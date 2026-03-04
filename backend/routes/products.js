const express = require("express");
const { readProducts } = require("../utils/db");
const cache = require("../utils/cache");

const router = express.Router();

// Returns cached products or reads from file
function getCachedProducts() {
  const cached = cache.get("products");
  if (cached) return cached;

  const products = readProducts();
  cache.set("products", products);
  return products;
}

// GET /api/products — supports search, category, sort, pagination
router.get("/", (req, res) => {
  try {
    let products = getCachedProducts();

    const { search, category, page, limit, sort, order } = req.query;

    if (search) {
      const term = search.toLowerCase().trim();
      products = products.filter((p) =>
        p.title.toLowerCase().includes(term)
      );
    }

    if (category) {
      const cat = category.toLowerCase().trim();
      products = products.filter(
        (p) => p.category.toLowerCase() === cat
      );
    }

    const sortField = ["price", "title"].includes(sort) ? sort : "id";
    const sortOrder = order === "desc" ? -1 : 1;

    products.sort((a, b) => {
      if (typeof a[sortField] === "string") {
        return sortOrder * a[sortField].localeCompare(b[sortField]);
      }
      return sortOrder * (a[sortField] - b[sortField]);
    });

    const totalItems = products.length;

    const parsedPage = Number.parseInt(page, 10);
    const parsedLimit = Number.parseInt(limit, 10);

    const safePage = Number.isNaN(parsedPage) ? 1 : parsedPage;
    const safeLimit = Number.isNaN(parsedLimit) ? 10 : parsedLimit;

    const pageNum = Math.max(safePage, 1);
    const perPage = Math.min(Math.max(safeLimit, 1), 50);

    const totalPages = Math.ceil(totalItems / perPage);
    const startIndex = (pageNum - 1) * perPage;

    const paginatedProducts = products.slice(startIndex, startIndex + perPage);

    const allProducts = getCachedProducts();
    const categories = [...new Set(allProducts.map((p) => p.category))];

    res.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems,
        perPage,
      },
      categories,
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// GET /api/products/suggestions — returns titles for autocomplete
router.get("/suggestions", (req, res) => {
  try {
    const products = getCachedProducts();
    const titles = products.map((p) => p.title);
    res.json({ success: true, data: titles });
  } catch (error) {
    console.error("Error fetching suggestions:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// GET /api/products/:id
router.get("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const products = getCachedProducts();
    const product = products.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
