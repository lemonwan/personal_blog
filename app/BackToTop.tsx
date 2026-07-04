"use client";

import { useEffect, useState } from "react";

/**
 * 全站浮动回顶按钮 — 环形进度 + 百分比数字
 * 滚动超过 300px 后淡入，点击平滑回顶
 * 悬停时百分比隐藏，显示上箭头
 */
export default function BackToTop() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    function onScroll() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
      setProgress(p);
      setShow(window.scrollY > 300);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pct = Math.round(progress * 100);
  const R = 24;
  const C = 2 * Math.PI * R;
  const dashOffset = C * (1 - progress);

  return (
    <button
      type="button"
      aria-label="回到顶部"
      title="回到顶部"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        right: "24px",
        bottom: "max(28px, env(safe-area-inset-bottom))",
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        background: "rgba(28, 28, 28, 0.55)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxSizing: "border-box",
        padding: 0,
        cursor: "pointer",
        zIndex: 60,
        display: show ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
        opacity: show ? 0.85 : 0,
        transform: show ? "scale(1)" : "scale(0.8)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
      }}
    >
      {/* ── 环形进度条（撑满容器，viewBox 对齐中心 28,28）── */}
      <svg
        viewBox="0 0 56 56"
        style={{
          position: "absolute",
          top: "-1px",    /* 补偿 border，让圆环视觉居中 */
          left: "-1px",
          width: "calc(100% + 2px)",
          height: "calc(100% + 2px)",
          transform: "rotate(-90deg)",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <circle cx="28" cy="28" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
        <circle
          cx="28"
          cy="28"
          r={R}
          fill="none"
          stroke="#FAC94A"
          strokeWidth="2.5"
          strokeDasharray={C}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
      </svg>

      {/* ── 中心内容：百分比 / 上箭头 ── */}
      {hovered ? (
        <svg
          width="20"
          height="20"
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
      ) : (
        <span
          style={{
            position: "relative",
            zIndex: 1,
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: "13px",
            fontWeight: 800,
            color: "#FAC94A",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            display: "flex",
            alignItems: "center",
          }}
        >
          {pct}
          <span style={{ fontSize: "8px", opacity: 0.7, marginLeft: "1px", alignSelf: "flex-start", marginTop: "1px" }}>%</span>
        </span>
      )}
    </button>
  );
}
