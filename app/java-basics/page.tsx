import Link from "next/link";
import { JAVA_ARTICLES, JAVA_VOLUMES, getJavaArticlesByVolume } from "@/lib/content";
import type { JavaArticleMeta } from "@/lib/content";

export const metadata = {
  title: "Java 面试笔记 · 系统整理 Java 核心知识",
  description: "系统整理 Java 核心知识，覆盖集合框架、并发编程、JVM、设计模式等高频面试主题。",
};

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII"];

export default function JavaBasicsPage() {
  const mustAsk = JAVA_ARTICLES.filter((a) => a.interviewFreq === "必问").length;

  return (
    <div className="ai-llm-scope" style={{ background: "#FFF8F0" }}>
      {/* ═══ Hero ═══ */}
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
            <a href="#toc" className="btn btn-white" style={{ padding: "10px 24px" }}>
              浏览目录 ↓
            </a>
          </div>
        </div>
      </section>

      {/* ═══ 目录 ═══ */}
      <section id="toc" className="jb-toc-section" style={{ scrollMarginTop: "24px" }}>
        <div className="mx-auto jb-toc-inner" style={{ maxWidth: 720 }}>

          {/* 目录标题 */}
          <div
            className="flex items-baseline justify-between"
            style={{ paddingBottom: 20, borderBottom: "2px solid #1C1C1C", marginBottom: 48 }}
          >
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-widest text-[#C2410C]">
                Contents
              </p>
              <h2
                style={{ fontFamily: "'AlimamaShuHeiTi', sans-serif" }}
                className="text-3xl font-black text-[#1C1C1C] mt-1"
              >
                目录
              </h2>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs font-black text-[#8C8676] tracking-wider">
                {JAVA_ARTICLES.length} 篇 · {mustAsk} 必问
              </p>
            </div>
          </div>

          {/* 卷列表 */}
          {JAVA_VOLUMES.map((vol, idx) => {
            const articles = getJavaArticlesByVolume(vol.num);
            if (!articles.length) return null;
            return (
              <section
                key={vol.num}
                id={`vol-${vol.num}`}
                style={{
                  scrollMarginTop: 24,
                  marginTop: idx === 0 ? 0 : 72,
                }}
              >
                {/* 卷标 · 极简 */}
                <div className="jb-toc-vol-head">
                  <span
                    className="font-mono font-black jb-toc-vol-num"
                    style={{
                      color: "#C2410C",
                      letterSpacing: "0.12em",
                      flexShrink: 0,
                    }}
                  >
                    {ROMAN[vol.num]}
                  </span>
                  <h3
                    className="font-black text-[#1C1C1C] jb-toc-vol-title"
                    style={{
                      fontFamily: "'AlimamaShuHeiTi', sans-serif",
                      lineHeight: 1.2,
                      letterSpacing: "0.02em",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {vol.title}
                  </h3>
                  <span
                    className="font-mono font-black text-[#8C8676] jb-toc-vol-count"
                    style={{ flexShrink: 0 }}
                  >
                    {articles.length}
                  </span>
                </div>

                {/* 文章列表 · 一行一篇 */}
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {articles.map((a) => (
                    <li key={a.slug}>
                      <TocRow article={a} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </section>

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

/* ═══════════════════════════════════════════════
   TocRow — 目录一行
   [编号] [标题, 中缀虚点线, 必问金字]
   ═══════════════════════════════════════════════ */
function TocRow({ article }: { article: JavaArticleMeta }) {
  const mustAsk = article.interviewFreq === "必问";
  return (
    <Link href={`/java-interview/${encodeURIComponent(article.slug)}/`} className="jb-toc-row">
      <span className="jb-toc-num font-mono">
        {String(article.lessonNum).padStart(2, "0")}
      </span>
      <span className="jb-toc-title">{article.title}</span>
      <span className="jb-toc-dots" aria-hidden="true" />
      {mustAsk && <span className="jb-toc-tag">必问</span>}
    </Link>
  );
}
