import React from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Code2 } from "lucide-react";

export const Navbar = () => {
  return (
    <div className="fixed top-0 w-full z-50 border-b border-indigo-500/10 bg-gradient-to-b from-[#0B1121] to-[#0B1121]/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo 和导航区域 */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Logo 图标 */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 blur-lg" />
                <Code2 className="size-6 text-indigo-400" />
              </div>

              {/* Logo 文字 */}
              <div className="flex flex-col">
                <span className="block text-lg font-semibold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text">
                  CodeCraft
                </span>
                <span className="block text-xs text-indigo-400/60 font-medium">
                  Code Platform
                </span>
              </div>
            </Link>

            {/* 导航链接 */}
            <nav className="hidden md:flex items-center space-x-4">
              <Link
                href="/snippets"
                className="group flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-indigo-300/70 hover:text-indigo-300 transition-colors"
              >
                <span>Code Snippets</span>
              </Link>
            </nav>
          </div>

          {/* 用户认证区域 */}
          <div className="flex items-center gap-6">
            {/* 未登录状态：显示登录和注册按钮 */}
            <SignedOut>
              <div className="flex items-center gap-4">
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-indigo-300/70 hover:text-indigo-300 transition-colors">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="inline-flex items-center justify-center rounded-lg border border-indigo-500/50 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 transition-colors hover:bg-indigo-500/20 hover:text-indigo-200">
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>

            {/* 已登录状态：显示用户头像按钮（包含下拉菜单和退出功能） */}
            <SignedIn>
              <UserButton
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  );
}; 