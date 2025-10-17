"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import Link from "next/link";
import { CartItem } from "../types/cart-types/cart-types";



export default function CartPage() {
  const { user, loading: authLoading } = useAuth(true);
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

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
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await fetch("/api/cart/update-cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: itemId,
          user_id: user?.id,
          quantity: newQuantity,
        }),
      });
      
      fetchCart();
    } catch (err) {
      console.error("Error updating cart:", err);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await fetch("/api/cart/delete-cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: itemId,
          user_id: user?.id,
        }),
      });
      
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
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
    const shipping = subtotal > 0 ? 150 : 0;
    return subtotal + shipping;
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    router.push("/checkout");
  };

  if (authLoading || loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6">Your Cart 🛒</h2>

        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-zinc-800 p-12 rounded-lg shadow-md text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-bold mb-2">Your cart is empty</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Add some products to get started!
            </p>
            <button
              onClick={() => router.push("/categories")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md flex gap-4"
                >
                  <img
                    src={
                      Array.isArray(item.products?.image_url)
                        ? item.products.image_url[0]
                        : item.products?.image_url
                    }
                    alt={item.products?.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{item.products?.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Size: {item.products?.size}
                    </p>
                    <p className="text-blue-600 font-bold">
                      Rs. {item.products?.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700 text-sm transition"
                    >
                      Remove
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 dark:bg-zinc-700 px-3 py-1 rounded hover:bg-gray-300 transition"
                      >
                        -
                      </button>
                      <span className="font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 dark:bg-zinc-700 px-3 py-1 rounded hover:bg-gray-300 transition"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm font-semibold mt-2">
                      Rs. {((item.products?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md sticky top-20">
                <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                
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
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold text-lg transition"
                >
                  Proceed to Checkout
                </button>

                <Link
                  href="/categories"
                  className="block w-full mt-3 bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-600 text-center transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}