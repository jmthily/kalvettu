"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { setAuthToken } from "@/lib/auth";
import { FormInput } from "@/components/FormInput";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);

    try {
      const res = await api.auth.login(
        String(fd.get("email")),
        String(fd.get("password"))
      );
      setAuthToken(res.accessToken);
      router.push(searchParams.get("redirect") || "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
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
          <p className="mt-2 text-stone-600">Admin login</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
        >
          <FormInput label="Email" name="email" type="email" required />
          <FormInput label="Password" name="password" type="password" required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-maroon-700 py-2.5 font-medium text-white hover:bg-maroon-800 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-stone-600">
          First time?{" "}
          <Link href="/setup" className="text-maroon-700 underline">
            Create admin account
          </Link>
        </p>
      </div>
    </div>
  );
}
