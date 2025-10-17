import ProductCard from "./ProductCard";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  design_category_id: number;
  size: string;
  image_url: string | string[];
}

interface ProductsGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function ProductsGrid({ products, onProductClick }: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No products found with the selected filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick(product)}
        />
      ))}
    </div>
  );
}