"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { FormInput, TextAreaInput } from "@/components/FormInput";
import type { Memorial } from "@/lib/types";

export default function ContributePage() {
  const { slug } = useParams<{ slug: string }>();
  const [memorial, setMemorial] = useState<Memorial | null>(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.memorials.getPublic(slug).then(setMemorial).catch(() => setMemorial(null));
  }, [slug]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!memorial) return;
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      await api.tributes.create(memorial.memorialId, {
        name: String(fd.get("name")),
        relationship: String(fd.get("relationship") || ""),
        message: String(fd.get("message")),
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit tribute");
    }
  }

  if (!memorial) {
    return <p className="p-12 text-center text-stone-500">Loading…</p>;
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4">
        <div className="max-w-md text-center">
          <h1 className="font-serif text-2xl text-maroon-800">Thank you</h1>
          <p className="mt-4 text-stone-600">
            Your memory will appear on the tribute wall after family approval.
          </p>
          <Link
            href={`/memorial/${slug}`}
            className="mt-6 inline-block text-maroon-700 underline"
          >
            Back to {memorial.fullName}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 px-4 py-12">
      <div className="mx-auto max-w-lg">
        <Link href={`/memorial/${slug}`} className="text-sm text-maroon-700 underline">
          ← Back
        </Link>
        <h1 className="mt-4 font-serif text-2xl text-maroon-800">
          Share a memory of {memorial.fullName}
        </h1>
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
        >
          <FormInput label="Your name" name="name" required />
          <FormInput
            label="Relationship"
            name="relationship"
            placeholder="e.g. niece, childhood friend"
          />
          <TextAreaInput
            label="Your memory"
            name="message"
            required
            rows={6}
            placeholder="Share a story, blessing, or message…"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-maroon-700 py-2.5 font-medium text-white hover:bg-maroon-800"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
