"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminHome() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

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

        if (!userData.user) {
          router.replace("/login");
          return;
        }

        if (userData.user.role !== "admin") {
          router.replace("/");
          return;
        }

        setUser(userData.user);
        setLoading(false);
      } catch (err) {
        router.replace("/login");
      }
    };

    checkAdmin();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/users/logout", { method: "POST" });
    router.push("/login");
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Checking access...</div>;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800">Welcome, Admin 👑</h1>
      <p className="text-gray-600 mt-2">Logged in as {user.email}</p>
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}