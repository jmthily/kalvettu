import type { MediaItem } from "@/lib/types";

export function MediaGallery({ items }: { items: MediaItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.mediaId}
          className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm"
        >
          {item.mediaType === "photo" && item.fileUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.fileUrl}
              alt={item.caption || "Photo"}
              className="aspect-square w-full object-cover"
            />
          ) : item.mediaType === "video" && item.fileUrl ? (
            <video src={item.fileUrl} controls className="aspect-square w-full object-cover" />
          ) : null}
          {item.caption && (
            <div className="p-3">
              <p className="text-sm text-stone-700">{item.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
