import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-10 mx-20">
        <h1 className="text-2xl font-bold">Welcome to Group Calendars</h1>

        <Image
          src="/new-icon.png"
          alt="Icon"
          height={200}
          width={200}
          className="rounded-2xl"
        />

        <Button className="py-10 text-xl" size="lg">
          <Link href="/" className="flex items-center justify-center">
            <FcGoogle
              style={{
                height: 40,
                width: 40,
              }}
              className="mr-2"
            />
            Log In via Google
          </Link>
        </Button>
      </div>
    </div>
  );
}
