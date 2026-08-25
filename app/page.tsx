import Link from "next/link";
import { JAVA_ARTICLES } from "@/lib/content";

export default function Home() {
  return (
    <>
      {/* ═══ Hero：金底 + 个人定位 ═══ */}
      <section className="relative overflow-hidden px-6" style={{ background: "#F4D35E", borderBottom: "3px solid #1C1C1C", padding: "48px 24px 56px" }}>
        {/* 装饰：右上角阶梯 SVG */}
        <div className="pointer-events-none absolute -right-8 -top-8 opacity-10">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-72 w-72 text-[#1C1C1C]" aria-hidden="true">
            <path d="M3 21h4v-4h4v-4h4v-4h4V5" />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl pt-12 pb-16 reveal">
          <p className="mb-4 text-sm font-black uppercase tracking-widest text-[#1C1C1C]/60">AI Agent 学习者 · 后端工程师 · 2026 转型中</p>
          <h1 className="text-4xl font-black text-[#1C1C1C] sm:text-5xl" style={{ fontFamily: "'AlimamaShuHeiTi', sans-serif" }}>
            正在从 Java 转向 AI Agent 应用工程师
            <span className="inline-block rounded-xl border-2 border-[#1C1C1C] bg-[#1C1C1C] text-[#FAC94A] ml-2 px-3 py-1 align-middle" style={{ fontSize: "0.45em", verticalAlign: "middle" }}>
              Learning in Public
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base font-semibold text-[#1C1C1C]/60 leading-relaxed">
            正在系统性地转型 AI Agent 应用工程师。
            学习方向：LangChain / LangGraph / RAG / MCP。
            这里公开我的每日学习笔记、面试知识沉淀与项目进度——用输出倒逼输入。
          </p>

          {/* 技能标签 */}
          <div className="mt-6 flex flex-wrap gap-2">
            {["Java", "Spring Boot", "JVM", "并发编程", "MySQL", "Redis", "系统设计", "AI / LLM"].map((t) => (
              <span key={t} className="font-mono text-[11px] font-bold px-3 py-1 rounded-full border border-[#1C1C1C]/30 text-[#1C1C1C]/65" style={{ letterSpacing: "0.05em" }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 精选内容 ═══ */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-sm font-black uppercase tracking-widest text-[#1C1C1C]/40">Featured · 精选</p>
          <h2 className="text-3xl font-black text-[#1C1C1C]">从这里开始探索</h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <FeatureCard
              href="/ai-llm/"
              vol="Vol. I"
              cover="#F4D35E"
              status="进行中"
              title="LLM 基础"
              subtitle="概念学习笔记"
              desc="从向量到 Transformer，零基础入门。每课从一个你一眼就懂的问题出发，亲手把注意力机制推导出来。"
              meta={["32 节课", "5 卷内容", "沉浸式讲解"]}
            />
            <FeatureCard
              href="/java-basics/"
              vol="Vol. II"
              cover="#EDE3C4"
              status="持续更新"
              title="Java 面试"
              subtitle="知识沉淀与源码解读"
              desc="从集合框架到 JVM 调优，每篇从高频面试题出发，配套 JDK 源码解读、图解与生产最佳实践。"
              meta={[`${JAVA_ARTICLES.length} 篇文章`, "7 卷内容", "持续更新"]}
            />
          </div>
        </div>
      </section>

      {/* ═══ 第三部分暂时去掉 ═══ */}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   FeatureCard · 丛书封面风
   3px 黑边 + 硬阴影 + 大卷号 + Alimama 粗黑体
   ═══════════════════════════════════════════════════════════ */
function FeatureCard({
  href,
  vol,
  cover,
  status,
  title,
  subtitle,
  desc,
  meta,
}: {
  href: string;
  vol: string;
  cover: string;
  status: string;
  title: string;
  subtitle: string;
  desc: string;
  meta: string[];
}) {
  return (
    <a
      href={href}
      className="feature-card group relative block"
      style={{
        background: cover,
        border: "3px solid #1C1C1C",
        boxShadow: "6px 6px 0 #1C1C1C",
        padding: "28px 28px 24px",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        color: "#1C1C1C",
        textDecoration: "none",
      }}
    >
      {/* 顶部一行：卷号 · 状态徽章 */}
      <div className="flex items-center justify-between mb-8">
        <span
          className="font-mono text-xs font-black tracking-widest"
          style={{ color: "#1C1C1C", opacity: 0.7 }}
        >
          {vol}
        </span>
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1"
          style={{
            background: "#1C1C1C",
            color: "#FAC94A",
            borderRadius: "999px",
            letterSpacing: "0.05em",
          }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "#FAC94A" }} />
          {status}
        </span>
      </div>

      {/* 主标题 + 副标题 */}
      <h3
        className="text-3xl sm:text-4xl leading-tight"
        style={{ fontFamily: "'AlimamaShuHeiTi', sans-serif", fontWeight: 900, color: "#1C1C1C" }}
      >
        {title}
      </h3>
      <p
        className="mt-2 text-sm font-mono font-bold"
        style={{ color: "#1C1C1C", opacity: 0.55, letterSpacing: "0.02em" }}
      >
        {subtitle}
      </p>

      {/* 分隔线 */}
      <div className="my-5 h-px" style={{ background: "#1C1C1C", opacity: 0.15 }} />

      {/* 描述 */}
      <p className="text-[14px] leading-relaxed" style={{ color: "#1C1C1C", opacity: 0.72 }}>
        {desc}
      </p>

      {/* 底部：元数据 · 翻开 → */}
      <div className="mt-6 flex items-end justify-between gap-3 flex-wrap">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {meta.map((m, i) => (
            <span
              key={m}
              className="font-mono text-[11px] font-bold uppercase tracking-wider"
              style={{ color: "#1C1C1C", opacity: 0.5 }}
            >
              {i > 0 && <span className="mr-3 opacity-40">·</span>}
              {m}
            </span>
          ))}
        </div>
        <span
          className="inline-flex items-center gap-1.5 text-sm font-black"
          style={{ color: "#1C1C1C" }}
        >
          翻开
          <svg
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </a>
  );
}
