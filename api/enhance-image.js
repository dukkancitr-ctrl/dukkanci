// POST /api/enhance-image
// Sends an existing product image to OpenAI image-edit API for professional enhancement.
// Body: { imageData?: string (base64 data-URL), imageUrl?: string, name?: string }
// Returns: { url: string } or { error: string }
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(503).json({ error: "OpenAI key not configured" });

  const { imageData, imageUrl, name } = req.body || {};
  if (!imageData && !imageUrl) return res.status(400).json({ error: "imageData or imageUrl required" });

  let imgBuffer, mimeType = "image/jpeg";

  try {
    if (imageData) {
      const match = imageData.match(/^data:([^;]+);base64,(.+)$/s);
      if (!match) return res.status(400).json({ error: "Invalid image data" });
      mimeType = match[1] || "image/jpeg";
      imgBuffer = Buffer.from(match[2], "base64");
    } else {
      const r = await fetch(imageUrl, { signal: AbortSignal.timeout(10000) });
      if (!r.ok) return res.status(400).json({ error: "Could not fetch image" });
      imgBuffer = Buffer.from(await r.arrayBuffer());
      mimeType = (r.headers.get("content-type") || "image/jpeg").split(";")[0].trim();
    }
  } catch (e) {
    return res.status(400).json({ error: "Failed to load image: " + e.message });
  }

  const prompt = `Professionally enhance this product photo for an e-commerce marketplace: remove the background and replace with a clean pure-white background, improve lighting, sharpen details, make it look crisp and commercial-grade.${name ? ` The product is: ${name}.` : ""} Do not add text, logos, or people.`;

  try {
    const form = new FormData();
    form.append("model", "gpt-image-1");
    form.append("prompt", prompt);
    form.append("n", "1");
    form.append("size", "1024x1024");
    form.append("image", new Blob([imgBuffer], { type: mimeType }), "product.png");

    const r = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body: form,
      signal: AbortSignal.timeout(60000)
    });
    const data = await r.json().catch(() => null);
    if (!r.ok || !data) return res.status(502).json({ error: data?.error?.message || "OpenAI error" });

    const url = data.data?.[0]?.url;
    const b64 = data.data?.[0]?.b64_json;
    if (url) return res.status(200).json({ url });
    if (b64) return res.status(200).json({ url: `data:image/png;base64,${b64}` });
    return res.status(502).json({ error: "No image in OpenAI response" });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
};
