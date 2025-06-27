"use client";

import React, { useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

export default function GroupCalendarPage() {
  // const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      navigator.userAgent.includes("iPhone")
    ) {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 150);
    }
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Calendar</h2>
      {/* container */}
      <div className="bg-muted/50 rounded-lg p-8">
        <div className="flex items-center justify-center lg:justify-start w-full">
          {/* calnedar with buttons */}
          <div className="inline-block bg-background space-y-6 rounded-lg border p-5">
            <Calendar
              mode="range"
              // get the range
              className="rounded-lg border text-sm"
            />

            <Button className="w-full">Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
