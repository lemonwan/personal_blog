import Link from "next/link";

export const metadata = {
  title: "关于我 · WAN",
  description: "一位正在从 Java 后端转型 AI Agent 应用工程师的开发者，公开学习笔记，用输出倒逼输入。",
};

const SKILLS = {
  后端: ["Java", "Spring Boot", "JVM", "并发编程", "MySQL", "Redis", "系统设计"],
  "AI / LLM": ["LangChain", "LangGraph", "RAG", "MCP", "Prompt Engineering"],
  工程化: ["Git", "Linux", "Docker", "设计模式"],
};

export default function AboutPage() {
  return (
    <div className="ai-llm-scope">
      {/* ═══ Hero：金底 + 头像 + 身份 ═══ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#F4D35E", borderBottom: "3px solid #1C1C1C", padding: "56px 24px 60px" }}
      >
        <div className="pointer-events-none absolute -right-8 -top-8 opacity-10">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-72 w-72 text-[#1C1C1C]" aria-hidden="true">
            <path d="M3 21h4v-4h4v-4h4v-4h4V5" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-3xl">
          <div className="flex flex-col items-center text-center">
            {/* 头像 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/avatar.png"
              alt="WAN"
              width={96}
              height={96}
              className="rounded-full border-[3px] border-[#1C1C1C] shadow-[4px_4px_0_#1C1C1C]"
              style={{ width: 96, height: 96 }}
            />

            <p className="mt-6 text-sm font-black uppercase tracking-widest text-[#1C1C1C]/60">
              About · 关于我
            </p>
            <h1
              className="mt-3 text-4xl sm:text-5xl font-black text-[#1C1C1C]"
              style={{ fontFamily: "'AlimamaShuHeiTi', sans-serif" }}
            >
              你好，我是 WAN
            </h1>
            <p className="mt-4 text-base font-semibold text-[#1C1C1C]/70 max-w-xl leading-relaxed">
              一名正在从 Java 后端转型 AI Agent 应用工程的开发者。
              相信「输出倒逼输入」——把学习过程公开出来，逼自己把每个概念真正吃透。
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 正文 ═══ */}
      <div className="article-shell">
        <div className="article-main" style={{ margin: "0 auto" }}>
          {/* ── 我是谁 ── */}
          <section style={{ marginTop: "56px" }}>
            <p className="section-kicker">WHO I AM · 我是谁</p>
            <h2 className="section-title">一个正在「转场」的工程师</h2>
            <div className="mt-6" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <p style={{ fontSize: "17px", lineHeight: 1.9, color: "var(--ink-soft)", margin: 0 }}>
                做了很多年 Java 后端，熟悉集合框架、并发编程、JVM 调优那一整套东西——它们是我的基本盘，
                也是这个博客里「Java 面试笔记」板块的来源。
              </p>
              <p style={{ fontSize: "17px", lineHeight: 1.9, color: "var(--ink-soft)", margin: 0 }}>
                现在，AI Agent 正在重写「应用工程师」的定义。我不想只做一个调用 API 的人，
                而是想真正理解大模型底层，把 LLM、RAG、Agent 编排变成自己手里的生产力工具。
              </p>
              <p style={{ fontSize: "17px", lineHeight: 1.9, color: "var(--ink-soft)", margin: 0 }}>
                这个网站就是我的公开笔记本：左边是「LLM 基础」——从向量一路推到 Transformer；
                右边是「Java 面试」——几年的功底沉淀。一个往未来走，一个把过去钉牢。
              </p>
            </div>
          </section>

          {/* ── 正在进行 ── */}
          <section style={{ marginTop: "64px" }}>
            <p className="section-kicker">RIGHT NOW · 正在进行</p>
            <h2 className="section-title">2026 转型路线</h2>
            <div className="mt-8" style={{ display: "grid", gap: "16px" }}>
              {[
                { no: "01", title: "打好 LLM 基础", desc: "从数学、神经网络到 Transformer，亲手把注意力机制推导出来。" },
                { no: "02", title: "上手 Agent 框架", desc: "LangChain / LangGraph，把 RAG 与工具调用串成能落地的 Agent。" },
                { no: "03", title: "回到业务", desc: "用 Agent 解决真实业务问题，而不是停留在 demo 层。" },
                { no: "04", title: "沉淀与公开", desc: "把踩过的坑、想通的事，写进这个博客，倒逼自己讲清楚。" },
              ].map((step) => (
                <div
                  key={step.no}
                  className="nb-card"
                  style={{ display: "flex", gap: "20px", alignItems: "flex-start", padding: "24px 26px" }}
                >
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "20px",
                      fontWeight: 900,
                      color: "transparent",
                      WebkitTextStroke: "1.5px var(--accent)",
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    {step.no}
                  </span>
                  <div>
                    <h3 style={{ fontFamily: "'AlimamaShuHeiTi', var(--sans)", fontSize: "17px", fontWeight: 900, color: "var(--ink)", margin: "0 0 6px" }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--ink-soft)", margin: 0 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── 技能栈 ── */}
          <section style={{ marginTop: "64px" }}>
            <p className="section-kicker">TOOLBOX · 技能栈</p>
            <h2 className="section-title">会什么，在学什么</h2>
            <div className="mt-8" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {Object.entries(SKILLS).map(([group, items]) => (
                <div key={group}>
                  <p style={{ fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 800, letterSpacing: "0.12em", color: "var(--ink-faint)", marginBottom: "12px" }}>
                    {group}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((s) => (
                      <span
                        key={s}
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: "12px",
                          fontWeight: 700,
                          padding: "4px 14px",
                          borderRadius: "999px",
                          border: "2px solid var(--ink)",
                          background: "var(--paper-card)",
                          color: "var(--ink)",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── 联系 ── */}
          <section style={{ marginTop: "64px" }}>
            <p className="section-kicker">GET IN TOUCH · 联系</p>
            <h2 className="section-title">一起交流</h2>
            <div className="mt-8" style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              <a
                href="https://github.com/yourname"
                target="_blank"
                rel="noopener noreferrer"
                className="about-cta"
              >
                <span style={{ fontSize: "22px" }}>⌥</span>
                <span>
                  <span style={{ display: "block", fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 800 }}>GitHub</span>
                  <span style={{ display: "block", fontSize: "13px", color: "var(--ink-faint)" }}>代码 & 项目</span>
                </span>
              </a>
              <a
                href="mailto:wan@example.com"
                className="about-cta"
              >
                <span style={{ fontSize: "22px" }}>✉</span>
                <span>
                  <span style={{ display: "block", fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 800 }}>Email</span>
                  <span style={{ display: "block", fontSize: "13px", color: "var(--ink-faint)" }}>邮件联系</span>
                </span>
              </a>
            </div>
          </section>

          {/* ── 回到内容 ── */}
          <div style={{ marginTop: "56px", paddingTop: "24px", borderTop: "1px solid var(--line)" }}>
            <Link href="/" style={{ fontSize: "14px", color: "var(--ink-faint)", textDecoration: "none" }}>
              ← 返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}