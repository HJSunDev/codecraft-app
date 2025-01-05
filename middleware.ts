import { clerkMiddleware } from "@clerk/nextjs/server";

// 这个文件用于配置和导出 Clerk 中间件，
// 通过设置匹配规则来决定哪些请求路径需要经过中间件处理。

// 导出 Clerk 中间件
export default clerkMiddleware();

export const config = {
  matcher: [
    // 跳过 Next.js 内部文件和所有静态文件，除非在搜索参数中找到
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // 始终对 API 路由运行
    '/(api|trpc)(.*)',
  ],
};