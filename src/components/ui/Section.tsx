import { cn } from "@/lib/utils";

export function Section({
  title,
  subtitle,
  children,
  className,
  action,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <section className={cn("py-12", className)}>
      <div className="container">
        {(title || action) && (
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              {title && <h2 className="text-2xl font-bold text-slate-900">{title}</h2>}
              {subtitle && <p className="mt-1 text-slate-600">{subtitle}</p>}
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
