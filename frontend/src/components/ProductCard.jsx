import "./ProductCard.css";

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-card-image-wrapper">
        <img
          className="product-card-image"
          src={product.image}
          alt={product.title}
          loading="lazy"
          width="300"
          height="300"
        />
      </div>
      <div className="product-card-info">
        <h3 className="product-card-title">{product.title}</h3>
        <p className="product-card-price">${product.price.toFixed(2)}</p>
        <span className="product-card-category">{product.category}</span>
      </div>
    </div>
  );
}
