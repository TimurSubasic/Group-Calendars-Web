import React from "react";
import { Id } from "../../convex/_generated/dataModel";

interface User {
  _id: Id<"users">;
  _creationTime: number;
  username: string;
  email: string;
  color: string;
  clerkId: string;
}

export default function MapMembers({ users }: { users: (User | null)[] }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {users?.map((user, index) => (
        <div
          key={index}
          className="w-full flex items-center justify-between flex-row bg-background rounded-lg p-4 border hover:shadow-lg dark:hover:shadow-background transition-shadow duration-150"
        >
          <div className="flex flex-row items-center justify-start gap-3">
            <div
              style={{ backgroundColor: user?.color }}
              className="w-14 h-14 rounded-full flex items-center justify-center"
            >
              <p className="text-white text-2xl font-bold">
                {user?.username.slice(0, 1).toUpperCase()}
              </p>
            </div>
            <p className="font-semibold text-xl">{user?.username}</p>
          </div>

          <div
            style={{ backgroundColor: user?.color }}
            className="p-2.5 rounded-full"
          />
        </div>
      ))}
    </div>
  );
}
