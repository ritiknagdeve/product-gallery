# Product Gallery

A full-stack product gallery app built with React and Node.js. Browse products with search, category filtering, sorting, and pagination — all in a clean responsive UI.

**Live:** [product-gallery-ritiknagdeve.vercel.app](https://product-gallery-ritiknagdeve.vercel.app)  
**Repo:** [github.com/ritiknagdeve/product-gallery](https://github.com/ritiknagdeve/product-gallery)

---

## Tech Stack

| Layer    | Tech                                      |
| -------- | ----------------------------------------- |
| Frontend | React 19, Vite 7, CSS Grid/Flexbox        |
| Backend  | Node.js, Express 5                        |
| Database | File-based JSON (`backend/data/products.json`) |
| Testing  | Vitest, React Testing Library             |
| Deploy   | Vercel (serverless functions + static)     |

---

## Features

### Backend (`/backend`)
- REST API built with Express 5
- File-based JSON database — 40 products across 6 categories (electronics, footwear, accessories, clothing, fitness)
- Each product has `id`, `title`, `price`, `category`, and `image` fields
- `GET /api/products` endpoint with full query support:
  - **Search** — filter by title (case-insensitive partial match)
  - **Category filter** — filter by exact category name
  - **Sorting** — sort by `price`, `title`, or `id` in `asc`/`desc` order
  - **Pagination** — `page` and `limit` params (default 10 per page, max 50)
- `GET /api/products/suggestions` — returns all product titles for autocomplete
- `GET /api/products/:id` — fetch a single product by ID
- `GET /api/health` — health check endpoint
- **Validation** — Zod schema validates all query params before they hit the route
- **Security** — Helmet headers, CORS (configurable origin), rate limiting (1000 req/15 min), 10kb body limit
- **Caching** — in-memory TTL cache (60s) avoids reading JSON from disk on every request

### Frontend (`/frontend`)
- **Product grid** — responsive CSS Grid layout showing product image, title, price, and category badge
- **Search bar** — debounced input (400ms) with autocomplete dropdown showing matching product titles, keyboard navigation support (arrow keys, enter, escape)
- **Category filter** — custom dropdown to filter by category, resets to page 1 on change
- **Sort dropdown** — sort by Price (Low→High, High→Low) or Name (A–Z, Z–A), resets to page 1 on change
- **Skeleton loader** — 8 shimmer cards displayed while data is loading
- **Pagination** — page number buttons (shows up to 5 around current page) with Prev/Next
- **Responsive** — `auto-fill` grid on desktop, 2-column on mobile; toolbar stacks vertically on small screens with filter dropdowns splitting 50-50
- **State management** — React Context + `useReducer` managing search, category, sort, page, loading, and error states
- **Client-side cache** — Map-based request cache (max 50 entries, LRU eviction) keyed by `search|category|page|sort`, so going back to a previous filter is instant
- **Unit tests** — 5 test cases for the `ProductCard` component using Vitest + React Testing Library

---

## Project Structure

```
product-gallery/
├── backend/
│   ├── server.js              # Entry point — starts Express server
│   ├── app.js                 # Express app setup (helmet, cors, rate limit, routes)
│   ├── routes/products.js     # GET /products, /products/suggestions, /products/:id
│   ├── middleware/validate.js  # Zod query param validation middleware
│   ├── utils/cache.js         # In-memory TTL cache class
│   ├── utils/db.js            # JSON file read/write helpers
│   └── data/products.json     # Product database (40 items)
├── frontend/
│   ├── src/
│   │   ├── main.jsx           # App entry — wraps App in ProductProvider
│   │   ├── App.jsx            # Layout — header, toolbar, result count, grid, pagination, footer
│   │   ├── api/products.js    # fetchProducts() and fetchSuggestions() API calls
│   │   ├── context/ProductContext.jsx  # useReducer state + cache + auto-fetch effect
│   │   ├── components/
│   │   │   ├── SearchBar.jsx       # Debounced search input with autocomplete
│   │   │   ├── CategoryFilter.jsx  # Category dropdown filter
│   │   │   ├── SortDropdown.jsx    # Sort by price/name dropdown
│   │   │   ├── ProductGrid.jsx     # Grid — renders cards, skeletons, or empty state
│   │   │   ├── ProductCard.jsx     # Single product card (image, title, price, category)
│   │   │   ├── Pagination.jsx      # Page navigation with numbered buttons
│   │   │   └── SkeletonCard.jsx    # Shimmer loading placeholder card
│   │   └── test/
│   │       ├── ProductCard.test.jsx  # Unit tests (title, price, image, lazy loading, dimensions)
│   │       └── setup.js
│   └── vite.config.js         # Vite config with dev proxy and Vitest setup
├── api/index.js               # Vercel serverless function entry
└── vercel.json                # Vercel routing and build config
```

---

## Getting Started

### Prerequisites
- Node.js 18+

### Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Run locally

Open two terminals:

```bash
# Terminal 1 — start backend on port 5000
cd backend
npm run dev
```

```bash
# Terminal 2 — start frontend on port 5173
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Vite's dev server proxies all `/api` requests to the backend automatically.

### How to use

1. **Browse** — products load in a paginated grid (8 per page)
2. **Search** — type in the search bar; results update after 400ms. Click a suggestion for instant search
3. **Filter** — pick a category from the dropdown to narrow results
4. **Sort** — use the sort dropdown to order by price or name
5. **Navigate** — use the pagination buttons to move between pages
6. **Reset** — click the logo or "Product Gallery" title to clear all filters and go back to page 1

### Run tests

```bash
cd frontend
npm test
```

Runs 5 unit tests on the `ProductCard` component — checks that the title, formatted price, image (src + alt), lazy loading attribute, and explicit width/height are rendered correctly.

---

## API Reference

### `GET /api/products`

| Param      | Type   | Default | Description                          |
| ---------- | ------ | ------- | ------------------------------------ |
| `search`   | string | —       | Filter by title (case-insensitive)   |
| `category` | string | —       | Filter by exact category             |
| `page`     | number | 1       | Page number                          |
| `limit`    | number | 10      | Items per page (max 50)              |
| `sort`     | string | id      | Sort by `price`, `title`, or `id`    |
| `order`    | string | asc     | `asc` or `desc`                      |

**Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": { "currentPage": 1, "totalPages": 5, "totalItems": 40, "perPage": 8 },
  "categories": ["electronics", "footwear", "accessories", "clothing", "fitness"]
}
```

### `GET /api/products/suggestions`
Returns all product titles for search autocomplete.

### `GET /api/products/:id`
Returns a single product by ID.

### `GET /api/health`
Health check — returns `{ success: true }`.

---

## Deployment

The app is configured for Vercel:
- **Frontend** — built with `vite build`, served as static files from `frontend/dist`
- **Backend** — runs as a serverless function via `api/index.js`, which imports the Express app
- **Routing** — `/api/*` requests go to the serverless function, everything else serves `index.html`

Push to the linked GitHub repo and Vercel auto-deploys.
