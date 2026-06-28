import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  color = "slate",
}: {
  children: React.ReactNode;
  className?: string;
  color?: "slate" | "brand" | "accent" | "green";
}) {
  const colors = {
    slate: "bg-slate-100 text-slate-700",
    brand: "bg-brand-50 text-brand-700",
    accent: "bg-accent-50 text-accent-600",
    green: "bg-green-50 text-green-700",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", colors[color], className)}>
      {children}
    </span>
  );
}
