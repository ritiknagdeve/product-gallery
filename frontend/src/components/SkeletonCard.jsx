import "./SkeletonCard.css";

export default function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-card-image" />
      <div className="skeleton-card-info">
        <div className="skeleton-card-line" />
        <div className="skeleton-card-line skeleton-card-line--short" />
      </div>
    </div>
  );
}
