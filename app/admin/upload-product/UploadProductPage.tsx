"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
}

export default function UploadProductPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [productCategories, setProductCategories] = useState<Category[]>([]);
  const [designCategories, setDesignCategories] = useState<Category[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    design_category_id: "",
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
        fetchCategories();
        setLoading(false);
      } catch (err) {
        router.replace("/");
      }
    };

    checkAdmin();
  }, [router]);

  const fetchCategories = async () => {
    try {
      const prodCatRes = await fetch("/api/product-categories/get-product-categories");
      const prodCatData = await prodCatRes.json();
      setProductCategories(prodCatData);

      const designCatRes = await fetch("/api/design-categories/get-design-categories");
      const designCatData = await designCatRes.json();
      setDesignCategories(designCatData);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("category_id", form.category_id);
      formData.append("design_category_id", form.design_category_id);
      formData.append("size", form.size);

      selectedImages.forEach((image) => {
        // Remove spaces from filename and replace with hyphens
        const cleanedName = image.name.replace(/\s+/g, "-");
        const cleanedFile = new File([image], cleanedName, { type: image.type });
        formData.append("images", cleanedFile);
      });

      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      alert("Product uploaded successfully!");
      setForm({
        name: "",
        description: "",
        price: "",
        category_id: "",
        design_category_id: "",
        size: "",
      });
      setSelectedImages([]);
      router.push("/admin/products");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
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

      <div className="max-w-3xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6">Upload New Product</h2>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block font-semibold mb-2">Product Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Price (Rs.)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                step="0.01"
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Size</label>
              <input
                type="text"
                name="size"
                value={form.size}
                onChange={handleChange}
                required
                placeholder="e.g., S, M, L, XL"
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Product Category</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Select Category</option>
                {productCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-2">Design Category</label>
              <select
                name="design_category_id"
                value={form.design_category_id}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Select Design</option>
                {designCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Product Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              required
              className="w-full p-3 border rounded-lg"
            />
            {selectedImages.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {selectedImages.length} image(s) selected
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {uploading ? "Uploading..." : "Upload Product"}
          </button>
        </form>
      </div>
    </div>
  );
}