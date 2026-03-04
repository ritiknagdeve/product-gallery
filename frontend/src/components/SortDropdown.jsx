import { useState, useEffect, useRef } from "react";
import { useProducts } from "../context/ProductContext";
import "./SortDropdown.css";

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "title_asc", label: "Name: A–Z" },
  { value: "title_desc", label: "Name: Z–A" },
];

export default function SortDropdown() {
  const { sort, setSort } = useProducts();
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

  const selectedLabel =
    SORT_OPTIONS.find((o) => o.value === sort)?.label || "Sort";

  const select = (value) => {
    setSort(value);
    setOpen(false);
  };

  return (
    <div className="sort-dropdown" ref={wrapperRef}>
      <button
        className={`sort-dropdown-trigger${open ? " sort-dropdown-trigger--open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <svg className="sort-dropdown-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4" />
        </svg>
        <span className="sort-dropdown-label">{selectedLabel}</span>
        <svg className="sort-dropdown-chevron" width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul className="sort-dropdown-list" role="listbox">
          {SORT_OPTIONS.map((opt) => (
            <li
              key={opt.value}
              className={`sort-dropdown-option${opt.value === sort ? " sort-dropdown-option--active" : ""}`}
              onMouseDown={() => select(opt.value)}
              role="option"
              aria-selected={opt.value === sort}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
