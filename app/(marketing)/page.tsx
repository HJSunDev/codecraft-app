"use client";

import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";
import { ThemeSelector } from "./_components/ThemeSelector";
import { LanguageSelector } from "./_components/LanguageSelector";
import { EditorPanel } from "./_components/EditorPanel";
import { OutputPanel } from "./_components/OutputPanel";
import { RunButton } from "./_components/RunButton";
import { motion } from "framer-motion";
import Link from "next/link";

export default function MarketingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col">
        {/* 模块入口区域 */}
        <div className="h-[100vh] relative w-full py-10 pt-24 bg-[#0B1121] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold mb-4 text-white">CodeCraft 编程平台</h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                探索我们的编程工具，从代码编辑器到AI辅助编程，提升您的开发体验
              </p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Playground入口 */}
              <Link href="/playground" className="group">
                <div className="bg-[#1A2333] rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-800 h-full">
                  <div className="mb-4 p-3 bg-blue-900/30 rounded-lg w-fit">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">代码 Playground</h2>
                  <p className="text-gray-300">
                    在我们的交互式编程环境中编写、测试和运行代码，支持多种编程语言
                  </p>
                </div>
              </Link>
              
              {/* AI模块入口 */}
              <Link href="/ai" className="group">
                <div className="bg-[#1A2333] rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-800 h-full">
                  <div className="mb-4 p-3 bg-purple-900/30 rounded-lg w-fit">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">AI 编程助手</h2>
                  <p className="text-gray-300">
                    利用人工智能辅助编程，获取代码建议、问题解答和智能补全功能
                  </p>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
        
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