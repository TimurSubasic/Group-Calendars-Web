"use client";
import MapMembers from "@/components/MapMembers";
import { Button } from "@/components/ui/button";
import { useConvexAuth, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React from "react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import Loading from "@/components/Loading";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function GroupMembersPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const { isLoading, isAuthenticated } = useConvexAuth();

  // get user
  const { user } = useUser();

  const clerkId = user?.id as string;

  const fullUser = useQuery(
    api.users.getUserByClerk,
    clerkId ? { clerkId } : "skip"
  );

  const validation = useQuery(
    api.groups.validateGroup,
    isLoading || !isAuthenticated
      ? "skip"
      : {
          groupId: groupId,
        }
  );

  const members = useQuery(
    api.groupMembers.getMembers,
    validation?.success
      ? {
          groupId: groupId as Id<"groups">,
        }
      : "skip"
  );

  const group = useQuery(
    api.groups.getById,
    validation?.success
      ? {
          groupId: groupId as Id<"groups">,
        }
      : "skip"
  );

  const nonAdmins = useQuery(
    api.groupMembers.getNonAdmins,
    validation?.success
      ? {
          groupId: groupId as Id<"groups">,
        }
      : "skip"
  );

  const isAdmin = useQuery(
    api.groups.isAdmin,
    fullUser && validation?.success
      ? { userId: fullUser._id, groupId: groupId as Id<"groups"> }
      : "skip"
  );

  const handleAdd = async () => {
    try {
      await navigator.clipboard.writeText(group?.joinCode as string);
      toast(group?.joinCode, {
        description: "Code has been copied, send it to your friends!",
        action: {
          label: "Undo",
          onClick: async () => await navigator.clipboard.writeText(""),
        },
        position: "top-center",
      });
    } catch (error) {
      toast("Error occured while copying code");
    }
  };

  if (
    validation === undefined ||
    members === undefined ||
    group === undefined ||
    nonAdmins === undefined ||
    isAdmin === undefined
  ) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Members</h2>
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <MapMembers users={members} />

        <div className="w-full flex flex-col items-center justify-center gap-5 mt-5 md:flex-row">
          {group?.allowJoin && (
            <Button onClick={handleAdd} className="flex-1 w-full" size="xl">
              Add Members
            </Button>
          )}

          {isAdmin && nonAdmins.length >= 1 && (
            <Button className="flex-1 w-full" size="xl" variant="destructive">
              Kick Members
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
