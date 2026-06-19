import Link from "next/link";
import { HomeNavbar, HomeFooter, PatternDivider } from "@/components/home/HomeChrome";

const features = [
  {
    title: "Rituals",
    desc: "Learn about Tamil religious, cultural, and family rituals with verified guidance from community elders and priests.",
    icon: "🪔",
  },
  {
    title: "Festivals",
    desc: "Discover the meaning, history, and traditions behind Tamil festivals and celebrations throughout the year.",
    icon: "🎉",
  },
  {
    title: "Recipes",
    desc: "Preserve and share traditional Tamil family recipes passed down through generations.",
    icon: "🍲",
  },
  {
    title: "Memories",
    desc: "Capture stories, wisdom, life lessons, migration journeys, and experiences from older generations.",
    icon: "📖",
  },
  {
    title: "Kalvettu",
    desc: "Create digital memorials, biographies, family trees, tributes, photos, and videos to preserve family legacy.",
    icon: "🕯️",
    href: "/login",
  },
  {
    title: "Community",
    desc: "Connect generations through shared knowledge, cultural learning, mentoring, and future community initiatives.",
    icon: "🤝",
  },
];

const roadmap = [
  {
    phase: "Phase 1",
    items: ["Digital Kalvettu", "Family Trees", "Memory Collection"],
  },
  {
    phase: "Phase 2",
    items: ["Ritual Knowledge Base", "Festival Library", "Recipe Collection"],
  },
  {
    phase: "Phase 3",
    items: [
      "Community Contributions",
      "Oral History Archive",
      "Cultural Learning Resources",
    ],
  },
  {
    phase: "Phase 4",
    items: [
      "Matrimony",
      "Intergenerational Connections",
      "Community Marketplace",
    ],
  },
];

export default function TamilMarabuHome() {
  return (
    <>
      <HomeNavbar />
      <main>
        {/* Announcement */}
        <div
          className="border-b border-gold-200/60 bg-gold-100/80 px-4 py-3 text-center text-sm text-maroon-800"
          role="status"
        >
          <strong>Coming Soon:</strong> A growing collection of Tamil rituals,
          festivals, family histories, recipes, memorials, cultural traditions,
          and community knowledge.
        </div>

        {/* Hero */}
        <section className="hero-pattern relative overflow-hidden px-4 py-20 sm:py-28">
          <div className="relative mx-auto max-w-4xl text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-gold-600">
              தமிழ் மரபு · Tamil Heritage
            </p>
            <h1 className="font-serif text-5xl font-bold tracking-tight text-maroon-800 sm:text-6xl lg:text-7xl">
              TamilMarabu
            </h1>
            <p className="mt-4 font-serif text-xl text-maroon-700 sm:text-2xl">
              Preserving Tamil Heritage Across Generations
            </p>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-stone-600">
              TamilMarabu is a growing digital knowledge platform dedicated to
              preserving and sharing Tamil culture, traditions, family histories,
              rituals, festivals, memories, recipes, and community knowledge so
              future generations can stay connected to their roots.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#explore"
                className="w-full rounded-lg bg-maroon-700 px-8 py-3.5 font-medium text-white shadow-md transition hover:bg-maroon-800 sm:w-auto"
              >
                Explore Tamil Heritage
              </a>
              <a
                href="#roadmap"
                className="w-full rounded-lg border-2 border-maroon-200 bg-white/80 px-8 py-3.5 font-medium text-maroon-800 transition hover:border-maroon-300 hover:bg-white sm:w-auto"
              >
                Join Our Community
              </a>
            </div>
          </div>
        </section>

        <PatternDivider />

        {/* Mission */}
        <section id="mission" className="mx-auto max-w-3xl px-4 py-16 scroll-mt-20">
          <h2 className="text-center font-serif text-3xl font-bold text-maroon-800 sm:text-4xl">
            Why TamilMarabu?
          </h2>
          <p className="mt-8 text-center text-lg leading-relaxed text-stone-600">
            Our mission is to preserve valuable cultural knowledge that is often
            passed down orally through families and communities. We aim to create
            a trusted digital archive where future generations can learn about
            Tamil traditions, customs, stories, and heritage.
          </p>
        </section>

        {/* Explore */}
        <section
          id="explore"
          className="bg-cream-100/80 px-4 py-20 scroll-mt-20"
        >
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-serif text-3xl font-bold text-maroon-800 sm:text-4xl">
              Explore Tamil Heritage
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-stone-600">
              Six pillars of cultural preservation — from sacred rituals to
              family legacy.
            </p>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => {
                const Card = (
                  <article className="card-pattern group h-full rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm transition hover:border-maroon-200 hover:shadow-md">
                    <span className="text-3xl" aria-hidden>
                      {f.icon}
                    </span>
                    <h3 className="mt-4 font-serif text-xl font-semibold text-maroon-800 group-hover:text-maroon-700">
                      {f.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-stone-600">
                      {f.desc}
                    </p>
                    {f.href && (
                      <p className="mt-4 text-sm font-medium text-maroon-700">
                        Available now →
                      </p>
                    )}
                  </article>
                );
                return (
                  <li key={f.title}>
                    {f.href ? (
                      <Link href={f.href} className="block h-full">
                        {Card}
                      </Link>
                    ) : (
                      Card
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Future generations */}
        <section id="future" className="mx-auto max-w-3xl px-4 py-20 scroll-mt-20">
          <h2 className="text-center font-serif text-3xl font-bold text-maroon-800 sm:text-4xl">
            For Future Generations
          </h2>
          <p className="mt-8 text-center text-lg leading-relaxed text-stone-600">
            Many traditions, stories, and cultural practices are at risk of being
            lost. TamilMarabu helps preserve this knowledge so children,
            grandchildren, and future generations can continue to learn from the
            wisdom of those who came before them.
          </p>
        </section>

        {/* Roadmap */}
        <section
          id="roadmap"
          className="border-t border-stone-200 bg-gradient-to-b from-cream-50 to-cream-100 px-4 py-20 scroll-mt-20"
        >
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center font-serif text-3xl font-bold text-maroon-800 sm:text-4xl">
              Coming Soon
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-stone-600">
              Our roadmap for building a comprehensive Tamil heritage platform.
            </p>
            <ol className="mt-12 grid gap-6 sm:grid-cols-2">
              {roadmap.map((r, i) => (
                <li
                  key={r.phase}
                  className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-maroon-100 font-serif text-sm font-bold text-maroon-800">
                      {i + 1}
                    </span>
                    <h3 className="font-serif text-lg font-semibold text-maroon-800">
                      {r.phase}
                    </h3>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {r.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-stone-600"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <HomeFooter />
      </main>
    </>
  );
}
