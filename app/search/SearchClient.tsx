"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

interface SearchDoc {
  title: string;
  url: string;
  section: string;
  meta: string;
  desc: string;
  tags: string[];
  body: string;
}

interface LoadedIndex {
  docs: SearchDoc[];
  /** 预先用 toLowerCase 生成的检索字段（长度与原文一致，可直接用下标取摘要） */
  lc: { title: string; tags: string; desc: string; body: string }[];
}

type Status = "loading" | "ready" | "error";

const SECTION_STYLE: Record<string, { bg: string; color: string }> = {
  "LLM 笔记": { bg: "var(--brand)", color: "var(--ink)" },
  "Java 笔记": { bg: "var(--accent-wash)", color: "var(--accent-deep)" },
  "React 笔记": { bg: "var(--paper-deep)", color: "var(--ink-soft)" },
  生活: { bg: "#DCFCE7", color: "#166534" },
};

const MAX_RESULTS = 50;

/** 热门关键词（点击直接检索） */
const HOT_KEYWORDS = ["HashMap", "线程池", "JVM", "注意力机制", "useEffect", "Redis", "volatile", "Transformer"];

function countOccurrences(hay: string, needle: string, cap = 8): number {
  let n = 0;
  let i = hay.indexOf(needle);
  while (i !== -1 && n < cap) {
    n++;
    i = hay.indexOf(needle, i + needle.length);
  }
  return n;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** 把纯文本按命中词拆分并高亮（奇数下标片段即命中词） */
function highlight(text: string, terms: string[]): React.ReactNode[] {
  if (!terms.length) return [text];
  const re = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  return text.split(re).map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} style={{ background: "var(--brand)", color: "var(--ink)", borderRadius: "3px", padding: "0 1px" }}>
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function SearchClient() {
  const params = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const initialQ = params.get("q") || "";
  const [status, setStatus] = useState<Status>("loading");
  const [index, setIndex] = useState<LoadedIndex | null>(null);
  const [query, setQuery] = useState(initialQ);
  const [searched, setSearched] = useState(initialQ.trim()); // 实际参与检索的词（防抖后）
  const [slowHint, setSlowHint] = useState(false);
  const [attempt, setAttempt] = useState(0);

  /* ── 加载索引（搜索页被访问时才拉取一次；dev 模式首次访问会在服务端现编译路由，可能较慢） ── */
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    // dev 首次访问该路由需要服务端现编译，给足 30s；超时/失败都可通过「重试」恢复，避免永远停在加载态
    const timer = setTimeout(() => controller.abort(), 30000);
    const slowTimer = setTimeout(() => {
      if (!cancelled) setSlowHint(true);
    }, 4000);
    fetch("/search-index.json", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<SearchDoc[]>;
      })
      .then((docs) => {
        if (cancelled) return;
        setIndex({
          docs,
          lc: docs.map((d) => ({
            title: d.title.toLowerCase(),
            tags: d.tags.join(" ").toLowerCase(),
            desc: d.desc.toLowerCase(),
            body: d.body.toLowerCase(),
          })),
        });
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      })
      .finally(() => {
        clearTimeout(timer);
        clearTimeout(slowTimer);
      });
    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearTimeout(slowTimer);
      controller.abort();
    };
  }, [attempt]);

  const retry = () => {
    setStatus("loading");
    setSlowHint(false);
    setAttempt((a) => a + 1);
  };

  /* ── 输入防抖 → 触发检索 + 同步 ?q= 到地址栏 ── */
  useEffect(() => {
    const t = setTimeout(() => setSearched(query.trim()), 150);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const url = searched ? `?q=${encodeURIComponent(searched)}` : "";
    window.history.replaceState(null, "", window.location.pathname + url);
  }, [searched]);

  /* ── 快捷键：⌘K / Ctrl+K 聚焦输入框 ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── 检索：多关键词 AND，按 命中位置加权打分 ── */
  const results = useMemo(() => {
    const terms = searched.toLowerCase().split(/\s+/).filter(Boolean);
    if (!index || !terms.length) return null;

    const scored: { doc: SearchDoc; score: number; bodyPos: number }[] = [];
    for (let i = 0; i < index.docs.length; i++) {
      const doc = index.docs[i];
      const f = index.lc[i];
      let score = 0;
      let bodyPos = -1;
      let allMatched = true;
      for (const t of terms) {
        const cTitle = countOccurrences(f.title, t);
        const cTags = countOccurrences(f.tags, t);
        const cDesc = countOccurrences(f.desc, t);
        const cBody = countOccurrences(f.body, t);
        if (!cTitle && !cTags && !cDesc && !cBody) {
          allMatched = false;
          break;
        }
        score += cTitle * 120 + (cTitle ? 40 : 0) + cTags * 50 + cDesc * 15 + cBody * 2;
        if (bodyPos === -1 && cBody) bodyPos = f.body.indexOf(t);
      }
      if (allMatched) scored.push({ doc, score, bodyPos });
    }
    scored.sort((a, b) => b.score - a.score);
    return { terms, list: scored.slice(0, MAX_RESULTS), total: scored.length };
  }, [index, searched]);

  /* ── 从正文提取命中片段 ── */
  function snippetFor(doc: SearchDoc, bodyPos: number): string {
    if (bodyPos < 0) return doc.desc;
    const start = Math.max(0, bodyPos - 60);
    const end = Math.min(doc.body.length, bodyPos + 180);
    return (start > 0 ? "…" : "") + doc.body.slice(start, end).trim() + (end < doc.body.length ? "…" : "");
  }

  return (
    <div>
      {/* ── 输入框：neo-brutalism 硬阴影 ── */}
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ width: 20, height: 20, color: "var(--ink-faint)" }}
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索标题、标签或正文……"
          aria-label="搜索文章"
          className="w-full rounded-xl bg-white py-4 pl-12 pr-16 text-base font-semibold outline-none transition-shadow"
          style={{
            border: "3px solid var(--ink)",
            boxShadow: "4px 4px 0 var(--ink)",
            color: "var(--ink)",
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "4px 4px 0 var(--brand)")}
          onBlur={(e) => (e.currentTarget.style.boxShadow = "4px 4px 0 var(--ink)")}
        />
        <kbd
          className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-md px-2 py-1 font-mono text-[11px] font-bold sm:block"
          style={{ background: "var(--paper-deep)", color: "var(--ink-faint)", border: "1px solid var(--line)" }}
        >
          ⌘K
        </kbd>
      </div>

      {/* ── 状态区 ── */}
      {status === "loading" && (
        <p className="mt-5 text-sm font-semibold" style={{ color: "var(--ink-faint)" }}>
          索引加载中……
          {slowHint && <span className="ml-2">首次访问需要生成索引，可能需要十几秒，请稍候。</span>}
        </p>
      )}
      {status === "error" && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <p className="text-sm font-semibold" style={{ color: "var(--accent-deep)" }}>
            索引加载失败。
          </p>
          <button
            type="button"
            onClick={retry}
            className="chip chip-go"
            style={{ background: "var(--brand)", border: "2px solid var(--ink)", color: "var(--ink)" }}
          >
            重试
          </button>
        </div>
      )}
      {status === "ready" && index && (
        <p className="mt-5 font-mono text-xs font-bold" style={{ color: "var(--ink-faint)", letterSpacing: "0.08em" }}>
          已收录 {index.docs.length} 篇文章 · 支持 Ctrl / ⌘ + K 快速唤起
        </p>
      )}

      {/* ── 空态：热门关键词 ── */}
      {status === "ready" && !searched && (
        <div className="mt-10">
          <p className="mb-3 font-mono text-xs font-bold uppercase" style={{ letterSpacing: "0.2em", color: "var(--ink-faint)" }}>
            热门搜索
          </p>
          <div className="flex flex-wrap gap-2">
            {HOT_KEYWORDS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setQuery(k);
                  inputRef.current?.focus();
                }}
                className="chip chip-go"
                style={{ background: "var(--paper-card)", border: "2px solid var(--ink)", color: "var(--ink)" }}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── 结果 ── */}
      {results && searched && (
        <>
          <p className="mt-8 mb-4 text-sm font-bold" style={{ color: "var(--ink-soft)" }}>
            共 {results.total} 条与「{searched}」相关的结果
            {results.total > MAX_RESULTS ? `（显示前 ${MAX_RESULTS} 条）` : ""}
          </p>

          {results.list.length === 0 ? (
            <div
              className="rounded-xl p-8 text-center"
              style={{ background: "var(--paper-card)", border: "2px dashed var(--ink-faint)" }}
            >
              <p className="text-base font-black" style={{ color: "var(--ink)" }}>
                没有找到与「{searched}」相关的内容
              </p>
              <p className="mt-2 text-sm" style={{ color: "var(--ink-faint)" }}>
                换个关键词试试，或使用文章中的英文术语（如 HashMap、useEffect）。
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {results.list.map(({ doc, bodyPos }) => {
                const sec = SECTION_STYLE[doc.section] ?? { bg: "var(--paper-deep)", color: "var(--ink-soft)" };
                const snippet = snippetFor(doc, bodyPos);
                return (
                  <li key={doc.url}>
                    <a
                      href={doc.url}
                      className="block rounded-xl p-5 transition-transform hover:-translate-y-0.5"
                      style={{
                        background: "var(--paper-card)",
                        border: "2px solid var(--ink)",
                        boxShadow: "3px 3px 0 var(--ink)",
                        textDecoration: "none",
                      }}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="rounded-full px-3 py-0.5 font-mono text-[11px] font-bold"
                          style={{ background: sec.bg, color: sec.color }}
                        >
                          {doc.section}
                        </span>
                        <span className="font-mono text-[11px] font-bold" style={{ color: "var(--ink-faint)", letterSpacing: "0.08em" }}>
                          {doc.meta}
                        </span>
                      </div>
                      <h2
                        className="mt-2 text-lg font-black leading-snug"
                        style={{ color: "var(--ink)", fontFamily: "'AlimamaShuHeiTi', sans-serif", wordBreak: "break-word" }}
                      >
                        {highlight(doc.title, results.terms)}
                      </h2>
                      <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--ink-soft)", wordBreak: "break-word" }}>
                        {highlight(snippet, results.terms)}
                      </p>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
