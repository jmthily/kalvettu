"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { FormInput } from "@/components/FormInput";

export default function ChangePasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const newPassword = String(fd.get("new_password"));
    const confirm = String(fd.get("confirm_password"));

    if (newPassword !== confirm) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await api.auth.changePassword(
        String(fd.get("current_password")),
        newPassword
      );
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change password");
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md p-6">
        <h1 className="font-serif text-2xl text-maroon-800">Password updated</h1>
        <p className="mt-4 text-stone-600">Your password has been changed successfully.</p>
        <Link href="/dashboard" className="mt-6 inline-block text-maroon-700 underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <Link href="/dashboard" className="text-sm text-maroon-700 underline">
        ← Dashboard
      </Link>
      <h1 className="mt-4 font-serif text-2xl text-maroon-800">Change password</h1>
      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
      >
        <FormInput label="Current password" name="current_password" type="password" required />
        <FormInput label="New password" name="new_password" type="password" required minLength={8} />
        <FormInput label="Confirm new password" name="confirm_password" type="password" required minLength={8} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-maroon-700 py-2.5 font-medium text-white hover:bg-maroon-800 disabled:opacity-50"
        >
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
