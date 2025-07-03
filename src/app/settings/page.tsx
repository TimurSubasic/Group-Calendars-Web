"use client";

import colors from "@/components/colors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClerk } from "@clerk/nextjs";
import { useState } from "react";

export default function UserSettingsPage() {
  const { signOut } = useClerk();

  const [username, setUsername] = useState("Timur");
  const [pickedColor, setPickedColor] = useState("#469990");
  const [text, setText] = useState("");
  const [showError, setShowError] = useState(false);

  const user = {
    name: username,
    color: pickedColor,
  };

  const handleUsernameChange = () => {
    if (text.trimStart().length > 1) {
      setUsername(text);
      setText("");
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Settings</h1>
      <div className="bg-muted/50 rounded-lg p-8">
        {/* User icon */}
        <div className="flex flex-row items-center justify-start gap-3 mb-10">
          <div
            style={{ backgroundColor: user?.color }}
            className="w-14 h-14 rounded-full flex items-center justify-center"
          >
            <p className="text-white text-2xl font-bold">
              {user?.name.slice(0, 1).toUpperCase()}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-accent-foreground">Welcome back,</p>
            <p className="font-semibold text-xl">{user?.name}</p>
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
            onClick={() => signOut({ redirectUrl: "/" })}
          >
            Log Out
          </Button>
          <Button variant="destructive" className=" text-xl flex-1" size="xl">
            Delete account
          </Button>
        </div>
      </div>
    </div>
  );
}
