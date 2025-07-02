import colors from "@/components/colors";
import MapMembers from "@/components/MapMembers";
import React from "react";

export default function GroupMembersPage() {
  const members = [
    {
      name: "Timur",
      color: colors[8],
    },
    {
      name: "Mirza",
      color: colors[4],
    },
    {
      name: "Adnan",
      color: colors[14],
    },
    {
      name: "Emira",
      color: colors[6],
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Members</h2>
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <MapMembers users={members} />
      </div>
    </div>
  );
}
