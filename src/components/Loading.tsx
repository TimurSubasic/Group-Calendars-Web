import React from "react";
import { Skeleton } from "./ui/skeleton";
import { RiLoaderFill } from "react-icons/ri";

export default function Loading() {
  return (
    <div>
      <Skeleton className="h-15 w-50 mb-8" />

      <div className="flex flex-col -space-y-10">
        <Skeleton className="w-full h-16" />
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-16" />
      </div>
    </div>
  );
}
