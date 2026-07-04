"use client";

import { useEffect, useState } from "react";

/**
 * 阅读进度条 — 固定在顶部 header 下方，随滚动填充宽度
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="reading-bar"
      style={{
        position: "fixed",
        top: "64px",
        left: 0,
        right: 0,
        height: "3px",
        background: "var(--line)",
        zIndex: 40,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "var(--accent)",
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
}
