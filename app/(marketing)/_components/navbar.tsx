import React from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignOutButton, SignUpButton, UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Link href="/">
          <h1 className="text-xl font-bold">
            CodeCraft
          </h1>
        </Link>
        
        <div className="flex items-center gap-x-2">
          <SignedOut>
            <SignUpButton>
              <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                注册
              </button>
            </SignUpButton>
          </SignedOut>

          <UserButton afterSignOutUrl="/" />

          <SignedIn>
            <SignOutButton>
              <button className="text-sm font-medium text-gray-700 hover:text-gray-900">
                退出
              </button>
            </SignOutButton>
          </SignedIn>
        </div>
      </div>
    </div>
  );
}; 