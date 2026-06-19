"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { MemorialCard } from "@/components/MemorialCard";
import { SectionTitle } from "@/components/SectionTitle";
import type { Memorial } from "@/lib/types";

export default function MemorialsPage() {
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.memorials
      .list()
      .then(setMemorials)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <SectionTitle title="Memorials" subtitle="Pages you manage" />
        <Link
          href="/dashboard/memorials/new"
          className="rounded-lg bg-maroon-700 px-4 py-2 text-sm text-white hover:bg-maroon-800"
        >
          + Create New
        </Link>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {memorials.length === 0 && !error ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <p className="text-lg text-stone-600">No memorials yet.</p>
          <Link
            href="/dashboard/memorials/new"
            className="mt-6 inline-block rounded-lg bg-maroon-700 px-6 py-2.5 text-white"
          >
            Create your first memorial
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {memorials.map((m) => (
            <MemorialCard key={m.memorialId} memorial={m} />
          ))}
        </div>
      )}
    </div>
  );
}
