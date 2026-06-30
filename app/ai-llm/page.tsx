import Link from "next/link";
import { AI_LESSONS, VOLUMES, getLessonsByVolume } from "@/lib/content";

export const metadata = {
  title: "LLM 基础概念学习笔记 · 从向量到 Transformer",
  description: "LLM 基础概念学习笔记，从向量到 Transformer，零基础系统学习大模型底层原理。30 节沉浸式讲解，每课从一个问题出发，亲手推导到 ChatGPT。",
};

export default function AiLlmPage() {
  return (
    <div className="ai-llm-scope">
      {/* ═══ Hero（精确对标源站 allm-hero）═══ */}
      <section className="allm-hero relative overflow-hidden" style={{ background: "#F4D35E", borderBottom: "3px solid #1C1C1C", padding: "40px 24px 48px" }}>
        <div className="pointer-events-none absolute -right-8 -top-8 opacity-10">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-64 w-64 text-[#1C1C1C]" aria-hidden="true">
            <path d="M3 21h4v-4h4v-4h4v-4h4V5" />
          </svg>
        </div>
        <div className="relative max-w-7xl" style={{ margin: "0 auto" }}>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div style={{ marginBottom: "12px" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-[#1C1C1C]" aria-hidden="true">
                  <path d="M3 21h4v-4h4v-4h4v-4h4V5" />
                </svg>
              </div>
              <h1 style={{ fontFamily: "'AlimamaShuHeiTi', sans-serif" }} className="text-4xl font-black text-[#1C1C1C] sm:text-5xl">
                LLM 基础概念，从向量到
                <span style={{ marginLeft: "6px", padding: "4px 12px" }} className="inline-block rounded-xl border-2 border-[#1C1C1C] bg-[#1C1C1C] text-[#FAC94A]">Transformer</span>
              </h1>
              <p style={{ marginTop: "14px" }} className="max-w-2xl text-base font-semibold text-[#1C1C1C]/60">
                30 节清晰简洁的大模型学习教程，每课从一个你一眼就懂的问题出发，先给最朴素的方案，再亲手发现不足、迭代改好——把向量、神经网络、注意力机制亲手「逼」出来。
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3" style={{ marginTop: "32px" }}>
            <Link href="/ai-llm/lessons/math-01-vector/" className="btn btn-dark" style={{ padding: "10px 24px", color: "#fff" }}>
              从第 1 课出发 →
            </Link>
            <a href="#volumes" className="btn btn-white" style={{ padding: "10px 24px" }}>
              浏览学习地图 ↓
            </a>
          </div>
        </div>
      </section>

      {/* ═══ Method 学习方法（对标源站 method-section）═══ */}
      <section className="method">
        <div className="method-inner">
          <p className="section-kicker reveal">HOW WE LEARN · 学习方式</p>
          <h2 className="section-title reveal">所有技术，都是为了解决问题而出现的</h2>
          <p className="section-lede reveal">
            没有人一开始就想到了RNN、LSTM、Transformer，都是在前一代技术方案上不断迭代调整，一步一步演化出来的。现在让我们从最开始那个问题开始，开启这趟自然语言处理的旅程。
          </p>
          <div className="method-loop">
            {[
              { no: "01", title: "提出问题", desc: "从一个小白都能听得懂的具体问题开始", arrow: true },
              { no: "02", title: "最小方案", desc: "先用最简单的技术方案来尝试解决这个问题。", arrow: true },
              { no: "03", title: "发现不足", desc: "这个最简单的技术方案遇到了它解决不了的部分", arrow: true },
              { no: "04", title: "迭代", desc: "对这个最简单的技术方案进行一轮迭代，解决了那部分无法解决的问题。", arrow: true },
              { no: "05", title: "总结", desc: "回头看——你刚刚「发明」的那个东西，就是教科书里那个术语。", arrow: false },
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
          「学习，不是背诵那些技术名词——<br />
          <span>而是亲历那个技术是怎么被逼出来的过程。」</span>
        </p>
      </div>

      {/* ═══ Route Map（对标源站 routemap）═══ */}
      <section className="map-section" id="volumes">
        <p className="section-kicker reveal">LEARNING PATH · 学习路径</p>
        <h2 className="section-title reveal">从向量到 Transformer，一条线穿起来</h2>
        <div className="routemap reveal">
          <div className="routemap-lines">
            {VOLUMES.map((vol, vi) => (
              <div key={vol.num}>
                <div className="rm-line">
                  <div className="rm-cap">
                    <span className="rm-cap-no">卷{getRoman(vol.num)}</span>
                    <span className="rm-cap-name">{vol.title}</span>
                    <span className="rm-cap-gloss">{vol.subtitle}</span>
                  </div>
                  <div className="rm-track">
                    {getLessonsByVolume(vol.num).map((l) => (
                      <Link key={l.slug} href={`/ai-llm/lessons/${l.slug}/`} className="rm-stop ready">
                        <span className="rm-dot" />
                        <span className="rm-stop-t">{String(l.lessonNum).padStart(2, "0")}</span>
                        {l.title}
                      </Link>
                    ))}
                    <span className="rm-flag end">{vol.count} 课</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Volume sections（对标源站 volume + lesson-list）═══ */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px 48px" }}>
        <p className="section-kicker reveal" style={{ marginTop: "72px" }}>EXPAND · 逐课展开</p>
        <p className="section-lede reveal" style={{ marginTop: "10px" }}>
          想知道每一课在解决什么问题？下面把五个部分逐课摊开，标题旁那句话，就是这一课的开场问题。
        </p>

        {VOLUMES.map((vol, vi) => (
          <section key={vol.num} className="volume reveal">
            <div className="volume-head">
              <span className="volume-no">{getZH(vol.num)}</span>
              <h3>{vol.title}</h3>
              <span className="volume-q">—— {vol.subtitle}</span>
            </div>
            <div className="lesson-list-wrap">
              <div className="stair-thread" />
              <ol className="lesson-list">
                {getLessonsByVolume(vol.num).map((l) => (
                  <li key={l.slug} className="lesson-row ready">
                    <span className="step-dot" />
                    <span className="lesson-no">{String(l.lessonNum).padStart(2, "0")}</span>
                    <Link href={`/ai-llm/lessons/${l.slug}/`} className="lesson-link">
                      <span className="lesson-title">{l.title}</span>
                      <span className="lesson-q">{l.question}</span>
                    </Link>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "14px", justifySelf: "end" }}>
                      <Link href={`/ai-llm/lessons/${l.slug}/`} className="chip chip-ready chip-go">去学习 →</Link>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            {/* Vol connector */}
            {vi < VOLUMES.length - 1 && <div className="vol-connector">下一卷</div>}
          </section>
        ))}
      </div>

      {/* ═══ CTA ═══ */}
      <section className="section-dark text-center" style={{ padding: "60px 24px", borderTop: "3px solid #FAC94A" }}>
        <p className="text-[#FAC94A] font-black text-lg mb-4">🚀 开始你的 LLM 学习之旅！</p>
        <p className="text-white/50 text-sm max-w-md mx-auto mb-8">
          建议从第 1 课开始，顺着学习路径一步步前进。每一课都建立在前一课的基础上，让你亲手把整个知识体系「搭建」起来。
        </p>
        <div className="flex justify-center gap-4">
          <a href="/" className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 text-sm font-black text-white hover:border-[#FAC94A] hover:text-[#FAC94A] transition-all">返回首页</a>
          <Link href="/ai-llm/lessons/math-01-vector/" className="btn btn-dark" style={{ padding: "12px 28px", color: "#fff" }}>开始学习 →</Link>
        </div>
      </section>
    </div>
  );
}

function getRoman(n: number): string { return ["", "I", "II", "III", "IV", "V"][n] || String(n); }
function getZH(n: number): string { return ["", "一", "二", "三", "四", "五"][n] || String(n); }
