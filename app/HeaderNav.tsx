"use client";

import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "首页", match: (p: string) => p === "/" },
  { href: "/ai-llm/", label: "LLM 笔记", match: (p: string) => p.startsWith("/ai-llm") },
  { href: "/java-basics/", label: "Java 笔记", match: (p: string) => p.startsWith("/java-basics") || p.startsWith("/java-interview") },
];

export default function HeaderNav() {
  const raw = usePathname() || "/";
  // 归一化：去掉可能存在的尾部斜杠（除了根路径）
  const pathname = raw.length > 1 && raw.endsWith("/") ? raw.slice(0, -1) : raw;

  return (
    <nav className="flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar">
      {LINKS.map((l) => {
        const active = l.match(pathname);
        return (
          <a
            key={l.href}
            href={l.href}
            className={
              "whitespace-nowrap text-xs sm:text-sm font-semibold transition-colors " +
              (active
                ? "text-[#FAC94A]"
                : "text-white/60 hover:text-white")
            }
            aria-current={active ? "page" : undefined}
          >
            {l.label}
          </a>
        );
      })}
    </nav>
  );
}
