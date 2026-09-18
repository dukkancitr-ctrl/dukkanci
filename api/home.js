// Server-rendered homepage shell for "/": serves the static index.html but
// injects a self-referencing <link rel="canonical"> that the static file lacks.
// Every inner shell (store/product/category/...) already injects its own
// page-specific canonical, so this only fills the gap on the root URL.
const SHELL_ENV = (process.env.SSR_SHELL_ORIGIN || "").replace(/\/+$/, "");
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.dukkanci.com.tr").replace(/\/+$/, "");

module.exports = async (req, res) => {
  let html = "";
  try {
    const shellOrigin = SHELL_ENV || `https://${req.headers.host || ""}`;
    const shell = await fetch(`${shellOrigin}/index.html`, { headers: { "User-Agent": "dukkanci-ssr" } });
    html = await shell.text();
  } catch (e) {
    res.setHeader("Location", "/index.html");
    return res.status(302).end();
  }

  const canonical = `${SITE}/`;
  // Only add a canonical if the static shell does not already carry one, and
  // anchor it right after the twitter:card meta (same spot the other shells use).
  if (!/<link\s+rel="canonical"/i.test(html)) {
    html = html.replace(
      /(<meta\s+name="twitter:card"\s+content="[^"]*">)/,
      `$1\n    <link rel="canonical" href="${canonical}">`
    );
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=86400, must-revalidate");
  res.status(200).send(html);
};
