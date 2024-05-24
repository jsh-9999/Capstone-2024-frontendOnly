"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import UserNav from "../auth/UserNav";
import MaxWidthContainer from "../layouts/MaxWidthContainer";
import { Button } from "../ui/button";

type Props = {};

export default function Navbar({}: Props) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("Authorization");
    setToken(storedToken);
  }, []);

  return (
    <main className="bg-gray-900 py-4 border-b-2 border-gray-800">
      <MaxWidthContainer>
        <nav className="flex flex-row items-center justify-between">
          <Link href="/">
            <h2 className="text-xl font-black text-white">VCD</h2>
          </Link>

          <div className="flex items-center justify-center space-x-2">
            {!token ? (
              <>
                <Button size={"lg"} asChild>
                  <Link href={"/auth/login"}>Login</Link>
                </Button>
                <Button size={"lg"} asChild>
                  <Link href={"/auth/register"}>Sign Up</Link>
                </Button>
              </>
            ) : (
              <UserNav />
            )}
          </div>
        </nav>
      </MaxWidthContainer>
    </main>
  );
}
