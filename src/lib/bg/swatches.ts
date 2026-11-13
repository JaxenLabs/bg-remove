import type { Background } from "./compose";

/** One-tap backgrounds: transparent for designs, white and blues for passport, ID and product photos. */
export const SWATCHES: { label: string; value: Background; hint: string }[] = [
  { label: "Transparent", value: "transparent", hint: "PNG" },
  { label: "White", value: "#ffffff", hint: "Passport, NID, resume" },
  { label: "Passport blue", value: "#2563eb", hint: "Official ID photos" },
  { label: "Light blue", value: "#38bdf8", hint: "ID and visa photos" },
];
