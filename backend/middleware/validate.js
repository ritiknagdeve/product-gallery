const { z } = require("zod");

// Query param schema — all optional since they're query strings
const productQuerySchema = z.object({
  search: z
    .string()
    .max(100, "Search term too long")
    .optional(),
  category: z
    .string()
    .max(50, "Category name too long")
    .optional(),
  page: z
    .string()
    .regex(/^\d+$/, "Page must be a positive number")
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a positive number")
    .optional(),
  sort: z
    .enum(["price", "title", "id"])
    .optional(),
  order: z
    .enum(["asc", "desc"])
    .optional(),
});

// Validates query params before hitting the route handler
function validateProductQuery(req, res, next) {
  const result = productQuerySchema.safeParse(req.query);

  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return res.status(400).json({ success: false, errors });
  }

  next();
}

module.exports = { validateProductQuery };
