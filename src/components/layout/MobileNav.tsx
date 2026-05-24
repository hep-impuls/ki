"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { unit } from "@/config/unit";

export default function MobileNav() {
  const pathname = usePathname();

  const items = [
    { href: "/", label: "Start", icon: "home" },
    {
      href: unit.modules[0]?.href ?? "/",
      label: "Module",
      icon: "menu_book",
      matches: (p: string | null) => !!p && p.startsWith("/lernen/"),
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-surface-bright border-t border-outline-variant z-50 px-lg h-16 flex items-center justify-around">
      {items.map((item) => {
        const active = item.matches
          ? item.matches(pathname)
          : pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-xs ${
              active ? "text-primary" : "text-on-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
            <span className="text-label-sm">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
