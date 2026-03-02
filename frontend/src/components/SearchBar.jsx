import { useState, useEffect, useRef } from "react";
import { useProducts } from "../context/ProductContext";
import { fetchSuggestions } from "../api/products";
import "./SearchBar.css";

export default function SearchBar() {
  const { setSearch } = useProducts();
  const [input, setInput] = useState("");
  const [titles, setTitles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  // Fetch all titles once
  useEffect(() => {
    fetchSuggestions().then(setTitles);
  }, []);

  // Debounce search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(input.trim());
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [input, setSearch]);

  // Filter suggestions — show all on empty input, filtered when typing
  useEffect(() => {
    if (!input.trim()) {
      setFiltered(titles.slice(0, 8));
    } else {
      const term = input.toLowerCase();
      setFiltered(
        titles.filter((t) => t.toLowerCase().includes(term)).slice(0, 8)
      );
    }
    setActiveIndex(-1);
  }, [input, titles]);

  // Close on outside click
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
