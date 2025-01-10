"use client";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { LANGUAGE_CONFIG } from "../_constants";
import { ChevronDownIcon, Sparkles } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useMounted from "@/hooks/useMounted";

export const LanguageSelector = () => {
  const mounted = useMounted();
  const { language, setLanguage } = useCodeEditorStore();
  const currentLanguage = LANGUAGE_CONFIG[language];

  if (!mounted) {
    return (
      <Button
        variant="outline"
        className="relative flex items-center gap-3 px-4 py-2.5 bg-[#1e1e2e]/80 rounded-lg transition-all duration-200 border border-gray-800/50 text-gray-300"
      >
        <div className="size-6 rounded-md bg-gray-800/50 p-0.5">
          <div className="w-6 h-6 bg-gray-600 rounded-md animate-pulse" />
        </div>
        <span className="flex-1 text-left">加载中...</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="relative flex items-center gap-3 px-4 py-2.5 bg-[#1e1e2e]/80 hover:bg-[#262637] rounded-lg transition-all duration-200 border border-gray-800/50 hover:border-gray-700 text-gray-300 group"
        >
          {/* 悬浮状态装饰器 */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* 语言图标 */}
          <div className="size-6 rounded-md bg-gray-800/50 p-0.5 group-hover:scale-110 transition-transform">
            <Image
              src={currentLanguage.logoPath}
              alt={`${currentLanguage.label} logo`}
              width={24}
              height={24}
              className="w-full h-full object-contain relative z-10"
            />
          </div>

          {/* 语言名称 */}
          <span className="flex-1 text-left group-hover:text-white transition-colors">
            {currentLanguage.label}
          </span>

          {/* 下拉箭头 */}
          <ChevronDownIcon className="size-4 text-gray-400 group-hover:text-gray-300 transition-colors" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-64 bg-[#1e1e2e]/95 backdrop-blur-xl border-[#313244] p-0"
      >
        <div className="flex items-center h-8 px-3 border-b border-gray-800/50">
          <span className="text-xs font-medium text-gray-400">选择编程语言</span>
        </div>

        <div className="max-h-[280px] overflow-y-auto overflow-x-hidden py-2 custom-scrollbar">
          {Object.values(LANGUAGE_CONFIG).map((lang) => {
            const isSelected = language === lang.id;

            return (
              <DropdownMenuItem
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={cn(
                  "relative group flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg transition-all duration-200 cursor-pointer focus:bg-transparent",
                  isSelected ? "bg-blue-500/10 text-blue-400" : "text-gray-300"
                )}
              >
                {/* 背景渐变 */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* hover 背景 */}
                <div className="absolute inset-0 bg-[#262637] opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* 内容容器 */}
                <div className="relative flex items-center gap-3 w-full">
                  {/* 语言图标 */}
                  <div
                    className={cn(
                      "relative size-8 rounded-lg p-1.5 group-hover:scale-110 transition-transform",
                      isSelected ? "bg-blue-500/10" : "bg-gray-800/50"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Image
                      src={lang.logoPath}
                      alt={`${lang.label} logo`}
                      width={24}
                      height={24}
                      className="w-full h-full object-contain relative z-10"
                    />
                  </div>

                  {/* 语言名称 */}
                  <span className="flex-1 text-left group-hover:text-white transition-colors">
                    {lang.label}
                  </span>

                  {/* 选中状态图标 */}
                  {isSelected && <Sparkles className="size-4 text-blue-400 animate-pulse" />}
                </div>

                {/* 选中状态边框 */}
                {isSelected && (
                  <div className="absolute inset-0 border-2 border-blue-500/30 rounded-lg" />
                )}
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
