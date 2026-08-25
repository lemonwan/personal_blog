"use client";

import { useEffect, useRef } from "react";

/*
 * ═══════════════════════════════════════════════════════════
 *  giscus 评论组件（评论数据存入 GitHub Discussions）
 *
 *  ── 一次性配置步骤（只需做一次）──
 *  1. 打开 https://github.com/apps/giscus →「Install」安装到
 *     lemonwan/personal_blog
 *  2. 打开仓库 → Settings → General → Features → 勾选 Discussions
 *  3. 打开 https://giscus.app，在「仓库」填 lemonwan/personal_blog，
 *     下方「启用 giscus」区域会给出三个值：
 *       - data-repo-id        （照抄到 GISCUS.repoId）
 *       - data-category       （照抄到 GISCUS.category）
 *       - data-category-id    （照抄到 GISCUS.categoryId）
 *  4. 填好后重新 `npm run build` 即可生效
 * ═══════════════════════════════════════════════════════════
 */
const GISCUS = {
  repo: "lemonwan/personal_blog",
  repoId: "",            // ← 待填（giscus.app 生成）
  category: "Announcements", // ← 待填（giscus.app 生成，或选 General）
  categoryId: "",        // ← 待填（giscus.app 生成）
};

export default function CommentSection() {
  const ref = useRef<HTMLDivElement>(null);

  // 未填完整配置时，整块评论区不渲染（避免出现空白框）
  const isReady = Boolean(GISCUS.repoId && GISCUS.category && GISCUS.categoryId);

  useEffect(() => {
    const container = ref.current;
    if (!container || !isReady || container.hasChildNodes()) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    script.setAttribute("data-repo", GISCUS.repo);
    script.setAttribute("data-repo-id", GISCUS.repoId);
    script.setAttribute("data-category", GISCUS.category);
    script.setAttribute("data-category-id", GISCUS.categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", "zh-CN");
    script.setAttribute("data-loading", "lazy");

    container.appendChild(script);
  }, [isReady]);

  if (!isReady) return null;

  return (
    <section style={{ marginTop: "56px", paddingTop: "24px", borderTop: "1px solid var(--line)" }}>
      <p className="section-kicker">Comments · 评论</p>
      <div
        style={{
          marginTop: "16px",
          background: "var(--paper-card)",
          border: "2px solid #1C1C1C",
          borderRadius: 0,
          boxShadow: "3px 3px 0 #1C1C1C",
          padding: "20px 22px",
        }}
      >
        <div ref={ref} className="giscus" />
      </div>
    </section>
  );
}