"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { setAuthToken } from "@/lib/auth";
import { FormInput } from "@/components/FormInput";

export default function SetupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");

    try {
      await api.auth.setup(email, password);
      const login = await api.auth.login(email, password);
      setAuthToken(login.accessToken);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Setup failed");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="font-serif text-3xl font-bold text-maroon-800">
            Kalvettu
          </Link>
          <p className="mt-2 text-stone-600">Create the admin account (once)</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
        >
          <FormInput label="Admin email" name="email" type="email" required />
          <FormInput label="Password" name="password" type="password" required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-maroon-700 py-2.5 font-medium text-white hover:bg-maroon-800 disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create admin"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-stone-600">
          Already set up?{" "}
          <Link href="/login" className="text-maroon-700 underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
