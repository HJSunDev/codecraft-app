import { httpRouter } from "convex/server";
import { clerkWebhook } from "./messages";

// 创建一个HTTP路由器实例
const http = httpRouter();

// 定义一个路由来处理Clerk Webhook
http.route({
  path: "/clerk-webhook", // 路由路径
  method: "POST", // HTTP方法
  handler: clerkWebhook, // 处理函数
});

// 导出HTTP路由器实例
export default http;