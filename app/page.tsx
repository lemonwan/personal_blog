export default function Home() {
  return (
    <>
      {/* ── Hero（对标源站：金底 + 深色字 + 厚边框按钮）── */}
      <section className="relative overflow-hidden px-6" style={{ background: "#F4D35E", borderBottom: "3px solid #1C1C1C", padding: "40px 24px 48px" }}>
        <div className="mx-auto max-w-7xl pt-16 pb-20 reveal">
          <p className="mb-4 text-sm font-black uppercase tracking-widest text-[#1C1C1C]/60">技术笔记 · 持续更新 — 2026</p>
          <h1 className="text-4xl font-black text-[#1C1C1C] sm:text-5xl">
            Java 开发工程师<br />
            <span className="inline-block rounded-xl border-2 border-[#1C1C1C] bg-[#1C1C1C] text-[#FAC94A] ml-1 mt-1 px-3 py-1">与知识记录者</span>
          </h1>
          <p className="mt-4 max-w-xl text-base font-semibold text-[#1C1C1C]/60">
            专注 Java 后端开发，深耕 JVM、并发编程与系统设计。在这里持续记录学习笔记与技术思考。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/ai-llm/" className="btn-dark" style={{ padding: "10px 24px" }}>AI 大模型教程 →</a>
            <a href="/java-basics/" className="btn-white" style={{ padding: "10px 24px" }}>Java 面试笔记</a>
          </div>
        </div>
      </section>

      {/* ── 统计 ── */}
      <section className="px-6 py-12" style={{ background: "#FFF8F0", borderBottom: "2px solid #1C1C1C" }}>
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "35+", label: "Java 技术笔记" },
            { value: "30+", label: "AI 大模型课程" },
            { value: "12+", label: "覆盖主题" },
            { value: "4+", label: "年 Java 经验" },
          ].map((s) => (
            <div key={s.label} className="nb-card text-center">
              <div className="text-3xl font-black text-[#1C1C1C]">{s.value}</div>
              <div className="mt-2 text-sm text-[#1C1C1C]/50">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 精选内容 ── */}
      <section className="px-6 py-20" style={{ background: "#FFF8F0" }}>
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-sm font-black uppercase tracking-widest text-[#1C1C1C]/50">笔记</p>
          <h2 className="text-3xl font-black text-[#1C1C1C]">精选内容</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <a href="/ai-llm/" className="nb-card group block">
              <div className="flex items-center justify-between mb-4">
                <span className="chip">30 节课</span>
                <span className="chip">5 卷内容</span>
              </div>
              <h3 className="text-xl font-black text-[#1C1C1C] group-hover:text-[#B07A1E] transition-colors">AI 大模型原理教程</h3>
              <p className="mt-2 text-sm text-[#1C1C1C]/50">从向量到 Transformer，零基础入门 AI 大模型核心原理。30 节沉浸式讲解，亲手把整个知识体系搭建起来。</p>
              <span className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-[#1C1C1C]">开始学习 →</span>
            </a>
            <a href="/java-basics/" className="nb-card group block">
              <div className="flex items-center justify-between mb-4">
                <span className="chip">15 篇文章</span>
                <span className="chip">7 主题</span>
              </div>
              <h3 className="text-xl font-black text-[#1C1C1C] group-hover:text-[#B07A1E] transition-colors">Java 面试笔记</h3>
              <p className="mt-2 text-sm text-[#1C1C1C]/50">系统整理 Java 核心知识，覆盖集合框架、并发编程、JVM、设计模式等高频面试主题。</p>
              <span className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-[#1C1C1C]">查看详情 →</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
