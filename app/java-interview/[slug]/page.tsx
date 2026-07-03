import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getJavaContent, getJavaArticle, JAVA_ARTICLES, JAVA_VOLUMES, getJavaArticlesByVolume } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

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
  if (!content) notFound();

  const vol = JAVA_VOLUMES.find((v) => v.num === meta.volume);
  const idx = JAVA_ARTICLES.findIndex((a) => a.slug === decoded);
  const prev = idx > 0 ? JAVA_ARTICLES[idx - 1] : null;
  const next = idx < JAVA_ARTICLES.length - 1 ? JAVA_ARTICLES[idx + 1] : null;

  return (
    <div className="ai-llm-scope">
      <div className="article-shell">
        <div className="article-grid">
          <aside className="article-side">
            <div style={{ position: "sticky", top: "80px" }}>
              {vol && (
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.12em", color: "var(--ink-faint)", marginBottom: "14px" }}>
                    卷{getZH(vol.num)} · {vol.title}
                  </div>
                  <ul style={{ listStyle: "none" }}>
                    {getJavaArticlesByVolume(meta.volume).map((a) => (
                      <li key={a.slug}>
                        <Link href={`/java-interview/${encodeURIComponent(a.slug)}/`} style={{
                          display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "6px",
                          fontSize: "15px", textDecoration: "none", lineHeight: 1.4,
                          color: a.slug === decoded ? "var(--accent)" : "var(--ink-soft)",
                          fontWeight: a.slug === decoded ? 700 : 400,
                          background: a.slug === decoded ? "var(--accent-wash)" : "transparent",
                        }}>
                          <span style={{ fontFamily: "var(--mono)", fontSize: "13px", minWidth: "24px", opacity: a.slug === decoded ? 1 : 0.6 }}>
                            {String(a.lessonNum).padStart(2, "0")}
                          </span>
                          <span style={{ lineHeight: 1.4 }}>{a.title.length > 14 ? a.title.slice(0, 14) + "…" : a.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div style={{ borderTop: "1px solid var(--line)", margin: "20px 0" }} />
              <Link href="/java-basics/" style={{ fontSize: "14px", color: "var(--ink-faint)", textDecoration: "none" }}>← 返回 Java 笔记</Link>
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
                JAVA · 卷{getZH(meta.volume)} · {vol?.title || ""}
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

            <div className="lesson-body" dangerouslySetInnerHTML={{ __html: content }} />

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

      {/* 浮动"回到顶部"按钮 + 环形阅读进度 */}
      <button
        id="back-to-top"
        type="button"
        aria-label="回到顶部"
        title="回到顶部"
        style={{
          position: "fixed",
          right: "20px",
          bottom: "max(24px, env(safe-area-inset-bottom))",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "#1C1C1C",
          border: "none",
          padding: 0,
          cursor: "pointer",
          zIndex: 60,
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.28)",
          opacity: 0,
          transition: "opacity 0.2s ease",
        }}
      >
        <svg width="52" height="52" viewBox="0 0 52 52" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)", pointerEvents: "none" }} aria-hidden="true">
          <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
          <circle id="progress-ring" cx="26" cy="26" r="22" fill="none" stroke="#FAC94A" strokeWidth="3" strokeDasharray="138.23" strokeDashoffset="138.23" strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.1s linear" }} />
        </svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FAC94A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: "relative", zIndex: 1 }} aria-hidden="true">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>

      <script dangerouslySetInnerHTML={{ __html: `(function(){var btn=document.getElementById('back-to-top');var ring=document.getElementById('progress-ring');var C=138.23;function onScroll(){var h=document.documentElement.scrollHeight-window.innerHeight;var p=h>0?Math.min(1,Math.max(0,window.scrollY/h)):0;if(ring)ring.style.strokeDashoffset=(C*(1-p)).toString();if(btn){var show=window.scrollY>400;btn.style.display=show?'inline-flex':'none';btn.style.opacity=show?'1':'0';}}window.addEventListener('scroll',onScroll,{passive:true});onScroll();if(btn)btn.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});})();` }} />
    </div>
  );
}

function getZH(n: number): string { return ["", "一", "二", "三", "四", "五"][n] || String(n); }
