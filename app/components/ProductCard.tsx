import React from 'react'

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  size: string;
  image_url: string | string[];
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const displayImage = Array.isArray(product.image_url)
    ? product.image_url[0]
    : product.image_url;

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-zinc-800 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer group overflow-hidden"
    >
      <div className="h-64 bg-gray-200 overflow-hidden">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 truncate">{product.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-blue-600 font-bold text-xl">
            Rs. {product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">Size: {product.size}</span>
        </div>
      </div>
    </div>
  );
}