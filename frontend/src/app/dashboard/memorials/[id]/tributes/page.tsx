"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { SectionTitle } from "@/components/SectionTitle";
import { formatDate } from "@/lib/utils";
import type { Memorial, Tribute } from "@/lib/types";

export default function MemorialTributesPage() {
  const { id } = useParams<{ id: string }>();
  const [memorial, setMemorial] = useState<Memorial | null>(null);
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    Promise.all([api.memorials.get(id), api.tributes.list(id)])
      .then(([m, t]) => {
        setMemorial(m);
        setTributes(t);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load tributes")
      );
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleApprove(tributeId: string) {
    setBusyId(tributeId);
    setError(null);
    try {
      await api.tributes.approve(id, tributeId);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not approve tribute");
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(tributeId: string) {
    setBusyId(tributeId);
    setError(null);
    try {
      await api.tributes.reject(id, tributeId);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not reject tribute");
    } finally {
      setBusyId(null);
    }
  }

  const pending = tributes.filter((t) => !t.approved);
  const approved = tributes.filter((t) => t.approved);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <Link
          href="/dashboard/memorials"
          className="text-sm text-maroon-700 underline"
        >
          ← Back to memorials
        </Link>
      </div>

      <SectionTitle
        title={memorial ? `Tributes — ${memorial.fullName}` : "Tributes"}
        subtitle="Approve family contributions before they appear on the public page"
      />

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {!memorial && !error ? (
        <p className="mt-8 text-stone-500">Loading…</p>
      ) : (
        <div className="mt-8 space-y-10">
          <section>
            <h3 className="font-serif text-lg text-maroon-800">
              Pending approval ({pending.length})
            </h3>
            {pending.length === 0 ? (
              <p className="mt-3 text-sm text-stone-500">
                No tributes waiting for review.
              </p>
            ) : (
              <ul className="mt-4 space-y-4">
                {pending.map((t) => (
                  <li
                    key={t.tributeId}
                    className="rounded-xl border border-gold-200 bg-gold-50/50 p-5"
                  >
                    <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-maroon-800">
                          {t.name || "Anonymous"}
                        </p>
                        {t.relationship && (
                          <p className="text-sm text-stone-500">{t.relationship}</p>
                        )}
                      </div>
                      <time className="text-xs text-stone-400">
                        {formatDate(t.createdAt)}
                      </time>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-700">
                      {t.message}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        disabled={busyId === t.tributeId}
                        onClick={() => handleApprove(t.tributeId)}
                        className="rounded-lg bg-maroon-700 px-4 py-2 text-sm text-white hover:bg-maroon-800 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={busyId === t.tributeId}
                        onClick={() => handleReject(t.tributeId)}
                        className="rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-600 hover:bg-white disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h3 className="font-serif text-lg text-maroon-800">
              Published ({approved.length})
            </h3>
            {approved.length === 0 ? (
              <p className="mt-3 text-sm text-stone-500">
                Approved tributes will appear on the public memorial page.
              </p>
            ) : (
              <ul className="mt-4 space-y-4">
                {approved.map((t) => (
                  <li
                    key={t.tributeId}
                    className="rounded-xl border border-stone-200 bg-white p-5"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="font-medium text-maroon-800">
                          {t.name || "Anonymous"}
                        </p>
                        {t.relationship && (
                          <p className="text-sm text-stone-500">{t.relationship}</p>
                        )}
                      </div>
                      <time className="text-xs text-stone-400">
                        {formatDate(t.createdAt)}
                      </time>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-700">
                      {t.message}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {memorial && (
            <p className="text-sm text-stone-500">
              Public page:{" "}
              <Link
                href={`/memorial/${memorial.slug}`}
                className="text-maroon-700 underline"
              >
                /memorial/{memorial.slug}
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
