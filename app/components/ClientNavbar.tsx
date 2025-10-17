"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface User {
    id: string;
    full_name: string;
    email: string;
    role: string;
}

export default function ClientNavbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [cartCount, setCartCount] = useState(0);

    const hideNavbar = pathname?.startsWith("/login") ||
        pathname?.startsWith("/signup") ||
        pathname?.startsWith("/admin");

    useEffect(() => {
        checkSession();
    }, [pathname]);

    useEffect(() => {
        if (user) {
            fetchCartCount();
        }
    }, [user, pathname]);

    const checkSession = async () => {
        try {
            const res = await fetch("/api/users/get-session");
            const data = await res.json();

            if (data.user) {
                const userRes = await fetch(`/api/users/get-user-by-id?id=${data.user.id}`);
                const userData = await userRes.json();

                if (userRes.ok) {
                    setUser(userData.user);
                }
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error("Error checking session:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchCartCount = async () => {
        try {
            const res = await fetch(`/api/cart/get-cart?user_id=${user?.id}`);
            const data = await res.json();
            setCartCount(data.length || 0);
        } catch (err) {
            console.error("Error fetching cart count:", err);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/users/logout", { method: "POST" });
        setUser(null);
        setCartCount(0);
        router.push("/");
        router.refresh();
    };

    if (hideNavbar || loading) return null;

    return (
        <nav className="bg-white dark:bg-zinc-800 shadow-md p-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <Link href={'/'} className="text-2xl font-bold cursor-pointer hover:text-blue-600 transition">
                        My Store
                    </Link>
                    <Link href={"/categories"} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition">
                        Categories
                    </Link>
                </div>

                <div className="flex gap-4 items-center">
                    {user ? (
                        <>
                            <button
                                onClick={() => router.push("/cart")}
                                className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                🛒 Cart
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Welcome, <span className="font-semibold">{user.full_name}</span>
                                </span>

                                {user.role === "admin" && (
                                    <Link href={'/admin'} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm">
                                        Admin Panel
                                    </Link>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href={'/login'} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                                Login
                            </Link>
                            <Link href={"/signup"} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}