"use node";

import { v } from "convex/values";
import OpenAI from "openai";
import { action } from "./_generated/server";

// 定义消息类型
interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// AI 助手的系统提示词
const instructions = `你是一个专业的编程助手，可以帮助用户解决编程问题、优化代码、解释概念等。
请用简洁专业的语言回答问题，必要时提供代码示例。
回答应当准确、有见地，并注重实用性。
如果问题不清楚，请寻求澄清而不是做假设。
始终使用中文回答。`;

// OpenAI API 调用函数
export const chat = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(v.literal("system"), v.literal("user"), v.literal("assistant")),
        content: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // 获取 API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OpenAI API key not found in environment variables");
    }

    // 创建 OpenAI 客户端
    const openai = new OpenAI({ 
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://codecraft.com",
        "X-Title": "CodeCraft",
      }
    });

    try {
      // 准备消息数组
      const messages: Message[] = [
        {
          role: "system",
          content: instructions,
        },
        ...args.messages,
      ];

      // 调用 OpenAI API
      const completion = await openai.chat.completions.create({
        model: "openai/gpt-3.5-turbo",
        messages,
      });

      // 返回 AI 的回复
      const reply = completion.choices[0].message.content;
      if (!reply) {
        throw new Error("No response from OpenAI");
      }

      return {
        reply,
        status: "success",
      };
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error(error instanceof Error ? error.message : "Unknown error occurred");
    }
  },
});
