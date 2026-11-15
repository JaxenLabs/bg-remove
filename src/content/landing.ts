import type { Background } from "@/lib/bg/compose";
import type { CutoutMethod } from "@/lib/bg/engine";

/**
 * KEYWORD LANDING PAGES: one page per popular search (/transparent-background/,
 * /white-background-photo/ ...). Each opens the same studio as the home page,
 * set up for that job (the background chosen up front and the photo prompt
 * worded for it), then gives its own how-to steps and FAQ. The FAQ also feeds
 * the FAQPage structured data, so keep it matching what the page shows.
 *
 * Add a page by adding an entry here: the route, sitemap, home-page links
 * and "Related" lists all pick it up.
 */
export interface Landing {
  slug: string;
  /** <title>: starts with the search phrase, 60 characters or fewer. */
  title: string;
  /** Meta description: 160 characters or fewer. */
  description: string;
  /** H1: the search phrase, then a short benefit (shown on its own line on phones). */
  h1: string;
  h1Sub: string;
  intro: string;
  /** Short name for links, breadcrumbs and the "Related" lists. */
  linkText: string;
  /** One line under the link on the home page. */
  blurb: string;
  keywords: string[];
  /** The background chosen when the page opens. */
  background: Background;
  /** How the cutout is made: the AI (default), or by brightness for ink on paper. */
  method?: CutoutMethod;
  /** Wording of the "choose a photo" box. */
  prompt: { title: string; hint: string };
  howToTitle: string;
  steps: { title: string; text: string }[];
  faq: { q: string; a: string }[];
}

const privacyQ = {
  q: "Is my image uploaded anywhere?",
  a: "No. The AI runs inside your web browser, so the image never leaves your phone or computer: 0 bytes are uploaded. Only the AI model is downloaded once from this site, then remembered by your browser.",
};

export const LANDINGS: Landing[] = [
  {
    slug: "remove-background-from-image",
    title: "Remove Background from Image Free – No Upload, No Signup",
    description:
      "Remove the background from any image free with on-device AI. Download a full-resolution transparent PNG or a JPG on any colour. Nothing is uploaded.",
    h1: "Remove Background from Image",
    h1Sub: "Free, Full Resolution, Private",
    intro:
      "Add a JPG, PNG or WebP image and the AI cuts out the person, product, pet or object in a few seconds, right on your device. Keep it transparent or put it on a new colour, then download it at full size with no watermark.",
    linkText: "Remove background from image",
    blurb: "Any JPG, PNG or WebP to a transparent cutout",
    keywords: ["remove background from image", "remove image background", "image background remover", "remove bg from image free", "erase background from picture", "cut out image online"],
    background: "transparent",
    prompt: { title: "Choose an image", hint: "JPG, PNG or WebP. Drop it here, paste it (Ctrl+V) or tap to pick it. People, products, pets and objects." },
    howToTitle: "How to Remove the Background from an Image",
    steps: [
      { title: "Add the image", text: "Drop it on the box, paste it with Ctrl+V or tap to choose it from your gallery or files." },
      { title: "Wait a few seconds", text: "The AI finds the main subject and removes everything behind it on your device. The first time, the model downloads once." },
      { title: "Check the edges", text: "Drag the slider to compare before and after, so you can see hair and fine edges up close." },
      { title: "Download", text: "Save a transparent PNG, or tap a colour first to get a JPG with a solid background." },
    ],
    faq: [
      {
        q: "How do I remove the background from an image for free?",
        a: "Add the image to the box at the top of this page. The background is removed on your device in a few seconds and you can download the result as a transparent PNG at full resolution. There is no signup, no credit limit and no watermark.",
      },
      {
        q: "Which image formats can I use?",
        a: "JPG (JPEG and JFIF), PNG and WebP. The result is a PNG when the background is transparent and a JPG when you choose a colour.",
      },
      {
        q: "Does it reduce the image size or quality?",
        a: "No. The download has the same width and height in pixels as the image you added. PNG keeps every pixel; JPG is saved at high quality (95%).",
      },
      privacyQ,
    ],
  },
  {
    slug: "transparent-background",
    title: "Transparent Background Maker – Free PNG Cutouts, No Upload",
    description:
      "Make a transparent background in one step. The AI cuts out your subject and saves a full-resolution PNG with no background, free and without uploading.",
    h1: "Transparent Background Maker",
    h1Sub: "Get a PNG with No Background",
    intro:
      "Turn any photo into a PNG with a transparent background, ready to place on slides, designs, stickers or a website. The AI removes the background on your device, and the download keeps full transparency at full resolution.",
    linkText: "Transparent background maker",
    blurb: "Save a PNG with the background see-through",
    keywords: ["transparent background", "make background transparent", "transparent background maker", "transparent png maker", "png without background", "make image transparent"],
    background: "transparent",
    prompt: { title: "Choose a photo to make transparent", hint: "JPG, PNG or WebP. You get a PNG with a transparent background. Drop, paste (Ctrl+V) or tap to pick." },
    howToTitle: "How to Make a Background Transparent",
    steps: [
      { title: "Add your photo", text: "Drop a JPG, PNG or WebP on the box, paste it, or tap to pick it from your phone." },
      { title: "AI removes the background", text: "Everything behind the subject is made fully transparent, on your device, in a few seconds." },
      { title: "Download the PNG", text: "Transparent is already selected, so the download is a PNG that keeps the see-through background." },
    ],
    faq: [
      {
        q: "How do I make the background of a photo transparent?",
        a: "Add the photo here. The AI removes the background and Transparent is already selected, so tap Download PNG. The checkered pattern in the preview shows the parts that are now see-through.",
      },
      {
        q: "Why is the file a PNG and not a JPG?",
        a: "JPG cannot store transparency: transparent areas would turn white or black. PNG keeps the see-through background, so the cutout can be placed on any colour or picture.",
      },
      {
        q: "Where can I use a transparent PNG?",
        a: "In PowerPoint, Google Slides, Canva, Word, Photoshop, websites, online shops, stickers and thumbnails. Anything that accepts PNG images shows the background as see-through.",
      },
      privacyQ,
    ],
  },
  {
    slug: "white-background-photo",
    title: "White Background Photo Maker – Passport, ID & Product Free",
    description:
      "Make a white background photo for passports, IDs, CVs and online shops. AI replaces the background with pure white on your device. Free, no upload.",
    h1: "White Background Photo Maker",
    h1Sub: "For Passport, ID & Product Photos",
    intro:
      "Passport, visa, NID and job forms, and marketplaces such as Amazon, often ask for a plain white background. Take a photo against any wall or table, add it here and the AI puts the subject on pure white (#FFFFFF) in seconds.",
    linkText: "White background photo",
    blurb: "Pure white for passport, ID and shop photos",
    keywords: ["white background photo", "change photo background to white", "white background photo editor", "passport photo white background", "photo with white background", "make background white"],
    background: "#ffffff",
    prompt: { title: "Choose a photo for a white background", hint: "JPG, PNG or WebP. The background is replaced with pure white and saved as a JPG. Drop, paste or tap to pick." },
    howToTitle: "How to Make a Photo with a White Background",
    steps: [
      { title: "Take a clear photo", text: "Face the camera in soft, even light, or place the product on a table. Any plain wall or surface works." },
      { title: "Add it here", text: "Drop, paste or pick the photo. The AI removes the old background on your device." },
      { title: "White is already chosen", text: "The preview shows the subject on pure white. Tap Passport blue or another colour if your form asks for one." },
      { title: "Download and resize", text: "Save the JPG, then resize it to the pixel size and KB limit your form or shop asks for." },
    ],
    faq: [
      {
        q: "How do I change a photo background to white?",
        a: "Add the photo here. The AI removes the background and White is already selected, so the download is a JPG with the subject on pure white (#FFFFFF), at the same size as your photo.",
      },
      {
        q: "Is this good for passport and ID photos?",
        a: "Yes for the background: it gives the plain white that most passport, visa, NID and exam forms ask for. Check your form's other rules too (head size, photo size in mm or pixels, file size in KB) and resize the JPG to match.",
      },
      {
        q: "My form asks for a blue background. Can I do that?",
        a: "Yes. After the cutout, tap Passport blue or Light blue, or pick any custom colour, then download the JPG.",
      },
      {
        q: "Why is the download a JPG?",
        a: "Forms and online shops almost always accept JPG, and it keeps the file small. If you need transparency instead, tap Transparent to download a PNG.",
      },
      privacyQ,
    ],
  },
  {
    slug: "remove-background-from-signature",
    title: "Remove Background from Signature – Free Transparent PNG",
    description:
      "Remove the background from a signature photo and get a transparent PNG to place on documents and PDFs. Free, private and done on your own device.",
    h1: "Remove Background from Signature",
    h1Sub: "Transparent PNG for Documents",
    intro:
      "Sign on plain white paper, take a photo and add it here. The paper is removed on your device so only the ink is left, even thin pen strokes, saved as a transparent PNG you can place on Word files, PDFs and forms without a white box.",
    linkText: "Remove background from signature",
    blurb: "Lift the ink off the paper as a transparent PNG",
    keywords: ["remove background from signature", "signature background remover", "transparent signature", "signature png maker", "make signature transparent", "digital signature from photo"],
    background: "transparent",
    // Pen strokes are keyed out by brightness: the AI model looks for one object and loses thin lines.
    method: "ink",
    prompt: { title: "Choose a signature photo", hint: "A photo or scan of your signature on plain paper (JPG, PNG or WebP). You get a transparent PNG." },
    howToTitle: "How to Make a Transparent Signature",
    steps: [
      { title: "Sign on plain paper", text: "Use a dark pen with a bold line on clean white paper. A thicker pen gives the cleanest result." },
      { title: "Take a flat photo", text: "Photograph it straight from above in good light, without shadows, and crop close to the signature." },
      { title: "Add it here", text: "The paper is removed on your device in under a second and the ink is kept. Check the edges with the slider." },
      { title: "Download the PNG", text: "Save the transparent PNG and insert it into your document, PDF editor or e-mail signature." },
    ],
    faq: [
      {
        q: "How do I remove the white background from my signature?",
        a: "Take a clear photo of your signature on white paper and add it here. The paper is removed and Transparent is already chosen, so tap Download PNG to get the ink on a see-through background.",
      },
      {
        q: "What gives the best signature cutout?",
        a: "Bold dark ink (a felt-tip or gel pen), plain white paper, even light with no shadows, and a photo cropped close to the signature. Very thin or faint strokes can be partly lost, so go over them with a thicker pen if needed.",
      },
      {
        q: "How do I add the signature to a document or PDF?",
        a: "Insert the PNG as a picture in Word, Google Docs or your PDF editor and place it on the signature line. Because the background is transparent, it sits on the page without a white box.",
      },
      privacyQ,
    ],
  },
  {
    slug: "product-photo-background-remover",
    title: "Product Photo Background Remover – White Background Free",
    description:
      "Put product photos on a clean white background for Amazon, Shopify, Etsy and Daraz. AI background removal on your device. Free, full size, no upload.",
    h1: "Product Photo Background Remover",
    h1Sub: "Clean White Backgrounds for Your Shop",
    intro:
      "Online shops and marketplaces look best, and often require, product photos on plain white. Shoot the product on any table, add the photo here and the AI places it on pure white, or on a transparent background for your own designs.",
    linkText: "Product photo background remover",
    blurb: "Shop-ready product shots on pure white",
    keywords: ["product photo background remover", "product photo white background", "ecommerce photo background", "amazon white background photo", "remove background from product photo", "product image background removal"],
    background: "#ffffff",
    prompt: { title: "Choose a product photo", hint: "JPG, PNG or WebP. The product is placed on pure white and saved as a JPG. Drop, paste or tap to pick." },
    howToTitle: "How to Put a Product Photo on a White Background",
    steps: [
      { title: "Shoot the product", text: "Place it on a plain table in daylight, fill most of the frame, and keep it sharp and in focus." },
      { title: "Add the photo", text: "The AI cuts out the product on your device. Unreleased products never leave your computer or phone." },
      { title: "Choose the background", text: "White is already chosen for marketplaces. Tap Transparent for a PNG to use in banners and ads." },
      { title: "Download", text: "Save the full-resolution JPG and upload it to your shop listing." },
    ],
    faq: [
      {
        q: "How do I make product photos with a white background?",
        a: "Take the photo on any plain surface, add it here and the AI removes the background. White is already selected, so Download JPG gives you the product on pure white (#FFFFFF) at the full size of your photo.",
      },
      {
        q: "Is the white background accepted by Amazon and other marketplaces?",
        a: "The background is pure white (RGB 255, 255, 255), which is what Amazon's main image rule asks for. Each marketplace has other rules too, such as minimum size and how much of the frame the product fills, so check them before you upload.",
      },
      {
        q: "Can I process many product photos?",
        a: "Yes, one after another with no limit. After the first photo the AI model is cached by your browser, so each new photo takes only a few seconds.",
      },
      {
        q: "Are my product photos kept private?",
        a: "Yes. The cutout happens inside your browser and nothing is uploaded, so photos of unreleased products stay on your device.",
      },
    ],
  },
  {
    slug: "change-background-color",
    title: "Change Background Color of Photo Free – Any Colour, Private",
    description:
      "Change the background colour of any photo: pick white, blue or any custom colour and download a full-resolution JPG. Free, private, nothing is uploaded.",
    h1: "Change Background Color",
    h1Sub: "Any Colour, in One Tap",
    intro:
      "Swap a messy background for a solid colour that matches your brand, profile picture or form. The AI cuts out the subject on your device; then tap white, passport blue, light blue or pick any custom colour and download.",
    linkText: "Change background color",
    blurb: "White, blue or any custom colour behind your subject",
    keywords: ["change background color", "change photo background color", "background colour changer", "change background of photo", "photo background color editor", "solid color background photo"],
    background: "#22c55e",
    prompt: { title: "Choose a photo to recolour", hint: "JPG, PNG or WebP. Pick any background colour after the cutout. Drop, paste (Ctrl+V) or tap to pick." },
    howToTitle: "How to Change the Background Colour of a Photo",
    steps: [
      { title: "Add your photo", text: "Drop, paste or pick a JPG, PNG or WebP. The AI removes the old background on your device." },
      { title: "Pick a colour", text: "Tap White, Passport blue or Light blue, or use Custom colour to choose any shade." },
      { title: "Compare", text: "Drag the slider to see the original and the new background side by side." },
      { title: "Download the JPG", text: "Save the photo on its new colour at full resolution, with no watermark." },
    ],
    faq: [
      {
        q: "How do I change the background colour of a photo?",
        a: "Add the photo here and wait a few seconds for the cutout. Then tap a colour, or tap the Custom colour box and pick any shade, and download the JPG with the new background.",
      },
      {
        q: "Can I use an exact colour code?",
        a: "Yes. The Custom colour picker lets you choose any colour, and on most browsers you can type an exact hex code such as #1E40AF to match your brand.",
      },
      {
        q: "Can I try several colours?",
        a: "Yes. The cutout is made once, so you can tap different colours, compare them in the preview and download as many versions as you like.",
      },
      privacyQ,
    ],
  },
  {
    slug: "remove-background-from-logo",
    title: "Remove Background from Logo – Free Transparent PNG Logo",
    description:
      "Remove the background from a logo and get a transparent PNG for websites, slides, merch and videos. Free, full resolution, processed on your device.",
    h1: "Remove Background from Logo",
    h1Sub: "Transparent PNG in Seconds",
    intro:
      "Got a logo on a white or coloured box? Add it here and the AI removes the background so the logo can sit on any website header, slide, video or T-shirt design. You get a full-resolution transparent PNG.",
    linkText: "Remove background from logo",
    blurb: "Logos without the white box, as transparent PNG",
    keywords: ["remove background from logo", "logo background remover", "transparent logo maker", "make logo transparent", "logo png transparent", "remove white background from logo"],
    background: "transparent",
    prompt: { title: "Choose a logo", hint: "JPG, PNG or WebP, the larger the better. You get a transparent PNG. Drop, paste (Ctrl+V) or tap to pick." },
    howToTitle: "How to Make a Logo Transparent",
    steps: [
      { title: "Add the logo", text: "Use the largest, sharpest version you have: a screenshot or export works, as long as it isn't blurry." },
      { title: "AI removes the background", text: "The box or colour behind the logo is removed on your device in a few seconds." },
      { title: "Download the PNG", text: "Transparent is already chosen, so the logo downloads as a PNG ready for any background." },
    ],
    faq: [
      {
        q: "How do I make my logo background transparent?",
        a: "Add the logo image here. The AI removes the background and Transparent is already selected, so tap Download PNG to get the logo with a see-through background at the same size.",
      },
      {
        q: "What logos work best?",
        a: "Logos with a clear shape that stands out from the background: icons, emblems, mascots and bold wordmarks. Very thin text or letters with holes (like O and A) on busy backgrounds can need a cleaner, larger source image.",
      },
      {
        q: "Can I get the logo on a white or coloured background instead?",
        a: "Yes. After the cutout, tap White or any colour to download a JPG with that background.",
      },
      privacyQ,
    ],
  },
];

export const landingBySlug = (slug: string) => LANDINGS.find((l) => l.slug === slug);

/** Home-page section linking to every landing page. */
export const popularTools = {
  eyebrow: "Popular tools",
  title: "Background Remover for Every Job",
};

/** Section headings on each landing page, and the link back home in its "Related" list. */
export const landingText = {
  faqTitle: (l: Landing) => `${l.linkText}: Questions & Answers`,
  relatedEyebrow: "Related",
  relatedTitle: "More Background Tools",
  home: { label: "Background remover home", blurb: "Transparent, white or blue, all in one place" },
};
