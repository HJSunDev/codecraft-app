"use client";

import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";
import { ArrowRight, Code2, Sparkles } from "lucide-react";
import { ThemeSelector } from "./_components/ThemeSelector";
import { LanguageSelector } from "./_components/LanguageSelector";
import { EditorPanel } from "./_components/EditorPanel";
import { motion } from "framer-motion";

export default function MarketingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col">
        {/* 英雄区域 */}
        <div className="relative w-full  py-20 pt-32">
          {/* 背景装饰 */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
          
          <div className="container mx-auto px-4">
            {/* 编辑器展示区域 */}
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {/* 工具栏背景 */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-[#1E293B]/80 backdrop-blur-sm border-b border-white/5">
                <div className="h-full w-full flex items-center justify-end gap-3 px-6">
                  <LanguageSelector />
                  <ThemeSelector />
                </div>
              </div>

              {/* 编辑器容器 */}
              <div className="pt-16">
                <EditorPanel />
              </div>

              {/* 装饰性光效 */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5" />
              </div>
            </motion.div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 