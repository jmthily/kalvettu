"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { FamilyTreeView } from "@/components/FamilyTreeView";
import { TributeCard } from "@/components/TributeCard";
import { MediaGallery } from "@/components/MediaGallery";
import { LeafDivider } from "@/components/Navbar";
import { SectionTitle } from "@/components/SectionTitle";
import { formatLifeDates } from "@/lib/utils";
import type { Memorial, FamilyMember, Tribute, MediaItem, Person } from "@/lib/types";

function toPerson(m: FamilyMember): Person {
  return {
    personId: m.personId,
    fullName: m.fullName,
    relationshipLabel: m.relationship,
    photoUrl: m.photoUrl,
    isLiving: m.isLiving,
  };
}

export default function MemorialPublicView({ slug }: { slug: string }) {
  const [memorial, setMemorial] = useState<Memorial | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.memorials
      .getPublic(slug)
      .then(setMemorial)
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-50 p-12 text-center">
        <div>
          <h1 className="font-serif text-2xl text-maroon-800">Memorial not found</h1>
          <Link href="/" className="mt-4 inline-block text-maroon-700 underline">
            Home
          </Link>
        </div>
      </div>
    );
  }

  if (!memorial) {
    return (
      <p className="p-12 text-center text-stone-500">Loading memorial…</p>
    );
  }

  return (
    <MemorialContent memorial={memorial} slug={slug} />
  );
}

function MemorialContent({ memorial, slug }: { memorial: Memorial; slug: string }) {
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);

  useEffect(() => {
    Promise.all([
      api.memorials.listPeoplePublic(memorial.memorialId),
      api.tributes.listPublic(memorial.memorialId),
      api.media.listPublic(memorial.memorialId),
    ]).then(([fam, trib, med]) => {
      setFamily(fam);
      setTributes(trib);
      setMedia(med);
    });
  }, [memorial.memorialId]);

  const photos = media.filter((m) => m.mediaType === "photo" && m.approved);
  const videos = media.filter((m) => m.mediaType === "video" && m.approved);

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="bg-gradient-to-b from-maroon-800 to-maroon-700 px-4 py-16 text-center text-white">
        {memorial.profilePhotoUrl && (
          <div className="mx-auto mb-6 h-28 w-28 overflow-hidden rounded-full border-4 border-gold-300">
            <Image
              src={memorial.profilePhotoUrl}
              alt={memorial.fullName}
              width={112}
              height={112}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
        )}
        <h1 className="font-serif text-4xl font-bold">{memorial.fullName}</h1>
        {memorial.tamilName && (
          <p className="mt-2 text-xl text-gold-100">{memorial.tamilName}</p>
        )}
        {memorial.knownAs && (
          <p className="mt-1 text-gold-200">Known as {memorial.knownAs}</p>
        )}
        <p className="mt-3 text-gold-100">
          {formatLifeDates(memorial.dateOfBirth, memorial.dateOfPassing)}
        </p>
        {memorial.village && (
          <p className="mt-1 text-sm text-gold-200">{memorial.village}</p>
        )}
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12">
        {memorial.biography && (
          <section className="mb-10">
            <SectionTitle title="Biography" />
            <p className="leading-relaxed text-stone-700">{memorial.biography}</p>
          </section>
        )}
        {memorial.lifeHistory && (
          <section className="mb-10">
            <SectionTitle title="Life History" />
            <p className="whitespace-pre-wrap leading-relaxed text-stone-700">
              {memorial.lifeHistory}
            </p>
          </section>
        )}

        <LeafDivider />

        {family.length > 0 && (
          <section className="mb-10">
            <SectionTitle title="Family Tree" />
            <FamilyTreeView people={family.map(toPerson)} />
          </section>
        )}

        {photos.length > 0 && (
          <section className="mb-10">
            <SectionTitle title="Photos" />
            <MediaGallery items={photos} />
          </section>
        )}

        {videos.length > 0 && (
          <section className="mb-10">
            <SectionTitle title="Videos" />
            <MediaGallery items={videos} />
          </section>
        )}

        {tributes.length > 0 && (
          <section className="mb-10 space-y-4">
            <SectionTitle title="Tribute Wall" />
            {tributes.map((t) => (
              <TributeCard key={t.tributeId} tribute={t} />
            ))}
          </section>
        )}

        <section className="rounded-xl border border-maroon-200 bg-maroon-50 p-8 text-center">
          <h3 className="font-serif text-xl text-maroon-800">Share your memory</h3>
          <p className="mt-2 text-sm text-stone-600">
            Family and friends can leave a tribute — no account needed.
          </p>
          <Link
            href={`/memorial/${slug}/contribute`}
            className="mt-4 inline-block rounded-lg bg-maroon-700 px-6 py-2.5 text-white hover:bg-maroon-800"
          >
            Add a tribute
          </Link>
        </section>
      </main>
    </div>
  );
}
