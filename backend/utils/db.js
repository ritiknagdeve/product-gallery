const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "data", "products.json");

function readProducts() {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}


module.exports = { readProducts };
