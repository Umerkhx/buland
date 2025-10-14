"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";


export default function ProductsListingPage() {
  const { user } = useAuth(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const categoryId = searchParams.get("category_id");
  const designCategoryId = searchParams.get("design_category_id");

  const [products, setProducts] = useState<any[]>([]);
  const [designCategories, setDesignCategories] = useState<any[]>([]);
  const [currentCategory, setCurrentCategory] = useState<any | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedDesignCategory, setSelectedDesignCategory] = useState<string | null>(
    designCategoryId
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await fetch("/api/products");
        const productsData = await productsRes.json();

        const designRes = await fetch("/api/design-categories/get-design-categories");
        const designData = await designRes.json();

        const categoriesRes = await fetch("/api/product-categories/get-product-categories");
        const categoriesData = await categoriesRes.json();
        
        if (categoryId) {
          const category = categoriesData.find((c: any) => c.id === parseInt(categoryId));
          setCurrentCategory(category);
        }

        setProducts(productsData);
        setDesignCategories(designData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  useEffect(() => {
    let filtered = products;

    if (categoryId) {
      filtered = filtered.filter((p) => p.category_id === parseInt(categoryId));
    }

    if (selectedDesignCategory) {
      filtered = filtered.filter(
        (p) => p.design_category_id === parseInt(selectedDesignCategory)
      );
    }

    setFilteredProducts(filtered);
  }, [products, categoryId, selectedDesignCategory]);

  const handleDesignCategoryChange = (designCatId: string | null) => {
    setSelectedDesignCategory(designCatId);
    
    const params = new URLSearchParams();
    if (categoryId) params.set("category_id", categoryId);
    if (designCatId) params.set("design_category_id", designCatId);
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleProductClick = (product: any) => {
    const productSlug = product.name.toLowerCase().replace(/\s+/g, "-");
    const categorySlug = pathname.split("/")[1];
    
    router.push(`/${categorySlug}/products/${productSlug}?product_id=${product.id}`);
  };

  if (loading) {
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
        <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push("/")}>
            Home
          </span>
          {" / "}
          <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push("/categories")}>
            Categories
          </span>
          {currentCategory && (
            <>
              {" / "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {currentCategory.name}
              </span>
            </>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">
            {currentCategory ? currentCategory.name : "Products"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredProducts.length} products found
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md mb-6">
          <h3 className="font-semibold mb-3">Filter by Design Category</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleDesignCategoryChange(null)}
              className={`px-4 py-2 rounded-lg transition ${
                !selectedDesignCategory
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            {designCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleDesignCategoryChange(cat.id.toString())}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedDesignCategory === cat.id.toString()
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="bg-white dark:bg-zinc-800 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer group overflow-hidden"
            >
              <div className="h-64 bg-gray-200 overflow-hidden">
                <img
                  src={product.image_url}
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
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No products found with the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}