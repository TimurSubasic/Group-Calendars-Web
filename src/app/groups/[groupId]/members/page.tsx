import colors from "@/components/colors";
import MapMembers from "@/components/MapMembers";
import { Button } from "@/components/ui/button";
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

        <div className="w-full flex flex-col items-center justify-center gap-5 mt-5 md:flex-row">
          <Button className="flex-1 w-full" size="xl">
            Add Members
          </Button>

          <Button className="flex-1 w-full" size="xl" variant="destructive">
            Kick Members
          </Button>
        </div>
      </div>
    </div>
  );
}
