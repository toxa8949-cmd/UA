"use client";

const ITEMS = [
  { id: "overview", label: "Огляд" },
  { id: "guide", label: "Гайди" },
  { id: "services", label: "Сервіси" },
  { id: "articles", label: "Статті" },
  { id: "faq", label: "Питання" },
];

export function CountryNav({ available }: { available: string[] }) {
  const items = ITEMS.filter((i) => available.includes(i.id));
  if (items.length < 2) return null;

  return (
    <nav className="sticky top-16 z-30 border-b border-sand-300 bg-sand-100/90 backdrop-blur">
      <div className="container flex gap-1 overflow-x-auto py-2">
        {items.map((i) => (
          <a
            key={i.id}
            href={`#${i.id}`}
            className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-sand-200 hover:text-ink"
          >
            {i.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
