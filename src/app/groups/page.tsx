"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NoGroups from "@/components/NoGroups";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { RiMenuFold4Line } from "react-icons/ri";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IoIosCreate } from "react-icons/io";
import { IoEnter } from "react-icons/io5";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

//Mock data - replace with your actual data fetching

const groups = [
  { id: "1", name: "Development Team", members: 8 },
  { id: "2", name: "Marketing Team", members: 5 },
  { id: "3", name: "Design Team", members: 6 },
];

// const groups = [] as { id: string; name: string; members: number }[];

export default function GroupsPage() {
  if (groups.length === 0) {
    return <NoGroups />;
  }

  const [maxBookings, setMaxBookings] = useState("1");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Groups</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Link key={group.id} href={`/groups/${group.id}/calendar`}>
            <Card className="hover:shadow-lg dark:hover:shadow-card transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{group.members} members</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="flex max-w-md space-x-3 mt-10">
        {/* create  */}
        <Dialog>
          <form className="flex-1">
            <DialogTrigger className="w-full" asChild>
              <Button size="xl" className="w-full text-lg">
                Create
                <IoIosCreate className="size-8" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create a Group</DialogTitle>
                <DialogDescription>
                  Settings can be changed later on.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-8 my-5">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">Group Name</Label>
                  <Input id="group-name" name="name" />
                </div>
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
                        <DropdownMenuRadioItem value="1">
                          1
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="2">
                          2
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="3">
                          3
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="4">
                          4
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="5">
                          5
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="6">
                          6
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="7">
                          7
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="8">
                          8
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="9">
                          9
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="10">
                          10
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center  gap-5 justify-between">
                  <Label>Allow members to Join:</Label>

                  <Switch defaultChecked />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button size="lg" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button size="lg" type="submit">
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>

        {/* join */}
        <Dialog>
          <form className="flex-1">
            <DialogTrigger className="w-full" asChild>
              <Button size="xl" variant="outline" className="w-full text-lg">
                Join
                <IoEnter className="size-8" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Join via Code</DialogTitle>
                <DialogDescription>
                  Enter unique code to join a group.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-8 my-5">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">Code</Label>
                  <Input id="code" name="code" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button size="lg" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button size="lg" type="submit">
                  Join
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </div>
  );
}
