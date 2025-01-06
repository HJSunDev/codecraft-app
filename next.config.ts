import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  // 忽略 ColorZilla 扩展导致的水合错误
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default config;
