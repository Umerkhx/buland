import { useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  size: string;
  category_id: number;
  design_category_id: number;
}

interface User {
  id: string;
  full_name: string;
}

interface ProductInfoProps {
  product: Product;
  user: User | null;
  designCategoryName?: string;
  onAddToCart: (quantity: number) => void;
  onBuyNow: () => void;
  onWriteReview: () => void;
}

export default function ProductInfo({
  product,
  user,
  designCategoryName,
  onAddToCart,
  onBuyNow,
  onWriteReview,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);

  const unitPrice = product.price;
  const totalPrice = unitPrice * quantity;

  return (
    <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      
      {/* Price Display */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Unit Price</p>
        <p className="text-2xl text-blue-600 font-bold mb-4">
          Rs. {unitPrice.toFixed(2)}
        </p>
      </div>

      {/* Product Details */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-block bg-gray-200 dark:bg-zinc-700 px-3 py-1 rounded-full text-sm">
            Size: {product.size}
          </span>
        </div>
        {designCategoryName && (
          <div className="flex items-center gap-2">
            <span className="inline-block bg-purple-200 dark:bg-purple-900 px-3 py-1 rounded-full text-sm text-purple-800 dark:text-purple-200">
              Design: {designCategoryName}
            </span>
          </div>
        )}
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
        {product.description}
      </p>

      {user && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">
            ✓ Logged in as {user.full_name}
          </p>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Quantity:</label>
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="bg-gray-200 dark:bg-zinc-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            -
          </button>
          <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="bg-gray-200 dark:bg-zinc-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            +
          </button>
        </div>
        
        {/* Total Price Display */}
        <div className="bg-gray-100 dark:bg-zinc-700 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Price:</span>
            <span className="text-lg font-bold text-blue-600">Rs. {totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => onAddToCart(quantity)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold text-lg transition"
        >
          🛒 Add to Cart
        </button>
        <button
          onClick={onBuyNow}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold text-lg transition"
        >
          ⚡ Buy Now
        </button>
        <button
          onClick={onWriteReview}
          className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-semibold transition"
        >
          ✍️ Write a Review
        </button>
      </div>

      {!user && (
        <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            💡 <strong>Note:</strong> Login to add to cart, place orders, or write reviews
          </p>
        </div>
      )}
    </div>
  );
}