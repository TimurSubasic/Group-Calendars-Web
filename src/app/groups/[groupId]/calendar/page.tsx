"use client";

import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useBreakpoint } from "@/components/useBreakpoint";
import { useParams } from "next/navigation";
import { useConvexAuth, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import Loading from "@/components/Loading";
import BookingCard from "@/components/BookingCard";

export default function GroupCalendarPage() {
  // const [date, setDate] = useState<Date | undefined>(new Date());

  const params = useParams();
  const groupId = params.groupId as string;
  const { isLoading, isAuthenticated } = useConvexAuth();
  const numberOfMonths = useBreakpoint();

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

  const bookings = useQuery(
    api.bookings.getByGroupId,
    validation?.success
      ? {
          groupId: groupId as Id<"groups">,
        }
      : "skip"
  );

  // //
  if (
    validation === undefined ||
    members === undefined ||
    group === undefined ||
    bookings === undefined ||
    fullUser === undefined
  ) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Calendar</h2>
      {/* container */}
      <div className="bg-muted/50 rounded-lg p-8">
        <div className="flex items-center justify-center w-full">
          {/* calendar with buttons */}
          <div className="inline-block bg-background space-y-6 rounded-lg border p-5 w-full max-w-6xl">
            <Calendar
              mode="range"
              disabled={{ before: new Date() }}
              // get the range
              className="rounded-lg border text-sm"
              numberOfMonths={numberOfMonths}
            />

            <Button className="w-full">Save</Button>
          </div>
        </div>

        <div className="mt-10 w-full max-w-6xl mx-auto">
          {bookings.length > 0 ? (
            <div className="flex flex-col items-start justify-center space-y-6 mt-8 w-full">
              <h1 className="text-2xl font-semibold">Bookings</h1>
              {bookings.map((booking, index) => (
                <div key={index} className="w-full">
                  <BookingCard booking={booking} />
                </div>
              ))}
            </div>
          ) : (
            <h1 className="text-2xl font-semibold">No Bookings</h1>
          )}
        </div>
      </div>
    </div>
  );
}
