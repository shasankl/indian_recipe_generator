/**
 * POST /api/recipe
 *
 * Environment (set in `.env.local` from `.env.example` — never expose secrets to the client):
 * - OPENAI_API_KEY — required; create at https://platform.openai.com/api-keys
 * - OPENAI_MODEL — optional; defaults to "gpt-4o-mini" (use a model that supports json_schema)
 * - RECIPE_RATE_LIMIT_PER_HOUR — optional; default 30 requests per IP per hour (0 = unlimited).
 *
 * User authentication is not implemented yet; rate limiting reduces anonymous abuse of your
 * OpenAI quota. Add Auth.js / Clerk / etc. when you introduce multi-user cloud profiles.
 */
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { normalizeMealTitle } from "@/lib/meal-title";
import { buildRecipePrompt } from "@/lib/prompt";
import { RECIPE_JSON_SCHEMA } from "@/lib/recipe-json-schema";
import {
  checkRecipeRateLimit,
  getRecipeClientIp,
} from "@/lib/recipe-rate-limit";
import {
  recipeRequestSchema,
  recipeResponseSchema,
  type RecipeResponse,
} from "@/lib/schemas";

function titleMatchesAvoidList(
  title: string,
  avoidRecentTitles: string[],
): boolean {
  const normalized = normalizeMealTitle(title);
  return avoidRecentTitles.some((t) => normalizeMealTitle(t) === normalized);
}

async function fetchRecipeFromModel(
  openai: OpenAI,
  model: string,
  system: string,
  user: string,
): Promise<
  | { ok: true; recipe: RecipeResponse }
  | { ok: false; error: string; status: number }
> {
  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: {
      type: "json_schema",
      json_schema: RECIPE_JSON_SCHEMA,
    },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    return { ok: false, error: "No content from model.", status: 502 };
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return {
      ok: false,
      error: "Model returned non-JSON content.",
      status: 502,
    };
  }

  const recipe = recipeResponseSchema.safeParse(json);
  if (!recipe.success) {
    return {
      ok: false,
      error: "Model JSON did not match expected shape.",
      status: 502,
    };
  }

  return { ok: true, recipe: recipe.data };
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server misconfiguration: OPENAI_API_KEY is not set." },
      { status: 500 },
    );
  }

  const ip = getRecipeClientIp(req);
  const limited = checkRecipeRateLimit(ip);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many recipe requests from this network. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = recipeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const avoidRecentTitles = parsed.data.avoidRecentTitles ?? [];
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const openai = new OpenAI({ apiKey });

  try {
    const { system, user } = buildRecipePrompt(
      parsed.data.profile,
      parsed.data.inputs,
      { avoidRecentTitles },
    );

    let result = await fetchRecipeFromModel(openai, model, system, user);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    if (
      avoidRecentTitles.length > 0 &&
      titleMatchesAvoidList(result.recipe.title, avoidRecentTitles)
    ) {
      const retry = buildRecipePrompt(
        parsed.data.profile,
        parsed.data.inputs,
        { avoidRecentTitles, forceDistinct: true },
      );
      const retryResult = await fetchRecipeFromModel(
        openai,
        model,
        retry.system,
        retry.user,
      );
      if (retryResult.ok) {
        result = retryResult;
      }
    }

    return NextResponse.json({ recipe: result.recipe });
  } catch (e) {
    const message = e instanceof Error ? e.message : "OpenAI request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
