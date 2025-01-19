"use client";

// React相关
import { useState } from "react";

// 动画库
import { motion, AnimatePresence } from "framer-motion";

// 图标库
import { AlertTriangle, CheckCircle, Clock, Copy, Terminal } from "lucide-react";

// 状态管理
import { useCodeEditorStore } from "@/store/useCodeEditorStore";

// 组件
import { RunningCodeSkeleton } from "./RunningCodeSkeleton";

// 工具函数
import { cn } from "@/lib/utils";

export const OutputPanel = () => {
  // 从状态管理中获取输出、错误和运行状态
  const { output, error, isRunning } = useCodeEditorStore();
  
  // 定义一个状态来跟踪是否已复制
  const [isCopied, setIsCopied] = useState(false);

  // 检查是否有内容（错误信息或输出）
  const hasContent = error || output;

  // 处理复制操作的函数
  const handleCopy = async () => {
    // 如果没有内容，则不执行复制操作
    if (!hasContent) return;
    
    // 将错误信息或输出复制到剪贴板
    await navigator.clipboard.writeText(error || output);
    
    // 设置已复制状态为true，并在2秒后重置为false
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative h-full">
      <div className="relative h-full bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] flex flex-col">
        {/* 输出面板头部 */}
        <header className="flex-shrink-0 flex items-center justify-between p-6 pb-4">
          {/* 左侧信息 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5">
              <Terminal className="size-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-white">输出面板</h2>
              <p className="text-xs text-gray-500">查看代码执行结果</p>
            </div>
          </div>

          {/* 复制按钮 */}
          {hasContent && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopy}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                "bg-[#1e1e2e] hover:bg-[#262637] ring-1 ring-white/5",
                "text-sm text-gray-400 hover:text-gray-300"
              )}
            >
              {isCopied ? (
                <CheckCircle className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              <span>{isCopied ? "已复制！" : "复制"}</span>
            </motion.button>
          )}
        </header>

        {/* 输出内容区域 - 使用flex-1确保填充剩余空间 */}
        <div className="flex-1 px-6 pb-6">
          <div className="relative h-full group rounded-xl overflow-hidden ring-1 ring-white/[0.05]">
            <div className="h-full p-6 font-mono text-sm bg-[#1e1e2e]/50 backdrop-blur-sm overflow-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                {isRunning ? (
                  <motion.div
                    key="running"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full"
                  >
                    <RunningCodeSkeleton />
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 p-3 rounded-xl bg-red-500/10 text-red-400">
                      <AlertTriangle className="size-5" />
                    </div>
                    <div className="space-y-2 pt-1">
                      <h3 className="font-medium text-red-400">执行错误</h3>
                      <pre className="whitespace-pre-wrap text-red-400/80 leading-relaxed">
                        {error}
                      </pre>
                    </div>
                  </motion.div>
                ) : output ? (
                  <motion.div
                    key="output"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                        <CheckCircle className="size-5" />
                      </div>
                      <h3 className="font-medium text-emerald-400">执行成功</h3>
                    </div>
                    <pre className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                      {output}
                    </pre>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-gray-500"
                  >
                    <div className="flex items-center justify-center size-12 rounded-xl bg-gray-800/50 ring-1 ring-gray-700/50 mb-4">
                      <Clock className="size-6" />
                    </div>
                    <p className="text-center">运行代码以查看输出结果...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
