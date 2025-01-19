"use client";

export const EditorPanelSkeleton = () => {
  return (
    <div className="w-full h-full bg-[#1e1e2e] rounded-lg animate-pulse">
      {/* 模拟代码行 */}
      <div className="p-4 space-y-3">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gray-700/50 rounded"
            style={{
              width: `${Math.random() * 60 + 20}%`,
              opacity: 1 - i * 0.05,
            }}
          />
        ))}
      </div>
    </div>
  );
}; 