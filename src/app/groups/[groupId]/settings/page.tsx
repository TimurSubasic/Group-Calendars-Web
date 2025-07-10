"use client";

import colors from "@/components/colors";
import MapMembers from "@/components/MapMembers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiMenuFold4Line } from "react-icons/ri";
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Loading from "@/components/Loading";

export default function GroupSettingsPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const { isLoading, isAuthenticated } = useConvexAuth();

  // get user
  const { user } = useUser();

  const clerkId = user?.id as string;

  const fullUser = useQuery(
    api.users.getUserByClerk,
    clerkId ? { clerkId } : "skip"
  );

  const validation = useQuery(
    api.groups.validateGroup,
    isLoading || !isAuthenticated
      ? "skip"
      : {
          groupId: groupId,
        }
  );

  const admins = useQuery(
    api.groups.getAdmins,
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

  const nonAdmins = useQuery(
    api.groupMembers.getNonAdmins,
    validation?.success
      ? {
          groupId: groupId as Id<"groups">,
        }
      : "skip"
  );

  const isAdmin = useQuery(
    api.groups.isAdmin,
    fullUser && validation?.success
      ? { userId: fullUser._id, groupId: groupId as Id<"groups"> }
      : "skip"
  );

  const [maxBookings, setMaxBookings] = useState("3");

  if (
    validation === undefined ||
    admins === undefined ||
    group === undefined ||
    nonAdmins === undefined ||
    isAdmin === undefined
  ) {
    return <Loading />;
  }
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Settings</h2>
      <div className="bg-muted/50 rounded-lg p-8 flex flex-col space-y-7">
        <div className="grid w-full items-center gap-3">
          <Label>Change Group Name</Label>
          <div className="flex gap-2">
            <Input type="text" placeholder="Group Name" />
            <Button className="h-12 text-lg flex-1" size="xl">
              Save
            </Button>
          </div>
        </div>

        <Label>Admins</Label>

        <MapMembers users={admins} />

        <Button className="w-full" size="xl">
          Add Admins
        </Button>

        <div className="flex flex-col space-y-7  w-full md:flex-row md:space-y-0 md:justify-around my-5 ">
          <div className="flex items-center gap-5 justify-between">
            <Label>Bookings per Member:</Label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="lg" className="text-lg" variant="outline">
                  {maxBookings} <RiMenuFold4Line size={8} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Max Bookings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={maxBookings}
                  onValueChange={setMaxBookings}
                >
                  <DropdownMenuRadioItem value="1">1</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="2">2</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="3">3</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="4">4</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="5">5</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="6">6</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="7">7</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="8">8</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="9">9</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="10">10</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center  gap-5 justify-between">
            <Label>Allow members to Join:</Label>

            <Switch />
          </div>
        </div>

        <Button
          variant="destructive"
          className="w-full my-6 h-4 cursor-default "
        />

        <div className="flex flex-col md:flex-row gap-4">
          <Button variant="destructive" className=" flex-1" size="xl">
            Leave
          </Button>
          <Button variant="destructive" className=" flex-1" size="xl">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
