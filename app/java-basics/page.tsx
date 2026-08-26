import Link from "next/link";
import { JAVA_ARTICLES, JAVA_VOLUMES, getJavaArticlesByVolume } from "@/lib/content";
import type { JavaArticleMeta, Difficulty, InterviewFreq } from "@/lib/content";

export const metadata = {
  title: "Java 学习笔记 · 系统整理 Java 核心知识",
  description: "系统整理 Java 核心知识，覆盖集合框架、并发编程、JVM、设计模式等高频面试主题。70 篇文章从源码到原理，逐篇攻克面试难关。",
};

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII"];

/* ── 难度 → 颜色映射（neo-brutamlist 统一调色）── */
const DIFF_COLORS: Record<Difficulty, string> = {
  "初级": "#FAC94A",
  "中级": "#C5B99B",
  "高级": "#C2410C",
  "深度": "#1C1C1C",
};

export default function JavaBasicsPage() {
  const mustAsk = JAVA_ARTICLES.filter((a) => a.interviewFreq === "必问").length;
  const totalCount = JAVA_ARTICLES.length;

  return (
    <div className="ai-llm-scope">

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
        <div className="relative max-w-7xl mx-auto">
          <div>
            <div style={{ marginBottom: "12px" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-[#1C1C1C]" aria-hidden="true">
                <path d="M4 20h16M4 20v-4a2 2 0 012-2h12a2 2 0 012 2v4M12 4v12m-4-4l4 4 4-4" />
              </svg>
            </div>
            <h1 style={{ fontFamily: "'AlimamaShuHeiTi', sans-serif" }} className="text-4xl font-black text-[#1C1C1C] sm:text-5xl">
              Java 学习笔记，从集合框架到
              <span style={{ marginLeft: "6px", padding: "4px 12px" }} className="inline-block rounded-xl border-2 border-[#1C1C1C] bg-[#1C1C1C] text-[#FAC94A]">JVM 调优</span>
            </h1>
            <p style={{ marginTop: "14px" }} className="max-w-2xl text-base font-semibold text-[#1C1C1C]/60">
              {totalCount} 篇文章系统整理 Java 核心知识。{mustAsk} 篇必问高频，每篇聚焦一个面试主题——配套源码解读、图解与生产最佳实践。
            </p>
          </div>
          <div className="flex flex-wrap gap-3" style={{ marginTop: "32px" }}>
            <Link href={`/java-interview/${encodeURIComponent(JAVA_ARTICLES[0].slug)}/`} className="btn btn-dark" style={{ padding: "10px 24px", color: "#fff" }}>
              从第 1 篇出发 →
            </Link>
            <a href="#map" className="btn btn-white" style={{ padding: "10px 24px" }}>
              浏览学习路径 ↓
            </a>
          </div>
        </div>
      </section>

      {/* ═══ Route Map：全宽路线卡片 ═══ */}
      <section className="map-section" id="map">
        <p className="section-kicker reveal">LEARNING PATH · 学习路径</p>
        <h2 className="section-title reveal">{ROMAN[7]} 卷完整体系，一次搞定 Java 面试</h2>
        <div className="routemap reveal">
          <div className="routemap-lines">
            {JAVA_VOLUMES.map((vol) => {
              const articles = getJavaArticlesByVolume(vol.num);
              if (!articles.length) return null;
              return (
                <div key={vol.num}>
                  <div className="rm-line">
                    <div className="rm-cap">
                      <span className="rm-cap-no">卷{ROMAN[vol.num]}</span>
                      <span className="rm-cap-name">{vol.title}</span>
                      <span className="rm-cap-gloss">—— {vol.subtitle}</span>
                    </div>
                    <div className="rm-track">
                      {articles.slice(0, 6).map((a) => (
                        <Link key={a.slug} href={`/java-interview/${encodeURIComponent(a.slug)}/`} className="rm-stop ready">
                          <span className="rm-dot" />
                          <span className="rm-stop-t">{String(a.lessonNum).padStart(2, "0")}</span>
                          {a.title.length > 14 ? a.title.slice(0, 14) + "…" : a.title}
                        </Link>
                      ))}
                      {articles.length > 6 && (
                        <span style={{ fontSize: "11px", color: "var(--ink-faint)", fontWeight: 600 }}>
                          +{articles.length - 6} 篇…
                        </span>
                      )}
                      <span className="rm-flag end">{articles.length} 篇</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 交互指南 / Method ═══ */}
      <section className="method">
        <div className="method-inner">
          <p className="section-kicker reveal">HOW TO USE · 使用方法</p>
          <h2 className="section-title reveal">建议按顺序阅读，每卷独立成体系</h2>
          <p className="section-lede reveal">
            这 {ROMAN[7]} 卷由浅入深，从基础的集合框架源码逐步深入到分布式系统设计。每一篇都可以独立阅读，也可以顺次推进建立完整的知识图谱。
          </p>
          <div className="method-loop">
            {[
              { no: "01", title: "先看目录", desc: "根据薄弱环节选择想看的卷" },
              { no: "02", title: "单点突破", desc: "从「必问」标签的文章开始" },
              { no: "03", title: "深入源码", desc: "理解底层实现，不只是背答案" },
              { no: "04", title: "串联知识", desc: "把不同卷的知识点形成网络" },
              { no: "05", title: "实战输出", desc: "用自己的话复述给面试官听" },
            ].map((s, i) => (
              <div key={s.no} className="method-step reveal">
                <span className="step-no">{s.no}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < 4 && <span className="step-arrow">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Interlude ═══ */}
      <div className="interlude">
        <p className="reveal">
          「面试不是背诵答案——<br />
          <span>而是真正理解每一个字背后的设计哲学。」</span>
        </p>
      </div>

      {/* ═══ Volume Sections：逐卷展开 ═══ */}
      <div className="volumes-wrap">
        <p className="section-kicker reveal" style={{ marginTop: "72px" }}>EXPAND · 逐卷展开</p>
        <p className="section-lede reveal" style={{ marginTop: "10px" }}>
          下面把 {ROMAN[7]} 个部分逐一摊开。每个标题旁就是你的面试战场，点击即可进入对应文章。
        </p>

        {JAVA_VOLUMES.map((vol) => {
          const articles = getJavaArticlesByVolume(vol.num);
          if (!articles.length) return null;
          return (
            <section key={vol.num} className="volume reveal">
              <div className="volume-head">
                <span className="volume-no">{ROMAN[vol.num]}</span>
                <h3>{vol.title}</h3>
                <span className="volume-q">—— {vol.subtitle}</span>
              </div>

              {/* 卷描述 */}
              <p style={{ fontSize: "15px", color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: "20px", maxWidth: "48em" }}>
                {vol.desc}
              </p>

              <div className="lesson-list-wrap">
                <ol className="lesson-list">
                  {articles.map((a) => (
                    <li key={a.slug} className="lesson-row ready">
                      <span className="step-dot" />
                      <span className="lesson-no">{String(a.lessonNum).padStart(2, "0")}</span>
                      <Link href={`/java-interview/${encodeURIComponent(a.slug)}/`} className="lesson-link">
                        <span className="lesson-title">{a.title}</span>
                        <span className="lesson-q">{a.desc}</span>
                      </Link>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "10px", justifySelf: "end" }}>
                        {a.difficulty && (
                          <span style={{
                            fontFamily: "var(--mono)", fontSize: "10px", fontWeight: 700,
                            padding: "2px 8px", borderRadius: "4px",
                            backgroundColor: `${DIFF_COLORS[a.difficulty]}18`,
                            color: DIFF_COLORS[a.difficulty],
                            letterSpacing: "0.05em",
                          }}>
                            {a.difficulty}
                          </span>
                        )}
                        {a.interviewFreq === "必问" && (
                          <span className="chip chip-ready chip-go" style={{ fontSize: "10px", padding: "2px 10px" }}>
                            必问
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Vol connector */}
              {vol.num < 7 && (
                <div className="vol-connector">下一卷 · {ROMAN[vol.num + 1]} · {JAVA_VOLUMES.find((v) => v.num === vol.num + 1)?.title}</div>
              )}
            </section>
          );
        })}
      </div>

      {/* ═══ CTA ═══ */}
      <section className="section-dark text-center" style={{ padding: "60px 24px", borderTop: "3px solid #FAC94A" }}>
        <p className="text-[#FAC94A] font-black text-lg mb-4">☕ 开始你的 Java 进阶之旅！</p>
        <p className="text-white/50 text-sm max-w-md mx-auto mb-8">
          建议从集合框架开始，这是所有 Java 开发者的基本功。掌握底层原理，面试和工作都能游刃有余。
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a href="/" className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 text-sm font-black text-white hover:border-[#FAC94A] hover:text-[#FAC94A] transition-all">返回首页</a>
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
