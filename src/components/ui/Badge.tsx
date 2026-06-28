import { cn } from "@/lib/utils";

export function Badge({ children, className, color = "slate" }: { children: React.ReactNode; className?: string; color?: "slate" | "emerald" | "gold" | "ink" }) {
  const colors = {
    slate: "bg-sand-200 text-slate-700",
    emerald: "bg-emerald-50 text-emerald-800",
    gold: "bg-gold-50 text-gold-500",
    ink: "bg-ink/5 text-ink",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", colors[color], className)}>{children}</span>;
}
