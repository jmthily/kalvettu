import type { Person } from "@/lib/types";

function PersonCard({ person }: { person: Person }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <p className="font-medium text-maroon-800">{person.fullName}</p>
      <p className="text-sm text-stone-500">{person.relationshipLabel}</p>
      {!person.isLiving && (
        <span className="mt-1 inline-block text-xs text-stone-400">In memory</span>
      )}
    </div>
  );
}

export function FamilyTreeView({ people }: { people: Person[] }) {
  if (people.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center text-stone-500">
        No family members added yet.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {people.map((person) => (
        <PersonCard key={person.personId} person={person} />
      ))}
    </div>
  );
}
