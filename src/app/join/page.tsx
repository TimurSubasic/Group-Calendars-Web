"use client";

import { Suspense } from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import Loading from "@/components/Loading";
import { toast } from "sonner";

export default function Join() {
  return (
    <Suspense fallback={<Loading />}>
      <JoinInner />
    </Suspense>
  );
}

function JoinInner() {
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

  const handleAddMember = async () => {
    if (!joinGroup?.groupId || !fullUser?._id) return;
    const result = await addMember({
      groupId: joinGroup?.groupId as Id<"groups">,
      userId: fullUser?._id,
    });

    if (result.success) {
      toast.success("Joined group successfully.");
    } else {
      toast.warning(result.message);
    }
  };

  useEffect(() => {
    if (!isLoaded || !code || !fullUser || !joinGroup) return;
    if (!code) {
      toast.error("No code provided in URL.");
      router.replace("/groups");
      return;
    }
    // If group found, add member
    if (joinGroup?.success) {
      handleAddMember();
    } else {
      toast.error(joinGroup.message);
    }
    router.replace("/groups");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, code, joinGroup, fullUser, router]);

  return <Loading />;
}
