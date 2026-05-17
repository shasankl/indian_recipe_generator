/** Exact conversion: 1 in = 2.54 cm, 1 ft = 30.48 cm */

const CM_PER_INCH = 2.54;
const CM_PER_FOOT = 30.48;

export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  if (!Number.isFinite(cm) || cm <= 0) return { feet: 0, inches: 0 };
  const totalInches = cm / CM_PER_INCH;
  const feet = Math.floor(totalInches / 12);
  let inches = totalInches - feet * 12;
  inches = Math.round(inches * 100) / 100;
  if (inches >= 12) {
    return { feet: feet + 1, inches: 0 };
  }
  return { feet, inches };
}

export function feetInchesToCm(feet: number, inches: number): number {
  const f = Number.isFinite(feet) ? feet : 0;
  let i = Number.isFinite(inches) ? inches : 0;
  i = Math.min(11.99, Math.max(0, i));
  return f * CM_PER_FOOT + i * CM_PER_INCH;
}

export function formatHeightSummary(
  heightCm: number,
  unit: "cm" | "imperial",
): string {
  if (!Number.isFinite(heightCm) || heightCm <= 0) return "—";
  if (unit === "imperial") {
    const { feet, inches } = cmToFeetInches(heightCm);
    const inchDisplay = inches === Math.floor(inches) ? `${inches}` : inches.toFixed(1);
    return `${feet}′${inchDisplay}″ (${Math.round(heightCm)} cm)`;
  }
  return `${heightCm} cm`;
}
