"use client";

import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";
import { ThemeSelector } from "./_components/ThemeSelector";
import { LanguageSelector } from "./_components/LanguageSelector";
import { EditorPanel } from "./_components/EditorPanel";
import { OutputPanel } from "./_components/OutputPanel";
import { RunButton } from "./_components/RunButton";
import { motion } from "framer-motion";

export default function MarketingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col">
        {/* 编辑器区域 */}
        <div className="relative w-full py-20 pt-32">
          {/* 背景装饰 */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
          
          <div className="container mx-auto px-4">
            {/* 工具栏 */}
            <motion.div
              className="flex items-center justify-between gap-3 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* 运行按钮 */}
              <RunButton className="relative px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 
                hover:shadow-blue-500/25 group" />

              {/* 右侧工具 */}
              <div className="flex items-center gap-3">
                <LanguageSelector />
                <ThemeSelector />
              </div>
            </motion.div>

            {/* 编辑器和输出面板容器 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 编辑器面板 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <EditorPanel />
              </motion.div>

              {/* 输出面板 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <OutputPanel />
              </motion.div>
            </div>

            {/* 装饰性元素 */}
            <div className="absolute inset-0 pointer-events-none">
              {/* 左侧光效 */}
              <div className="absolute left-0 top-1/4 w-1/3 h-1/2 bg-blue-500/30 rounded-full blur-[128px] opacity-20" />
              
              {/* 右侧光效 */}
              <div className="absolute right-0 bottom-1/4 w-1/3 h-1/2 bg-purple-500/30 rounded-full blur-[128px] opacity-20" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 