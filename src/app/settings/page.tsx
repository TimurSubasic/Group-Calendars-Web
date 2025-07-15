"use client";

import colors from "@/components/colors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClerk, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import Loading from "@/components/Loading";
import { toast } from "sonner";

export default function UserSettingsPage() {
  const { signOut } = useClerk();

  const { user } = useUser();

  const clerkId = user?.id as string;

  const fullUser = useQuery(
    api.users.getUserByClerk,
    clerkId ? { clerkId } : "skip"
  );

  const [pickedColor, setPickedColor] = useState(fullUser?.color);
  const [text, setText] = useState("");
  const [showError, setShowError] = useState(false);
  const [logOutOpen, setLogOutOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  useEffect(() => {
    setPickedColor(fullUser?.color);
  }, [fullUser]);

  const changeUsername = useMutation(api.users.changeUsername);

  const handleUsernameChange = () => {
    if (text.trim().length > 1 && fullUser !== null && fullUser !== undefined) {
      changeUsername({
        id: fullUser._id,
        username: text,
      });
      setText("");
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  // change color
  const changeColor = useMutation(api.users.changeColor);

  const [debouncedColor, setDebouncedColor] = useState(pickedColor);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedColor(pickedColor);
    }, 500);

    return () => clearTimeout(timer);
  }, [pickedColor]);

  useEffect(() => {
    if (
      debouncedColor !== fullUser?.color &&
      fullUser !== null &&
      fullUser !== undefined &&
      debouncedColor !== undefined
    ) {
      changeColor({
        id: fullUser._id,
        color: debouncedColor,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedColor, fullUser]);

  if (fullUser === undefined) {
    return <Loading />;
  }
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Settings</h1>
      <div className="bg-muted/50 rounded-lg p-8">
        {/* User icon */}
        <div className="flex flex-row items-center justify-start gap-3 mb-10">
          <div
            style={{ backgroundColor: pickedColor }}
            className="w-14 h-14 rounded-full flex items-center justify-center"
          >
            <p className="text-white text-2xl font-bold">
              {fullUser?.username.slice(0, 1).toUpperCase()}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-accent-foreground">Welcome back,</p>
            <p className="font-semibold text-xl">{fullUser?.username}</p>
          </div>
        </div>

        <div className="grid w-full items-center gap-3">
          <Label className="text-lg font-bold">Change username</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              id="username"
              placeholder="Username"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button
              onClick={handleUsernameChange}
              className="h-12 text-lg flex-1"
              size="xl"
            >
              Save
            </Button>
          </div>
          <p
            className={`text-destructive font-semibold duration-150
          ${showError ? "opacity-100" : "opacity-0"}
          `}
          >
            User name must be at least 2 letters
          </p>
        </div>

        <Label className="text-lg font-bold my-5">Change color</Label>
        <div className="grid grid-cols-3 md:grid-cols-6 xl:grid-cols-9 gap-4">
          {colors.map((color, index) => (
            <Button
              key={index}
              className={`rounded-lg h-24 w-full ${
                color === pickedColor
                  ? "border-4 border-blue-500 scale-115"
                  : "border"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setPickedColor(color)}
            />
          ))}
        </div>

        <Button
          variant="destructive"
          className="w-full my-6 h-4 cursor-default "
        />

        <div className="flex flex-col md:flex-row gap-4">
          <Button
            variant="destructive"
            className="text-xl flex-1"
            size="xl"
            onClick={() => setLogOutOpen(true)}
          >
            Log Out
          </Button>
          <Button
            onClick={() => setDeleteAccountOpen(true)}
            variant="destructive"
            className=" text-xl flex-1"
            size="xl"
          >
            Delete account
          </Button>
        </div>
      </div>

      <Dialog open={logOutOpen} onOpenChange={setLogOutOpen}>
        <form className="flex-1">
          <DialogContent className="sm:max-w-[350px]">
            <DialogHeader>
              <DialogTitle>Log Out</DialogTitle>
              <DialogDescription>
                Are you sure you want to log out?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button size="lg" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                size="lg"
                type="submit"
                variant="destructive"
                onClick={() => signOut({ redirectUrl: "/" })}
              >
                Log Out
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      <Dialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen}>
        <form className="flex-1">
          <DialogContent className="sm:max-w-[350px]">
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete your account?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button size="lg" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                size="lg"
                type="submit"
                variant="destructive"
                onClick={() => toast("This feature is not available yet")}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}
