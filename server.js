// Local dev server. It serves the static site AND dispatches every /api/* request
// to the SAME handler files used in production (api/<name>.js), so local behaviour
// matches Vercel exactly — including delivery-quote rounding/minimum, /api/config
// and /api/reverse-geocode. (For full Vercel parity you can also run `vercel dev`.)
const http = require("http");
const fs = require("fs");
const path = require("path");
const { parse: parseUrl } = require("url");

const port = Number(process.env.PORT) || 4173;
const host = process.env.HOST || "0.0.0.0";
const root = __dirname;

// Local dev only: load KEY=value pairs from a .env file (if present) into
// process.env, so the /api/* handlers see the same secrets they get from Vercel
// in production (e.g. ADMIN_PASSWORD for the admin panel login). .env is
// gitignored and never committed; Vercel injects its own env vars, so this is a
// no-op in production.
(function loadDotenv() {
  try {
    const envPath = path.join(root, ".env");
    if (!fs.existsSync(envPath)) return;
    for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
      if (!line || /^\s*#/.test(line)) continue;
      const eq = line.indexOf("=");
      if (eq < 1) continue;
      const key = line.slice(0, eq).trim();
      let val = line.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
      if (key && !(key in process.env)) process.env[key] = val;
    }
  } catch (e) { /* ignore — dev convenience only */ }
})();

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon"
};

function readRawBody(request) {
  return new Promise(resolve => {
    let body = "";
    request.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) request.destroy();
    });
    request.on("end", () => resolve(body));
    request.on("error", () => resolve(""));
  });
}

// Add the Vercel-style helpers (res.status().json()/send()) the api/* modules use.
function enhanceResponse(response) {
  response.status = code => { response.statusCode = code; return response; };
  response.json = obj => {
    if (!response.headersSent) response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(JSON.stringify(obj));
    return response;
  };
  response.send = data => {
    response.end(Buffer.isBuffer(data) || typeof data === "string" ? data : String(data));
    return response;
  };
  return response;
}

// Dispatch /api/<name> to the production handler in api/<name>.js.
async function handleApi(name, request, response) {
  if (!/^[a-z0-9-]+$/.test(name)) { response.writeHead(404); response.end("Not found"); return; }
  let handler;
  try {
    const mod = require(path.join(root, "api", `${name}.js`));
    handler = typeof mod === "function" ? mod : (mod && mod.default);
  } catch (e) {
    response.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: `no api handler: ${name}` }));
    return;
  }
  if (typeof handler !== "function") { response.writeHead(500); response.end("Bad handler"); return; }

  const parsed = parseUrl(request.url, true);
  request.query = parsed.query || {};
  const raw = await readRawBody(request);
  const contentType = request.headers["content-type"] || "";
  if (raw && contentType.includes("application/json")) {
    try { request.body = JSON.parse(raw); } catch { request.body = {}; }
  } else {
    request.body = raw || {};
  }
  enhanceResponse(response);
  try {
    await handler(request, response);
  } catch (error) {
    console.error(`/api/${name} error:`, error && error.message);
    if (!response.writableEnded) {
      response.statusCode = 500;
      response.setHeader("Content-Type", "application/json; charset=utf-8");
      response.end(JSON.stringify({ error: "server error" }));
    }
  }
}

http.createServer(async (request, response) => {
  const requestPath = decodeURIComponent(request.url.split("?")[0]);

  // Route every /api/* to the matching production handler file.
  if (requestPath.startsWith("/api/")) {
    await handleApi(requestPath.slice("/api/".length).replace(/\/+$/, ""), request, response);
    return;
  }

  // Clean-URL rewrites (mirror vercel.json so dev matches prod).
  const cleanUrls = { "/privacy": "privacy.html", "/gizlilik": "privacy.html", "/merchants": "merchants.html" };
  const relativePath = requestPath === "/"
    ? "index.html"
    : (cleanUrls[requestPath] || requestPath.replace(/^\/+/, ""));
  const filePath = path.resolve(root, relativePath);

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stat) => {
    const target = !statError && stat.isFile() ? filePath : path.join(root, "index.html");
    fs.readFile(target, (readError, data) => {
      if (readError) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }
      response.writeHead(200, {
        "Content-Type": types[path.extname(target)] || "application/octet-stream",
        "Cache-Control": /^(sw\.js|index\.html)$/.test(path.basename(target)) ? "no-cache" : "public, max-age=300"
      });
      response.end(data);
    });
  });
}).listen(port, host, () => {
  console.log(`Dukkanci is running at http://${host}:${port}`);
});
