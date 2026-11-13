/**
 * Makes the downloadable file from the cutout: transparent PNG, or the
 * subject on a solid colour as JPG (passport and product photos need a
 * plain background and JPG keeps the file small). Full resolution.
 */

/** "transparent" or a CSS hex colour such as "#ffffff". */
export type Background = "transparent" | `#${string}`;

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("The cutout could not be opened."));
    img.src = url;
  });
}

export async function compose(cutoutUrl: string, background: Background): Promise<Blob> {
  const img = await loadImage(cutoutUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not create an image canvas.");
  if (background !== "transparent") {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0);
  const type = background === "transparent" ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.95));
  canvas.width = canvas.height = 0;
  if (!blob) throw new Error("Your browser could not save the image.");
  return blob;
}

/** "my photo.jpg" → "my-photo-no-bg.png" (or .jpg on a coloured background). */
export function outputName(original: string, background: Background) {
  const base = original.replace(/\.[^.]+$/, "").replace(/[^\w.-]+/g, "-").slice(0, 60) || "image";
  return `${base}-no-bg.${background === "transparent" ? "png" : "jpg"}`;
}
