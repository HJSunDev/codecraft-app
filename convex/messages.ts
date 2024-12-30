import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { api } from "./_generated/api";

/**
 * Svix 是 Clerk 官方使用的 Webhook 提供商和验证服务。
 * 
 * 工作流程：
 * 1. 当 Clerk 中发生用户相关事件（如用户注册）时，Clerk 使用 Svix 发送 Webhook
 * 2. Svix 为每个 Webhook 请求生成加密签名，包含：
 *    - svix-id：唯一请求标识
 *    - svix-timestamp：请求时间戳
 *    - svix-signature：使用 CLERK_WEBHOOK_SECRET 生成的 HMAC 签名
 * 3. 我们的服务器使用相同的 secret 验证签名，确保：
 *    - 请求确实来自 Clerk
 *    - 请求未被篡改
 *    - 防止重放攻击
 * 
 * 参考：
 * - Clerk Webhooks: https://clerk.com/docs/integration/webhooks
 * - Svix 官方文档: https://docs.svix.com
 */
export const clerkWebhook = httpAction(async (ctx, request) => {

  // 从convex服务端环境变量中获取 Clerk 的 Webhook 秘钥
  const clerkWebhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  // 如果没有设置 Webhook 秘钥，则抛出错误
  if(!clerkWebhookSecret){
    throw new Error("CLERK_WEBHOOK_SECRET is not set");
  }

  // 从请求头中获取 Svix 验证所需的标识、时间戳和签名
  const svix_id = request.headers.get("svix-id");
  const svix_timestamp = request.headers.get("svix-timestamp");
  const svix_signature = request.headers.get("svix-signature");

  // 如果缺少任何一个 Svix 验证所需的参数，则抛出错误
  if(!svix_id || !svix_timestamp || !svix_signature){
    throw new Error("svix-id, svix-timestamp, svix-signature are required");
  }

  // 获取请求的 JSON 负载并将其转换为字符串格式
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // 使用 Clerk Webhook 秘钥创建一个新的 Webhook 实例
  const webhook = new Webhook(clerkWebhookSecret)
  let evt: WebhookEvent;
  try{
    // 验证 Webhook 请求的有效性
    evt = webhook.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  }catch (err) {
    // 如果验证失败，返回 400 错误响应
    return new Response("Error verifying webhook", {
      status: 400,
    });
  }

  // 获取事件类型
  const eventType = evt.type;

  // 如果事件类型是用户创建
  if(eventType === "user.created"){
    // 从事件数据中提取用户信息
    const {id, email_addresses, first_name, last_name, username} = evt.data;

    // 获取用户的电子邮件地址
    const email = email_addresses[0].email_address;

    // 优先使用 first_name 和 last_name 组合，如果都为空则使用 username 或 email 的本地部分
    const fullName = `${first_name || ''} ${last_name || ''}`.trim();
    const name = fullName || username || email.split('@')[0];
    
    try{
      // 调用创建用户的 mutation
      await ctx.runMutation(api.users.createUser, {
        userId: id,
        email: email,
        name: name,
      });
    }catch (err) {
      // 如果创建用户失败，返回 500 错误响应
      return new Response("Error creating user", {
        status: 500,
      });
    }
  }

  // 返回 200 响应，表示 Webhook 已成功接收
  return new Response("Webhook received", {
    status: 200,
  });
});