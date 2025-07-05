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
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Loading from "@/components/Loading";
import { Id } from "../../../convex/_generated/dataModel";

//Mock data - replace with your actual data fetching

// const groups = [] as { id: string; name: string; members: number }[];

export default function GroupsPage() {
  // get user
  const { user } = useUser();

  const clerkId = user?.id as string;

  const fullUser = useQuery(
    api.users.getUserByClerk,
    clerkId ? { clerkId } : "skip"
  );

  // get groups
  const groups = useQuery(
    api.groupMembers.getGroupsByUser,
    fullUser
      ? {
          userId: fullUser._id,
        }
      : "skip"
  );

  //use states create
  const [name, setName] = useState("");

  const [maxBookings, setMaxBookings] = useState("1");

  const [allowJoin, setAllowJoin] = useState(true);

  const [hasName, setHasName] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);

  const createGroup = useMutation(api.groups.createGroup);

  // handle create
  const handleCreate = () => {
    if (name.trim().length > 1) {
      const bookings = Number(maxBookings);
      createGroup({
        name: name,
        userId: fullUser!._id,
        allowJoin: allowJoin,
        maxBookings: bookings,
      });
      setCreateOpen(false);
    } else {
      setHasName(false);
    }
  };

  useEffect(() => {
    if (name.trim().length > 1) {
      setHasName(true);
    }
  }, [name]);

  // join setup
  const [code, setCode] = useState("");
  const [finalCode, setFinalCode] = useState<string | undefined>(undefined);

  const [joinOpen, setJoinOpen] = useState(false);

  const [joinMessage, setJoinMessage] = useState("");

  const joinGroup = useQuery(
    api.groups.getByCode,
    finalCode ? { joinCode: finalCode } : "skip"
  );
  const addMember = useMutation(api.groupMembers.addMember);

  const handleJoin = () => {
    if (code.trim().length === 6) {
      setFinalCode(code.toUpperCase());
    } else {
      setJoinMessage("Invalid Code");
    }
  };

  useEffect(() => {
    if (joinGroup?.success) {
      addMember({
        groupId: joinGroup.groupId as Id<"groups">,
        userId: fullUser!._id,
      });
      setJoinOpen(false);
    } else {
      setJoinMessage(joinGroup?.message as string);
    }
  }, [joinGroup]);

  useEffect(() => {
    setJoinMessage("");
  }, [code]);

  // frontend
  if (groups === undefined) {
    return <Loading />;
  }

  if (groups.length === 0) {
    return <NoGroups />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Groups</h1>
        <div className="flex gap-4">
          <Button
            onClick={() => setCreateOpen(true)}
            size="lg"
            className="w-27"
          >
            Create
            <IoIosCreate />
          </Button>
          <Button
            onClick={() => setJoinOpen(true)}
            size="lg"
            className="w-27"
            variant="outline"
          >
            Join
            <IoEnter />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Link key={group.groupId} href={`/groups/${group.groupId}/calendar`}>
            <Card className="hover:shadow-lg dark:hover:shadow-card transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Click to view</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* create  */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <form className="flex-1">
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
                <Input
                  id="group-name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p
                  className={`text-destructive font-semibold duration-150
          ${hasName ? "opacity-0" : "opacity-100"}
          `}
                >
                  Group name must be at least 2 letters
                </p>
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
                      <DropdownMenuRadioItem value="1">1</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="2">2</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="3">3</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="4">4</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="5">5</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="6">6</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="7">7</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="8">8</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="9">9</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="10">
                        10
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center  gap-5 justify-between my-5">
                <Label>Allow members to Join:</Label>

                <Switch
                  checked={allowJoin}
                  onCheckedChange={() => setAllowJoin(!allowJoin)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button size="lg" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button size="lg" onClick={handleCreate}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      {/* join */}
      <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
        <form className="flex-1">
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
                <Input
                  id="code"
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <p className="text-destructive font-semibold duration-150">
                  {joinMessage}
                </p>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button size="lg" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button size="lg" type="submit" onClick={handleJoin}>
                Join
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}
