import React from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function NoGroups() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="mt-10 w-96 bg-accent shadow-lg py-10">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">
            You are not in a Group
          </CardTitle>
          <CardDescription>Please create or join a group</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <div className="flex flex-col items-center justify-center gap-5 w-60 mt-8">
            <Button size="xl" className="w-full">
              Create Group
            </Button>
            <Button size="xl" variant="outline" className="w-full">
              Join Group
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
