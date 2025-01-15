"use client";

import { useState, useRef, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Message {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: number;
}

// 提取代码块的正则表达式
const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;

function CodeBlock({ language, code }: { language?: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-lg overflow-hidden border border-indigo-500/20">
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/5">
        <span className="text-xs text-indigo-200/90">{language || "代码"}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-indigo-200/70 hover:text-indigo-200 hover:bg-white/5"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <pre className="m-0 p-4 bg-gradient-to-br from-[#0B1121]/80 to-[#0B1121]/60 overflow-x-auto">
        <code className="block text-sm font-mono text-indigo-200/90 whitespace-pre">
          {code.trim()}
        </code>
      </pre>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // 添加代码块之前的文本
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: content.slice(lastIndex, match.index),
      });
    }

    // 添加代码块
    parts.push({
      type: "code",
      language: match[1] || "",
      content: match[2],
    });

    lastIndex = match.index + match[0].length;
  }

  // 添加剩余的文本
  if (lastIndex < content.length) {
    parts.push({
      type: "text",
      content: content.slice(lastIndex),
    });
  }

  return (
    <div className="space-y-2">
      {parts.map((part, index) =>
        part.type === "code" ? (
          <CodeBlock
            key={index}
            language={part.language}
            code={part.content}
          />
        ) : (
          <p key={index} className="leading-7">
            {part.content}
          </p>
        )
      )}
    </div>
  );
}

export function AIChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const chat = useAction(api.openai.chat);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 自动调整文本框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(36).slice(2),
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await chat({
        messages: [...messages, userMessage].map(({ timestamp, id, ...msg }) => msg),
      });

      if (result.status === "success") {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).slice(2),
            role: "assistant",
            content: result.reply,
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex">
      {/* 左侧面板 - 历史记录 */}
      <div className="w-80 border-r border-white/[0.08] bg-[#0B1121]/80 backdrop-blur-sm">
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-2 px-2 mb-6">
            <h2 className="text-lg font-medium text-indigo-100">历史记录</h2>
            <div className="h-4 w-4 rounded-full bg-white/[0.06] flex items-center justify-center">
              <span className="text-xs text-indigo-200/80">0</span>
            </div>
          </div>
          <div className="flex-1 space-y-2 min-h-0 overflow-y-auto">
            {/* 历史记录列表 */}
            <div className="px-2 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] transition-colors cursor-pointer group">
              <div className="text-sm font-medium text-indigo-200/90 mb-1 truncate group-hover:text-indigo-100">代码优化讨论</div>
              <div className="text-xs text-indigo-300/60 truncate group-hover:text-indigo-300/80">关于性能优化的建议...</div>
              <div className="mt-2 flex items-center justify-between text-xs text-indigo-300/40">
                <span>3 条消息</span>
                <span>12:30</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧主要聊天区域 */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-[#0B1121]/40 to-[#0B1121]/60">
        {/* 空状态 */}
        {messages.length === 0 && !isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center text-indigo-300/70">
            <div className="relative mb-6 group">
              <div className="absolute -inset-8 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
              <Bot className="h-16 w-16 text-indigo-200/90" />
            </div>
            <h3 className="text-2xl font-medium mb-3 text-indigo-100">AI 编程助手</h3>
            <p className="text-base text-center max-w-lg mb-12 leading-relaxed text-indigo-300/70">
              我可以帮助你解决编程问题、优化代码、解释概念，
              <br />
              让我们开始对话吧！
            </p>
            <div className="grid grid-cols-2 gap-6 max-w-2xl w-full px-8">
              <Button
                variant="outline"
                className="h-auto p-6 bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.06] hover:border-white/[0.08] transition-all duration-300 group"
                onClick={() => setInput("如何优化这段代码的性能？")}
              >
                <div className="text-left">
                  <div className="font-medium text-lg mb-2 text-indigo-200/90 group-hover:text-indigo-100">代码优化</div>
                  <div className="text-sm text-indigo-300/60 group-hover:text-indigo-300/80">获取代码改进建议</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-6 bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.06] hover:border-white/[0.08] transition-all duration-300 group"
                onClick={() => setInput("解释一下这个概念...")}
              >
                <div className="text-left">
                  <div className="font-medium text-lg mb-2 text-indigo-200/90 group-hover:text-indigo-100">概念解释</div>
                  <div className="text-sm text-indigo-300/60 group-hover:text-indigo-300/80">理解技术概念</div>
                </div>
              </Button>
            </div>
          </div>
        )}

        {/* 消息列表 */}
        {(messages.length > 0 || isLoading) && (
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={cn(
                      "flex gap-4",
                      message.role === "user" ? "flex-row-reverse" : ""
                    )}
                  >
                    <div
                      className={cn(
                        "flex-shrink-0 flex flex-col items-center gap-2",
                        message.role === "user" ? "items-end" : "items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center backdrop-blur-sm",
                          message.role === "user"
                            ? "bg-white/[0.06] text-indigo-200/90"
                            : "bg-white/[0.06] text-purple-200/90"
                        )}
                      >
                        {message.role === "user" ? (
                          <User className="h-5 w-5" />
                        ) : (
                          <Bot className="h-5 w-5" />
                        )}
                      </div>
                      <time className="text-xs text-indigo-300/40">
                        {format(message.timestamp, "HH:mm", { locale: zhCN })}
                      </time>
                    </div>
                    <div
                      className={cn(
                        "flex-1 rounded-2xl px-6 py-4 backdrop-blur-sm",
                        message.role === "user"
                          ? "bg-white/[0.04]"
                          : "bg-white/[0.04]"
                      )}
                    >
                      <div className="text-sm mb-1 font-medium text-indigo-200/90">
                        {message.role === "user" ? "你" : "AI 助手"}
                      </div>
                      <div className="text-sm text-indigo-300/80">
                        <MessageContent content={message.content} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* 加载状态 */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-xl bg-white/[0.06] backdrop-blur-sm flex items-center justify-center">
                      <Bot className="h-5 w-5 text-purple-200/90" />
                    </div>
                  </div>
                  <div className="flex-1 rounded-2xl px-6 py-4 bg-white/[0.04] backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-indigo-300/70">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">正在思考...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* 输入区域 */}
        <div className="border-t border-white/[0.08] bg-[#0B1121]/90 backdrop-blur-sm p-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="输入问题或粘贴代码（Shift + Enter 换行）..."
                className="resize-none pr-12 min-h-[2.5rem] max-h-32 bg-white/[0.03] border-white/[0.06] focus:border-white/[0.08] focus:ring-1 focus:ring-white/[0.08] placeholder:text-indigo-300/30 text-indigo-100 transition-all duration-200"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      className="absolute right-2 bottom-2 h-8 w-8 bg-white/[0.06] hover:bg-white/[0.08] text-indigo-200/90 hover:text-indigo-100 border-white/[0.08] transition-all duration-200 disabled:opacity-50"
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>发送消息（Enter）</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="mt-2 flex justify-between items-center text-xs text-indigo-300/40">
              <div>Shift + Enter 换行</div>
              <div>Enter 发送</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 