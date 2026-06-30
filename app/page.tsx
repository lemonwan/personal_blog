import Link from "next/link";
import { JAVA_ARTICLES } from "@/lib/content";

// 最近更新的 4 篇 Java 文章
const recentJava = JAVA_ARTICLES.slice(0, 4);

export default function Home() {
  return (
    <>
      {/* ═══ Hero：金底 + 个人定位 ═══ */}
      <section className="relative overflow-hidden px-6" style={{ background: "#F4D35E", borderBottom: "3px solid #1C1C1C", padding: "48px 24px 56px" }}>
        {/* 装饰：右上角阶梯 SVG */}
        <div className="pointer-events-none absolute -right-8 -top-8 opacity-8">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-72 w-72 text-[#1C1C1C]" aria-hidden="true">
            <path d="M3 21h4v-4h4v-4h4v-4h4V5" />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl pt-12 pb-16 reveal">
          <p className="mb-4 text-sm font-black uppercase tracking-widest text-[#1C1C1C]/60">技术笔记 · 持续更新 — 2026</p>
          <h1 className="text-4xl font-black text-[#1C1C1C] sm:text-5xl" style={{ fontFamily: "'AlimamaShuHeiTi', sans-serif" }}>
            Java 开发工程师
            <span className="inline-block rounded-xl border-2 border-[#1C1C1C] bg-[#1C1C1C] text-[#FAC94A] ml-2 px-3 py-1 align-middle" style={{ fontSize: "0.45em", verticalAlign: "middle" }}>
              与知识记录者
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base font-semibold text-[#1C1C1C]/60 leading-relaxed">
            专注 Java 后端开发，深耕 JVM、并发编程与系统设计。
            相信"理解源码才能写出好代码"——在这里记录学习笔记、面试复盘与技术思考。
          </p>

          {/* 技能标签 */}
          <div className="mt-5 flex flex-wrap gap-2">
            {["Java", "Spring Boot", "JVM", "并发编程", "MySQL", "Redis", "系统设计", "AI / LLM"].map((t) => (
              <span key={t} className="inline-block px-3 py-1 rounded-full border border-[#1C1C1C]/25 text-xs font-bold text-[#1C1C1C]/50">{t}</span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/ai-llm/" className="btn-dark" style={{ padding: "12px 28px" }}>LLM 基础概念学习笔记 →</Link>
            <Link href="/java-basics/" className="btn-white" style={{ padding: "12px 28px" }}>Java 面试笔记</Link>
          </div>
        </div>
      </section>

      {/* ═══ 关于我 ═══ */}
      <section className="px-6 py-16" style={{ background: "#FFF8F0", borderBottom: "1px solid var(--line, #D8CEB6)" }}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-widest text-[#1C1C1C]/40 mb-4">About · 关于</p>
          <p className="text-lg text-[#1C1C1C]/70 leading-relaxed">
            我是 <strong className="text-[#1C1C1C]">wan</strong>，一名常驻北京的 Java 开发工程师。
            目前专注于<strong className="text-[#1C1C1C]">后端架构设计</strong>与<strong className="text-[#1C1C1C]">性能优化</strong>，
            同时对 AI 大模型原理保持浓厚兴趣。
            这个网站是我整理知识、沉淀思考的地方——希望这些笔记也能帮到你。
          </p>
        </div>
      </section>

      {/* ═══ 精选内容 ═══ */}
      <section className="px-6 py-20" style={{ background: "#FFF8F0" }}>
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-sm font-black uppercase tracking-widest text-[#1C1C1C]/40">Featured · 精选</p>
          <h2 className="text-3xl font-black text-[#1C1C1C]">从这里开始探索</h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <FeatureCard
              href="/ai-llm/"
              accent="#3E6B8F"
              label="LLM 基础概念学习笔记"
              subtitle="从向量到 Transformer，零基础入门"
              desc="30 节沉浸式讲解，每课从一个你一眼就懂的问题出发，亲手把向量、神经网络、注意力机制推导出来。"
              stats={["30 节课", "5 卷内容"]}
            />
            <FeatureCard
              href="/java-basics/"
              accent="#C2410C"
              label="Java 面试笔记"
              subtitle="从集合框架到 JVM 调优"
              desc="系统整理 Java 核心知识，每篇从高频面试题出发，配套 JDK 源码解读、图解与生产最佳实践。"
              stats={[`${JAVA_ARTICLES.length} 篇文章`, "4 大主题"]}
            />
          </div>
        </div>
      </section>

      {/* ═══ 最近更新 ═══ */}
      <section className="px-6 py-20" style={{ background: "#EDE3C4", borderTop: "2px solid #1C1C1C" }}>
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="mb-2 text-sm font-black uppercase tracking-widest text-[#1C1C1C]/40">Latest · 最近更新</p>
              <h2 className="text-3xl font-black text-[#1C1C1C]">Java 面试笔记 · 最新文章</h2>
            </div>
            <Link href="/java-basics/" className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-[#1C1C1C]/60 hover:text-[#C2410C] transition-colors">
              查看全部 {JAVA_ARTICLES.length} 篇 →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentJava.map((a, i) => (
              <Link key={a.slug} href={`/java-interview/${encodeURIComponent(a.slug)}/`}
                className="nb-card group block" style={{ padding: "22px 24px" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-[#C2410C]">
                    {String(a.lessonNum).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#D8CEB6] text-[#1C1C1C]/40">
                    {a.tags?.[0] || ""}
                  </span>
                </div>
                <h3 className="font-bold text-[#1C1C1C] group-hover:text-[#C2410C] transition-colors text-sm leading-snug">
                  {a.title}
                </h3>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/java-basics/" className="btn-white" style={{ padding: "10px 24px" }}>
              查看全部 {JAVA_ARTICLES.length} 篇 →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="section-dark text-center" style={{ padding: "56px 24px", borderTop: "3px solid #FAC94A" }}>
        <p className="text-[#FAC94A] font-black text-lg mb-3">有想交流的技术话题？</p>
        <p className="text-white/50 text-sm max-w-md mx-auto">
          对笔记内容有想法，或想探讨 Java、JVM、AI 大模型？欢迎随时联系交流。
        </p>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   可复用精美卡片组件 · FeatureCard
   新增卡片只需传 href / accent / label / subtitle / desc / stats
   ═══════════════════════════════════════════════════════════ */
function FeatureCard({
  href,
  accent,
  label,
  subtitle,
  desc,
  stats,
}: {
  href: string;
  accent: string;
  label: string;
  subtitle: string;
  desc: string;
  stats: string[];
}) {
  return (
    <a
      href={href}
      className="group relative flex flex-col rounded-2xl border border-[#E8E3D5] bg-white p-7
                 transition-all duration-300
                 hover:-translate-y-1 hover:border-transparent hover:shadow-lg hover:shadow-black/[0.06]"
    >
      {/* 顶部彩色装饰条 */}
      <div
        className="absolute top-0 left-7 right-7 h-[3px] rounded-b-full opacity-60 transition-all duration-300 group-hover:opacity-100 group-hover:h-[4px]"
        style={{ background: accent }}
      />

      {/* 标题区 */}
      <div className="mt-2 flex items-start gap-3">
        {/* 彩色圆点图标 */}
        <div
          className="mt-0.5 h-9 w-9 flex-shrink-0 rounded-xl flex items-center justify-center transition-colors duration-300"
          style={{ background: `${accent}12` }}
        >
          <div className="h-3 w-3 rounded-full" style={{ background: accent }} />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-[#1C1C1C] leading-snug transition-colors duration-300 group-hover:text-[#1C1C1C]">
            {label}
          </h3>
          <p className="text-[13px] text-[#1C1C1C]/40 mt-0.5">{subtitle}</p>
        </div>
      </div>

      {/* 描述 */}
      <p className="mt-4 text-[14px] text-[#1C1C1C]/50 leading-relaxed flex-1">
        {desc}
      </p>

      {/* 底部：统计 + 箭头 */}
      <div className="mt-5 flex items-center justify-between pt-4 border-t border-[#F0EDE4]">
        <div className="flex gap-3">
          {stats.map((s) => (
            <span key={s} className="text-[11px] font-bold tracking-wide text-[#1C1C1C]/30 uppercase">
              {s}
            </span>
          ))}
        </div>
        <span
          className="inline-flex items-center gap-1 text-[13px] font-bold transition-all duration-300"
          style={{ color: accent }}
        >
          探索
          <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </a>
  );
}
