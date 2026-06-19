"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { FormInput } from "@/components/FormInput";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const fd = new FormData(e.currentTarget);

    try {
      const res = await api.auth.forgotPassword(String(fd.get("email")));
      setMessage(res.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
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
          <p className="mt-2 text-stone-600">Reset your admin password</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
        >
          <FormInput label="Admin email" name="email" type="email" required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-stone-600">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-maroon-700 py-2.5 font-medium text-white hover:bg-maroon-800 disabled:opacity-50"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-stone-600">
          <Link href="/login" className="text-maroon-700 underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
