import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-sand-300 bg-white p-5 transition-colors", className)}>
      {children}
    </div>
  );
}
