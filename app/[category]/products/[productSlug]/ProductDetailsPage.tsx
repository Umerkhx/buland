"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import Breadcrumb from "@/app/components/Breadcrumb";
import ProductImages from "@/app/components/ProductImages";
import ProductInfo from "@/app/components/ProductInfo";
import ProductReviews from "@/app/components/ProductReviews";
import { DesignCategory, Product, ProductCategory } from "@/app/types/product-types/product-types";




export default function ProductDetailPage() {
  const { user, requireAuthentication } = useAuth(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("product_id");

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [designCategory, setDesignCategory] = useState<DesignCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const [productsRes, categoriesRes, designCatRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/product-categories/get-product-categories"),
        fetch("/api/design-categories/get-design-categories"),
      ]);

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      const designCatData = await designCatRes.json();

      const foundProduct = productsData.find((p: Product) => p.id === parseInt(productId!));
      if (foundProduct) {
        setProduct(foundProduct);
        
        const foundCategory = categoriesData.find(
          (c: ProductCategory) => c.id === foundProduct.category_id
        );
        setCategory(foundCategory);

        const foundDesignCategory = designCatData.find(
          (d: DesignCategory) => d.id === foundProduct.design_category_id
        );
        setDesignCategory(foundDesignCategory);
      }
    } catch (err) {
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (quantity: number) => {
    if (!requireAuthentication("add items to cart")) return;
    if (!product || !user) return;

    try {
      const res = await fetch("/api/cart/add-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          product_id: product.id,
          product_category_id: product.category_id,
          design_category_id: product.design_category_id,
          quantity: quantity,
        }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      alert("Added to cart successfully!");
      router.push("/cart");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add to cart. Please try again.");
    }
  };

  const handleBuyNow = async () => {
    if (!requireAuthentication("place an order")) return;
    await handleAddToCart(1);
  };

  const handleWriteReview = () => {
    if (!requireAuthentication("write a review")) return;
    alert("Opening review form...");
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
      <div className="max-w-7xl mx-auto p-8">
        <Breadcrumb categoryName={category?.name} productName={product.name} />

        <div className="grid md:grid-cols-2 gap-8">
          <ProductImages images={product.image_url} productName={product.name} />
          
          <ProductInfo
            product={product}
            user={user}
            designCategoryName={designCategory?.name}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onWriteReview={handleWriteReview}
          />
        </div>

        <ProductReviews />
      </div>
    </div>
  );
}