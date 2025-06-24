import type React from "react";
import { GroupNav } from "@/components/navigation/group-nav";

export default function GroupLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { groupId: string };
}) {
  return (
    <div className="space-y-6">
      <GroupNav groupId={params.groupId} />
      {children}
    </div>
  );
}
