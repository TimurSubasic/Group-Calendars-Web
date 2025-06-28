import colors from "@/components/colors";
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
        <div className="flex flex-col items-center justify-center space-y-6 mb-6">
          {members.map((member, index) => (
            <div
              key={index}
              className="w-full flex items-center justify-between flex-row bg-background rounded-lg p-4 border hover:shadow-lg dark:hover:shadow-background transition-shadow duration-150"
            >
              <div className="flex flex-row items-center justify-start gap-3">
                <div
                  style={{ backgroundColor: member.color }}
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                >
                  <p className="text-white text-2xl font-bold">
                    {member.name.slice(0, 1).toUpperCase()}
                  </p>
                </div>
                <p className="font-semibold text-xl">{member.name}</p>
              </div>

              <div
                style={{ backgroundColor: member.color }}
                className="p-2.5 rounded-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
