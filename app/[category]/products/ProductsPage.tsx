"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import Breadcrumb from "@/app/components/Breadcrumb";
import FilterBar from "@/app/components/FilterBar";
import ProductsGrid from "@/app/components/ProductGrid";
import { DesignCategory, Product, ProductCategory } from "@/app/types/product-types/product-types";





export default function ProductsListingPage() {
  const { user } = useAuth(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const categoryId = searchParams.get("category_id");
  const designCategoryId = searchParams.get("design_category_id");

  const [products, setProducts] = useState<Product[]>([]);
  const [designCategories, setDesignCategories] = useState<DesignCategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState<ProductCategory | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedDesignCategory, setSelectedDesignCategory] = useState<string | null>(
    designCategoryId
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  useEffect(() => {
    filterProducts();
  }, [products, categoryId, selectedDesignCategory]);

  const fetchData = async () => {
    try {
      const [productsRes, designRes, categoriesRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/design-categories/get-design-categories"),
        fetch("/api/product-categories/get-product-categories"),
      ]);

      const productsData = await productsRes.json();
      const designData = await designRes.json();
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

  const filterProducts = () => {
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
  };

  const handleDesignCategoryChange = (designCatId: string | null) => {
    setSelectedDesignCategory(designCatId);
    
    const params = new URLSearchParams();
    if (categoryId) params.set("category_id", categoryId);
    if (designCatId) params.set("design_category_id", designCatId);
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleProductClick = (product: Product) => {
    const productSlug = product.name.toLowerCase().replace(/\s+/g, "-");
    const categorySlug = pathname.split("/")[1];
    
    router.push(`/${categorySlug}/products/${productSlug}?product_id=${product.id}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900">

      <div className="max-w-7xl mx-auto p-8">
        <Breadcrumb categoryName={currentCategory?.name} />

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">
            {currentCategory ? currentCategory.name : "Products"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredProducts.length} products found
          </p>
        </div>

        <FilterBar
          designCategories={designCategories}
          selectedDesignCategory={selectedDesignCategory}
          onFilterChange={handleDesignCategoryChange}
        />

        <ProductsGrid
          products={filteredProducts}
          onProductClick={handleProductClick}
        />
      </div>
    </div>
  );
}