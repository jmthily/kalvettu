import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-stone-200 bg-cream-50/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-serif text-2xl font-bold text-maroon-800">
          Kalvettu
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/login" className="text-stone-600 hover:text-maroon-700">
            Sign in
          </Link>
          <Link
            href="/setup"
            className="rounded-lg bg-maroon-700 px-4 py-2 text-white hover:bg-maroon-800"
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function LeafDivider() {
  return (
    <div className="my-8 flex items-center gap-3">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-300" />
      <span className="text-gold-500">✦</span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-300" />
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 px-4 py-8 text-center text-sm text-stone-500">
      <p>Kalvettu — A digital memory book for Tamil heritage</p>
      <p className="mt-1">
        Part of{" "}
        <a
          href="https://tamilmarabu.com"
          className="text-maroon-700 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tamil Marabu
        </a>
      </p>
    </footer>
  );
}

export function DashboardNav() {
  const links = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/memorials", label: "Memorials" },
    { href: "/dashboard/memorials/new", label: "Create New" },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-stone-200 bg-cream-50 p-4">
      <Link href="/dashboard" className="mb-6 block font-serif text-xl font-bold text-maroon-800">
        Kalvettu
      </Link>
      <nav className="space-y-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="block rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-maroon-50 hover:text-maroon-800"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
