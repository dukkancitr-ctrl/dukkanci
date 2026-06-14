import fs from "fs";
const t = fs.readFileSync("sam-data.js", "utf8");
const cat = JSON.parse(t.match(/ProductCatalog = (\[[\s\S]*?\n\]);/)[1]);
// emit a tab-separated index list for reference
cat.forEach((p, i) => console.log(i + "\t" + p.image.split("/").pop() + "\t" + p.name));
