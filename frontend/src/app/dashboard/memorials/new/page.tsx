"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { FormInput, TextAreaInput } from "@/components/FormInput";
import { SectionTitle } from "@/components/SectionTitle";

export default function NewMemorialPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);

    try {
      const memorial = await api.memorials.create({
        fullName: fd.get("full_name"),
        tamilName: fd.get("tamil_name") || undefined,
        knownAs: fd.get("known_as") || undefined,
        village: fd.get("village") || undefined,
        dateOfBirth: fd.get("date_of_birth") || undefined,
        dateOfPassing: fd.get("date_of_passing") || undefined,
        biography: fd.get("biography") || undefined,
        lifeHistory: fd.get("life_history") || undefined,
        privacyLevel: "public",
      });
      router.push(`/memorial/${memorial.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create memorial");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg p-6">
      <SectionTitle title="Create a Memorial" subtitle="Honour a loved one" />
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
      >
        <FormInput label="Full name" name="full_name" required />
        <FormInput label="Tamil name" name="tamil_name" />
        <FormInput label="Known as" name="known_as" />
        <FormInput label="Village" name="village" />
        <FormInput label="Date of birth" name="date_of_birth" type="date" />
        <FormInput label="Date of passing" name="date_of_passing" type="date" />
        <TextAreaInput label="Biography" name="biography" rows={4} />
        <TextAreaInput label="Life history" name="life_history" rows={6} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-maroon-700 py-2.5 text-white disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create memorial"}
        </button>
      </form>
    </div>
  );
}
