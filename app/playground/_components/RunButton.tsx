'use client';

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { getExecutionResult, useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface RunButtonProps {
  className?: string;
}

export const RunButton = ({ className }: RunButtonProps) => {
  // 获取状态和方法
  const { isRunning, runCode, language } = useCodeEditorStore();
  
  // 获取用户信息
  const { isSignedIn, user } = useUser();
  
  // 获取保存执行记录的 mutation
  const saveExecution = useMutation(api.codeExecutions.saveExecution);

  // 执行代码并保存记录
  const handleRunClick = async () => {
    if (isRunning) return;

    try {
      // 执行代码
      await runCode();

      // 如果用户未登录，跳过保存
      if (!isSignedIn || !user) {
        toast.info("登录后可以保存执行记录");
        return;
      }

      // 获取最新的执行结果并保存
      const latestResult = getExecutionResult();
      
      if (!latestResult) {
        toast.error("没有执行结果可保存");
        return;
      };

      // 保存执行记录
      await saveExecution({
        language,
        code: latestResult.code,
        output: latestResult.output,
        error: latestResult.error || undefined,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "执行过程中发生错误";
      toast.error(message);
      console.error("代码执行失败:", error);
    }
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