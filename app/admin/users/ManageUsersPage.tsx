"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  phone_number?: string;
  alt_phone_number?: string;
  address?: string;
  city?: string;
  created_at: string;
}

export default function ManageUsersPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

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

        setAdmin(userData.user);
        fetchUsers(sessionData.user.id);
        setLoading(false);
      } catch (err) {
        router.replace("/");
      }
    };

    checkAdmin();
  }, [router]);

  const fetchUsers = async (userId: string) => {
    try {
      const res = await fetch("/api/users/get-users", {
        headers: {
          "x-user-id": userId,
        },
      });

      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
        setFilteredUsers(data.users);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter) {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

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
        <h2 className="text-3xl font-bold mb-6">Manage Users</h2>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Search Users</label>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Filter by Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          </div>
          <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Regular Users</h3>
            <p className="text-3xl font-bold text-green-600">
              {users.filter((u) => u.role === "user").length}
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Admins</h3>
            <p className="text-3xl font-bold text-purple-600">
              {users.filter((u) => u.role === "admin").length}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-zinc-700">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">City</th>
                  <th className="p-4 text-left">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50 dark:hover:bg-zinc-700">
                    <td className="p-4 font-semibold">{user.full_name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">{user.phone_number || "N/A"}</td>
                    <td className="p-4">{user.city || "N/A"}</td>
                    <td className="p-4">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center p-8 text-gray-500">No users found</div>
          )}
        </div>
      </div>
    </div>
  );
}