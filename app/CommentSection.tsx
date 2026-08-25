"use client";

import { useEffect, useRef } from "react";

/*
 * ═══════════════════════════════════════════════════════════
 *  giscus 评论组件（评论数据存入 GitHub Discussions）
 *  - repo 需为公开仓库
 *  - 修改配置后需 `npm run build` 重新生成静态站
 *  - 通过 data-mapping="pathname" 自动为每篇文章创建独立讨论线程
 *     （Java 笔记、React 笔记等所有详情页通用）
 * ═══════════════════════════════════════════════════════════
 */
const GISCUS = {
  repo: "lemonwan/personal_blog",
  repoId: "R_kgDOTJWZuw",
  category: "General",
  categoryId: "DIC_kwDOTJWZu84DEIde",
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