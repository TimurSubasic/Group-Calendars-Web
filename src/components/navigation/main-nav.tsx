"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/groups", label: "Groups" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <nav className="flex items-center space-x-6 py-4">
      <div className="flex items-center space-x-6">
        <Link href="/groups" className="text-xl font-bold">
          Group Calendars
        </Link>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
