import vm from "vm";
import fs from "fs";

// Load all data files + the data-assembly section of app.js in one VM context,
// then read the assembled `stores` and `products` globals.
const dataFiles = [
  "heelal-products.js", "alsultan-data.js", "zaitoune-data.js", "ezzedine-data.js",
  "salloura-data.js", "nour-data.js", "tihama-data.js", "afgan-data.js",
  "sam-data.js", "kady-data.js",
];
let code = dataFiles.map(f => fs.readFileSync(f, "utf8")).join("\n");
const app = fs.readFileSync("app.js", "utf8");
const marker = "products.push(...kadyProducts);";
const cut = app.indexOf(marker) + marker.length;
code += "\n" + app.slice(0, cut);

const ctx = { __out: {} };
vm.createContext(ctx);
code += "\n__out.stores = stores; __out.products = products;";
vm.runInContext(code, ctx);
const stores = ctx.__out.stores;
const products = ctx.__out.products;
console.error("assembled:", stores.length, "stores,", products.length, "products");

const q = (v) => v === null || v === undefined ? "null" : "'" + String(v).replace(/'/g, "''") + "'";
const num = (v) => v === null || v === undefined || v === "" || Number.isNaN(Number(v)) ? "null" : Number(v);
const bool = (v) => v ? "true" : "false";
const jsonb = (v) => v === null || v === undefined ? "'[]'::jsonb" : "'" + JSON.stringify(v).replace(/'/g, "''") + "'::jsonb";

let sql = "-- Dukkanci seed — run AFTER schema.sql\nbegin;\n";

// stores
const storeCols = "id,name,category,image,cover_image,logo_image,logo,rating,reviews,new_store,delivery,min_order,time,distance,lat,lng,map_url,open,featured,has_offer,offer,price_on_request,description,address,phone,whatsapp,email,website,source_url,hours,areas,fulfillment,subscription,order_count,official_store,branch_group,brand_theme";
sql += `insert into public.stores (${storeCols}) values\n`;
sql += stores.map(s => `(${[
  num(s.id), q(s.name), q(s.category), q(s.image), q(s.coverImage), q(s.logoImage), q(s.logo),
  num(s.rating), num(s.reviews), bool(s.newStore), num(s.delivery), num(s.minOrder), q(s.time), num(s.distance),
  num(s.location?.lat), num(s.location?.lng), q(s.mapUrl), bool(s.open), bool(s.featured), bool(s.hasOffer), q(s.offer),
  bool(s.priceOnRequest), q(s.description), q(s.address), q(s.phone), q(s.whatsapp), q(s.email), q(s.website),
  q(s.sourceUrl), q(s.hours), jsonb(s.areas || []), q(s.fulfillment), q(s.subscription), num(s.orderCount), bool(s.officialStore),
  q(s.branchGroup), q(s.brandTheme),
].join(",")})`).join(",\n");
sql += "\non conflict (id) do nothing;\n\n";

// products (batched to keep statements reasonable)
const prodCols = "id,store_id,source_id,name,image,price,old_price,price_on_request,unit,category,available,featured,description,image_fit,options";
const BATCH = 500;
for (let i = 0; i < products.length; i += BATCH) {
  const chunk = products.slice(i, i + BATCH);
  sql += `insert into public.products (${prodCols}) values\n`;
  sql += chunk.map(p => `(${[
    num(p.id), num(p.storeId), q(p.sourceId), q(p.name), q(p.image), num(p.price), num(p.oldPrice),
    bool(p.priceOnRequest), q(p.unit), q(p.category), bool(p.available !== false), bool(p.featured),
    q(p.description), q(p.imageFit), jsonb(p.options || []),
  ].join(",")})`).join(",\n");
  sql += "\non conflict (id) do nothing;\n\n";
}

sql += "commit;\n";
fs.writeFileSync("supabase/seed.sql", sql);
console.error("wrote supabase/seed.sql —", (sql.length / 1024 / 1024).toFixed(2), "MB");
