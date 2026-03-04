import { useState, useEffect, useMemo, useRef } from "react";
import { useProducts } from "../context/ProductContext";
import { fetchSuggestions } from "../api/products";
import "./SearchBar.css";

export default function SearchBar() {
  const { search, setSearch } = useProducts();
  const [input, setInput] = useState("");
  const [titles, setTitles] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);

  const filtered = useMemo(() => {
    if (!input.trim()) return titles.slice(0, 8);

    const term = input.toLowerCase();
    return titles.filter((t) => t.toLowerCase().includes(term)).slice(0, 8);
  }, [input, titles]);

  useEffect(() => {
    fetchSuggestions().then(setTitles);
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setSearch(input.trim());
    }, 400);
    return () => clearTimeout(timerId);
  }, [input, setSearch]);

  useEffect(() => {
    setInput(search);
    if (!search) setOpen(false);
  }, [search]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [input, titles]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectSuggestion = (title) => {
    setInput(title);
    setSearch(title); // instant search
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!open || filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i < filtered.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : filtered.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="search-bar" ref={wrapperRef}>
      <svg className="search-bar-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        className="search-bar-input"
        type="text"
        placeholder="Search products..."
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        aria-label="Search products"
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul className="search-bar-suggestions" role="listbox">
          {filtered.map((title, i) => (
            <li
              key={title}
              className={`search-bar-suggestion${i === activeIndex ? " search-bar-suggestion--active" : ""}`}
              onMouseDown={() => selectSuggestion(title)}
              role="option"
              aria-selected={i === activeIndex}
            >
              {title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
