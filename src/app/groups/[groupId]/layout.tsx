import type React from "react";
import { GroupNav } from "@/components/navigation/group-nav";

export default function GroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <GroupNav />
      {children}
    </div>
  );
}
