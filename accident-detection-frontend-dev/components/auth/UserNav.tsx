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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { deleteCookie } from "cookies-next";

type Props = {};

export default function UserNav({}: Props) {
  const handleLogout = () => {
    deleteCookie("token");
    window.location.pathname = "/";
  };

  const handleRegister = () => {
    deleteCookie("token");
    window.location.pathname = "/auth/Register";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none select-none">
        <Avatar className="select-none">
          <AvatarImage src="https://github.com/ebraj.png" alt="@ebraj" />
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
