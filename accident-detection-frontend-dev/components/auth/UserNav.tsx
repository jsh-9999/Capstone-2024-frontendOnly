"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {};

export default function UserNav({}: Props) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("Authorization");
    localStorage.removeItem("Refresh");
    router.push("/");
  };

  const handleRegister = () => {
    localStorage.removeItem("Authorization");
    localStorage.removeItem("Refresh");
    router.push("/auth/Register");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none select-none">
        <Avatar className="select-none">
          <AvatarFallback>EG</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Admin</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={"/auth/bbb"}>Homepage</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={"/dashboard"}>Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div onClick={handleLogout}>
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </div>
        <div onClick={handleRegister}>
          <DropdownMenuItem>Register</DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
