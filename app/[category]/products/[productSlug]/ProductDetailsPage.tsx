"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  design_category_id: number;
  size: string;
  image_url: string;
}

interface ProductCategory {
  id: number;
  name: string;
}

export default function ProductDetailPage() {
  const { user, requireAuthentication } = useAuth(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const productId = searchParams.get("product_id");

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const foundProduct = data.find((p: Product) => p.id === parseInt(productId as string));
        
        if (foundProduct) {
          setProduct(foundProduct);
          
          // Fetch category name
          const categoriesRes = await fetch("/api/product-categories/get-product-categories");
          const categoriesData = await categoriesRes.json();
          const foundCategory = categoriesData.find((c: ProductCategory) => c.id === foundProduct.category_id);
          setCategory(foundCategory);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (!requireAuthentication("add items to cart")) return;

    // TODO: Add to cart logic
    alert(`Added ${quantity} item(s) to cart!`);
  };

  const handleBuyNow = () => {
    if (!requireAuthentication("place an order")) return;

    // TODO: Navigate to checkout with this product
    router.push("/checkout");
  };

  const handleWriteReview = () => {
    if (!requireAuthentication("write a review")) return;

    // TODO: Open review modal/form
    alert("Opening review form...");
  };

  const goBackToProducts = () => {
    if (category) {
      const categorySlug = category.name.toLowerCase().replace(/\s+/g, "-");
      router.push(`/${categorySlug}/products?category_id=${category.id}`);
    } else {
      router.back();
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <button
          onClick={() => router.push("/categories")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Browse Categories
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-zinc-800 shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold cursor-pointer" onClick={() => router.push("/")}>
            My Store
          </h1>
          <div className="flex gap-4 items-center">
            {user ? (
              <span className="text-sm">Welcome, {user.full_name}</span>
            ) : (
              <>
                <button
                  onClick={() => router.push("/login")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push("/")}>
            Home
          </span>
          {" / "}
          <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push("/categories")}>
            Categories
          </span>
          {category && (
            <>
              {" / "}
              <span className="cursor-pointer hover:text-blue-600" onClick={goBackToProducts}>
                {category.name}
              </span>
              {" / "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {product.name}
              </span>
            </>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-[500px] object-cover rounded-lg"
            />
          </div>

          {/* Product Details */}
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl text-blue-600 font-bold mb-4">
              Rs. {product.price.toFixed(2)}
            </p>
            
            <div className="mb-4">
              <span className="inline-block bg-gray-200 dark:bg-zinc-700 px-3 py-1 rounded-full text-sm">
                Size: {product.size}
              </span>
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
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Quantity:</label>
              <div className="flex items-center gap-3">
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
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold text-lg"
              >
                🛒 Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold text-lg"
              >
                ⚡ Buy Now
              </button>
              <button
                onClick={handleWriteReview}
                className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-semibold"
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
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <div className="flex items-center mb-2">
                <span className="font-semibold">John Doe</span>
                <span className="ml-2 text-yellow-500">★★★★★</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Great quality! Highly recommend this product.
              </p>
            </div>
            <div className="border-b pb-4">
              <div className="flex items-center mb-2">
                <span className="font-semibold">Jane Smith</span>
                <span className="ml-2 text-yellow-500">★★★★☆</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Good product, fast delivery. Will buy again!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}