import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getReactContent, getReactArticle, REACT_ARTICLES, REACT_VOLUMES, getReactArticlesByVolume, extractToc } from "@/lib/content";
import type { ReactLevel } from "@/lib/content";
import CommentSection from "../../CommentSection";
import ArticleToc from "../../ArticleToc";

type Props = { params: Promise<{ slug: string }> };

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII"];

/* ── 难度分级 → 颜色映射 ── */
const LEVEL_COLORS: Record<ReactLevel, string> = {
  "入门": "#FAC94A",
  "进阶": "#C2410C",
  "实战": "#1C1C1C",
};

export function generateStaticParams() {
  const seen = new Set<string>();
  return REACT_ARTICLES
    .filter((a) => { if (seen.has(a.slug)) return false; seen.add(a.slug); return true; })
    .map((a) => ({
      // 生产构建（静态导出给 nginx 托管）：返回原始 slug，导出目录名为解码后的中文名，
      // nginx 收到 %E7%BA%BF... 这类 URL 时会先解码再找文件，才能命中。
      // dev 模式：Next 校验的是 URL 中的 encoded 形态，须返回 encodeURIComponent 结果。
      slug: process.env.NODE_ENV === "production" ? a.slug : encodeURIComponent(a.slug),
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const meta = getReactArticle(decoded);
  return { title: meta ? `${meta.title} | React 学习笔记` : "React 笔记" };
}

export default async function ReactArticlePage({ params }: Props) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const meta = getReactArticle(decoded);
  if (!meta) notFound();

  const content = getReactContent(decoded);
  const ready = content !== null;
  const tocItems = content ? extractToc(content) : [];

  const vol = REACT_VOLUMES.find((v) => v.num === meta.volume);
  const idx = REACT_ARTICLES.findIndex((a) => a.slug === decoded);
  const prev = idx > 0 ? REACT_ARTICLES[idx - 1] : null;
  const next = idx < REACT_ARTICLES.length - 1 ? REACT_ARTICLES[idx + 1] : null;

  const volArticles = getReactArticlesByVolume(meta.volume);
  const coreInVol = volArticles.filter((a) => a.focus).length;

  return (
    <div className="ai-llm-scope">
      <div className="article-shell">
        <div className="article-grid">

          {/* ═══ 左侧边栏：全书目录风 ═══ */}
          <aside className="article-side">
            <div style={{ position: "sticky", top: "80px", maxHeight: "calc(100vh - 100px)", overflowY: "auto", paddingRight: "4px" }}>

              <div style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", color: "var(--ink-faint)", marginBottom: "16px" }}>
                React 学习笔记
              </div>

              {REACT_VOLUMES.map((v) => {
                const isCurrent = v.num === meta.volume;
                const articles = getReactArticlesByVolume(v.num);
                const countCore = articles.filter((a) => a.focus).length;

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
                          <Link href={`/react-notes/${encodeURIComponent(a.slug)}/`} style={{
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
                            {a.focus && (
                              <span style={{ fontSize: "9px", fontWeight: 900, color: "var(--brand)", background: "#1C1C1C", padding: "1px 5px", borderRadius: "999px", lineHeight: "1.3", flexShrink: 0 }}>
                                核心
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
              <Link href="/react-notes/" style={{ fontSize: "13px", color: "var(--ink-faint)", textDecoration: "none" }}>
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
              <Link href="/react-notes/" style={{ color: "var(--ink-faint)", textDecoration: "none" }}>React 学习笔记</Link>
              {" / "}第 {String(meta.lessonNum).padStart(2, "0")} 篇
            </div>

            {/* 文章头部 */}
            <header style={{ marginBottom: "36px" }}>
              {/* Meta 行：REACT · VOL · LESSON · 主题 */}
              <p style={{
                display: "inline-flex", flexWrap: "wrap", alignItems: "center", gap: "6px",
                fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 700,
                letterSpacing: "0.15em", color: "var(--accent)", marginBottom: "14px",
              }}>
                REACT · Vol.{ROMAN[meta.volume]} · LESSON {String(meta.lessonNum).padStart(2, "0")} · {vol?.title || ""}
              </p>

              {/* 标题 */}
              <h1 style={{
                fontFamily: "'AlimamaShuHeiTi', var(--sans)", fontSize: "clamp(26px, 3.5vw, 36px)",
                fontWeight: 900, color: "var(--ink)", marginBottom: "16px", lineHeight: 1.2, wordBreak: "break-word",
              }}>
                {meta.title}
              </h1>

              {/* 难度分级 + 标签 */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <span style={{
                  fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em",
                  padding: "3px 14px", borderRadius: "999px",
                  backgroundColor: `${LEVEL_COLORS[meta.level]}18`, color: LEVEL_COLORS[meta.level],
                  border: `2px solid ${LEVEL_COLORS[meta.level]}`,
                }}>
                  {meta.level}
                </span>
                {meta.focus && (
                  <span className="chip chip-ready" style={{ fontSize: "11px", padding: "3px 14px" }}>
                    核心
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
              /* ─── 内容编写中占位 —— neo-brutalism 卡片 ─── */
              <div className="nb-card" style={{ padding: "40px 36px", marginTop: "8px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: "20px" }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "12px",
                    backgroundColor: "var(--brand)", border: "2px solid #1C1C1C",
                    boxShadow: "3px 3px 0 #1C1C1C",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "22px", flexShrink: 0,
                  }}>
                    ⚛️
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
                    分级：{meta.level}
                  </span>
                  <span style={{
                    fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, padding: "4px 14px", borderRadius: "999px",
                    backgroundColor: "var(--paper-deep)", color: "var(--ink-soft)", border: "1px solid var(--line)",
                  }}>
                    本卷已整理 {coreInVol} 篇核心内容
                  </span>
                </div>

                <div style={{ marginTop: "28px" }}>
                  <Link href="/react-notes/" style={{
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
                <Link href={`/react-notes/${encodeURIComponent(prev.slug)}/`} style={{
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
                <Link href={`/react-notes/${encodeURIComponent(next.slug)}/`} className="btn btn-dark" style={{ padding: "10px 24px", color: "#fff", textDecoration: "none" }}>
                  {next.title.length > 18 ? next.title.slice(0, 18) + "…" : next.title} →
                </Link>
              ) : <span />}
            </nav>

            {/* 评论区（giscus → GitHub Discussions） */}
            <CommentSection />
          </article>

          {/* 右侧：本文章节大纲（scroll-spy） */}
          {ready && <ArticleToc items={tocItems} />}

        </div>
      </div>
    </div>
  );
}