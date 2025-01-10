"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export const RunningCodeSkeleton = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-500">
      <motion.div
        className="flex items-center justify-center size-12 rounded-xl bg-gray-800/50 ring-1 ring-gray-700/50 mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="size-6" />
      </motion.div>
      <p className="text-center">正在执行代码...</p>
      
      {/* 进度条 */}
      <div className="w-48 h-1 mt-6 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-500/50"
          animate={{
            width: ["0%", "100%"],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />
      </div>
    </div>
  );
}; 