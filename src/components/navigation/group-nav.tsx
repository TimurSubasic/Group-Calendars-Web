"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowLeft, Calendar, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GroupNav() {
  const pathname = usePathname();
  const params = useParams();

  const groupId = params.groupId as string;

  const navItems = [
    {
      href: `/groups/${groupId}/calendar`,
      label: "Calendar",
      icon: Calendar,
    },
    {
      href: `/groups/${groupId}/members`,
      label: "Members",
      icon: Users,
    },
    {
      href: `/groups/${groupId}/settings`,
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/groups">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Group {groupId}</h1>
      </div>

      <nav className="flex space-x-1 border-b -mx-2 sm:mx-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors",
                pathname === item.href
                  ? "bg-background border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
