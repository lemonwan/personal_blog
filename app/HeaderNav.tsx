"use client";

import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  match: (p: string) => boolean;
  icon?: boolean;
}

const LINKS: NavItem[] = [
  { href: "/", label: "首页", match: (p: string) => p === "/" },
  { href: "/ai-llm/", label: "LLM笔记", match: (p: string) => p.startsWith("/ai-llm") },
  { href: "/java-basics/", label: "Java笔记", match: (p: string) => p.startsWith("/java-basics") || p.startsWith("/java-interview") },
  { href: "/react-notes/", label: "React笔记", match: (p: string) => p.startsWith("/react-notes") },
  { href: "/about/", label: "关于我", match: (p: string) => p.startsWith("/about") },
];

const SEARCH_LINK: NavItem = { href: "/search/", label: "搜索", match: (p: string) => p.startsWith("/search"), icon: true };

export default function HeaderNav() {
  const raw = usePathname() || "/";
  // 归一化：去掉可能存在的尾部斜杠（除了根路径）
  const pathname = raw.length > 1 && raw.endsWith("/") ? raw.slice(0, -1) : raw;

  const renderLink = (l: NavItem, active: boolean) => (
    <a
      key={l.href}
      href={l.href}
      className={
        "flex flex-col whitespace-nowrap text-xs sm:text-sm font-black transition-colors " +
        (active
          ? "text-[#FAC94A]"
          : "text-white/70 hover:text-white")
      }
      aria-current={active ? "page" : undefined}
    >
      <span className="flex items-center gap-1">
        {l.icon && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="h-3 w-3"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        )}
        {l.label}
      </span>
      <span
        className={"mt-1 h-0.5 w-full rounded-full transition-colors " + (active ? "bg-[#FAC94A]" : "bg-transparent")}
        aria-hidden="true"
      />
    </a>
  );

  return (
    <nav className="flex flex-1 items-center justify-between gap-3 min-w-0">
      {/* 前 5 个 tab：紧贴左侧头像 */}
      <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar min-w-0">
        {LINKS.map((l) => renderLink(l, l.match(pathname)))}
      </div>
      {/* 搜索：保持固定在最右 */}
      {renderLink(SEARCH_LINK, SEARCH_LINK.match(pathname))}
    </nav>
  );
}
