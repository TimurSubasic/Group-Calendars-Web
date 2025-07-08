import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function LoadingNav() {
  return (
    <div>
      <Skeleton className="w-64 h-11" />
      <div className="flex gap-2 mt-3">
        <Skeleton className="h-8 w-30" />
        <Skeleton className="h-8 w-30" />
        <Skeleton className="h-8 w-30" />
      </div>
    </div>
  );
}
