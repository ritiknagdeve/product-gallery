import { useState, useEffect, useRef } from "react";
import { useProducts } from "../context/ProductContext";
import "./CategoryFilter.css";

export default function CategoryFilter() {
  const { categories, category, setCategory } = useProducts();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const allOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((cat) => ({
      value: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
    })),
  ];

  const selectedLabel =
    allOptions.find((o) => o.value === category)?.label || "All Categories";

  const select = (value) => {
    setCategory(value);
    setOpen(false);
  };

  return (
    <div className="category-filter" ref={wrapperRef}>
      <button
        className={`category-filter-trigger${open ? " category-filter-trigger--open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selectedLabel}
        <svg className="category-filter-chevron" width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul className="category-filter-dropdown" role="listbox">
          {allOptions.map((opt) => (
            <li
              key={opt.value}
              className={`category-filter-option${opt.value === category ? " category-filter-option--active" : ""}`}
              onMouseDown={() => select(opt.value)}
              role="option"
              aria-selected={opt.value === category}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
