import React from "react";
import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";

export default function MarketingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-20">
        {/* 主要内容区域 */}
        <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
            <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                欢迎使用 CodeCraft
              </h1>
              <p className="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                CodeCraft 是一个强大的在线编程平台，让您可以轻松创建、分享和协作您的代码项目。
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 