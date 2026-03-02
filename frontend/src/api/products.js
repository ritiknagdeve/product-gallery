const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

/**
 * Fetch products with search, category, pagination params
 */
export async function fetchProducts({ search, category, page, limit } = {}) {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (category) params.set("category", category);
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));

  const res = await fetch(`${API_BASE}/products?${params.toString()}`);

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

/**
 * Fetch all product titles for search suggestions (cached after first call)
 */
let suggestionsCache = null;

export async function fetchSuggestions() {
  if (suggestionsCache) return suggestionsCache;

  const res = await fetch(`${API_BASE}/products/suggestions`);
  if (!res.ok) return [];

  const json = await res.json();
  suggestionsCache = json.data || [];
  return suggestionsCache;
}
