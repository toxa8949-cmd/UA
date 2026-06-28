import { cn } from "@/lib/utils";

export function Section({ title, subtitle, children, className, action, eyebrow }: {
  title?: string; subtitle?: string; children: React.ReactNode; className?: string;
  action?: React.ReactNode; eyebrow?: string;
}) {
  return (
    <section className={cn("py-14", className)}>
      <div className="container">
        {(title || action) && (
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              {eyebrow && <div className="mb-2 font-mono text-xs uppercase tracking-widest text-emerald">{eyebrow}</div>}
              {title && <h2 className="font-display text-3xl font-bold text-ink">{title}</h2>}
              {subtitle && <p className="mt-2 max-w-xl text-slate-600">{subtitle}</p>}
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
