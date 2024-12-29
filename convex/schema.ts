// 用于定义数据库结构和数据表
import { defineSchema, defineTable } from "convex/server";
// 用于定义字段类型的工具
import { v } from "convex/values";

// 导出数据库结构定义
export default defineSchema({
    // 定义一个名为 users 的数据表
    users: defineTable({
      userId: v.string(), // 用户的唯一标识符
      email: v.string(), // 用户的电子邮件地址
      name: v.string(), // 用户的姓名
      isPro: v.boolean(), // 用户是否为专业版
      proSince: v.optional(v.number()), // 用户成为专业版的时间
      lemonSqueezyCustomerId: v.optional(v.string()), // Lemon Squeezy 客户ID
      lemonSqueezyOrderId: v.optional(v.string()), // Lemon Squeezy 订单ID

    })
    // === 索引定义（用于优化查询速度）===
    // 通过用户ID快速查找文档
    .index("by_user", ["userId"]),

    // 定义一个名为 codeExecutions 的数据表
    codeExecutions: defineTable({
        userId: v.string(), // 执行代码的用户ID
        language: v.string(), // 代码的编程语言
        code: v.string(), // 执行的代码内容
        output: v.optional(v.string()), // 代码执行的输出结果
        error: v.optional(v.string()), // 代码执行的错误信息
    })
    // 通过用户ID快速查找代码执行记录
    .index("by_user", ["userId"]),

    // 定义一个名为 snippets 的数据表
    snippets: defineTable({
        userId: v.string(), // 创建代码片段的用户ID
        title: v.string(), // 代码片段的标题
        language: v.string(), // 代码片段的编程语言
        code: v.string(), // 代码片段的内容
        userName: v.string(), // 存储用户的姓名以便于访问
    })
    // 通过用户ID快速查找代码片段
    .index("by_user", ["userId"]),

    // 定义一个名为 snippetComments 的数据表
    snippetComments: defineTable({
        snippetId: v.id("snippets"), // 评论所属的代码片段ID
        userId: v.string(), // 评论用户的ID
        userName: v.string(), // 评论用户的姓名
        content: v.string(), // 评论的内容
    })
    // 通过代码片段ID快速查找评论
    .index("by_snippet", ["snippetId"]),

    // 定义一个名为 stars 的数据表
    stars: defineTable({
        userId: v.id("users"), // 点赞用户的ID
        snippetId: v.id("snippets"), // 被点赞的代码片段ID
    })
    // 通过用户ID快速查找点赞记录
    .index("by_user", ["userId"])
    // 通过代码片段ID快速查找点赞记录
    .index("by_snippet", ["snippetId"])
    // 通过用户ID和代码片段ID快速查找点赞记录
    .index("by_user_and_snippet", ["userId", "snippetId"]),

}) 