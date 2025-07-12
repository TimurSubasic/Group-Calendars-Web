"use client";
import MapMembers from "@/components/MapMembers";
import { Button } from "@/components/ui/button";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import Loading from "@/components/Loading";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SelectableUsers from "@/components/SelectableUsers";

interface User {
  _id: Id<"users">;
  _creationTime: number;
  username: string;
  email: string;
  color: string;
  clerkId: string;
}

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

  // get data from queries
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

  // *add members
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
    } catch {
      toast("Error occurred while copying code");
    }
  };

  //! kick members
  const [kickOpen, setKickOpen] = useState(false);
  let newUsers: User[] = [];

  const removeMember = useMutation(api.groupMembers.removeMember);

  const handleSelectionChange = (selectedUsers: User[]) => {
    newUsers = selectedUsers;
  };

  const handleKick = async () => {
    for (const user of newUsers) {
      await removeMember({
        groupId: groupId as Id<"groups">,
        userId: user._id,
      });
    }
    setKickOpen(false);
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
            <Button
              onClick={() => setKickOpen(true)}
              className="flex-1 w-full"
              size="xl"
              variant="destructive"
            >
              Kick Members
            </Button>
          )}
        </div>
      </div>

      <Dialog open={kickOpen} onOpenChange={setKickOpen}>
        <form className="flex-1">
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add admins</DialogTitle>
              <DialogDescription>
                Admins can not be removed later, so choose wisely.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-8 my-5">
              <SelectableUsers
                users={nonAdmins}
                onSelectionChange={handleSelectionChange}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button size="lg" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                size="lg"
                variant={"destructive"}
                type="submit"
                onClick={handleKick}
              >
                Kick
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}
