"use client";

import Link from "next/link";
import { BookOpen, FolderOpen, LayoutGrid, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Workspace", icon: LayoutGrid },
  { href: "/library", label: "Library", icon: FolderOpen },
  { href: "/guides", label: "Guides", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function LeftNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden w-[236px] shrink-0 border-r border-[var(--trace-border)] bg-[var(--trace-panel)] p-3 md:block">
      <ul className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                  active
                    ? "bg-[color-mix(in_oklab,var(--trace-accent)_20%,transparent)] text-white"
                    : "text-[var(--trace-text-secondary)] hover:bg-[var(--trace-panel-hover)] hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--trace-border)] bg-[var(--trace-panel)] p-2 md:hidden">
      <ul className="grid grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] ${
                  active ? "text-white" : "text-[var(--trace-text-secondary)]"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
