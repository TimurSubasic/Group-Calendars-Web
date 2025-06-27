"use client";

import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export default function GroupCalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

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
      <div className="bg-muted/50 rounded-lg px-4 py-4 sm:p-8 min-h-[520px]">
        <div className="block w-full min-h-[520px] overflow-visible">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border text-sm mx-auto md:mx-0"
          />
        </div>
      </div>
    </div>
  );
}
