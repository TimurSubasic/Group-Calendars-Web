import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function LoadingNav() {
  return (
    <div className="w-full border-b">
      <Skeleton className="w-64 h-11" />
      <div className="flex gap-2 mt-3">
        <Skeleton className="h-8 w-28 rounded-b-none" />
        <Skeleton className="h-8 w-28 rounded-b-none" />
        <Skeleton className="h-8 w-28 rounded-b-none" />
      </div>
    </div>
  );
}
