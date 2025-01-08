'use client';

import { Button } from "@/components/ui/button";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface RunButtonProps {
  className?: string;
}

export const RunButton = ({ className }: RunButtonProps) => {
  // 从 store 中获取运行状态和方法
  const { isRunning, runCode } = useCodeEditorStore();

  // 处理运行按钮点击事件
  const handleRunClick = async () => {
    if (isRunning) return;
    await runCode();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        onClick={handleRunClick}
        disabled={isRunning}
        variant="default"
        size="lg"
        className={cn(
          "relative rounded-xl text-white font-medium shadow-lg transition-all duration-200",
          isRunning && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        {/* 按钮装饰 */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 
        group-hover:opacity-100 blur-xl transition-opacity duration-500" />
        
        {/* 按钮内容 */}
        <div className="relative flex items-center gap-2">
          <Play className="size-5" />
          <span>{isRunning ? "运行中..." : "运行代码"}</span>
        </div>
      </Button>
    </motion.div>
  );
}; 