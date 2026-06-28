import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-emerald text-white hover:bg-emerald-700",
  secondary: "bg-ink text-white hover:bg-ink-800",
  outline: "border border-ink/20 text-ink hover:bg-sand-200",
  ghost: "text-ink hover:bg-sand-200",
};
const sizes: Record<Size, string> = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald disabled:opacity-50";

type CommonProps = { variant?: Variant; size?: Size; className?: string; children: React.ReactNode };

export function Button({ variant = "primary", size = "md", className, children, ...props }: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props}>{children}</button>;
}

export function ButtonLink({ variant = "primary", size = "md", className, children, href, ...props }: CommonProps & { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...props}>{children}</Link>;
}
