import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductCard from "../components/ProductCard";

const mockProduct = {
  id: 1,
  title: "Wireless Bluetooth Headphones",
  price: 59.99,
  category: "electronics",
  image: "https://example.com/headphones.jpg",
};

describe("ProductCard", () => {
  it("renders product title", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Wireless Bluetooth Headphones")).toBeInTheDocument();
  });

  it("renders formatted price", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("$59.99")).toBeInTheDocument();
  });

  it("renders product image with correct alt text", () => {
    render(<ProductCard product={mockProduct} />);
    const img = screen.getByAltText("Wireless Bluetooth Headphones");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/headphones.jpg");
  });

  it("image has lazy loading attribute", () => {
    render(<ProductCard product={mockProduct} />);
    const img = screen.getByAltText("Wireless Bluetooth Headphones");
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("renders with explicit width and height to prevent CLS", () => {
    render(<ProductCard product={mockProduct} />);
    const img = screen.getByAltText("Wireless Bluetooth Headphones");
    expect(img).toHaveAttribute("width", "300");
    expect(img).toHaveAttribute("height", "300");
  });
});
