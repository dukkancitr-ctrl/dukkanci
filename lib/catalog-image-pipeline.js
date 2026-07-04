// Shared image-processing pipeline for the supermarket "shared image bank"
// (مخزن الصور المشترك). Used by BOTH api/catalog-process-image.js (admin,
// on-demand single image) and scripts/build-shared-catalog.js (bulk ingestion
// job that seeds the bank from the existing supermarket stores).
//
// Always two steps, in this order:
//
//   1) removeBackgroundAndMarks() — OpenAI gpt-image-1 image-edit, the same
//      technique /api/enhance-image.js already uses for a merchant's own
//      "تحسين الصورة بالذكاء الاصطناعي" button — except the prompt here
//      explicitly instructs the model to strip any store name, logo,
//      watermark, or price sticker baked into the shot, since this image is
//      about to be shared across every supermarket on the platform.
//
//   2) standardizeCanvas() — sharp: trims the empty margin around the
//      product, rescales it so it always occupies the SAME proportion of a
//      SAME-sized square canvas, and centers it. This is what makes every
//      catalog photo render at an identical size/zoom in product grids,
//      instead of some products looking zoomed-in and others tiny.
//
// IMPORTANT LIMITATION (by design, not an oversight): neither step can
// reliably detect a trademark baked into a product's own packaging design
// (e.g. a private-label sticker unique to one store). That judgment call is
// left to a human reviewer — see catalog_products.approved / brand_free and
// api/catalog-review.js. optionalBrandPrescreen() below is a best-effort
// assistant for that reviewer; it must never be treated as an approval.

const sharp = require("sharp");

const CANVAS_SIZE = Number(process.env.CATALOG_CANVAS_SIZE || 1000);      // px — every catalog image is this exact square size
const CONTENT_RATIO = Number(process.env.CATALOG_CONTENT_RATIO || 0.82);  // the product itself fills this fraction of the canvas — same "zoom" for every item
const CANVAS_BACKGROUND = { r: 255, g: 255, b: 255, alpha: 1 };           // pure white, matches the rest of the storefront's product cards

// ── Step 1: background + store-marks removal (OpenAI gpt-image-1 edit) ──
async function removeBackgroundAndMarks(buffer, mimeType, name) {
  const key = (process.env.OPENAI_API_KEY || "").trim();
  if (!key) throw new Error("OPENAI_API_KEY not configured");

  const prompt = [
    "Professionally clean this product photo for a shared grocery-store catalog:",
    "remove the background completely and replace it with a solid pure-white background;",
    "remove any watermark, sticker, handwritten price tag, store name or store logo overlaid on the photo;",
    "keep the product and its original manufacturer packaging exactly as-is (only remove marks added by the photographer or the store, never redesign the packaging itself);",
    "improve lighting and sharpness to commercial e-commerce quality.",
    name ? `The product is: ${name}.` : "",
    "Do not add any new text, logo, people, or props."
  ].filter(Boolean).join(" ");

  const form = new FormData();
  form.append("model", "gpt-image-1");
  form.append("prompt", prompt);
  form.append("n", "1");
  form.append("size", "1024x1024");
  form.append("image", new Blob([buffer], { type: mimeType || "image/jpeg" }), "product.png");

  const r = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
    signal: AbortSignal.timeout(60000)
  });
  const data = await r.json().catch(() => null);
  if (!r.ok || !data) throw new Error(data?.error?.message || "OpenAI image edit failed");

  const b64 = data.data?.[0]?.b64_json;
  if (b64) return Buffer.from(b64, "base64");
  const url = data.data?.[0]?.url;
  if (url) {
    const imgRes = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!imgRes.ok) throw new Error("could not download OpenAI result image");
    return Buffer.from(await imgRes.arrayBuffer());
  }
  throw new Error("OpenAI returned no image data");
}

// ── Step 2: uniform size + zoom on a fixed square canvas ──
// Trims the near-white margin left by step 1, resizes so the product's
// longest side is exactly CONTENT_RATIO of CANVAS_SIZE, then composites it
// centered onto a CANVAS_SIZE × CANVAS_SIZE white square. Every output image
// therefore has the identical physical scale/framing, regardless of how the
// original photo was cropped or zoomed.
async function standardizeCanvas(buffer) {
  const trimmed = await sharp(buffer).trim({ background: "#ffffff", threshold: 12 }).toBuffer();
  const meta = await sharp(trimmed).metadata();
  const longestSide = Math.max(meta.width || 1, meta.height || 1);
  const targetContentSize = Math.round(CANVAS_SIZE * CONTENT_RATIO);
  const scale = targetContentSize / longestSide;
  const resizedW = Math.max(1, Math.round((meta.width || longestSide) * scale));
  const resizedH = Math.max(1, Math.round((meta.height || longestSide) * scale));

  const resized = await sharp(trimmed).resize(resizedW, resizedH, { fit: "fill" }).toBuffer();

  return sharp({
    create: { width: CANVAS_SIZE, height: CANVAS_SIZE, channels: 4, background: CANVAS_BACKGROUND }
  })
    .composite([{ input: resized, gravity: "center" }])
    .flatten({ background: CANVAS_BACKGROUND })
    .jpeg({ quality: 92 })
    .toBuffer();
}

// ── Optional: best-effort assistant for the human reviewer (never auto-approves) ──
// Off by default. Set ENABLE_AI_BRAND_PRESCREEN=true to have a vision model add a
// one-line hint ("قد تظهر علامة متجر معيّن..." / "لا يظهر ما يميّز متجراً بعينه")
// to review_note, so the admin can triage the queue faster. The approved/
// brand_free flags always stay false until a human sets them via
// api/catalog-review.js — this function cannot flip them itself.
async function optionalBrandPrescreen(standardizedBuffer, name) {
  const key = (process.env.OPENAI_API_KEY || "").trim();
  if (!key || process.env.ENABLE_AI_BRAND_PRESCREEN !== "true") return null;
  try {
    const b64 = standardizedBuffer.toString("base64");
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 120,
        messages: [{
          role: "user",
          content: [
            {
              type: "text",
              text: `Look at this product photo${name ? ` (product: ${name})` : ""}. In one short line, answer: does it show a store name, store logo, watermark, or price sticker that identifies a SPECIFIC retailer (not the manufacturer's own packaging)? Reply starting with "نعم" or "لا", then a 5-10 word reason, in Arabic.`
            },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${b64}` } }
          ]
        }]
      }),
      signal: AbortSignal.timeout(20000)
    });
    const data = await r.json().catch(() => null);
    return data?.choices?.[0]?.message?.content?.trim() || null;
  } catch (e) {
    return null; // best-effort only — a failure here must never block ingestion
  }
}

// ── Full pipeline ──
async function processCatalogImage({ buffer, mimeType, name }) {
  const clean = await removeBackgroundAndMarks(buffer, mimeType, name);
  const standardized = await standardizeCanvas(clean);
  const brandCheckNote = await optionalBrandPrescreen(standardized, name);
  return { buffer: standardized, mimeType: "image/jpeg", brandCheckNote };
}

module.exports = {
  processCatalogImage,
  removeBackgroundAndMarks,
  standardizeCanvas,
  optionalBrandPrescreen,
  CANVAS_SIZE,
  CONTENT_RATIO
};
