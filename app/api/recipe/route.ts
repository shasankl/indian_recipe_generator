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
import { buildRecipePrompt } from "@/lib/prompt";
import { RECIPE_JSON_SCHEMA } from "@/lib/recipe-json-schema";
import {
  checkRecipeRateLimit,
  getRecipeClientIp,
} from "@/lib/recipe-rate-limit";
import {
  recipeRequestSchema,
  recipeResponseSchema,
} from "@/lib/schemas";

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

  const { system, user } = buildRecipePrompt(
    parsed.data.profile,
    parsed.data.inputs,
  );

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const openai = new OpenAI({ apiKey });

  try {
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
      return NextResponse.json(
        { error: "No content from model." },
        { status: 502 },
      );
    }

    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Model returned non-JSON content." },
        { status: 502 },
      );
    }

    const recipe = recipeResponseSchema.safeParse(json);
    if (!recipe.success) {
      return NextResponse.json(
        { error: "Model JSON did not match expected shape." },
        { status: 502 },
      );
    }

    return NextResponse.json({ recipe: recipe.data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "OpenAI request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
