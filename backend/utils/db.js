const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "data", "products.json");

/**
 * Read all products from the JSON file
 */
function readProducts() {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

/**
 * Write products array back to the JSON file
 */
function writeProducts(products) {
  fs.writeFileSync(DB_PATH, JSON.stringify(products, null, 2), "utf-8");
}

module.exports = { readProducts, writeProducts };
