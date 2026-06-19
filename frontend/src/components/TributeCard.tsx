import type { Tribute } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function TributeCard({ tribute }: { tribute: Tribute }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-cream-50 p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div>
          {tribute.name && (
            <p className="font-medium text-maroon-800">{tribute.name}</p>
          )}
          {tribute.relationship && (
            <p className="text-sm text-stone-500">{tribute.relationship}</p>
          )}
        </div>
        <time className="text-xs text-stone-400">{formatDate(tribute.createdAt)}</time>
      </div>
      <p className="whitespace-pre-wrap leading-relaxed text-stone-700">{tribute.message}</p>
    </div>
  );
}
