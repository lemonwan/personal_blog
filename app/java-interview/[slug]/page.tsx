import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getJavaContent, getJavaArticle, JAVA_ARTICLES, JAVA_VOLUMES, getJavaArticlesByVolume } from "@/lib/content";
import CommentSection from "../../CommentSection";
import ArticleToc from "../../ArticleToc";

type Props = { params: Promise<{ slug: string }> };

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII"];

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

/** 从正文 HTML 提取 station 的 id + 标题，生成右侧大纲 */
function extractToc(html: string): { id: string; title: string }[] {
  const items: { id: string; title: string }[] = [];
  const re = /<section class="station[^"]*"\s+id="([^"]+)"[^>]*>[\s\S]*?<div class="station-head[^"]*"[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const title = decodeEntities(m[2].replace(/<[^>]+>/g, "").trim());
    if (title) items.push({ id: m[1], title });
  }
  return items;
}

export function generateStaticParams() {
  const seen = new Set<string>();
  return JAVA_ARTICLES
    .filter((a) => { if (seen.has(a.slug)) return false; seen.add(a.slug); return true; })
    .map((a) => ({ slug: encodeURIComponent(a.slug) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const meta = getJavaArticle(decoded);
  return { title: meta ? `${meta.title} | Java 学习笔记` : "Java 笔记" };
}

export default async function JavaArticlePage({ params }: Props) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const meta = getJavaArticle(decoded);
  if (!meta) notFound();

  const content = getJavaContent(decoded);
  const ready = content !== null;
  const tocItems = content ? extractToc(content) : [];

  const vol = JAVA_VOLUMES.find((v) => v.num === meta.volume);
  const idx = JAVA_ARTICLES.findIndex((a) => a.slug === decoded);
  const prev = idx > 0 ? JAVA_ARTICLES[idx - 1] : null;
  const next = idx < JAVA_ARTICLES.length - 1 ? JAVA_ARTICLES[idx + 1] : null;

  /* ── 统计当前卷信息 ── */
  const volArticles = getJavaArticlesByVolume(meta.volume);
  const mustAskInVol = volArticles.filter((a) => a.interviewFreq === "必问").length;

  return (
    <div className="ai-llm-scope">
      <div className="article-shell">
        <div className="article-grid">

          {/* ═══ 左侧边栏：全书目录风 ═══ */}
          <aside className="article-side">
            <div style={{ position: "sticky", top: "80px", maxHeight: "calc(100vh - 100px)", overflowY: "auto", paddingRight: "4px" }}>

              <div style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", color: "var(--ink-faint)", marginBottom: "16px" }}>
                Java 学习笔记
              </div>

              {JAVA_VOLUMES.map((v) => {
                const isCurrent = v.num === meta.volume;
                const articles = getJavaArticlesByVolume(v.num);
                const countMustAsk = articles.filter((a) => a.interviewFreq === "必问").length;

                return (
                  <div key={v.num} style={{ marginBottom: isCurrent ? "4px" : "16px" }}>
                    {/* 卷标题 */}
                    <div style={{
                      fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 700,
                      letterSpacing: "0.08em", color: isCurrent ? "var(--accent)" : "var(--ink-soft)",
                      padding: "8px 4px 6px", borderBottom: isCurrent ? `2px solid var(--accent)` : `1px solid var(--line)`,
                      marginBottom: "4px",
                    }}>
                      <span>{ROMAN[v.num]} · {v.title}</span>
                      <span style={{ float: "right", opacity: 0.5, fontWeight: 400, fontSize: "10px" }}>{articles.length}</span>
                    </div>

                    {/* 文章列表 */}
                    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                      {articles.map((a) => (
                        <li key={a.slug}>
                          <Link href={`/java-interview/${encodeURIComponent(a.slug)}/`} style={{
                            display: "flex", alignItems: "center", gap: "10px",
                            padding: "6px 8px", borderRadius: "6px",
                            fontSize: "14px", textDecoration: "none", lineHeight: 1.4,
                            color: a.slug === decoded ? "var(--accent)" : "var(--ink-soft)",
                            fontWeight: a.slug === decoded ? 700 : 400,
                            background: a.slug === decoded ? "var(--accent-wash)" : "transparent",
                          }}>
                            <span style={{ fontFamily: "var(--mono)", fontSize: "11px", minWidth: "22px", opacity: a.slug === decoded ? 1 : 0.5, textAlign: "right" }}>
                              {String(a.lessonNum).padStart(2, "0")}
                            </span>
                            <span style={{ lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{a.title}</span>
                            {a.interviewFreq === "必问" && (
                              <span style={{ fontSize: "9px", fontWeight: 900, color: "var(--brand)", background: "#1C1C1C", padding: "1px 5px", borderRadius: "999px", lineHeight: "1.3", flexShrink: 0 }}>
                                MQ
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}

              <div style={{ borderTop: "1px solid var(--line)", margin: "20px 0" }} />

              {/* 返回链接 */}
              <Link href="/java-basics/" style={{ fontSize: "13px", color: "var(--ink-faint)", textDecoration: "none" }}>
                ← 返回目录
              </Link>
            </div>
          </aside>

          {/* ═══ 正文区域 ═══ */}
          <article className="article-main">
            {/* 面包屑 */}
            <div className="lesson-breadcrumb" style={{ fontSize: "14px", color: "var(--ink-faint)", marginBottom: "28px" }}>
              <Link href="/" style={{ color: "var(--ink-faint)", textDecoration: "none" }}>首页</Link>
              {" / "}
              <Link href="/java-basics/" style={{ color: "var(--ink-faint)", textDecoration: "none" }}>Java 学习笔记</Link>
              {" / "}第 {String(meta.lessonNum).padStart(2, "0")} 篇
            </div>

            {/* 文章头部 */}
            <header style={{ marginBottom: "36px" }}>
              {/* Meta 行：VOL · DAY · 主题 */}
              <p style={{
                display: "inline-flex", flexWrap: "wrap", alignItems: "center", gap: "6px",
                fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 700,
                letterSpacing: "0.15em", color: "var(--accent)", marginBottom: "14px",
              }}>
                JAVA · Vol.{ROMAN[meta.volume]} · DAY {String(meta.lessonNum).padStart(2, "0")} · {vol?.title || ""}
              </p>

              {/* 标题 */}
              <h1 style={{
                fontFamily: "'AlimamaShuHeiTi', var(--sans)", fontSize: "clamp(26px, 3.5vw, 36px)",
                fontWeight: 900, color: "var(--ink)", marginBottom: "16px", lineHeight: 1.2, wordBreak: "break-word",
              }}>
                {meta.title}
              </h1>

              {/* 难度 + 面试频率标签 */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <span style={{
                  fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em",
                  padding: "3px 12px", borderRadius: "999px",
                  border: "2px solid var(--ink-faint)", color: "var(--ink-faint)",
                }}>
                  {meta.difficulty}
                </span>
                {meta.interviewFreq === "必问" ? (
                  <span className="chip chip-ready" style={{ fontSize: "11px", padding: "3px 14px" }}>
                    必问
                  </span>
                ) : (
                  <span style={{
                    fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em",
                    padding: "3px 12px", borderRadius: "999px",
                    backgroundColor: "var(--accent-wash)", color: "var(--accent-deep)",
                    border: "1px solid transparent",
                  }}>
                    {meta.interviewFreq}
                  </span>
                )}
                {meta.tags.slice(0, 3).map((t) => (
                  <span key={t} style={{
                    fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em",
                    padding: "2px 10px", borderRadius: "4px",
                    color: "var(--ink-soft)",
                  }}>
                    #{t}
                  </span>
                ))}
              </div>
            </header>

            {/* 正文内容 */}
            {ready ? (
              <div className="lesson-body" dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              /* ─── 即将更新占位 —— neo-brutalism 卡片 ─── */
              <div className="nb-card" style={{
                padding: "40px 36px", marginTop: "8px",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: "20px" }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "12px",
                    backgroundColor: "var(--brand)", border: "2px solid #1C1C1C",
                    boxShadow: "3px 3px 0 #1C1C1C",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "22px", flexShrink: 0,
                  }}>
                    📝
                  </div>
                  <div>
                    <h2 style={{ fontFamily: "'AlimamaShuHeiTi', var(--sans)", fontSize: "18px", fontWeight: 900, color: "var(--ink)", marginBottom: "4px" }}>
                      内容正在编写中
                    </h2>
                    <p style={{ fontSize: "13px", color: "var(--ink-faint)", fontStyle: "italic", margin: 0 }}>
                      {meta.desc}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "20px" }}>
                  <span style={{
                    fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, padding: "4px 14px", borderRadius: "999px",
                    backgroundColor: "var(--brand)", color: "var(--ink)", border: "2px solid #1C1C1C",
                    boxShadow: "1.5px 1.5px 0 #1C1C1C",
                  }}>
                    面试频率：{meta.interviewFreq}
                  </span>
                  <span style={{
                    fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, padding: "4px 14px", borderRadius: "999px",
                    backgroundColor: "var(--paper-deep)", color: "var(--ink-soft)", border: "1px solid var(--line)",
                  }}>
                    难度：{meta.difficulty}
                  </span>
                </div>

                <div style={{ marginTop: "28px" }}>
                  <Link href="/java-basics/" style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    padding: "10px 22px", borderRadius: "999px",
                    fontFamily: "var(--sans)", fontSize: "13px", fontWeight: 700,
                    color: "var(--ink-soft)", textDecoration: "none",
                    border: "2px solid var(--line)",
                    transition: "all 0.15s ease",
                  }}>
                    ← 返回文章列表
                  </Link>
                </div>
              </div>
            )}

            {/* 上一篇 / 下一篇 */}
            <nav style={{
              display: "flex", justifyContent: "space-between", marginTop: "56px",
              paddingTop: "24px", borderTop: "1px solid var(--line)", flexWrap: "wrap", gap: "12px",
            }}>
              {prev ? (
                <Link href={`/java-interview/${encodeURIComponent(prev.slug)}/`} style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "10px 20px", borderRadius: "999px",
                  border: "2px solid var(--line)", color: "var(--ink-soft)",
                  fontWeight: 700, fontSize: "13px", textDecoration: "none",
                  transition: "all 0.12s ease",
                }}>
                  ← {prev.title.length > 18 ? prev.title.slice(0, 18) + "…" : prev.title}
                </Link>
              ) : <span />}
              {next ? (
                <Link href={`/java-interview/${encodeURIComponent(next.slug)}/`} className="btn btn-dark" style={{ padding: "10px 24px", color: "#fff", textDecoration: "none" }}>
                  {next.title.length > 18 ? next.title.slice(0, 18) + "…" : next.title} →
                </Link>
              ) : <span />}
            </nav>

            {/* 评论区（giscus → GitHub Discussions） */}
            <CommentSection />
          </article>

          {/* ═══ 右侧边栏：本文大纲（scroll-spy）═══ */}
          <ArticleToc items={tocItems} />

        </div>
      </div>
    </div>
  );
}
