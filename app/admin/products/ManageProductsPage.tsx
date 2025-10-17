"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  design_category_id: number;
  size: string;
  image_url: string[];
}

interface Category {
  id: number;
  name: string;
}

export default function ManageProductsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [productCategories, setProductCategories] = useState<Category[]>([]);
  const [designCategories, setDesignCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDesignCategory, setSelectedDesignCategory] = useState<string>("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    size: "",
  });

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const sessionRes = await fetch("/api/users/get-session");
        const sessionData = await sessionRes.json();

        if (!sessionData.user) {
          router.replace("/login");
          return;
        }

        const userRes = await fetch(`/api/users/get-user-by-id?id=${sessionData.user.id}`);
        const userData = await userRes.json();

        if (!userData.user || userData.user.role !== "admin") {
          router.replace("/");
          return;
        }

        setUser(userData.user);
        fetchData();
        setLoading(false);
      } catch (err) {
        router.replace("/");
      }
    };

    checkAdmin();
  }, [router]);

  const fetchData = async () => {
    try {
      const productsRes = await fetch("/api/products");
      const productsData = await productsRes.json();
      setProducts(productsData);
      setFilteredProducts(productsData);

      const prodCatRes = await fetch("/api/product-categories/get-product-categories");
      const prodCatData = await prodCatRes.json();
      setProductCategories(prodCatData);

      const designCatRes = await fetch("/api/design-categories/get-design-categories");
      const designCatData = await designCatRes.json();
      setDesignCategories(designCatData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category_id === parseInt(selectedCategory));
    }

    if (selectedDesignCategory) {
      filtered = filtered.filter((p) => p.design_category_id === parseInt(selectedDesignCategory));
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, selectedDesignCategory, products]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch("/api/products/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        alert("Product deleted successfully!");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      size: product.size,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("id", editingProduct!.id.toString());
      formData.append("name", editForm.name);
      formData.append("description", editForm.description);
      formData.append("price", editForm.price);
      formData.append("size", editForm.size);

      const res = await fetch("/api/products/update", {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        alert("Product updated successfully!");
        setEditingProduct(null);
        fetchData();
      }
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <nav className="bg-white dark:bg-zinc-800 shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold cursor-pointer" onClick={() => router.push("/admin")}>
            Admin Panel
          </h1>
          <button
            onClick={() => router.push("/admin")}
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6">Manage Products</h2>

        {/* Filters */}
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md mb-6">
          <h3 className="font-semibold mb-3">Filters</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-3 border rounded-lg"
            >
              <option value="">All Categories</option>
              {productCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={selectedDesignCategory}
              onChange={(e) => setSelectedDesignCategory(e.target.value)}
              className="p-3 border rounded-lg"
            >
              <option value="">All Design Categories</option>
              {designCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-zinc-700">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Size</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="p-4">
                    <img
                      src={Array.isArray(product.image_url) ? product.image_url[0] : product.image_url}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-4">{product.name}</td>
                  <td className="p-4">Rs. {product.price}</td>
                  <td className="p-4">{product.size}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-blue-600 text-white px-3 py-1 rounded mr-2 hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center p-8 text-gray-500">No products found</div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Edit Product</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Price</label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Size</label>
                <input
                  type="text"
                  value={editForm.size}
                  onChange={(e) => setEditForm({ ...editForm, size: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}