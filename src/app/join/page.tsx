"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import Loading from "@/components/Loading";
import { toast } from "sonner";

export default function Join() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code")?.toUpperCase();
  const { user, isLoaded } = useUser();

  // Get full user from Convex
  const clerkId = user?.id as string | undefined;
  const fullUser = useQuery(
    api.users.getUserByClerk,
    clerkId ? { clerkId } : "skip"
  );

  // Query group by code
  const joinGroup = useQuery(
    api.groups.getByCode,
    code ? { joinCode: code } : "skip"
  );
  const addMember = useMutation(api.groupMembers.addMember);

  useEffect(() => {
    if (!isLoaded) return;
    if (!code) {
      toast.error("No code provided in URL.");
      router.replace("/groups");
      return;
    }
    //If not authenticated, save code to localStorage and redirect to sign-in
    if (!user) {
      if (typeof window !== "undefined") {
        localStorage.setItem("join_code", code);
      }
      router.replace("/sign-in");
      return;
    }
    // Wait for fullUser to load
    if (!fullUser) return;
    // If group found, add member
    if (joinGroup?.success) {
      addMember({
        groupId: joinGroup.groupId as Id<"groups">,
        userId: fullUser._id,
      }).catch(() => {
        toast.error("Failed to join group.");
      });
      toast.success("Joined group successfully.");
    } else if (joinGroup && !joinGroup.success) {
      toast.error(joinGroup.message);
    }
    router.replace("/groups");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoaded, code, joinGroup, fullUser]);

  return <Loading />;
}
