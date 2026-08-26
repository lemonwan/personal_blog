"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; title: string };

/**
 * 文章右侧大纲（scroll-spy）
 * - 服务端从正文 .station 结构提取 id + 标题后传入
 * - 滚动时高亮当前所在小节
 * - 点击平滑滚动到对应小节（顶部固定 header 已用 scroll-margin-top 预留）
 */
export default function ArticleToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (!items.length) return;

    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el != null);

    function onScroll() {
      let current = items[0]?.id ?? "";
      const offset = 96; // 64px header + 呼吸空间
      for (const el of els) {
        if (el.getBoundingClientRect().top - offset <= 0) {
          current = el.id;
        } else {
          break;
        }
      }
      // 滚到底部时强制高亮最后一节
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = items[items.length - 1]?.id ?? current;
      }
      setActive(current);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!items.length) return null;

  return (
    <aside className="article-toc">
      <nav className="article-toc-inner" aria-label="本文目录">
        <div className="article-toc-title">ON THIS PAGE · 本文目录</div>
        <ul className="article-toc-list">
          {items.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={active === item.id ? "active" : ""}
                onClick={(e) => handleClick(e, item.id)}
                aria-current={active === item.id ? "location" : undefined}
              >
                <span className="article-toc-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="article-toc-text">{item.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}