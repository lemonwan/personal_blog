import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getJavaContent, getJavaArticle, hasJavaContent, JAVA_ARTICLES, JAVA_VOLUMES, getJavaArticlesByVolume } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

const ZH = ["", "一", "二", "三", "四", "五", "六", "七"];

export function generateStaticParams() {
  const seen = new Set<string>();
  return JAVA_ARTICLES
    .filter((a) => { if (seen.has(a.slug)) return false; seen.add(a.slug); return true; })
    .map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const meta = getJavaArticle(decoded);
  return { title: meta ? `${meta.title} | Java 面试笔记` : "Java 笔记" };
}

export default async function JavaArticlePage({ params }: Props) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const meta = getJavaArticle(decoded);
  if (!meta) notFound();

  const content = getJavaContent(decoded);
  const ready = content !== null;

  const vol = JAVA_VOLUMES.find((v) => v.num === meta.volume);
  const idx = JAVA_ARTICLES.findIndex((a) => a.slug === decoded);
  const prev = idx > 0 ? JAVA_ARTICLES[idx - 1] : null;
  const next = idx < JAVA_ARTICLES.length - 1 ? JAVA_ARTICLES[idx + 1] : null;

  return (
    <div className="ai-llm-scope">
      <div className="article-shell">
        <div className="article-grid">
          <aside className="article-side">
            <div style={{ position: "sticky", top: "80px", maxHeight: "calc(100vh - 100px)", overflowY: "auto", paddingRight: "4px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", color: "var(--ink-faint)", marginBottom: "16px", textTransform: "uppercase" }}>
                Java 面试笔记 · 全部卷
              </div>

              {JAVA_VOLUMES.map((v) => {
                const isCurrent = v.num === meta.volume;
                const articles = getJavaArticlesByVolume(v.num);
                const header = (
                  <div style={{
                    fontFamily: "var(--mono)", fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.08em",
                    color: isCurrent ? "var(--accent)" : "var(--ink-soft)",
                    padding: "6px 0",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px",
                    cursor: isCurrent ? "default" : "pointer",
                  }}>
                    <span>卷{["", "一", "二", "三", "四", "五"][v.num] || v.num} · {v.title}</span>
                    <span style={{ fontSize: "11px", opacity: 0.5, fontWeight: 400 }}>{articles.length} 篇</span>
                  </div>
                );
                const list = (
                  <ul style={{ listStyle: "none", marginTop: "4px", marginBottom: "16px" }}>
                    {articles.map((a) => (
                      <li key={a.slug}>
                        <Link href={`/java-interview/${encodeURIComponent(a.slug)}/`} style={{
                          display: "flex", alignItems: "center", gap: "10px", padding: "7px 10px", borderRadius: "6px",
                          fontSize: "14px", textDecoration: "none", lineHeight: 1.4,
                          color: a.slug === decoded ? "var(--accent)" : "var(--ink-soft)",
                          fontWeight: a.slug === decoded ? 700 : 400,
                          background: a.slug === decoded ? "var(--accent-wash)" : "transparent",
                        }}>
                          <span style={{ fontFamily: "var(--mono)", fontSize: "12px", minWidth: "24px", opacity: a.slug === decoded ? 1 : 0.55 }}>
                            {String(a.lessonNum).padStart(2, "0")}
                          </span>
                          <span style={{ lineHeight: 1.4 }}>{a.title.length > 14 ? a.title.slice(0, 14) + "…" : a.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                );
                return isCurrent ? (
                  <div key={v.num} style={{ borderLeft: "2px solid var(--accent)", paddingLeft: "10px", marginBottom: "8px" }}>
                    {header}
                    {list}
                  </div>
                ) : (
                  <details key={v.num} style={{ borderLeft: "2px solid var(--line)", paddingLeft: "10px", marginBottom: "8px" }}>
                    <summary style={{ listStyle: "none", cursor: "pointer" }}>{header}</summary>
                    {list}
                  </details>
                );
              })}

              <div style={{ borderTop: "1px solid var(--line)", margin: "16px 0" }} />
              <Link href="/java-basics/" style={{ fontSize: "13px", color: "var(--ink-faint)", textDecoration: "none" }}>← 返回 Java 笔记</Link>
            </div>
          </aside>

          <article className="article-main">
            <div style={{ fontSize: "13px", color: "var(--ink-faint)", marginBottom: "24px", wordBreak: "break-word" }}>
              <Link href="/" style={{ color: "var(--ink-faint)", textDecoration: "none" }}>首页</Link>
              {" / "}<Link href="/java-basics/" style={{ color: "var(--ink-faint)", textDecoration: "none" }}>Java 面试笔记</Link>
              {" / "}{meta.title}
            </div>

            <header style={{ marginBottom: "32px" }}>
              <p style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center", gap: "6px", fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", color: "var(--accent)", marginBottom: "12px" }}>
                JAVA · 卷{ZH[meta.volume]} · {vol?.title || ""}
              </p>
              <h1 style={{ fontFamily: "'AlimamaShuHeiTi', var(--sans)", fontSize: "clamp(24px, 6vw, 40px)", fontWeight: 900, color: "var(--ink)", lineHeight: 1.2, wordBreak: "break-word" }}>
                {meta.title}
              </h1>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
                {meta.tags.map((t) => (
                  <span key={t} className="chip chip-ready" style={{ fontSize: "11px", padding: "2px 10px" }}>{t}</span>
                ))}
              </div>
            </header>

            {ready ? (
              /* ─── 正文内容 ─── */
              <div className="lesson-body" dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              /* ─── 即将更新占位 ─── */
              <div style={{
                background: "var(--card-bg, #FFFDF7)",
                border: "2px dashed var(--line, #E8E3D5)",
                borderRadius: "16px",
                padding: "48px 40px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--ink, #1C1C1C)", marginBottom: "12px" }}>
                  内容正在编写中
                </h2>
                <p style={{ fontSize: "15px", color: "var(--ink-soft, #1C1C1C)/0.6)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto 24px" }}>
                  {meta.desc}
                </p>
                <div style={{ display: "inline-flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                  <span style={{
                    fontSize: "12px", fontWeight: 700, padding: "4px 12px", borderRadius: "999px",
                    background: "#FAC94A20", color: "#B8860B",
                  }}>
                    面试频率：{meta.interviewFreq}
                  </span>
                  <span style={{
                    fontSize: "12px", fontWeight: 700, padding: "4px 12px", borderRadius: "999px",
                    background: "#1C1C1C08", color: "var(--ink-soft, #666)",
                  }}>
                    难度：{meta.difficulty}
                  </span>
                </div>
                <div style={{ marginTop: "32px" }}>
                  <Link href="/java-basics/" style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    padding: "10px 24px", borderRadius: "999px",
                    border: "2px solid var(--line, #E8E3D5)",
                    color: "var(--ink-soft)", fontWeight: 700, fontSize: "13px", textDecoration: "none",
                  }}>
                    ← 返回文章列表
                  </Link>
                </div>
              </div>
            )}

            <nav className="article-pager">
              {prev ? (
                <Link href={`/java-interview/${encodeURIComponent(prev.slug)}/`} className="pager-btn pager-prev">
                  ← {prev.title.length > 15 ? prev.title.slice(0, 15) + "…" : prev.title}
                </Link>
              ) : <span />}
              {next ? (
                <Link href={`/java-interview/${encodeURIComponent(next.slug)}/`} className="btn btn-dark pager-btn pager-next" style={{ color: "#fff", textDecoration: "none" }}>
                  {next.title.length > 15 ? next.title.slice(0, 15) + "…" : next.title} →
                </Link>
              ) : <span />}
            </nav>
          </article>
        </div>
      </div>
    </div>
  );
}
