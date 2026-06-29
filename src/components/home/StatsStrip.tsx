type Stat = { value: string; label: string };

/**
 * Смуга метрик під hero — соц-доказ масштабу порталу.
 * Не «велике число + градієнт», а стримана типографічна сітка в дусі бренду.
 */
export function StatsStrip({ stats }: { stats: Stat[] }) {
  return (
    <div className="border-y border-sand-300 bg-white">
      <div className="container">
        <dl className="grid grid-cols-2 divide-x divide-sand-200 sm:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="px-4 py-6 text-center sm:py-7">
              <dt className="font-display text-2xl font-bold text-ink sm:text-3xl">
                {s.value}
              </dt>
              <dd className="mt-1 font-mono text-xs uppercase tracking-widest text-slate-500">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
