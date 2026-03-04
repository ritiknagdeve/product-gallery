import { createContext, useContext, useReducer, useCallback, useEffect, useRef } from "react";
import { fetchProducts } from "../api/products";

const MAX_CACHE_SIZE = 50;

function makeCacheKey(search, category, page, sort) {
  return `${search}|${category}|${page}|${sort}`;
}

const initialState = {
  products: [],
  categories: [],
  loading: true,
  error: null,
  search: "",
  category: "",
  sort: "",
  page: 1,
  totalPages: 1,
  totalItems: 0,
};

const ACTIONS = {
  FETCH_START: "FETCH_START",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",
  SET_SEARCH: "SET_SEARCH",
  SET_CATEGORY: "SET_CATEGORY",
  SET_SORT: "SET_SORT",
  SET_PAGE: "SET_PAGE",
};

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
    case ACTIONS.SET_SORT:
      return { ...state, sort: action.payload, page: 1 };
    case ACTIONS.SET_PAGE:
      return { ...state, page: action.payload };
    default:
      return state;
  }
}

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [state, dispatch] = useReducer(productReducer, initialState);
  const cacheRef = useRef(new Map());

  const loadProducts = useCallback(async (search, category, page, sort) => {
    const key = makeCacheKey(search, category, page, sort);
    const cached = cacheRef.current.get(key);

    if (cached) {
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: cached });
      return;
    }

    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const [sortField, sortOrder] = sort ? sort.split("_") : ["", ""];
      const result = await fetchProducts({
        search,
        category,
        page,
        limit: 8,
        sort: sortField || undefined,
        order: sortOrder || undefined,
      });

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

  useEffect(() => {
    loadProducts(state.search, state.category, state.page, state.sort);
  }, [state.search, state.category, state.page, state.sort, loadProducts]);

  const setSearch = useCallback(
    (term) => dispatch({ type: ACTIONS.SET_SEARCH, payload: term }),
    []
  );

  const setCategory = useCallback(
    (cat) => dispatch({ type: ACTIONS.SET_CATEGORY, payload: cat }),
    []
  );

  const setSort = useCallback(
    (s) => dispatch({ type: ACTIONS.SET_SORT, payload: s }),
    []
  );

  const setPage = useCallback(
    (p) => dispatch({ type: ACTIONS.SET_PAGE, payload: p }),
    []
  );

  return (
    <ProductContext.Provider
      value={{ ...state, setSearch, setCategory, setSort, setPage }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
}
