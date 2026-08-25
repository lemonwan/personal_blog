import Link from "next/link";
import { REACT_ARTICLES, REACT_VOLUMES, getReactArticlesByVolume } from "@/lib/content";
import type { ReactArticleMeta, ReactLevel } from "@/lib/content";

export const metadata = {
  title: "React 学习笔记 · 面向 Java 后端转型全栈",
  description: "为 Java 后端量身定制的 React 学习路径：从核心原语到 Hooks、状态管理、数据获取、性能优化，再到 AI 时代的全栈进阶。用后端思维类比，快速上手 React 实战。",
};

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII"];

/* ── 难度分级 → 颜色映射（neo-brutalism 统一调色）── */
const LEVEL_COLORS: Record<ReactLevel, string> = {
  "入门": "#FAC94A",
  "进阶": "#C2410C",
  "实战": "#1C1C1C",
};

export default function ReactNotesPage() {
  const coreCount = REACT_ARTICLES.filter((a) => a.focus).length;
  const totalCount = REACT_ARTICLES.length;

  return (
    <div className="ai-llm-scope">

      {/* ═══ Hero ═══ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#F4D35E", borderBottom: "3px solid #1C1C1C", padding: "40px 24px 48px" }}
      >
        <div className="pointer-events-none absolute -right-8 -top-8 opacity-10">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-64 w-64 text-[#1C1C1C]" aria-hidden="true">
            <ellipse cx="12" cy="12" rx="10" ry="4.2" />
            <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
            <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div>
            <div style={{ marginBottom: "12px" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-[#1C1C1C]" aria-hidden="true">
                <ellipse cx="12" cy="12" rx="10" ry="4.2" />
                <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
                <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
                <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <h1 style={{ fontFamily: "'AlimamaShuHeiTi', sans-serif" }} className="text-4xl font-black text-[#1C1C1C] sm:text-5xl">
              后端转全栈的 React 学习路径，从
              <span style={{ marginLeft: "6px", padding: "4px 12px" }} className="inline-block rounded-xl border-2 border-[#1C1C1C] bg-[#1C1C1C] text-[#FAC94A]">核心原语</span>
              到
              <span style={{ marginLeft: "6px", padding: "4px 12px" }} className="inline-block rounded-xl border-2 border-[#1C1C1C] bg-[#1C1C1C] text-[#FAC94A]">AI 时代</span>
            </h1>
            <p style={{ marginTop: "14px" }} className="max-w-2xl text-base font-semibold text-[#1C1C1C]/60">
              {totalCount} 篇内容为「Java 后端」量身设计。用后端思维类比（组件=函数、State=字段、Router=RequestMapping），
              让 {coreCount} 个核心知识点快速落地，一步到位掌握实际开发所需的 React 全栈能力。
            </p>
          </div>
          <div className="flex flex-wrap gap-3" style={{ marginTop: "32px" }}>
            <Link href={`/react-notes/${encodeURIComponent(REACT_ARTICLES[0].slug)}/`} className="btn btn-dark" style={{ padding: "10px 24px", color: "#fff" }}>
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
        <h2 className="section-title reveal">{ROMAN[7]} 卷完整体系，由浅入深学透 React</h2>
        <div className="routemap reveal">
          <div className="routemap-lines">
            {REACT_VOLUMES.map((vol) => {
              const articles = getReactArticlesByVolume(vol.num);
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
                        <Link key={a.slug} href={`/react-notes/${encodeURIComponent(a.slug)}/`} className="rm-stop ready">
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
          <h2 className="section-title reveal">建议按顺序阅读，用后端思维迁移</h2>
          <p className="section-lede reveal">
            这 {ROMAN[7]} 卷由浅入深，从核心原语出发，逐步深入到 Hooks、状态管理和 AI 时代进阶。每一篇都尽量用 Java/Spring 类比，帮你把已有知识迁移过来，而不是从零学一门新语言。
          </p>
          <div className="method-loop">
            {[
              { no: "01", title: "建立映射", desc: "把 React 概念映射到你熟悉的 Java 概念" },
              { no: "02", title: "先定 state", desc: "像建表一样，先把状态模型定清楚" },
              { no: "03", title: "动手写", desc: "每个知识点配可运行的代码示例" },
              { no: "04", title: "追原理", desc: "不只会用，理解虚拟 DOM / diff 本质" },
              { no: "05", title: "实战闭环", desc: "用一个小项目串起所有知识点" },
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
          「AI 时代，全栈能力不再是加分项，<br />
          <span>而是后端工程师的生存必需品。」</span>
        </p>
      </div>

      {/* ═══ Volume Sections：逐卷展开 ═══ */}
      <div className="volumes-wrap">
        <p className="section-kicker reveal" style={{ marginTop: "72px" }}>EXPAND · 逐卷展开</p>
        <p className="section-lede reveal" style={{ marginTop: "10px" }}>
          下面把 {ROMAN[7]} 个部分逐一摊开。第一章 8 篇已完成正文，后续章节正在持续编写中。
        </p>

        {REACT_VOLUMES.map((vol) => {
          const articles = getReactArticlesByVolume(vol.num);
          if (!articles.length) return null;
          return (
            <section key={vol.num} className="volume reveal">
              <div className="volume-head">
                <span className="volume-no">{ROMAN[vol.num]}</span>
                <h3>{vol.title}</h3>
                <span className="volume-q">—— {vol.subtitle}</span>
              </div>

              <p style={{ fontSize: "15px", color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: "20px", maxWidth: "48em" }}>
                {vol.desc}
              </p>

              <div className="lesson-list-wrap">
                <ol className="lesson-list">
                  {articles.map((a) => (
                    <li key={a.slug} className="lesson-row ready">
                      <span className="step-dot" />
                      <span className="lesson-no">{String(a.lessonNum).padStart(2, "0")}</span>
                      <Link href={`/react-notes/${encodeURIComponent(a.slug)}/`} className="lesson-link">
                        <span className="lesson-title">{a.title}</span>
                        <span className="lesson-q">{a.desc}</span>
                      </Link>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "10px", justifySelf: "end" }}>
                        <span style={{
                          fontFamily: "var(--mono)", fontSize: "10px", fontWeight: 700,
                          padding: "2px 8px", borderRadius: "4px",
                          backgroundColor: `${LEVEL_COLORS[a.level]}18`,
                          color: LEVEL_COLORS[a.level],
                          letterSpacing: "0.05em",
                        }}>
                          {a.level}
                        </span>
                        {a.focus && (
                          <span className="chip chip-ready chip-go" style={{ fontSize: "10px", padding: "2px 10px" }}>
                            核心
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {vol.num < 7 && (
                <div className="vol-connector">下一卷 · {ROMAN[vol.num + 1]} · {REACT_VOLUMES.find((v) => v.num === vol.num + 1)?.title}</div>
              )}
            </section>
          );
        })}
      </div>

      {/* ═══ CTA ═══ */}
      <section className="section-dark text-center" style={{ padding: "60px 24px", borderTop: "3px solid #FAC94A" }}>
        <p className="text-[#FAC94A] font-black text-lg mb-4">⚛️ 开始你的全栈转型之旅！</p>
        <p className="text-white/50 text-sm max-w-md mx-auto mb-8">
          建议从「核心原语」开始，这是所有 React 开发的地基。用你熟悉的 Java 思维迁移过来，很快就能上手实战。
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a href="/" className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 text-sm font-black text-white hover:border-[#FAC94A] hover:text-[#FAC94A] transition-all">返回首页</a>
          <Link
            href={`/react-notes/${encodeURIComponent(REACT_ARTICLES[0].slug)}/`}
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