"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowLeft, Calendar, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import LoadingNav from "./LoadingNav";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";

export function GroupNav() {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  // get user
  const { user } = useUser();

  const clerkId = user?.id as string;

  const fullUser = useQuery(
    api.users.getUserByClerk,
    clerkId ? { clerkId } : "skip"
  );

  const { isLoading, isAuthenticated } = useConvexAuth();

  const groupId = params.groupId as string;

  const validation = useQuery(
    api.groups.validateGroup,
    isLoading || !isAuthenticated
      ? "skip"
      : {
          groupId: groupId,
        }
  );

  const group = useQuery(
    api.groups.getById,
    validation?.success
      ? {
          groupId: groupId as Id<"groups">,
        }
      : "skip"
  );

  const userBookings = useQuery(
    api.bookings.getUserBookings,
    validation?.success
      ? {
          groupId: groupId as Id<"groups">,
          userId: fullUser?._id as Id<"users">,
        }
      : "skip"
  );

  const navItems = [
    {
      href: `/groups/${groupId}/calendar`,
      label: "Calendar",
      icon: Calendar,
    },
    {
      href: `/groups/${groupId}/members`,
      label: "Members",
      icon: Users,
    },
    {
      href: `/groups/${groupId}/settings`,
      label: "Settings",
      icon: Settings,
    },
  ];

  const deleteBooking = useMutation(api.bookings.deleteBooking);

  // For deleting bookings
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState<Id<"bookings">[]>(
    []
  ); // store booking _id's

  // Open delete dialog
  useEffect(() => {
    if (userBookings && group) {
      if (userBookings.length > group.maxBookings) {
        setDeleteOpen(true);
      } else setDeleteOpen(false);
    }
  }, [userBookings, group]);

  // Confirm deletion
  const handleDelete = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    for (const bookingId of selectedBookings) {
      await deleteBooking({ bookingId });
    }
    setDeleteOpen(false);
    setSelectedBookings([]);
  };

  // Redirect safely after validation check
  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isAuthenticated && validation && !validation.success) {
      console.log(validation.message);
      router.replace("/");
    }
  }, [validation, router, isLoading, isAuthenticated]);

  // While loading validation or group
  if (
    validation === undefined ||
    (validation.success && group === undefined) ||
    userBookings === undefined
  ) {
    return <LoadingNav />;
  }

  // If group is valid
  if (validation.success) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/groups">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{group?.name}</h1>
        </div>

        <nav className="flex space-x-1 border-b -mx-2 sm:mx-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors",
                  pathname === item.href
                    ? "bg-background border-b-2 border-primary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <form className="flex-1" onSubmit={handleDelete}>
            <DialogContent showCloseButton={false} className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>You have too many bookings</DialogTitle>
                <DialogDescription>
                  This group has a maximum of {group?.maxBookings} bookings. You
                  have {userBookings.length} bookings. Please delete some
                  bookings to continue.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-8 my-5">
                {userBookings.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {userBookings.map((booking: (typeof userBookings)[0]) => (
                      <div
                        key={booking._id}
                        onClick={() => {
                          setSelectedBookings((prev) =>
                            prev.includes(booking._id)
                              ? prev.filter((id) => id !== booking._id)
                              : [...prev, booking._id]
                          );
                        }}
                        className={`cursor-pointer border rounded-lg p-2 ${selectedBookings.includes(booking._id) ? "border-destructive bg-destructive/10" : "border-muted"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div
                            style={{ backgroundColor: booking.color }}
                            className="w-14 h-14 rounded-full flex items-center justify-center"
                          >
                            <p className="text-white text-2xl font-bold">
                              {booking.username.slice(0, 1).toUpperCase()}
                            </p>
                          </div>
                          <p>
                            {booking.startDate}
                            {booking.endDate !== booking.startDate &&
                              " - " + booking.endDate}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No bookings to delete.</p>
                )}
              </div>
              <DialogFooter>
                <Button
                  size="lg"
                  variant={"destructive"}
                  type="submit"
                  disabled={selectedBookings.length === 0}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    );
  }

  return null;
}
