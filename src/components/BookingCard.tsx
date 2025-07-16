import React, { useState } from "react";
import { TbNotes, TbNotesOff } from "react-icons/tb";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function BookingCard({
  booking,
}: {
  booking: {
    _id: Id<"bookings">;
    startDate: string;
    endDate: string;
    note: string | undefined;
    color: string;
    username: string;
  };
}) {
  const [noteOpen, setNoteOpen] = useState(false);

  return (
    <div>
      <div
        style={{
          borderColor: booking.color,
        }}
        className="w-full flex items-center justify-between bg-background rounded-lg p-4 border hover:shadow-lg dark:hover:shadow-background transition-shadow duration-150"
      >
        <div className="flex flex-col items-start">
          <div className="flex flex-row items-center justify-start gap-3">
            <div
              style={{ backgroundColor: booking?.color }}
              className="w-14 h-14 rounded-full flex items-center justify-center"
            >
              <p className="text-white text-2xl font-bold">
                {booking?.username.slice(0, 1).toUpperCase()}
              </p>
            </div>
            <div className="flex flex-col items-start space-y-2">
              <p className="font-semibold text-xl">{booking?.username}</p>
              <p className="text-sm sm:text-md font-bold">
                {booking.startDate}
                {booking.startDate !== booking.endDate &&
                  " - " + booking.endDate}
              </p>
            </div>
          </div>
        </div>
        <div className="flex space-x-3 items-center justify-center">
          {booking.note ? (
            <Button
              size="icon"
              style={{ borderColor: booking.color }}
              onClick={() => setNoteOpen(true)}
              variant="outline"
            >
              <TbNotes className=" size-8" />
            </Button>
          ) : (
            <Button
              size="icon"
              style={{ borderColor: booking.color }}
              variant="outline"
              disabled
            >
              <TbNotesOff className="size-8" />
            </Button>
          )}
        </div>
      </div>

      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <form className="flex-1">
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {booking.startDate} - {booking.endDate}
              </DialogTitle>
              <DialogDescription>Note</DialogDescription>
            </DialogHeader>
            <div className="flex flex-row items-center justify-start gap-3 text-white">
              <div
                style={{ backgroundColor: booking?.color }}
                className="w-14 h-14 rounded-full flex items-center justify-center"
              >
                <p className="text-white text-2xl font-bold">
                  {booking?.username.slice(0, 1).toUpperCase()}
                </p>
              </div>
              <div className="flex flex-col items-start space-y-2">
                <p className="font-semibold text-xl">{booking?.username}</p>
              </div>
            </div>
            <div className="grid gap-8">
              <p className="my-5 text-lg">{booking.note}</p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button size="lg" variant="outline">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}
