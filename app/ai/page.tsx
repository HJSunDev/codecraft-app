"use client";

import { Navbar } from "./_components/navbar";
import { AIChatPanel } from "./_components/AIChatPanel";

export default function AIPage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* 导航栏 */}
      <Navbar />
      
      {/* 主内容区域 */}
      <main className="flex-1 pt-14 bg-[#0B1121] flex items-center">
        {/* 内容容器 */}
        <div className="w-full max-w-[1000px] mx-auto px-6">
          {/* AI 聊天面板 */}
          <div className="h-[calc(100vh-12rem)]">
            <AIChatPanel />
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