import Link from "next/link";

const homeNavLinks = [
  { href: "/#mission", label: "Mission" },
  { href: "/#explore", label: "Heritage" },
  { href: "/#roadmap", label: "Roadmap" },
];

type SiteHeaderProps = {
  /** When set, show memorial-specific links in the nav */
  memorialSlug?: string;
  memorialName?: string;
};

export function SiteHeader({ memorialSlug, memorialName }: SiteHeaderProps = {}) {
  const onMemorial = Boolean(memorialSlug);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-cream-50/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="shrink-0 font-serif text-lg font-bold text-maroon-800 sm:text-xl"
          >
            TamilMarabu
          </Link>
          {onMemorial && memorialName && (
            <>
              <span className="hidden text-stone-300 sm:inline" aria-hidden>
                /
              </span>
              <Link
                href={`/memorial/${memorialSlug}`}
                className="hidden truncate font-serif text-sm text-maroon-700 hover:underline sm:inline"
              >
                {memorialName}
              </Link>
            </>
          )}
        </div>

        <nav
          className="hidden items-center gap-5 text-sm lg:flex"
          aria-label="Main navigation"
        >
          <Link href="/" className="text-stone-600 transition hover:text-maroon-700">
            Home
          </Link>
          {!onMemorial &&
            homeNavLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-stone-600 transition hover:text-maroon-700"
              >
                {l.label}
              </Link>
            ))}
          {onMemorial && (
            <>
              <a
                href="#biography"
                className="text-stone-600 transition hover:text-maroon-700"
              >
                Biography
              </a>
              <a
                href="#family"
                className="text-stone-600 transition hover:text-maroon-700"
              >
                Family
              </a>
              <a
                href="#gallery"
                className="text-stone-600 transition hover:text-maroon-700"
              >
                Photos
              </a>
              <a
                href="#tributes"
                className="text-stone-600 transition hover:text-maroon-700"
              >
                Tributes
              </a>
              <Link
                href={`/memorial/${memorialSlug}/contribute`}
                className="text-stone-600 transition hover:text-maroon-700"
              >
                Share memory
              </Link>
            </>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2 text-sm sm:gap-3">
          <Link
            href="/"
            className="text-stone-600 hover:text-maroon-700 lg:hidden"
          >
            Home
          </Link>
          <Link href="/login" className="text-stone-600 hover:text-maroon-700">
            Sign in
          </Link>
          {!onMemorial && (
            <Link
              href="/#explore"
              className="hidden rounded-lg bg-maroon-700 px-3 py-1.5 font-medium text-white hover:bg-maroon-800 sm:inline-block"
            >
              Explore
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

/** @deprecated Use SiteHeader — kept for homepage */
export const HomeNavbar = SiteHeader;

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-maroon-900 px-4 py-12 text-cream-100">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-8 text-center sm:grid-cols-3 sm:text-left">
          <div className="sm:col-span-1">
            <Link href="/" className="font-serif text-xl font-bold text-white hover:underline">
              TamilMarabu
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-cream-200">
              Preserving Tamil heritage across generations.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gold-400">
              Explore
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/#explore" className="text-cream-200 hover:text-white">
                  Tamil Heritage
                </Link>
              </li>
              <li>
                <Link href="/#roadmap" className="text-cream-200 hover:text-white">
                  Coming Soon
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-cream-200 hover:text-white">
                  Kalvettu — Sign in
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gold-400">
              Kalvettu
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/login" className="text-cream-200 hover:text-white">
                  Admin login
                </Link>
              </li>
              <li>
                <Link href="/setup" className="text-cream-200 hover:text-white">
                  Create account
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-maroon-800 pt-8 text-center text-xs text-stone-400">
          © 2026 TamilMarabu. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

/** @deprecated Use SiteFooter */
export const HomeFooter = SiteFooter;

export function PatternDivider() {
  return (
    <div className="pattern-divider my-12 flex items-center justify-center gap-4 px-4" aria-hidden>
      <span className="h-px w-24 bg-gradient-to-r from-transparent to-gold-400/60" />
      <span className="font-serif text-gold-500">❋</span>
      <span className="h-px w-24 bg-gradient-to-l from-transparent to-gold-400/60" />
    </div>
  );
}
