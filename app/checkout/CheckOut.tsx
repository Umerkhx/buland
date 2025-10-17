"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { CartItem } from "../types/cart-types/cart-types";
import { OrderData } from "../types/order-types/order-types";



export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth(true);
  const router = useRouter();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    phone_number: "",
    alt_phone_number: "",
    address: "",
    city: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await fetch(`/api/cart/get-cart?user_id=${user?.id}`);
      const data = await res.json();
      
      const productsRes = await fetch("/api/products");
      const products = await productsRes.json();
      
      const enrichedCart = data.map((item: CartItem) => {
        const product = products.find((p: any) => p.id === item.product_id);
        return { ...item, products: product };
      });
      
      setCartItems(enrichedCart);
      setFormData((prev) => ({
        ...prev,
        phone_number: user?.phone_number || "",
        alt_phone_number: user?.alt_phone_number || "",
        address: user?.address || "",
        city: user?.city || "",
      }));
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.products?.price || 0) * item.quantity,
      0
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + 150; 
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setSubmitting(true);

    try {
      for (const item of cartItems) {
        const orderData: OrderData = {
          user_id: user!.id,
          user_name: user!.full_name,
          user_email: user!.email,
          status: "pending",
          total_amount: calculateTotal(),
          product_id: item.product_id,
          product_name: item.products?.name || "",
          quantity: item.quantity,
          unit_price: item.products?.price || 0,
          size: item.products?.size || "",
          product_category_id: item.product_category_id,
          product_category_name: "", // You can fetch this if needed
          design_category_id: item.design_category_id,
          design_category_name: "", // You can fetch this if needed
          phone_number: formData.phone_number,
          alt_phone_number: formData.alt_phone_number,
          address: formData.address,
          city: formData.city,
        };

        const res = await fetch("/api/orders/add-orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        if (!res.ok) throw new Error("Failed to place order");
      }

      for (const item of cartItems) {
        await fetch("/api/cart/delete-cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: item.id,
            user_id: user!.id,
          }),
        });
      }

      alert("Order placed successfully!");
      router.push("/order-confirmation");
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-zinc-800 p-12 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <button
              onClick={() => router.push("/categories")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Order Review</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b">
                      <img
                        src={
                          Array.isArray(item.products?.image_url)
                            ? item.products.image_url[0]
                            : item.products?.image_url
                        }
                        alt={item.products?.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.products?.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Size: {item.products?.size} | Qty: {item.quantity}
                        </p>
                        <p className="text-blue-600 font-bold">
                          Rs. {((item.products?.price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg ${
                        errors.phone_number ? "border-red-600" : "border-gray-300"
                      }`}
                    />
                    {errors.phone_number && (
                      <p className="text-red-600 text-sm mt-1">{errors.phone_number}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Alternate Phone Number
                    </label>
                    <input
                      type="tel"
                      name="alt_phone_number"
                      value={formData.alt_phone_number}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full p-3 border rounded-lg ${
                        errors.address ? "border-red-600" : "border-gray-300"
                      }`}
                    />
                    {errors.address && (
                      <p className="text-red-600 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg ${
                        errors.city ? "border-red-600" : "border-gray-300"
                      }`}
                    />
                    {errors.city && (
                      <p className="text-red-600 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md sticky top-20">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>Rs. {calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span>Rs. 150.00</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">Rs. {calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {submitting ? "Placing Order..." : "Place Order"}
                </button>

                <button
                  onClick={() => router.push("/cart")}
                  className="w-full mt-3 bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-600 transition"
                >
                  Back to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}