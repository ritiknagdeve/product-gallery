import { createContext, useContext, useReducer, useCallback, useEffect, useRef } from "react";
import { fetchProducts } from "../api/products";

// ─── Request Cache ──────────────────────────────────────────────────
// Caches API responses keyed by "search|category|page".
// When backspacing, the previous term is already cached — no API call needed.
const MAX_CACHE_SIZE = 50;

function makeCacheKey(search, category, page) {
  return `${search}|${category}|${page}`;
}

// ─── Initial State ──────────────────────────────────────────────────
const initialState = {
  products: [],
  categories: [],
  loading: false,
  error: null,
  search: "",
  category: "",
  page: 1,
  totalPages: 1,
  totalItems: 0,
};

// ─── Actions ────────────────────────────────────────────────────────
const ACTIONS = {
  FETCH_START: "FETCH_START",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",
  SET_SEARCH: "SET_SEARCH",
  SET_CATEGORY: "SET_CATEGORY",
  SET_PAGE: "SET_PAGE",
};

// ─── Reducer ────────────────────────────────────────────────────────
function productReducer(state, action) {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, loading: true, error: null };
    case ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload.data,
        categories: action.payload.categories,
        page: action.payload.pagination.currentPage,
        totalPages: action.payload.pagination.totalPages,
        totalItems: action.payload.pagination.totalItems,
      };
    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case ACTIONS.SET_SEARCH:
      return { ...state, search: action.payload, page: 1 };
    case ACTIONS.SET_CATEGORY:
      return { ...state, category: action.payload, page: 1 };
    case ACTIONS.SET_PAGE:
      return { ...state, page: action.payload };
    default:
      return state;
  }
}

// ─── Context ────────────────────────────────────────────────────────
const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [state, dispatch] = useReducer(productReducer, initialState);
  const cacheRef = useRef(new Map());

  // Stable fetch function with cache check
  const loadProducts = useCallback(async (search, category, page) => {
    const key = makeCacheKey(search, category, page);
    const cached = cacheRef.current.get(key);

    // Cache hit — skip API call, update state instantly
    if (cached) {
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: cached });
      return;
    }

    // Cache miss — fetch from API
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const result = await fetchProducts({
        search,
        category,
        page,
        limit: 8,
      });

      // Store in cache (evict oldest if full)
      if (cacheRef.current.size >= MAX_CACHE_SIZE) {
        const firstKey = cacheRef.current.keys().next().value;
        cacheRef.current.delete(firstKey);
      }
      cacheRef.current.set(key, result);

      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: result });
    } catch (err) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: err.message });
    }
  }, []);

  // Single effect — auto-fetches whenever search, category, or page changes
  useEffect(() => {
    loadProducts(state.search, state.category, state.page);
  }, [state.search, state.category, state.page, loadProducts]);

  // Stable setters — dispatch is stable so these never change
  const setSearch = useCallback(
    (term) => dispatch({ type: ACTIONS.SET_SEARCH, payload: term }),
    []
  );

  const setCategory = useCallback(
    (cat) => dispatch({ type: ACTIONS.SET_CATEGORY, payload: cat }),
    []
  );

  const setPage = useCallback(
    (p) => dispatch({ type: ACTIONS.SET_PAGE, payload: p }),
    []
  );

  return (
    <ProductContext.Provider
      value={{ ...state, setSearch, setCategory, setPage }}
    >
      {children}
    </ProductContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────
export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
}
