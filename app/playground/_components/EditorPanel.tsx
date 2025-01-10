"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useClerk } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Editor } from "@monaco-editor/react";
import { RotateCcwIcon, ShareIcon, TypeIcon } from "lucide-react";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import useMounted from "@/hooks/useMounted";
import { cn } from "@/lib/utils";

import { defineMonacoThemes, LANGUAGE_CONFIG } from "../_constants";
import { EditorPanelSkeleton } from "./EditorPanelSkeleton";

import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// 编辑器选项配置
const EDITOR_OPTIONS = {
  minimap: { enabled: false },
  automaticLayout: true,
  scrollBeyondLastLine: false,
  padding: { top: 16, bottom: 16 },
  renderWhitespace: "selection",
  fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
  fontLigatures: true,
  cursorBlinking: "smooth",
  smoothScrolling: true,
  contextmenu: true,
  renderLineHighlight: "all",
  lineHeight: 1.6,
  letterSpacing: 0.5,
  roundedSelection: true,
  scrollbar: {
    verticalScrollbarSize: 8,
    horizontalScrollbarSize: 8,
    verticalSliderSize: 8,
    horizontalSliderSize: 8,
    verticalScrollbarBackground: "transparent",
    horizontalScrollbarBackground: "transparent",
  },
} as const;

export const EditorPanel = () => {
  // 检查组件是否已挂载
  const mounted = useMounted();
  
  // 获取Clerk对象，用于用户身份验证
  const clerk = useClerk();
  
  // 从状态管理中获取编辑器相关的状态和方法
  const { language, theme, fontSize, editor, setFontSize, setEditor } = useCodeEditorStore();
  
  // 根据当前语言配置获取语言相关信息
  const currentLanguage = LANGUAGE_CONFIG[language];

  // 处理编辑器内容变化
  const handleEditorChange = (value: string | undefined) => {
    if (!value) return;
    localStorage.setItem(`editor-code-${language}`, value);
  };

  // 重置编辑器内容
  const handleReset = () => {
    if (!editor) return;
    editor.setValue(currentLanguage.defaultCode);
    localStorage.removeItem(`editor-code-${language}`);
  };

  // 处理字体大小变化
  const handleFontSizeChange = (value: number[]) => {
    const size = value[0];
    setFontSize(size);
    localStorage.setItem("editor-font-size", size.toString());
  };

  // 初始化字体大小
  useEffect(() => {
    const savedFontSize = localStorage.getItem("editor-font-size");
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize));
    }
  }, []); // 只在组件挂载时运行一次

  // 加载保存的代码
  useEffect(() => {
    if (!editor) return;
    
    const savedCode = localStorage.getItem(`editor-code-${language}`);
    editor.setValue(savedCode || currentLanguage.defaultCode);
  }, [language, editor]); // 只依赖 language 和 editor

  if (!mounted) return null;

  return (
    <div className="relative">
      <div className="relative bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-6">
        {/* 编辑器头部 */}
        <header className="flex items-center justify-between mb-4">
          {/* 左侧信息 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5">
              <Image
                src={currentLanguage.logoPath}
                alt={`${currentLanguage.label} logo`}
                width={24}
                height={24}
                className="size-5 object-contain"
              />
            </div>
            <div>
              <h2 className="text-sm font-medium text-white">代码编辑器</h2>
              <p className="text-xs text-gray-500">编写并执行您的代码</p>
            </div>
          </div>

          {/* 右侧工具栏 */}
          <div className="flex items-center gap-3">
            {/* 字体大小调节 */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-3 px-3 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5">
                    <TypeIcon className="size-4 text-gray-400" />
                    <Slider
                      value={[fontSize]}
                      onValueChange={handleFontSizeChange}
                      min={12}
                      max={24}
                      step={1}
                      className="w-20"
                    />
                    <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">
                      {fontSize}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>调整字体大小</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* 重置按钮 */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors"
                  >
                    <RotateCcwIcon className="size-4 text-gray-400" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>重置代码</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* 分享按钮 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
                "bg-gradient-to-r from-blue-500 to-blue-600",
                "opacity-90 hover:opacity-100 transition-opacity"
              )}
            >
              <ShareIcon className="size-4 text-white" />
              <span className="text-sm font-medium text-white">分享</span>
            </motion.button>
          </div>
        </header>

        {/* 编辑器主体 */}
        <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]">
          {clerk.loaded ? (
            <Editor
              height="600px"
              language={currentLanguage.monacoLanguage}
              theme={theme}
              onChange={handleEditorChange}
              beforeMount={defineMonacoThemes}
              onMount={setEditor}
              options={{
                ...EDITOR_OPTIONS,
                fontSize,
              }}
              className="custom-scrollbar"
            />
          ) : (
            <EditorPanelSkeleton />
          )}

          {/* 编辑器装饰效果 */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
};
