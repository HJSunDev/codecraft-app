"use client";

import { Navbar } from "./_components/navbar";
import { AIChatPanel } from "./_components/AIChatPanel";

export default function AIPage() {
  return (
    <div className="h-screen flex flex-col">
      {/* 导航栏 */}
      <Navbar />
      
      {/* 主内容区域 - 移除内边距限制 */}
      <main className="flex-1 pt-14 bg-[#0B1121]">
        {/* AI 聊天面板 - 占据全屏 */}
        <div className="h-[calc(100vh-3.5rem)]">
          <AIChatPanel />
        </div>

        {/* 装饰性元素 - 调整位置和大小 */}
        <div className="fixed inset-0 pointer-events-none">
          {/* 左上角装饰 */}
          <div className="absolute left-0 top-0 w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] opacity-20 animate-pulse" />
          {/* 右下角装饰 */}
          <div className="absolute right-0 bottom-0 w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] opacity-20 animate-pulse" />
        </div>
      </main>
    </div>
  );
} 