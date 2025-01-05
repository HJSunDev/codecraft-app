import { create } from "zustand";
import { CodeEditorState } from "../types";
import type * as monacoEditor from "monaco-editor";
import { LANGUAGE_CONFIG } from "@/app/(marketing)/_constants";


// 从本地存储中获取代码编辑器状态
const getInitialState = () => {

  // 如果在服务端，则返回默认的编辑器设置
  if (typeof window === "undefined") {
    return {
      language: "javascript", // 默认语言为JavaScript
      fontSize: 14, // 默认字体大小为14
      theme: "vs-dark", // 默认主题为VS Dark
    };
  }

  // 如果在客户端，则从本地存储中获取用户的编辑器设置
  const savedLanguage = localStorage.getItem("editor-language") || "javascript";
  const savedFontSize = localStorage.getItem("editor-fontSize") || 14;
  const savedTheme = localStorage.getItem("editor-theme") || "vs-dark";

  return {
    language: savedLanguage, // 获取保存的语言设置
    fontSize: Number(savedFontSize), // 获取保存的字体大小并转换为数字
    theme: savedTheme, // 获取保存的主题设置
  };
};

// 创建代码编辑器的状态管理
export const useCodeEditorStore = create<CodeEditorState>((set, get) => {

  // 初始化编辑器状态
  const initialState = getInitialState();

  return {
    // 展开初始状态
    ...initialState,
    // 初始化输出为空
    output: "",
    // 初始化运行状态为false
    isRunning: false,
    // 初始化错误信息为null
    error: null,
    // 初始化编辑器实例为null
    editor: null,
    // 初始化执行结果为null
    executionResult: null,

    // 获取当前编辑器中的代码
    getCode: () => {
      const editor = get().editor;
      // 如果编辑器存在，返回其内容，否则返回空字符串
      return editor?.getValue() || "";
    },

    // 设置编辑器实例并加载保存的代码
    setEditor: (editor: monacoEditor.editor.IStandaloneCodeEditor) => {
      const saveCode = localStorage.getItem(`editor-code-${get().language}`)
      if (saveCode) {
        // 如果存在保存的代码，则设置到编辑器中
        editor.setValue(saveCode)
      }
      // 更新编辑器实例
      set({ editor })
    },

    // 设置编辑器主题
    setTheme: (theme: string) => {
      // 保存主题到本地存储
      localStorage.setItem("editor-theme", theme);
      // 更新状态中的主题
      set({ theme });
    },

    // 设置编辑器字体大小
    setFontSize: (fontSize: number) => {
      // 保存字体大小到本地存储
      localStorage.setItem("editor-fontSize", fontSize.toString());
      // 更新状态中的字体大小
      set({ fontSize });
    },

    // 设置编辑器语言
    setLanguage: (language: string) => {

      // 获取当前编辑器中的代码
      const currentCode = get().getCode();

      if(currentCode) {
        // 保存当前代码到本地存储
        localStorage.setItem(`editor-code-${get().language}`, currentCode);
      }

      // 保存语言到本地存储
      localStorage.setItem("editor-language", language);
      set({ 
        language, // 更新状态中的语言
        output: "", // 重置输出
        error: null, // 重置错误信息
      });
    },

    // 运行代码的逻辑
    runCode: async () => {
      // todo: 实现代码运行逻辑
    },
  };
});
