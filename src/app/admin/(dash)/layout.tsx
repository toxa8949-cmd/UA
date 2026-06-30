import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { signOut } from "@/server/actions/auth";
import {
  LayoutDashboard, FileText, Globe, Package, Tag, LogOut, MapPin,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Статті", icon: FileText },
  { href: "/admin/countries", label: "Країни", icon: Globe },
  { href: "/admin/services", label: "Сервіси", icon: Package },
  { href: "/admin/places", label: "Заклади", icon: MapPin },
  { href: "/admin/deals", label: "Бонуси", icon: Tag },
];

export default async function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  if (user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">Немає доступу до адмінки.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white md:block">
        <div className="p-5">
          <Link href="/admin" className="flex items-center gap-2 font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-white">З</span>
            Адмінка
          </Link>
        </div>
        <nav className="px-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <item.icon size={18} /> {item.label}
            </Link>
          ))}
        </nav>
        <form action={signOut} className="mt-4 px-3">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
            <LogOut size={18} /> Вийти
          </button>
        </form>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <div className="border-b border-slate-200 bg-white px-6 py-3 md:hidden">
          <nav className="flex gap-3 overflow-x-auto text-sm">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="whitespace-nowrap text-slate-700">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
