"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { FormInput, TextAreaInput } from "@/components/FormInput";
import { SiteHeader, SiteFooter } from "@/components/home/HomeChrome";
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
    return (
      <div className="flex min-h-screen flex-col bg-cream-50">
        <SiteHeader />
        <p className="flex flex-1 items-center justify-center p-12 text-center text-stone-500">
          Loading…
        </p>
        <SiteFooter />
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex min-h-screen flex-col bg-cream-50">
        <SiteHeader memorialSlug={slug} memorialName={memorial.fullName} />
        <div className="flex flex-1 items-center justify-center px-4">
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
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <SiteHeader memorialSlug={slug} memorialName={memorial.fullName} />
      <div className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-lg">
          <nav className="text-sm text-stone-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-maroon-700">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/memorial/${slug}`} className="hover:text-maroon-700">
              {memorial.fullName}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-stone-700">Share a memory</span>
          </nav>
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
      <SiteFooter />
    </div>
  );
}
