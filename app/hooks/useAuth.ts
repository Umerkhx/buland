import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";



export function useAuth(requireAuth: boolean = false) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

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
          } else if (requireAuth) {
            router.push(`/login?redirect=${pathname}`);
          }
        } else if (requireAuth) {
          router.push(`/login?redirect=${pathname}`);
        }
      } catch (err) {
        console.error("Session fetch error:", err);
        if (requireAuth) {
          router.push(`/login?redirect=${pathname}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [requireAuth, router, pathname]);

  const logout = async () => {
    await fetch("/api/users/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  const requireAuthentication = (action: string = "perform this action") => {
    if (!user) {
      const currentPath = pathname;
      router.push(`/login?redirect=${currentPath}`);
      return false;
    }
    return true;
  };

  return { user, loading, logout, requireAuthentication };
}