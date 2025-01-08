import type * as monacoEditor from "monaco-editor";
import { create } from "zustand";
import { LANGUAGE_CONFIG } from "@/app/(marketing)/_constants";
import type { CodeEditorState, ExecuteCodeResponse, ExecutionResult, LanguageRuntime } from "../types";


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

// 代码执行服务类
class CodeExecutionService {
  private static readonly API_URL = "https://emkc.org/api/v2/piston/execute";

  // 准备执行环境
  private static prepareExecutionData(code: string, runtime: LanguageRuntime) {
    return {
      language: runtime.language,
      version: runtime.version,
      files: [{ content: code }] 
    };
  }

  // 执行代码
  static async execute(code: string, runtime: LanguageRuntime): Promise<ExecuteCodeResponse> {
    const executionData = this.prepareExecutionData(code, runtime);
    const response = await fetch(this.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(executionData)
    });
    
    if (!response.ok) {
      throw new Error("API请求失败");
    }
    
    return response.json();
  }
}

// 执行结果处理类
class ExecutionResultHandler {
  private code: string;
  private result: ExecuteCodeResponse;

  constructor(code: string, result: ExecuteCodeResponse) {
    this.code = code;
    this.result = result;
  }

  // 处理API错误
  private handleApiError(): ExecutionResult | null {
    if ("message" in this.result) {
      return {
        code: this.code,
        output: "",
        error: this.result.message as string
      };
    }
    return null;
  }

  // 处理编译错误
  private handleCompileError(): ExecutionResult | null {
    const compile = this.result.compile;
    if (compile && compile.code !== 0) {
      return {
        code: this.code,
        output: "",
        error: compile?.stderr || compile?.output || "编译错误"
      };
    }
    return null;
  }

  // 处理运行时错误
  private handleRuntimeError(): ExecutionResult | null {
    const run = this.result.run;
    if (run && run.code !== 0) {
      return {
        code: this.code,
        output: "",
        error: run?.stderr || run?.output || "运行时错误"
      };
    }
    return null;
  }

  // 处理成功结果
  private handleSuccess(): ExecutionResult {
    return {
      code: this.code,
      output: (this.result.run?.output || "").trim(),
      error: null
    };
  }

  // 处理执行结果
  process(): ExecutionResult {
    return (
      this.handleApiError() ||
      this.handleCompileError() ||
      this.handleRuntimeError() ||
      this.handleSuccess()
    );
  }
}

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

    // 运行代码
    runCode: async () => {
      const { language, getCode } = get();
      const code = getCode().trim();

      // 验证代码
      if (!code) {
        const result: ExecutionResult = {
          code: "",
          output: "",
          error: "请输入要执行的代码"
        };
        set({ error: result.error, executionResult: result });
        return;
      }

      // 初始化执行状态
      set({ isRunning: true, error: null, output: "", executionResult: null });

      try {
        // 获取运行时配置
        const runtime = LANGUAGE_CONFIG[language].pistonRuntime;
        
        // 执行代码
        const response = await CodeExecutionService.execute(code, runtime);
        
        // 处理执行结果
        const handler = new ExecutionResultHandler(code, response);
        const result = handler.process();
        
        // 更新状态
        set({
          output: result.output,
          error: result.error,
          executionResult: result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "代码执行过程中发生错误";
        const result: ExecutionResult = {
          code,
          output: "",
          error: errorMessage
        };
        set({ error: errorMessage, executionResult: result });
      } finally {
        set({ isRunning: false });
      }
    },
  };
});
