/**
 * PAGE TEXT for the home page (the only page). Kept here, away from the
 * layout code, so wording can be tuned for search without touching
 * components. The FAQ is also turned into FAQPage structured data, so the
 * questions and answers must match what is shown on the page.
 */

export const hero = {
  h1: "Remove Background Free",
  h1Sub: "Transparent, White or Blue in One Tap",
  intro:
    "Cut out people, products, pets and logos with AI that runs on your own device. Get a transparent PNG or a clean white or blue background for passport and ID photos. No signup, no watermark.",
};

export const privacyBadge = "On-Device Browser AI — Your personal portraits & product photos are never uploaded.";

export const howToTitle = "How to Remove a Background Without Uploading";

export const steps = [
  { title: "Add your photo", text: "Drop a JPG, PNG or WebP image on the box, paste a screenshot with Ctrl+V, or tap to pick one from your phone." },
  { title: "Let the AI work", text: "The background is removed on your device in a few seconds. The first time, the AI model downloads once and is then remembered." },
  { title: "Pick a background", text: "Keep it transparent, or tap White, Passport blue, Light blue or any custom colour. Drag the slider to compare before and after." },
  { title: "Download", text: "Save a full-resolution transparent PNG, or a JPG on your chosen colour, ready for forms, shops and social media." },
];

export const passport = {
  title: "Create White-Background Passport & ID Photos Free",
  intro:
    "Most passport, visa, NID, exam and job portals ask for a photo on a plain white or light background. You don't need a studio: take a well-lit photo against any wall and let the AI replace the background.",
  tips: [
    { title: "Take the photo", text: "Face the camera, shoulders straight, in soft even light. Keep the whole head and the top of the shoulders in the frame." },
    { title: "Remove the background", text: "Add the photo here and tap White (or Passport blue if your form asks for blue). Edges like hair are handled automatically." },
    { title: "Check the size", text: "Download the JPG, then resize it to the size your form asks for, such as 300 × 300 px or 35 × 45 mm, and the KB limit." },
  ],
};

/** "Browser AI vs cloud editors" comparison table. */
export const comparison = {
  title: "100% Private Browser AI vs. Cloud Editors",
  head: ["", "This tool (on-device AI)", "Typical cloud background removers"],
  rows: [
    ["Where your photo goes", "Stays on your device; 0 bytes uploaded", "Uploaded to the company's servers"],
    ["Account or signup", "Not needed", "Often required for full quality"],
    ["Full-resolution download", "Free", "Often paid credits"],
    ["Watermark", "None", "Sometimes on free downloads"],
    ["Works offline", "Yes, after the first visit", "No"],
  ],
  note: "Portraits, ID photos and unreleased product shots are personal or commercially sensitive. Keeping them on your device means there is no copy on anyone else's server.",
};

export const faqTitle = "Background Remover: Frequently Asked Questions";

export const faq = [
  {
    q: "How do I remove the background from a photo for free?",
    a: "Add your photo to the box above. The AI removes the background on your own device in a few seconds, then you can download a transparent PNG or pick a white, blue or custom background and download a JPG. It is free, with no signup and no watermark.",
  },
  {
    q: "How do I make a passport photo with a white background?",
    a: "Take a front-facing photo in good light, add it here and tap the White swatch (or Passport blue if your form needs blue). Download the JPG, then resize it to the size and KB limit your passport or ID form asks for.",
  },
  {
    q: "Are my photos uploaded to a server?",
    a: "No. The AI model runs inside your web browser with WebAssembly, so your photo never leaves your phone or computer: 0 bytes are uploaded. Only the AI model itself is downloaded once from this website and then remembered by your browser.",
  },
  {
    q: "Why does the first cutout take longer?",
    a: "The first time, your browser downloads the AI model (about 100 MB) from this site. It is saved by your browser, so every cutout after that starts straight away, even offline.",
  },
  {
    q: "What kind of photos work best?",
    a: "Clear photos where the subject stands out from the background work best: people, products, pets, cars and logos. Very busy backgrounds or subjects the same colour as the background can leave small edges; a plain wall or table gives the cleanest cutout.",
  },
];

/** What this tool is, for the WebApplication structured data and the app manifest. */
export const app = {
  fullName: "Remove Background Free – AI Background Remover",
  alternateNames: ["Background Remover", "Remove BG", "Transparent Background Maker", "White Background Photo Editor"],
  subCategory: "Background Remover",
  features: [
    "AI background removal that runs on your device",
    "Transparent PNG download at full resolution",
    "White, passport blue, light blue or custom colour backgrounds as JPG",
    "Before and after comparison slider",
    "Paste from clipboard (Ctrl+V)",
    "No signup, no watermark",
    "100% client-side: no photos uploaded",
  ],
};
