"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone_number: "",
    alt_phone_number: "",
    address: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      
      alert("Signup successful!");
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}

        {["full_name", "email", "password", "phone_number", "alt_phone_number", "address", "city"].map(
          (field) => (
            <input
              key={field}
              name={field}
              type={field === "password" ? "password" : "text"}
              placeholder={field.replace("_", " ")}
              value={(form as any)[field]}
              onChange={handleChange}
              required={["full_name", "email", "password"].includes(field)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}