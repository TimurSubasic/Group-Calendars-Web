"use client";

import colors from "@/components/colors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClerk } from "@clerk/nextjs";
import { useState } from "react";

export default function UserSettingsPage() {
  const { signOut } = useClerk();

  const [pickedColor, setPickedColor] = useState("#469990");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Settings</h1>
      <div className="bg-muted/50 rounded-lg p-8">
        <div className="grid w-full items-center gap-3">
          <Label className="text-lg font-bold">Change username</Label>
          <div className="flex gap-2">
            <Input type="text" id="username" placeholder="Username" />
            <Button className="h-12 text-lg flex-1" size="xl">
              Save
            </Button>
          </div>
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
