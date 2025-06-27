"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export default function GroupCalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Calendar</h2>
      <div className="bg-muted/50 rounded-lg px-4 py-4 sm:p-8 min-h-[420px]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg border w-full max-w-sm text-sm mx-auto md:mx-0"
        />
      </div>
    </div>
  );
}
