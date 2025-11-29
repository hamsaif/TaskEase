"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Login dengan email: ${email} dan password: ${password}`);
    // Di sini nanti bisa ditambahkan validasi / API login
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-6">
      <main className="flex w-full max-w-md flex-col gap-6 py-16 bg-white dark:bg-zinc-900 rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-black dark:text-white">
          Login TaskEase
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
            required
          />

          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-full font-medium hover:opacity-90 dark:bg-white dark:text-black transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-zinc-600 dark:text-zinc-400 text-sm">
          Belum punya akun? <a href="#" className="underline">Daftar sekarang</a>
        </p>
      </main>
    </div>
  );
}
