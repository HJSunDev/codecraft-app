"use client";

import { useState, useEffect } from "react";
import { Navbar } from "./_components/navbar";
import { EditorPanel } from "./_components/EditorPanel";
import { OutputPanel } from "./_components/OutputPanel";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftToLine, ArrowRightToLine } from "lucide-react";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { cn } from "@/lib/utils";

export default function PlaygroundPage() {
  // 控制输出面板的显示状态
  const [isOutputVisible, setIsOutputVisible] = useState(false);
  // 获取运行状态
  const { isRunning } = useCodeEditorStore();

  // 监听运行状态，自动展开输出面板
  useEffect(() => {
    if (isRunning) {
      setIsOutputVisible(true);
    }
  }, [isRunning]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* 导航栏 - 固定高度 */}
      <Navbar />
      
      {/* 主内容区域 - 自适应高度 */}
      <main className="flex-1 pt-14 bg-[#0B1121] flex items-center">
        {/* 内容容器 */}
        <div className="w-full max-w-[1680px] mx-auto px-6">
          {/* 固定高度的内容区域 */}
          <div className="h-[calc(100vh-12rem)] flex flex-col">
            {/* 编辑器和输出面板区域 */}
            <div className="flex items-stretch gap-4 h-full">
              {/* 编辑器区域 */}
              <motion.div
                className="relative flex-1 min-w-0"
                animate={{
                  flex: isOutputVisible ? "1 1 65%" : "1 1 100%"
                }}
                transition={{ duration: 0.3 }}
              >
                {/* 编辑器面板 */}
                <div className="h-full rounded-xl overflow-hidden">
                  <EditorPanel />
                </div>

                {/* 展开按钮 - 悬浮在编辑器右侧中间 */}
                <AnimatePresence>
                  {!isOutputVisible && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-1/2 -right-3 -translate-y-1/2 z-10"
                    >
                      <button
                        onClick={() => setIsOutputVisible(true)}
                        className="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#1e1e2e]/90 hover:bg-[#262637] border border-white/[0.1] shadow-lg transition-all duration-200 hover:scale-105"
                      >
                        <span className="text-xs text-indigo-300/70 group-hover:text-indigo-300 transition-colors">
                          输出
                        </span>
                        <ArrowLeftToLine className="size-4 text-indigo-300/70 group-hover:text-indigo-300 transition-colors" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* 输出面板 */}
              <AnimatePresence mode="wait">
                {isOutputVisible && (
                  <motion.div
                    className="relative flex-1 min-w-0"
                    initial={{ 
                      opacity: 0,
                      flex: "0 0 0%"
                    }}
                    animate={{ 
                      opacity: 1,
                      flex: "1 1 35%"
                    }}
                    exit={{ 
                      opacity: 0,
                      flex: "0 0 0%"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* 收起按钮 - 悬浮在输出面板左侧中间 */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-10">
                      <button
                        onClick={() => setIsOutputVisible(false)}
                        className="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#1e1e2e]/90 hover:bg-[#262637] border border-white/[0.1] shadow-lg transition-all duration-200 hover:scale-105"
                      >
                        <ArrowRightToLine className="size-4 text-indigo-300/70 group-hover:text-indigo-300 transition-colors" />
                        <span className="text-xs text-indigo-300/70 group-hover:text-indigo-300 transition-colors">
                          收起
                        </span>
                      </button>
                    </div>

                    {/* 输出面板内容 */}
                    <div className="h-full rounded-xl overflow-hidden">
                      <OutputPanel />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 装饰性元素 */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute left-0 top-1/4 w-1/3 h-1/2 bg-blue-500/20 rounded-full blur-[128px] opacity-20 animate-pulse" />
          <div className="absolute right-0 bottom-1/4 w-1/3 h-1/2 bg-purple-500/20 rounded-full blur-[128px] opacity-20 animate-pulse" />
        </div>
      </main>
    </div>
  );
} 