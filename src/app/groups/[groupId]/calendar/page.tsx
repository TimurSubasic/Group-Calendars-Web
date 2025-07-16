"use client";

import React, { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useBreakpoint } from "@/components/useBreakpoint";
import { useParams } from "next/navigation";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import Loading from "@/components/Loading";
import BookingCard from "@/components/BookingCard";
import { DayButtonProps, DateRange } from "react-day-picker";
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
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";

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

  const userBookings = useQuery(
    api.bookings.getUserBookings,
    validation?.success
      ? {
          groupId: groupId as Id<"groups">,
          userId: fullUser?._id as Id<"users">,
        }
      : "skip"
  );

  // get booked dates with colors
  const bookedDates = useQuery(
    api.bookings.getBookedDatesWithColors,
    validation?.success
      ? {
          groupId: groupId as Id<"groups">,
        }
      : "skip"
  );

  // Map date string to booking info for quick lookup
  const bookedDateMap = useMemo(() => {
    const map: Record<
      string,
      { color: string; isStart: boolean; isEnd: boolean }
    > = {};
    if (bookedDates) {
      for (const { date, color, isStart, isEnd } of bookedDates) {
        map[date] = { color, isStart, isEnd };
      }
    }
    return map;
  }, [bookedDates]);

  // State for selected range
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    undefined
  );

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date: Date) =>
    [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

  // All booked date strings for quick lookup
  const allBookedDates = useMemo(
    () => new Set(Object.keys(bookedDateMap)),
    [bookedDateMap]
  );

  // Check if a range overlaps with booked dates
  function isRangeOverlapping(from: Date, to: Date) {
    const d = new Date(from);
    while (d <= to) {
      if (allBookedDates.has(formatDate(d))) return true;
      d.setDate(d.getDate() + 1);
    }
    return false;
  }

  // Handle day click
  function handleSelect(range: DateRange | undefined) {
    if (!range || !range.from) return;
    // Check if picked date is booked
    if (range.from && range.to && isRangeOverlapping(range.from, range.to)) {
      toast.warning("Date already booked", {
        description: "Please select a different date",
      });
      setSelectedRange(undefined);
      return;
    }
    setSelectedRange(range);
  }

  // Custom DayButton for coloring booked and selected dates
  const CustomDayButton = (props: DayButtonProps) => {
    const dateStr = [
      props.day.date.getFullYear(),
      String(props.day.date.getMonth() + 1).padStart(2, "0"),
      String(props.day.date.getDate()).padStart(2, "0"),
    ].join("-");
    const booked = bookedDateMap[dateStr];
    const isSelected =
      selectedRange?.from &&
      ((selectedRange?.to &&
        props.day.date >= selectedRange.from &&
        props.day.date <= selectedRange.to) ||
        (!selectedRange?.to &&
          props.day.date.getTime() === selectedRange.from.getTime()));
    const isStart =
      selectedRange?.from &&
      props.day.date.getTime() === selectedRange.from.getTime();
    const isEnd =
      selectedRange?.to &&
      props.day.date.getTime() === selectedRange.to.getTime();
    const roundedClass = booked
      ? booked.isStart && booked.isEnd
        ? "rounded-md"
        : booked.isStart
          ? "rounded-l-md rounded-r-none"
          : booked.isEnd
            ? "rounded-r-md rounded-l-none"
            : "rounded-none"
      : isSelected
        ? isStart && isEnd
          ? "rounded-md"
          : isStart
            ? "rounded-l-md rounded-r-none"
            : isEnd
              ? "rounded-r-md rounded-l-none"
              : "rounded-none"
        : "";
    const bookedBorderClass = booked
      ? booked.isStart && booked.isEnd
        ? "border-2 border-black dark:border-white"
        : booked.isStart
          ? "border-2 border-black dark:border-white border-r-0"
          : booked.isEnd
            ? "border-2 border-black dark:border-white border-l-0"
            : "border-2 border-black dark:border-white border-l-0 border-r-0"
      : "";
    const borderClass = isSelected
      ? isStart && isEnd
        ? "border-2 border-blue-500"
        : isStart
          ? "border-2 border-blue-500 border-r-0"
          : isEnd
            ? "border-2 border-blue-500 border-l-0"
            : "border-2 border-blue-500 border-l-0 border-r-0"
      : "";
    return (
      <Button
        {...props}
        variant="ghost"
        size="icon"
        style={
          booked
            ? {
                backgroundColor: booked.color,
                color: "#fff",
              }
            : isSelected && fullUser?.color
              ? {
                  backgroundColor: fullUser.color,
                  color: "#fff",
                }
              : undefined
        }
        className={
          (booked
            ? `!text-white ${roundedClass} ${bookedBorderClass}`
            : isSelected
              ? `!text-white ${roundedClass} ${borderClass}`
              : "") +
          " w-full " +
          (props.className || "")
        }
      >
        {props.children}
      </Button>
    );
  };

  // format date for dialog
  function formatDateForDialog(dateStr: string | null) {
    if (dateStr === null) return "";
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const [, mm, dd] = dateStr.split("-");
    const monthIndex = parseInt(mm, 10) - 1;
    return `${monthNames[monthIndex]} ${dd}`;
  }

  const [saveOpen, setSaveOpen] = useState(false);

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const handleSave = () => {
    if (selectedRange === undefined) {
      toast.info("Please select a date");
    } else if (
      userBookings &&
      group &&
      userBookings.length >= group.maxBookings
    ) {
      toast.warning("You have reached the maximum number of bookings");
      setSelectedRange(undefined);
    } else {
      // set correct format for dates
      setStartDate(selectedRange.from ? formatDate(selectedRange.from) : null);
      setEndDate(selectedRange.to ? formatDate(selectedRange.to) : null);
      // open dialog
      setSaveOpen(true);
    }
  };

  const createBooking = useMutation(api.bookings.createBooking);

  const handleCreate = async () => {
    const result = await createBooking({
      groupId: groupId as Id<"groups">,
      userId: fullUser?._id as Id<"users">,
      startDate: startDate as string,
      endDate: endDate as string,
      note: note.trimStart().length > 0 ? note : undefined,
    });

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }

    setSaveOpen(false);
    setStartDate(null);
    setEndDate(null);
    setNote("");
    setSelectedRange(undefined);
  };

  const deleteBooking = useMutation(api.bookings.deleteBooking);

  // For deleting bookings
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState<Id<"bookings">[]>(
    []
  ); // store booking _id's

  // Open delete dialog
  const openDeleteDialog = () => {
    setDeleteOpen(true);
    setSelectedBookings([]);
  };

  // Confirm deletion
  const handleDelete = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (selectedBookings.length > 0) {
      for (const bookingId of selectedBookings) {
        await deleteBooking({ bookingId });
      }
      setDeleteOpen(false);
      setSelectedBookings([]);
    } else {
      toast.error("Select a booking to delete");
    }
  };

  // //
  if (
    validation === undefined ||
    members === undefined ||
    group === undefined ||
    bookings === undefined ||
    fullUser === undefined ||
    bookedDates === undefined ||
    userBookings === undefined
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
          <div className="inline-block bg-background space-y-6 rounded-lg p-5 border">
            <Calendar
              mode="range"
              disabled={{ before: new Date() }}
              className="rounded-lg border text-sm mx-auto w-fit"
              numberOfMonths={numberOfMonths}
              components={{ DayButton: CustomDayButton }}
              selected={selectedRange}
              onSelect={handleSelect}
            />

            <Button onClick={handleSave} className="w-full">
              Save
            </Button>

            {userBookings.length > 0 && (
              <Button
                variant="destructive"
                onClick={openDeleteDialog}
                className="w-full"
              >
                Delete
              </Button>
            )}
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
      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <form className="flex-1">
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {formatDateForDialog(startDate)}
                {endDate !== startDate && " - " + formatDateForDialog(endDate)}
              </DialogTitle>
              <DialogDescription>Booking details</DialogDescription>
            </DialogHeader>

            <Label className="flex gap-2 items-center ">
              Leave a Note
              <p className="text-xs text-muted-foreground">(optional)</p>
            </Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} />

            <DialogFooter>
              <DialogClose asChild>
                <Button size="lg" variant="outline">
                  Close
                </Button>
              </DialogClose>
              <Button onClick={handleCreate}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <form className="flex-1" onSubmit={handleDelete}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Bookings</DialogTitle>
              <DialogDescription>
                Select the bookings you want to delete. This action cannot be
                undone.
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
              <DialogClose asChild>
                <Button size="lg" variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                size="lg"
                variant={"destructive"}
                type="submit"
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
