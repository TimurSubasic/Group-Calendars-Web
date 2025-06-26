"use client";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";

export default function UserSettingsPage() {
  const { signOut } = useClerk();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Settings</h1>
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <p className="text-muted-foreground">User settings and preferences</p>

        <Button
          variant="destructive"
          className="mt-4 text-xl"
          size="xl"
          onClick={() => signOut({ redirectUrl: "/" })}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
