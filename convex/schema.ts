// 用于定义数据库结构和数据表
import { defineSchema, defineTable } from "convex/server";
// 用于定义字段类型的工具
import { v } from "convex/values";

// 导出数据库结构定义
export default defineSchema({
    // 定义一个名为 documents 的数据表
    documents: defineTable({
      userId: v.string(), // clerkId
      email: v.string(), 
      name: v.string(),
      isPro: v.boolean(),
      proSince: v.optional(v.number()),
      lemonSqueezyCustomerId: v.optional(v.string()),
      lemonSqueezyOrderId: v.optional(v.string()),

    })
    // === 索引定义（用于优化查询速度）===
    // 通过用户ID快速查找文档
    .index("by_user", ["userId"]),

    codeExecutions: defineTable({
        userId: v.string(),
        language: v.string(),
        code: v.string(),
        output: v.optional(v.string()),
        error: v.optional(v.string()),
    })
    .index("by_user", ["userId"]),


    snippets: defineTable({
        userId: v.string(),
        title: v.string(),
        language: v.string(),
        code: v.string(),
        userName: v.string(), // store user's name for easy access
    })
    .index("by_user", ["userId"]),


    snippetComments: defineTable({
        snippetId: v.id("snippets"),
        userId: v.string(),
        userName: v.string(), 
        content: v.string(),
    })
    .index("by_snippet", ["snippetId"]),

    stars: defineTable({
        userId: v.id("users"),
        snippetId: v.id("snippets"),
    })
    .index("by_user", ["userId"])
    .index("by_snippet", ["snippetId"])
    .index("by_user_and_snippet", ["userId", "snippetId"]),

}) 