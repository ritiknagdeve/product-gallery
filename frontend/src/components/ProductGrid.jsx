import ProductCard from "./ProductCard";
import SkeletonCard from "./SkeletonCard";
import { useProducts } from "../context/ProductContext";
import "./ProductGrid.css";

const SKELETON_COUNT = 8; // matches our per-page limit

export default function ProductGrid() {
  const { products, loading, error } = useProducts();

  if (error) {
    return (
      <div className="product-grid">
        <p className="product-grid-error">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {loading
        ? Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <SkeletonCard key={i} />
          ))
        : products.length === 0
          ? <p className="product-grid-empty">No products found.</p>
          : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
    </div>
  );
}
