import fortunes from "../cookies/fortunes.json";

if (fortunes.length === 0) {
  throw new Error("cookies/fortunes.json must contain at least one fortune.");
}

export { fortunes };

export function pickRandomFortune(): string {
  const index = crypto.getRandomValues(new Uint32Array(1))[0] % fortunes.length;
  return fortunes[index]!;
}
