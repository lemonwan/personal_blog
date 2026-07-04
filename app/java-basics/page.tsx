import Link from "next/link";
import { JAVA_ARTICLES, JAVA_VOLUMES, getJavaArticlesByVolume } from "@/lib/content";
import type { Difficulty, InterviewFreq, JavaArticleMeta } from "@/lib/content";

export const metadata = {
  title: "Java 面试笔记 · 系统整理 Java 核心知识",
  description: "系统整理 Java 核心知识，覆盖集合框架、并发编程、JVM、设计模式等高频面试主题。",
};

/* ── 每卷强调色 ── */
const VOL_COLORS: Record<number, string> = {
  1: "#3B82F6", 2: "#EA580C", 3: "#10B981",
  4: "#8B5CF6", 5: "#059669", 6: "#EF4444", 7: "#6366F1",
};

/* ── 难度配色 ── */
const DIFF: Record<Difficulty, { dot: string; label: string }> = {
  初级: { dot: "#66BB6A", label: "初级" },
  中级: { dot: "#FFA726", label: "中级" },
  高级: { dot: "#EF5350", label: "高级" },
  深度: { dot: "#AB47BC", label: "深度" },
};

/* ── 频率样式（重点突出：必问 > 极高 > 其余） ── */
const FREQ = (
  f: InterviewFreq,
): { bg: string; fg: string; icon: string } => {
  switch (f) {
    case "必问":
      return { bg: "#FAC94A", fg: "#1C1C1C", icon: "⭐" };
    case "极高":
      return { bg: "#FFF3E0", fg: "#E65100", icon: "🔥" };
    default:
      return { bg: "#F3F0EA", fg: "#8C8676", icon: "" };
  }
};

export default function JavaBasicsPage() {
  const mustAsk = JAVA_ARTICLES.filter((a) => a.interviewFreq === "必问").length;

  return (
    <div className="ai-llm-scope" style={{ background: "#FFF8F0" }}>
      {/* ═══ Hero（全站统一：金底 + 黑边）═══ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#F4D35E", borderBottom: "3px solid #1C1C1C", padding: "40px 24px 48px" }}
      >
        <div className="pointer-events-none absolute -right-8 -top-8 opacity-10">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-64 w-64 text-[#1C1C1C]" aria-hidden="true">
            <path d="M4 20h16M4 20v-4a2 2 0 012-2h12a2 2 0 012 2v4M12 4v12m-4-4l4 4 4-4" />
          </svg>
        </div>
        <div className="relative max-w-7xl" style={{ margin: "0 auto" }}>
          <div>
            <div style={{ marginBottom: "12px" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-[#1C1C1C]" aria-hidden="true">
                <path d="M4 20h16M4 20v-4a2 2 0 012-2h12a2 2 0 012 2v4M12 4v12m-4-4l4 4 4-4" />
              </svg>
            </div>
            <h1 style={{ fontFamily: "'AlimamaShuHeiTi', sans-serif" }} className="text-4xl font-black text-[#1C1C1C] sm:text-5xl">
              Java 面试笔记，从集合框架到
              <span style={{ marginLeft: "6px", padding: "4px 12px" }} className="inline-block rounded-xl border-2 border-[#1C1C1C] bg-[#1C1C1C] text-[#FAC94A]">JVM 调优</span>
            </h1>
            <p style={{ marginTop: "14px" }} className="max-w-2xl text-base font-semibold text-[#1C1C1C]/60">
              {JAVA_ARTICLES.length} 篇文章系统整理 Java 核心知识。从集合框架到底层 JVM，每篇聚焦一个高频面试主题，配套源码解读与典型例题。
            </p>
          </div>
          <div className="flex flex-wrap gap-3" style={{ marginTop: "32px" }}>
            <Link href={`/java-interview/${encodeURIComponent(JAVA_ARTICLES[0].slug)}/`} className="btn btn-dark" style={{ padding: "10px 24px", color: "#fff" }}>
              从第 1 篇出发 →
            </Link>
            <a href="#index" className="btn btn-white" style={{ padding: "10px 24px" }}>
              浏览全部文章 ↓
            </a>
          </div>
        </div>
      </section>

      {/* ═══ 卷目录索引 — 纯排版，hover 贯通色线 ═══ */}
      <section id="index" style={{ padding: "56px 24px 24px" }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-widest text-[#C2410C]">Contents · 目录</p>
              <h2 style={{ fontFamily: "'AlimamaShuHeiTi', sans-serif" }} className="text-2xl font-black text-[#1C1C1C] mt-1">
                七大主题，{JAVA_ARTICLES.length} 篇精讲
              </h2>
            </div>
            <span className="hidden sm:inline font-mono text-xs font-bold text-[#A09889]">
              {mustAsk} 篇必问 · 持续更新
            </span>
          </div>

          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4">
            {JAVA_VOLUMES.map((vol) => {
              const count = getJavaArticlesByVolume(vol.num).length;
              const c = VOL_COLORS[vol.num];
              return (
                <a
                  key={vol.num}
                  href={`#vol-${vol.num}`}
                  className="jb-vol-item"
                  style={{ padding: "12px 16px 20px" }}
                >
                  <div className="flex items-center gap-3 mb-2.5">
                    <span className="font-mono text-[11px] font-black" style={{ color: "#B0A898" }}>
                      {String(vol.num).padStart(2, "0")}
                    </span>
                    <span style={{ flex: 1, height: 1, background: "#E8E0D0" }} />
                    <span
                      className="font-mono text-[11px] font-black px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: `${c}14`, color: c }}
                    >
                      {count} 篇
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span style={{ fontSize: "1.5rem", lineHeight: 1, marginTop: 2 }}>{vol.emoji}</span>
                    <div>
                      <h3 className="jb-vol-title text-[15px] font-black text-[#1C1C1C] leading-tight transition-colors duration-150">
                        {vol.title}
                      </h3>
                      <p className="text-[11px] font-medium text-[#A09889] mt-0.5" style={{ lineHeight: 1.4 }}>
                        {vol.subtitle}
                      </p>
                    </div>
                  </div>
                  {/* 底部色线 — hover 时贯通至 100% */}
                  <div className="jb-vol-line" style={{ marginTop: 14, height: 2, width: "40%", background: c, borderRadius: 1, opacity: 0.3 }} />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 装饰分隔线 ═══ */}
      <div className="mx-auto max-w-5xl" style={{ padding: "0 24px" }}>
        <div style={{ height: 1, background: "linear-gradient(90deg, #E8E0D0 0%, #FAC94A 50%, #E8E0D0 100%)", opacity: 0.5 }} />
      </div>

      {/* ═══ 逐卷展开 ═══ */}
      <div className="mx-auto max-w-5xl" style={{ padding: "40px 24px 72px" }}>
        {JAVA_VOLUMES.map((vol) => {
          const articles = getJavaArticlesByVolume(vol.num);
          const c = VOL_COLORS[vol.num];
          return (
            <section key={vol.num} id={`vol-${vol.num}`} style={{ marginBottom: "56px", scrollMarginTop: "56px" }}>
              {/* ── 卷标题 ── */}
              <div style={{ marginBottom: "22px" }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-[10px] font-black text-[#B0A898] tracking-wider">
                    VOL.{String(vol.num).padStart(2, "0")}
                  </span>
                  <span style={{ width: 16, height: 1, background: "#D8D0C0" }} />
                  <span className="font-mono text-[10px] font-black uppercase tracking-widest" style={{ color: c }}>
                    {getRoman(vol.num)}
                  </span>
                </div>
                <div className="flex items-start gap-4">
                  {/* Emoji 圆底 */}
                  <span
                    style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: `${c}12`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.6rem", flexShrink: 0,
                    }}
                  >
                    {vol.emoji}
                  </span>
                  <div className="flex-1">
                    <h2
                      className="font-black text-[#1C1C1C]"
                      style={{ fontFamily: "'AlimamaShuHeiTi', sans-serif", fontSize: "1.5rem", lineHeight: 1.2 }}
                    >
                      {vol.title}
                    </h2>
                    <p className="text-[13px] font-bold mt-0.5" style={{ color: c }}>{vol.subtitle}</p>
                  </div>
                  <span className="font-mono text-[11px] font-black flex-shrink-0 self-center px-2.5 py-1 rounded-full" style={{ background: `${c}10`, color: c }}>
                    {articles.length}
                  </span>
                </div>
                <p className="text-[13px] text-[#8C8676] leading-relaxed mt-2.5" style={{ paddingLeft: "64px" }}>
                  {vol.desc}
                </p>
                {/* 卷色分隔线 */}
                <div style={{ marginTop: 16, height: 2, width: "100%", background: `linear-gradient(90deg, ${c}30 0%, ${c}08 100%)`, borderRadius: 1 }} />
              </div>

              {/* ── 文章列表 ── */}
              {articles.map((article) => (
                <ArticleRow key={article.slug} article={article} />
              ))}
            </section>
          );
        })}
      </div>

      {/* ═══ CTA ═══ */}
      <section
        className="text-center"
        style={{ padding: "60px 24px", borderTop: "3px solid #FAC94A", background: "#1C1C1C" }}
      >
        <p className="text-[#FAC94A] font-black text-lg mb-4">☕ 开始你的 Java 进阶之旅！</p>
        <p className="text-white/50 text-sm max-w-md mx-auto mb-8">
          建议从集合框架开始，这是所有 Java 开发者的基本功。掌握底层原理，面试和工作都能游刃有余。
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 text-sm font-black text-white hover:border-[#FAC94A] hover:text-[#FAC94A] transition-all"
          >
            返回首页
          </a>
          <Link
            href={`/java-interview/${encodeURIComponent(JAVA_ARTICLES[0].slug)}/`}
            className="btn btn-dark"
            style={{ padding: "12px 28px", color: "#fff" }}
          >
            开始学习 →
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ArticleRow — 频率为主导视觉元素
   · 左侧大号频率徽章（必问=金底⭐、极高=橙底🔥）
   · 右侧标题 + 难度 + 描述 + 标签
   · Hover: 左指示条生长 + 暖色背景 + 徽章放大
   · 底部分割线（hover 时左端缩进回正）
   ═══════════════════════════════════════════════════ */
function ArticleRow({ article }: { article: JavaArticleMeta }) {
  const freq = FREQ(article.interviewFreq);
  const diff = DIFF[article.difficulty];

  return (
    <Link
      href={`/java-interview/${encodeURIComponent(article.slug)}/`}
      className="jb-row-link"
    >
      <div style={{ display: "flex", gap: 16, padding: "14px 16px 14px 18px", alignItems: "flex-start" }}>
        {/* ═══ 左侧：频率徽章 ═══ */}
        <div style={{ flexShrink: 0, paddingTop: 2, minWidth: 58 }}>
          <span
            className="jb-freq-badge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              padding: "5px 10px",
              borderRadius: 8,
              background: freq.bg,
              color: freq.fg,
              fontWeight: 900,
              fontSize: 13,
              lineHeight: 1,
              letterSpacing: "0.01em",
            }}
          >
            {freq.icon && <span style={{ fontSize: 12 }}>{freq.icon}</span>}
            {article.interviewFreq}
          </span>
        </div>

        {/* ═══ 右侧：内容 ═══ */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* 首行：编号 + 标题 + 难度 */}
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <span className="font-mono text-[11px] font-black flex-shrink-0" style={{ color: "#C5B99B" }}>
              {String(article.lessonNum).padStart(2, "0")}
            </span>
            <h3
              className="jb-row-title text-[15px] font-bold leading-snug text-[#1C1C1C] transition-colors duration-150"
              style={{ flex: "1 1 0", minWidth: 0 }}
            >
              {article.title}
            </h3>
            <span
              className="inline-flex items-center gap-1 text-[11px] font-bold flex-shrink-0"
              style={{ color: diff.dot, whiteSpace: "nowrap" }}
            >
              <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ background: diff.dot }} />
              {diff.label}
            </span>
          </div>

          {/* 描述 */}
          <p className="text-[13px] leading-relaxed mt-1" style={{ color: "#A09889", margin: 0 }}>
            {article.desc}
          </p>

          {/* 标签 */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5">
            {article.tags.map((t) => (
              <span key={t} className="text-[10.5px] font-medium" style={{ color: "#C5B99B" }}>
                #{t}
              </span>
            ))}
            {article.interviewFreq === "必问" && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold" style={{ color: "#C2410C" }}>
                <span>◉</span> 重点掌握
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function getRoman(n: number): string {
  return ["", "I", "II", "III", "IV", "V", "VI", "VII"][n] || String(n);
}
