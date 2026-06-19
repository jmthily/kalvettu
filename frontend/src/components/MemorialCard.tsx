import Link from "next/link";
import type { Memorial } from "@/lib/types";
import { formatLifeDates } from "@/lib/utils";

export function MemorialCard({ memorial }: { memorial: Memorial }) {
  return (
    <Link
      href={`/memorial/${memorial.slug}`}
      className="group block rounded-xl border border-stone-200 bg-cream-50 p-5 shadow-sm transition hover:border-maroon-200 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        {memorial.profilePhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={memorial.profilePhotoUrl}
            alt={memorial.fullName}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-gold-200"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-maroon-100 font-serif text-xl text-maroon-700">
            {memorial.fullName.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-lg font-semibold text-stone-900 group-hover:text-maroon-800">
            {memorial.fullName}
          </h3>
          {memorial.knownAs && (
            <p className="text-sm text-stone-500">Known as {memorial.knownAs}</p>
          )}
          <p className="mt-1 text-sm text-stone-600">
            {formatLifeDates(memorial.dateOfBirth, memorial.dateOfPassing)}
          </p>
          <p className="mt-2 text-xs capitalize text-stone-400">{memorial.privacyLevel}</p>
        </div>
      </div>
    </Link>
  );
}
