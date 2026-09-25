"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, MessageCircle, Compass } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { Avatar } from "@/components/common/Avatar";
import { useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/people", label: "People", icon: Compass },
  { href: "/dashboard/communities", label: "Communities", icon: Users },
  { href: "/dashboard/messages", label: "Messages", icon: MessageCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  return (
    <aside className="w-64 shrink-0 bg-ruchi-navy text-white flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <Logo size="sm" className="[&_span]:text-white [&_div]:border-white" />
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors",
                isActive
                  ? "bg-ruchi-purple text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon size={19} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {user && (
        <Link
          href="/dashboard/profile"
          className="p-4 mx-4 mb-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3"
        >
          <Avatar pseudonym={user.pseudonym} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{user.pseudonym}</p>
            <p className="text-xs text-white/50 truncate">
              {user.institution_name || "Your campus"}
            </p>
          </div>
        </Link>
      )}
    </aside>
  );
}
