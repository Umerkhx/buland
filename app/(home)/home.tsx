"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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



  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900">


      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-5xl font-bold mb-4">Welcome to Our Store! 🛍️</h2>
          <p className="text-xl mb-8">
            Discover amazing products at great prices
          </p>
          <Link
            href={"/categories"}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
          >
            Browse Categories →
          </Link>
        </div>
      </div>

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