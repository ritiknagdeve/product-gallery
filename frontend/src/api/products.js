const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export async function fetchProducts({ search, category, page, limit, sort, order } = {}) {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (category) params.set("category", category);
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  if (sort) params.set("sort", sort);
  if (order) params.set("order", order);

  const res = await fetch(`${API_BASE}/products?${params.toString()}`);

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

// Cached after first call
let suggestionsCache = null;

export async function fetchSuggestions() {
  if (suggestionsCache) return suggestionsCache;

  const res = await fetch(`${API_BASE}/products/suggestions`);
  if (!res.ok) return [];

  const json = await res.json();
  suggestionsCache = json.data || [];
  return suggestionsCache;
}
