"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Notification {
  id: number;
  message: string;
  created_at: string;
}

export default function AdminHome() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

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
        fetchNotifications(sessionData.user.id);
        setLoading(false);
      } catch (err) {
        router.replace("/");
      }
    };

    checkAdmin();
  }, [router]);

  const fetchNotifications = async (userId: string) => {
    try {
      const res = await fetch("/api/notifications/get-notifications", {
        headers: { "x-user-id": userId },
      });
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await fetch("/api/notifications/delete-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({ id }),
      });
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await fetch("/api/notifications/delete-all-notifications", {
        method: "POST",
        headers: { "x-user-id": user.id },
      });
      setNotifications([]);
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/users/logout", { method: "POST" });
    router.push("/login");
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Checking access...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <nav className="bg-white dark:bg-zinc-800 shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold cursor-pointer" onClick={() => router.push("/admin")}>
              Admin Panel
            </h1>
            <button
              onClick={() => router.push("/admin/products")}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
            >
              Products
            </button>
            <button
              onClick={() => router.push("/admin/upload-product")}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
            >
              Upload Product
            </button>
            <button
              onClick={() => router.push("/admin/users")}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
            >
              Users
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg"
              >
                🔔
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-800 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-semibold">Notifications</h3>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No notifications</div>
                  ) : (
                    <div>
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className="p-4 border-b hover:bg-gray-50 dark:hover:bg-zinc-700 flex justify-between items-start"
                        >
                          <div className="flex-1">
                            <p className="text-sm">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notif.created_at).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => deleteNotification(notif.id)}
                            className="text-red-600 hover:text-red-700 ml-2"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <span className="text-sm">{user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Welcome, Admin 👑</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div
            onClick={() => router.push("/admin/products")}
            className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer"
          >
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-bold mb-2">Manage Products</h3>
            <p className="text-gray-600 dark:text-gray-400">
              View, edit, and delete products
            </p>
          </div>

          <div
            onClick={() => router.push("/admin/upload-product")}
            className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer"
          >
            <div className="text-4xl mb-4">⬆️</div>
            <h3 className="text-xl font-bold mb-2">Upload Product</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Add new products to your store
            </p>
          </div>

          <div
            onClick={() => router.push("/admin/users")}
            className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer"
          >
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2">Manage Users</h3>
            <p className="text-gray-600 dark:text-gray-400">
              View all registered users
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}