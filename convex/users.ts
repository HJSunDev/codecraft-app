import { v } from "convex/values";
import { mutation } from "./_generated/server";


// 定义一个创建用户的 mutation
export const createUser = mutation({
  // 定义 mutation 的参数
  args: {
    userId: v.string(), // 用户ID，字符串类型
    email: v.string(), // 用户电子邮件，字符串类型
    name: v.string(), // 用户姓名，字符串类型
  },
  // 定义 mutation 的处理函数
  handler: async (ctx, args) => {
    // 查询数据库中是否已存在具有相同 userId 的用户
    const existingUser = await ctx.db.query("users").filter((q) => q.eq(q.field("userId"), args.userId)).first();
    // 如果用户已存在，则抛出错误
    if(existingUser){
      throw new Error("User already exists");
    }
    // 如果用户不存在，则在数据库中插入新用户记录
    await ctx.db.insert("users", {
      ...args, // 使用传入的参数
      isPro: false, // 默认设置用户为非专业版
    });
  },
});
