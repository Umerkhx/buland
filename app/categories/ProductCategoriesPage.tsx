"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";



export default function ProductCategoriesPage() {
  const { user, loading: authLoading } = useAuth(false);
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/product-categories/get-product-categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    const slug = categoryName.toLowerCase().replace(/\s+/g, "-");
    router.push(`/${slug}/products?category_id=${categoryId}`);
  };

  if (authLoading || loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900">
      <nav className="bg-white dark:bg-zinc-800 shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold cursor-pointer" onClick={() => router.push("/")}>
            My Store
          </h1>
          <div className="flex gap-4 items-center">
            {user ? (
              <>
                <span className="text-sm">Welcome, {user.full_name}</span>
                {user.role === "admin" && (
                  <button
                    onClick={() => router.push("/admin")}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    Admin Panel
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/login")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/signup")}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Shop by Category 🛍️</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Choose a category to explore our products
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id, category.name)}
              className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-48 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-white text-6xl">👕</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">{category.name}</h3>
              {category.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                  {category.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {categories.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-8">
            No categories available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}