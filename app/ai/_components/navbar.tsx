import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Code2, Home, Share2, Settings, BookMarked } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const Navbar = () => {
  return (
    <div className="fixed top-0 w-full z-50 border-b border-white/[0.1] bg-[#0B1121]/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* 左侧区域：Logo和基础操作 */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 blur-lg" />
                <Code2 className="size-5 text-indigo-400" />
              </div>
              <span className="text-base font-semibold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text">
                CodeCraft
              </span>
            </Link>

            {/* 分隔线 */}
            <div className="h-5 w-px bg-white/[0.1]" />

            {/* 快捷操作按钮 */}
            <div className="flex items-center gap-2">
              <TooltipProvider>
                {/* 分享按钮 */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/[0.05] transition-all duration-200"
                    >
                      <Share2 className="size-4 text-indigo-300/70 group-hover:text-indigo-300" />
                      <span className="text-sm text-indigo-300/70 group-hover:text-indigo-300">分享</span>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>分享代码</p>
                  </TooltipContent>
                </Tooltip>

                {/* 收藏按钮 */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/[0.05] transition-all duration-200"
                    >
                      <BookMarked className="size-4 text-indigo-300/70 group-hover:text-indigo-300" />
                      <span className="text-sm text-indigo-300/70 group-hover:text-indigo-300">收藏</span>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>保存到收藏夹</p>
                  </TooltipContent>
                </Tooltip>

                {/* 设置按钮 */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/[0.05] transition-all duration-200"
                    >
                      <Settings className="size-4 text-indigo-300/70 group-hover:text-indigo-300" />
                      <span className="text-sm text-indigo-300/70 group-hover:text-indigo-300">设置</span>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>编辑器设置</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* 右侧区域：用户操作 */}
          <div className="flex items-center gap-6">
            {/* 返回首页 */}
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-300/70 hover:text-indigo-300 transition-colors rounded-lg hover:bg-white/[0.05]"
            >
              <Home className="size-4" />
              <span>首页</span>
            </Link>

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