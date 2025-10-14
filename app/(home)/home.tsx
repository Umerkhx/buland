"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionRes = await fetch("/api/users/get-session");
        const sessionData = await sessionRes.json();

        if (sessionData.user) {
          const userRes = await fetch(`/api/users/get-user-by-id?id=${sessionData.user.id}`);
          const userData = await userRes.json();
          
          if (userRes.ok) {
            setUser(userData.user);
          }
        }
      } catch (err) {
        console.error("Session fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/users/logout", { method: "POST" });
    setUser(null);
    router.refresh();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900">
      {/* Navigation Bar */}
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
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>
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

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-5xl font-bold mb-4">Welcome to Our Store! 🛍️</h2>
          <p className="text-xl mb-8">
            Discover amazing products at great prices
          </p>
          <button
            onClick={() => router.push("/categories")}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
          >
            Browse Categories →
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get your orders delivered quickly and safely
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">💯</div>
            <h3 className="text-xl font-bold mb-2">Quality Products</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We ensure top-notch quality for all items
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2">Secure Payment</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your transactions are safe and encrypted
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white dark:bg-zinc-800 py-16">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Browse our collection and find what you love
          </p>
          <button
            onClick={() => router.push("/categories")}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
          >
            Explore Products
          </button>
        </div>
      </div>
    </div>
  );
}