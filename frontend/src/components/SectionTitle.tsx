export function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="font-serif text-2xl text-maroon-800">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-stone-600">{subtitle}</p>}
    </div>
  );
}
