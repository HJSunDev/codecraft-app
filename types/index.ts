import type * as monacoEditor from "monaco-editor";
import { Id } from "../convex/_generated/dataModel";

// 主题接口，定义了主题的基本属性
export interface Theme {
  id: string; // 主题ID
  label: string; // 主题标签
  color: string; // 主题颜色
}

// 语言接口，定义了编程语言的基本属性
export interface Language {
  id: string; // 语言ID
  label: string; // 语言标签
  logoPath: string; // 语言Logo路径
  monacoLanguage: string; // Monaco编辑器使用的语言
  defaultCode: string; // 语言的默认代码模板
  pistonRuntime: LanguageRuntime; // 语言的运行时配置
}

// 语言运行时接口，定义了语言的运行时信息
export interface LanguageRuntime {
  language: string; // 语言名称
  version: string; // 语言版本
}

// 执行代码响应接口，定义了代码执行的响应结构
export interface ExecuteCodeResponse {
  compile?: {
    code: number;
    output: string; // 运行输出
    stderr: string; // 标准错误输出
  };
  run?: {
    code: number;
    output: string; // 运行输出
    stderr: string; // 标准错误输出
  };
}

// 执行结果接口，定义了代码执行的结果结构
export interface ExecutionResult {
  code: string; // 执行的代码
  output: string; // 执行输出
  error: string | null; // 执行错误信息
}

// 代码编辑器状态接口，定义了编辑器的状态和操作
export interface CodeEditorState {
  language: string; // 当前语言
  output: string; // 当前输出
  isRunning: boolean; // 是否正在运行
  error: string | null; // 当前错误信息
  theme: string; // 当前主题
  fontSize: number; // 字体大小
  editor: monacoEditor.editor.IStandaloneCodeEditor | null; // Monaco编辑器实例
  executionResult: ExecutionResult | null; // 执行结果

  setEditor: (editor: monacoEditor.editor.IStandaloneCodeEditor) => void; // 设置编辑器实例
  getCode: () => string; // 获取当前代码
  setLanguage: (language: string) => void; // 设置语言
  setTheme: (theme: string) => void; // 设置主题
  setFontSize: (fontSize: number) => void; // 设置字体大小
  runCode: () => Promise<void>; // 运行代码
}

// 代码片段接口，定义了代码片段的基本属性
export interface Snippet {
  _id: Id<"snippets">; // 片段ID
  _creationTime: number; // 创建时间
  userId: string; // 用户ID
  language: string; // 语言
  code: string; // 代码内容
  title: string; // 片段标题
  userName: string; // 用户名
}