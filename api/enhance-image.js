// POST /api/enhance-image
// Generates a professional product photo via OpenAI DALL-E 3.
// Body: { name: string, category: string }
// Returns: { url: string } or { error: string }
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(503).json({ error: "OpenAI key not configured" });

  const { name, category } = req.body || {};
  if (!name) return res.status(400).json({ error: "name required" });

  const prompt = `Professional product photo for a marketplace: "${name}"${category ? ` (category: ${category})` : ""}. Clean white background, sharp focus, commercial quality, top-down or 3/4 angle, no text or watermarks, no people.`;

  try {
    const r = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "dall-e-3", prompt, n: 1, size: "1024x1024", quality: "standard", response_format: "url" })
    });
    const data = await r.json().catch(() => null);
    if (!r.ok || !data) return res.status(502).json({ error: data?.error?.message || "OpenAI error" });
    const url = data.data?.[0]?.url;
    if (!url) return res.status(502).json({ error: "No image returned" });
    return res.status(200).json({ url });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
};
