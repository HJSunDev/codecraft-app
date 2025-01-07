import React from "react";
import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";
import { ArrowRight, Code2, Sparkles, Zap } from "lucide-react";
import { ThemeSelector } from "./_components/ThemeSelector";
import { LanguageSelector } from "./_components/LanguageSelector";

// 特性卡片组件接口定义
interface FeatureCardProps {
  icon: React.ReactNode;  // 特性图标
  title: string;         // 特性标题
  description: string;   // 特性描述
}

// 特性卡片组件：用于展示产品特性
const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="relative overflow-hidden rounded-lg border border-indigo-500/10 bg-[#1E293B]/20 px-6 py-8">
    <div className="flex items-center gap-4">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-indigo-100">{title}</h3>
        <p className="mt-2 text-sm text-indigo-300/70">{description}</p>
      </div>
    </div>
  </div>
);

// 营销主页组件
export default function MarketingPage() {
  // 产品特性数据配置
  const features = [
    {
      icon: <Code2 className="size-6" />,
      title: "Smart Completion",
      description: "AI-powered code completion to boost your productivity",
    },
    {
      icon: <Zap className="size-6" />,
      title: "Real-time Collaboration",
      description: "Code together in real-time with zero latency",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      {/* 主要内容区域 */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
            <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
            <ThemeSelector />
            <LanguageSelector />
              {/* 英雄区域：包含主标题和行动按钮 */}
              <section className="relative">
                {/* 背景渐变效果 */}
                <div className="absolute -top-4 -left-8 size-72 bg-indigo-500/10 rounded-full blur-3xl" />
                
                {/* 英雄区域内容 */}
                <div className="relative">
                  {/* 主标题：使用渐变文字效果 */}
                  <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-indigo-200 via-indigo-300 to-indigo-200 bg-clip-text text-transparent pb-2">
                    The Intelligent
                    <br />
                    Programming Platform
                  </h1>

                  {/* 行动按钮组 */}
                  <div className="mt-10 flex items-center gap-x-6">
                    {/* 主要行动按钮：注册按钮 */}
                    <button className="relative group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2.5 text-sm font-semibold text-white hover:from-indigo-400 hover:to-purple-400 transition-all duration-300">
                      Get Started Free
                      <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    
                    {/* 次要行动按钮：了解更多 */}
                    <button className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                      Learn More
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              </section>

              {/* 特性网格区域：展示产品主要功能 */}
              <section className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                  />
                ))}
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 