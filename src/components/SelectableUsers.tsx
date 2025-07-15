import React, { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

interface User {
  _id: Id<"users">;
  _creationTime: number;
  username: string;
  email: string;
  color: string;
  clerkId: string;
}

interface SelectableUsersProps {
  users: (User | null)[];
  destructive?: boolean;
  onSelectionChange: (selected: User[]) => void;
}

export default function SelectableUsers({
  users,
  destructive = false,
  onSelectionChange,
}: SelectableUsersProps) {
  const [selectedIds, setSelectedIds] = useState<Id<"users">[]>([]);

  const toggleSelect = (user: User | null) => {
    if (!user) return;

    setSelectedIds((prev) => {
      const isSelected = prev.includes(user._id);
      const newSelected = isSelected
        ? prev.filter((id) => id !== user._id)
        : [...prev, user._id];

      const selectedUsers = users.filter(
        (u) => u && newSelected.includes(u._id)
      ) as User[];

      onSelectionChange(selectedUsers);
      return newSelected;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {users?.map((user, index) => {
        const isSelected = user ? selectedIds.includes(user._id) : false;

        return (
          <div
            key={index}
            onClick={() => toggleSelect(user)}
            className={`w-full flex items-center justify-between flex-row bg-background rounded-lg p-4 border hover:shadow-lg dark:hover:shadow-background transition-shadow duration-150 cursor-pointer ${
              isSelected
                ? destructive
                  ? "border-2 border-red-500 bg-red-500/10"
                  : "border-2 border-blue-500 bg-blue-500/10"
                : ""
            }`}
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
        );
      })}
    </div>
  );
}
