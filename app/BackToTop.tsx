"use client";

import { useEffect } from "react";

/**
 * 全局浮动"回到顶部"按钮 + 环形阅读进度
 * - 滚动 > 400px 才淡入显示（短页面不打扰）
 * - 黄色环形进度条随滚动位置填充
 * - safe-area 适配 iPhone 底部
 */
export default function BackToTop() {
  useEffect(() => {
    const btn = document.getElementById("back-to-top") as HTMLElement | null;
    const ring = document.getElementById("progress-ring") as unknown as SVGCircleElement | null;
    const C = 131.95; // 2π·21

    function onScroll() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
      if (ring) ring.style.strokeDashoffset = (C * (1 - p)).toString();
      if (btn) {
        const show = window.scrollY > 400;
        btn.style.display = show ? "inline-flex" : "none";
        btn.style.opacity = show ? "1" : "0";
      }
    }
    function onClick() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    btn?.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      btn?.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <button
      id="back-to-top"
      type="button"
      aria-label="回到顶部"
      title="回到顶部"
      style={{
        position: "fixed",
        right: "20px",
        bottom: "max(88px, calc(env(safe-area-inset-bottom) + 72px))",
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        background: "rgba(28,28,28,0.35)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "none",
        padding: 0,
        cursor: "pointer",
        zIndex: 60,
        display: "none",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
        opacity: 0,
        transition: "opacity 0.2s ease",
      }}
    >
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)", pointerEvents: "none" }}
        aria-hidden="true"
      >
        <circle cx="22" cy="22" r="21" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
        <circle
          id="progress-ring"
          cx="22"
          cy="22"
          r="21"
          fill="none"
          stroke="#FAC94A"
          strokeWidth="2"
          strokeDasharray="131.95"
          strokeDashoffset="131.95"
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
      </svg>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FAC94A"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ position: "relative", zIndex: 1 }}
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
