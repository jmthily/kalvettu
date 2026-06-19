export function formatDate(date: string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatLifeDates(
  birth: string | null | undefined,
  passing: string | null | undefined
): string {
  const birthStr = birth ? formatDate(birth) : "";
  const passStr = passing ? formatDate(passing) : "";
  if (birthStr && passStr) return `${birthStr} — ${passStr}`;
  if (birthStr) return `Born ${birthStr}`;
  if (passStr) return `Passed ${passStr}`;
  return "";
}
