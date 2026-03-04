import { useProducts } from "../context/ProductContext";
import "./Pagination.css";

export default function Pagination() {
  const { page, totalPages, totalItems, loading, setPage } = useProducts();

  if (totalPages <= 1) return null;

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);

    if (end - start < 4) {
      if (start === 1) end = Math.min(totalPages, start + 4);
      else start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <nav className="pagination" aria-label="Product pagination">
      <button
        className="pagination-btn"
        onClick={() => handlePageChange(page - 1)}
        disabled={page <= 1 || loading}
      >
        Prev
      </button>

      {getPageNumbers().map((num) => (
        <button
          key={num}
          className={`pagination-btn ${num === page ? "pagination-btn--active" : ""}`}
          onClick={() => handlePageChange(num)}
          disabled={loading}
          aria-current={num === page ? "page" : undefined}
        >
          {num}
        </button>
      ))}

      <button
        className="pagination-btn"
        onClick={() => handlePageChange(page + 1)}
        disabled={page >= totalPages || loading}
      >
        Next
      </button>

      {/* <span className="pagination-info">
        {totalItems} product{totalItems !== 1 ? "s" : ""}
      </span> */}
    </nav>
  );
}
