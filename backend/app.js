const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const productRoutes = require("./routes/products");
const { validateProductQuery } = require("./middleware/validate");

const app = express();

app.use(helmet());

if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: "*" }));
} else if (process.env.FRONTEND_URL) {
  app.use(cors({ origin: process.env.FRONTEND_URL }));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use(limiter);

app.use(express.json({ limit: "10kb" }));

app.use("/api/products", validateProductQuery, productRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Server is running" });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ success: false, message: "Internal server error" });
});

module.exports = app;
