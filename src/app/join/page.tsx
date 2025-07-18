"use client";

import { useEffect, useState } from "react";
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
  const { user, isLoaded } = useUser();

  const [code, setCode] = useState<string | null>(null);
  const [ready, setReady] = useState(false); // controls when queries are allowed

  // Set the code in a useEffect to avoid calling useSearchParams during render
  useEffect(() => {
    const c = searchParams.get("code")?.toUpperCase();
    if (!c) {
      toast.error("No code provided in URL.");
      router.replace("/groups");
      return;
    }
    setCode(c);
  }, [searchParams, router]);

  // After user and code are both ready, allow querying
  useEffect(() => {
    if (isLoaded && user && code) {
      setReady(true);
    }
  }, [isLoaded, user, code]);

  const clerkId = user?.id;
  const fullUser = useQuery(
    api.users.getUserByClerk,
    ready && clerkId ? { clerkId } : "skip"
  );
  const joinGroup = useQuery(
    api.groups.getByCode,
    ready && code ? { joinCode: code } : "skip"
  );
  const addMember = useMutation(api.groupMembers.addMember);

  useEffect(() => {
    if (!ready || !fullUser || !joinGroup) return;

    if (joinGroup.success) {
      addMember({
        groupId: joinGroup.groupId as Id<"groups">,
        userId: fullUser._id,
      })
        .then(() => {
          toast.success("Joined group successfully.");
          router.replace("/groups");
        })
        .catch(() => {
          toast.error("Failed to join group.");
          router.replace("/groups");
        });
    } else {
      toast.error(joinGroup.message);
      router.replace("/groups");
    }
  }, [ready, fullUser, joinGroup, addMember, router]);

  return <Loading />;
}
