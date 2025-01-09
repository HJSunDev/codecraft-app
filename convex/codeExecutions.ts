import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { Doc, Id } from "./_generated/dataModel";
import { MutationCtx, QueryCtx } from "./_generated/server";

// 语言使用统计接口
interface LanguageStats {
  [key: string]: number;
}

// 用户统计信息接口
interface UserStats {
  totalExecutions: number; // 总执行次数
  languagesCount: number; // 使用的编程语言数量
  languages: string[]; // 使用的编程语言列表
  last24Hours: number; // 最近24小时的执行次数
  favoriteLanguage: string; // 最喜欢的编程语言
  languageStats: LanguageStats; // 编程语言使用统计
  mostStarredLanguage: string; // 最多星标的编程语言
}

// 数据库查询工具类
class DatabaseQueries {
  // 通过用户ID查询用户
  static async getUserByUserId(ctx: QueryCtx | MutationCtx, userId: string) {
    return await ctx.db
      .query("users")
      .withIndex("by_user")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
  }

  // 获取用户的代码执行记录
  static async getExecutionsByUserId(ctx: QueryCtx | MutationCtx, userId: string) {
    return await ctx.db
      .query("codeExecutions")
      .withIndex("by_user")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  }

  // 获取用户的星标记录
  static async getStarsByUserId(ctx: QueryCtx | MutationCtx, userId: string) {
    return await ctx.db
      .query("stars")
      .withIndex("by_user")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  }
}

// 工具函数
class StatsCalculator {
  // 计算最近24小时的执行次数
  static getLast24HoursCount(executions: Doc<"codeExecutions">[]): number {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return executions.filter(e => e._creationTime > oneDayAgo).length;
  }

  // 计算语言使用统计
  static getLanguageStats(executions: Doc<"codeExecutions">[]): LanguageStats {
    return executions.reduce((acc, curr) => ({
      ...acc,
      [curr.language]: (acc[curr.language] || 0) + 1
    }), {} as LanguageStats);
  }

  // 获取最喜欢的语言
  static getFavoriteLanguage(stats: LanguageStats): string {
    const languages = Object.keys(stats);
    return languages.length
      ? languages.reduce((a, b) => (stats[a] > stats[b] ? a : b))
      : "N/A";
  }

  // 计算最多星标的语言
  static getMostStarredLanguage(snippets: (Doc<"snippets"> | null)[]): string {
    const stats = snippets
      .filter(Boolean)
      .reduce((acc, curr) => {
        if (curr?.language) {
          acc[curr.language] = (acc[curr.language] || 0) + 1;
        }
        return acc;
      }, {} as LanguageStats);

    const entries = Object.entries(stats);
    return entries.length ? entries.sort(([, a], [, b]) => b - a)[0][0] : "N/A";
  }
}

// 用户身份验证和权限检查中间件
class AuthMiddleware {
  // 验证用户身份，确保用户已登录
  static async validateUser(ctx: QueryCtx | MutationCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("未经身份验证");
    }
    return identity;
  }

  // 验证用户是否有专业版访问权限
  static async validateProAccess(ctx: QueryCtx | MutationCtx, identity: { subject: string }, language: string) {
    // JavaScript 对所有用户开放
    if (language === "javascript") return;

    // 获取用户信息
    const user = await DatabaseQueries.getUserByUserId(ctx, identity.subject);

    // 检查用户是否为专业版用户
    if (!user?.isPro) {
      throw new ConvexError("需要专业版订阅才能使用此语言");
    }
  }
}

// 保存代码执行记录的API接口
export const saveExecution = mutation({
  args: {
    language: v.string(), // 代码语言
    code: v.string(), // 代码内容
    output: v.optional(v.string()), // 可选的执行输出
    error: v.optional(v.string()), // 可选的错误信息
  },
  handler: async (ctx, args) => {
    // 验证用户身份以确保请求者已登录
    const identity = await AuthMiddleware.validateUser(ctx);
    
    // 验证用户是否有专业版访问权限
    // await AuthMiddleware.validateProAccess(ctx, identity, args.language);

    // 将执行记录保存到数据库中
    await ctx.db.insert("codeExecutions", {
      ...args,
      userId: identity.subject, // 记录执行者的用户ID
    });
  },
});

// 获取用户代码执行记录的API接口
export const getUserExecutions = query({
  args: {
    userId: v.string(), // 用户ID
    paginationOpts: paginationOptsValidator, // 分页选项
  },
  handler: async (ctx, args) => {
    // 查询并返回用户的代码执行记录，按时间降序排列并分页
    return await ctx.db
      .query("codeExecutions")
      .withIndex("by_user")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

// 获取用户统计信息的API接口
export const getUserStats = query({
  args: { userId: v.string() }, // 用户ID
  handler: async (ctx, args) => {
    // 获取用户的所有代码执行记录
    const executions = await DatabaseQueries.getExecutionsByUserId(ctx, args.userId);

    // 获取用户的所有星标代码片段
    const starredSnippets = await DatabaseQueries.getStarsByUserId(ctx, args.userId);

    // 获取星标代码片段的详细信息
    const snippetIds = starredSnippets.map((star: Doc<"stars">) => star.snippetId);
    const snippetDetails = await Promise.all(
      snippetIds.map((id: Id<"snippets">) => ctx.db.get(id))
    );

    // 计算用户的代码语言使用统计数据
    const languageStats = StatsCalculator.getLanguageStats(executions);
    const languages = Object.keys(languageStats);

    // 构建用户统计信息对象
    const stats: UserStats = {
      totalExecutions: executions.length, // 总执行次数
      languagesCount: languages.length, // 使用过的语言数量
      languages, // 使用过的语言列表
      last24Hours: StatsCalculator.getLast24HoursCount(executions), // 最近24小时的执行次数
      favoriteLanguage: StatsCalculator.getFavoriteLanguage(languageStats), // 最常用的语言
      languageStats, // 语言使用统计
      mostStarredLanguage: StatsCalculator.getMostStarredLanguage(snippetDetails), // 最多星标的语言
    };

    return stats; // 返回用户统计信息
  },
}); 