"use client";

import { Button } from "@/components";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return <Button onClick={() => signOut({ redirectTo: "/" })}>Sign Out</Button>;
}
