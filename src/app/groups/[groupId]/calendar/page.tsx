"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export default function GroupCalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Calendar</h2>
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <div className="">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border w-full mx-auto sm:w-[350px] md:mx-0"
          />
        </div>
      </div>
    </div>
  );
}
