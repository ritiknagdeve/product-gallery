import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import SortDropdown from "./components/SortDropdown";
import ProductGrid from "./components/ProductGrid";
import Pagination from "./components/Pagination";
import { useProducts } from "./context/ProductContext";
import "./App.css";

function ResultCount() {
  const { totalItems, loading, search, category } = useProducts();
  if (loading) return null;
  const hasFilter = search || category;
  return (
    <p className="result-count">
      {hasFilter
        ? `${totalItems} result${totalItems !== 1 ? "s" : ""} found`
        : `${totalItems} products`}
    </p>
  );
}

function App() {
  const { setSearch, setCategory, setSort, setPage } = useProducts();

  const resetToHome = () => {
    setSearch("");
    setCategory("");
    setSort("");
    setPage(1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo" onClick={resetToHome} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && resetToHome()}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </div>
        <h1 className="app-title" onClick={resetToHome}>Product Gallery</h1>
      </header>

      <div className="toolbar">
        <SearchBar />
        <div className="toolbar-filters">
          <CategoryFilter />
          <SortDropdown />
        </div>
      </div>

      <ResultCount />

      <ProductGrid />
      <Pagination />

      <footer className="app-footer">
        <p className="app-footer-text">Made with ❤️ by Ritik</p>
      </footer>
    </div>
  );
}

export default App;
