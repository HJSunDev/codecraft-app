"use client";

import { useEffect, useState } from "react";

// 自定义 Hook：用于检测组件是否已挂载
const useMounted = () => {
  // 定义状态变量 mounted，初始值为 false
  const [mounted, setMounted] = useState(false);

  // 使用 useEffect 在组件挂载后更新 mounted 状态
  useEffect(() => {
    setMounted(true);
  }, []);

  // 返回 mounted 状态
  return mounted;
};

export default useMounted; 