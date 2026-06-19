import Link from "next/link";
import { Navbar, LeafDivider, SiteFooter } from "@/components/Navbar";

export default function KalvettuHome() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 to-cream-50 px-4 py-20 text-center">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-gold-600">
              Tamil Marabu · Heritage & Legacy
            </p>
            <h1 className="font-serif text-4xl font-bold text-maroon-800 sm:text-5xl">
              Kalvettu
            </h1>
            <p className="mt-2 text-lg italic text-stone-600">
              கல்வெட்டு — A digital memory book for your family
            </p>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-stone-600">
              Preserve heritage, life stories, family trees, photos, and tributes —
              honouring those you love in memory.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/setup"
                className="rounded-lg bg-maroon-700 px-8 py-3 font-medium text-white shadow-sm hover:bg-maroon-800"
              >
                Start your family archive
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-stone-300 px-8 py-3 font-medium text-stone-700 hover:bg-white"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>

        <LeafDivider />

        <section className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="mb-10 text-center font-serif text-3xl text-maroon-800">
            What you can preserve
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Biography", desc: "Life history, village roots, and Tamil names." },
              { title: "Family Tree", desc: "Amma, Appa, Periamma — Sri Lankan relationships." },
              { title: "Photos & Videos", desc: "A gallery of family moments and memories." },
              { title: "Tributes", desc: "Relatives overseas share memories without an account." },
              { title: "Share Links", desc: "Invite family to contribute — you approve first." },
              { title: "Memorial Pages", desc: "A respectful public page at /memorial/name." },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
              >
                <h3 className="font-serif text-lg font-semibold text-maroon-800">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
