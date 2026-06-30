import Link from "next/link";
import { JAVA_ARTICLES, JAVA_VOLUMES, getJavaArticlesByVolume } from "@/lib/content";

export const metadata = {
  title: "Java 面试笔记 · 系统整理 Java 核心知识",
  description: "系统整理 Java 核心知识，覆盖集合框架、并发编程、JVM、设计模式等高频面试主题。",
};

export default function JavaBasicsPage() {
  return (
    <div className="ai-llm-scope">
      {/* ═══ Hero（对标 AI 教程金底风格）═══ */}
      <section className="allm-hero relative overflow-hidden" style={{ background: "#F4D35E", borderBottom: "3px solid #1C1C1C", padding: "40px 24px 48px" }}>
        <div className="pointer-events-none absolute -right-8 -top-8 opacity-10">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-64 w-64 text-[#1C1C1C]" aria-hidden="true">
            <path d="M4 20h16M4 20v-4a2 2 0 012-2h12a2 2 0 012 2v4M12 4v12m-4-4l4 4 4-4" />
          </svg>
        </div>
        <div className="relative max-w-7xl" style={{ margin: "0 auto" }}>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
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
          </div>
          <div className="flex flex-wrap gap-3" style={{ marginTop: "32px" }}>
            <Link href={`/java-interview/${encodeURIComponent(JAVA_ARTICLES[0].slug)}/`} className="btn btn-dark" style={{ padding: "10px 24px", color: "#fff" }}>
              从第 1 篇出发 →
            </Link>
            <a href="#volumes" className="btn btn-white" style={{ padding: "10px 24px" }}>
              浏览全部文章 ↓
            </a>
          </div>
        </div>
      </section>

      {/* ═══ Method 学习方式 ═══ */}
      <section className="method">
        <div className="method-inner">
          <p className="section-kicker reveal">HOW WE LEARN · 学习方式</p>
          <h2 className="section-title reveal">从高频面试题出发，深入底层原理</h2>
          <p className="section-lede reveal">
            Java 面试不只是背八股文。每一篇文章从一道具体面试题出发，带你理解背后的设计思想、源码实现与最佳实践。
          </p>
          <div className="method-loop">
            {[
              { no: "01", title: "面试真题", desc: "从一道大厂高频面试题出发", arrow: true },
              { no: "02", title: "源码分析", desc: "深入 JDK 源码，理解底层实现。", arrow: true },
              { no: "03", title: "原理图解", desc: "用图解辅助理解抽象概念与流程", arrow: true },
              { no: "04", title: "最佳实践", desc: "结合生产场景，给出可落地的方案。", arrow: true },
              { no: "05", title: "知识串联", desc: "回头看——把零散知识点串成体系。", arrow: false },
            ].map((s) => (
              <div key={s.no} className="method-step reveal">
                <span className="step-no">{s.no}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {s.arrow && <span className="step-arrow">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Interlude ═══ */}
      <div className="interlude">
        <p className="reveal">
          「面试不是终点，而是检验理解的起点——<br />
          <span>真正的高手，能从源码里看到设计者的思考。」</span>
        </p>
      </div>

      {/* ═══ Route Map ═══ */}
      <section className="map-section" id="volumes">
        <p className="section-kicker reveal">LEARNING PATH · 学习路径</p>
        <h2 className="section-title reveal">从集合框架到 JVM，一条线串起来</h2>
        <div className="routemap reveal">
          <div className="routemap-lines">
            {JAVA_VOLUMES.map((vol) => (
              <div key={vol.num}>
                <div className="rm-line">
                  <div className="rm-cap">
                    <span className="rm-cap-no">{getRoman(vol.num)}</span>
                    <span className="rm-cap-name">{vol.title}</span>
                    <span className="rm-cap-gloss">{vol.subtitle}</span>
                  </div>
                  <div className="rm-track">
                    {getJavaArticlesByVolume(vol.num).map((a) => (
                      <Link key={a.slug} href={`/java-interview/${encodeURIComponent(a.slug)}/`} className="rm-stop ready">
                        <span className="rm-dot" />
                        <span className="rm-stop-t">{String(a.lessonNum).padStart(2, "0")}</span>
                        {a.title.length > 12 ? a.title.slice(0, 12) + "…" : a.title}
                      </Link>
                    ))}
                    <span className="rm-flag end">{getJavaArticlesByVolume(vol.num).length} 篇</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Volume sections ═══ */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px 48px" }}>
        <p className="section-kicker reveal" style={{ marginTop: "72px" }}>EXPAND · 逐篇展开</p>
        <p className="section-lede reveal" style={{ marginTop: "10px" }}>
          想知道每篇文章在讲什么？下面按四大主题展开，每篇标题下是该文的核心主题。
        </p>

        {JAVA_VOLUMES.map((vol, vi) => (
          <section key={vol.num} className="volume reveal">
            <div className="volume-head">
              <span className="volume-no">{getZH(vol.num)}</span>
              <h3>{vol.title}</h3>
              <span className="volume-q">—— {vol.subtitle}</span>
            </div>
            <p style={{ fontSize: "15px", color: "var(--ink-soft)", marginBottom: "20px" }}>{vol.desc}</p>
            <div className="lesson-list-wrap">
              <div className="stair-thread" />
              <ol className="lesson-list">
                {getJavaArticlesByVolume(vol.num).map((a) => (
                  <li key={a.slug} className="lesson-row ready">
                    <span className="step-dot" />
                    <span className="lesson-no">{String(a.lessonNum).padStart(2, "0")}</span>
                    <Link href={`/java-interview/${encodeURIComponent(a.slug)}/`} className="lesson-link">
                      <span className="lesson-title">{a.title}</span>
                      <span className="lesson-q">
                        {a.tags.map((t) => `#${t}`).join("  ")}
                      </span>
                    </Link>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "14px", justifySelf: "end" }}>
                      <Link href={`/java-interview/${encodeURIComponent(a.slug)}/`} className="chip chip-ready chip-go">去学习 →</Link>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            {vi < JAVA_VOLUMES.length - 1 && <div className="vol-connector">下一卷</div>}
          </section>
        ))}
      </div>

      {/* ═══ CTA ═══ */}
      <section className="section-dark text-center" style={{ padding: "60px 24px", borderTop: "3px solid #FAC94A" }}>
        <p className="text-[#FAC94A] font-black text-lg mb-4">☕ 开始你的 Java 进阶之旅！</p>
        <p className="text-white/50 text-sm max-w-md mx-auto mb-8">
          建议从集合框架开始，这是所有 Java 开发者的基本功。掌握底层原理，面试和工作都能游刃有余。
        </p>
        <div className="flex justify-center gap-4">
          <a href="/" className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 text-sm font-black text-white hover:border-[#FAC94A] hover:text-[#FAC94A] transition-all">返回首页</a>
          <Link href={`/java-interview/${encodeURIComponent(JAVA_ARTICLES[0].slug)}/`} className="btn btn-dark" style={{ padding: "12px 28px", color: "#fff" }}>开始学习 →</Link>
        </div>
      </section>
    </div>
  );
}

function getRoman(n: number): string { return ["", "I", "II", "III", "IV", "V"][n] || String(n); }
function getZH(n: number): string { return ["", "一", "二", "三", "四", "五"][n] || String(n); }
