"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearAuth } from "@/lib/auth";
import { SectionTitle } from "@/components/SectionTitle";

export default function DashboardPage() {
  const router = useRouter();

  function signOut() {
    clearAuth();
    router.push("/");
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <SectionTitle
          title="Dashboard"
          subtitle="Manage memorials and approve family contributions"
        />
        <button
          onClick={signOut}
          className="rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-600"
        >
          Sign out
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/memorials"
          className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm hover:border-maroon-200"
        >
          <h3 className="font-serif text-lg text-maroon-800">Memorials</h3>
          <p className="mt-2 text-sm text-stone-600">View and manage all memorial pages</p>
        </Link>
        <Link
          href="/dashboard/memorials/new"
          className="rounded-xl border border-dashed border-maroon-200 bg-maroon-50 p-6 hover:bg-maroon-100"
        >
          <h3 className="font-serif text-lg text-maroon-800">+ Create memorial</h3>
          <p className="mt-2 text-sm text-stone-600">Start a new Kalvettu page</p>
        </Link>
      </div>
    </div>
  );
}
