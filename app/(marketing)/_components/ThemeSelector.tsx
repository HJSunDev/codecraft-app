"use client"

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { THEMES } from "../_constants";
import { CircleOff, Cloud, GithubIcon, Laptop, Moon, Palette, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import useMounted from "@/hooks/useMounted";

// 主题图标映射
const THEME_ICONS: Record<string, React.ReactNode> = {
  "vs-dark": <Moon className="size-4" />,
  "vs-light": <Sun className="size-4" />,
  "github-dark": <GithubIcon className="size-4" />,
  monokai: <Laptop className="size-4" />,
  "solarized-dark": <Cloud className="size-4" />,
};

// 主题选择器组件
export const ThemeSelector = () => {
  const mounted = useMounted();
  const { theme, setTheme } = useCodeEditorStore();
  const currentTheme = THEMES.find((t) => t.id === theme);

  // 加载状态
  if (!mounted) {
    return (
      <Button
        variant="outline"
        className="w-48 relative flex items-center gap-2 px-4 py-2.5 bg-[#1e1e2e]/80 rounded-lg transition-all duration-200 border border-gray-800/50 text-gray-300"
      >
        <Palette className="w-4 h-4 text-gray-400" />
        <span className="flex-1 text-left">加载中...</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          suppressHydrationWarning
          variant="outline"
          className="w-48 relative flex items-center gap-2 px-4 py-2.5 bg-[#1e1e2e]/80 hover:bg-[#262637] rounded-lg transition-all duration-200 border border-gray-800/50 hover:border-gray-700 text-gray-300 group"
        >
          {/* 悬浮状态装饰器 */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          <Palette className="w-4 h-4 text-gray-400 group-hover:text-gray-300 transition-colors" />
          <span className="flex-1 text-left group-hover:text-white transition-colors">
            {currentTheme?.label}
          </span>
          <div
            className="relative size-4 rounded-full border border-gray-600 group-hover:border-gray-500 transition-colors"
            style={{ background: currentTheme?.color }}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-[240px] bg-[#1e1e2e]/95 backdrop-blur-xl border-[#313244] p-0"
      >
        <div className="flex items-center h-8 px-3 border-b border-gray-800/50">
          <span className="text-xs font-medium text-gray-400">选择主题</span>
        </div>

        {THEMES.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={cn(
              "relative group flex items-center gap-3 px-3 py-2.5 transition-all duration-200 cursor-pointer focus:bg-transparent",
              theme === t.id ? "bg-blue-500/10 text-blue-400" : "text-gray-300"
            )}
          >
            {/* 背景渐变 */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* hover 背景 */}
            <div className="absolute inset-0 bg-[#262637] opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* 内容容器 - 确保内容在背景之上 */}
            <div className="relative flex items-center gap-3 w-full">
              {/* 图标 */}
              <div
                className={cn(
                  "flex items-center justify-center size-8 rounded-lg group-hover:scale-110 transition-all duration-200",
                  theme === t.id ? "bg-blue-500/10 text-blue-400" : "bg-gray-800/50 text-gray-400"
                )}
              >
                {THEME_ICONS[t.id] || <CircleOff className="size-4" />}
              </div>

              {/* 标签 */}
              <span className="flex-1 text-left group-hover:text-white transition-colors">
                {t.label}
              </span>

              {/* 颜色指示器 */}
              <div
                className="relative size-4 rounded-full border border-gray-600 group-hover:border-gray-500 transition-colors"
                style={{ background: t.color }}
              />
            </div>

            {/* 当前主题边框 */}
            {theme === t.id && (
              <div className="absolute inset-0 border-2 border-blue-500/30 rounded-lg" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};