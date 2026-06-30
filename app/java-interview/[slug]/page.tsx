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
      <div className="reading-bar" style={{ position: "fixed", top: "64px", left: 0, right: 0, height: "3px", background: "var(--line)", zIndex: 40 }}>
        <div id="reading-progress" style={{ height: "100%", width: "0%", background: "var(--accent)", transition: "width 0.1s linear" }} />
      </div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
        <div style={{ display: "flex", gap: "48px" }}>
          <aside style={{ width: "220px", flexShrink: 0, paddingTop: "56px" }}>
            <div style={{ position: "sticky", top: "80px" }}>
              {vol && (
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", color: "var(--ink-faint)", marginBottom: "12px" }}>
                    卷{getZH(vol.num)} · {vol.title}
                  </div>
                  <ul style={{ listStyle: "none" }}>
                    {getJavaArticlesByVolume(meta.volume).map((a) => (
                      <li key={a.slug}>
                        <Link href={`/java-interview/${encodeURIComponent(a.slug)}/`} style={{
                          display: "flex", alignItems: "center", gap: "10px", padding: "6px 10px", borderRadius: "6px",
                          fontSize: "13px", textDecoration: "none",
                          color: a.slug === decoded ? "var(--accent)" : "var(--ink-soft)",
                          fontWeight: a.slug === decoded ? 700 : 400,
                          background: a.slug === decoded ? "var(--accent-wash)" : "transparent",
                        }}>
                          <span style={{ fontFamily: "var(--mono)", fontSize: "11px", minWidth: "22px", opacity: a.slug === decoded ? 1 : 0.6 }}>
                            {String(a.lessonNum).padStart(2, "0")}
                          </span>
                          <span style={{ lineHeight: 1.3 }}>{a.title.length > 14 ? a.title.slice(0, 14) + "…" : a.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div style={{ borderTop: "1px solid var(--line)", margin: "20px 0" }} />
              <Link href="/java-basics/" style={{ fontSize: "13px", color: "var(--ink-faint)", textDecoration: "none" }}>← 返回 Java 笔记</Link>
            </div>
          </aside>

          <article style={{ flex: 1, minWidth: 0, maxWidth: "788px", paddingTop: "48px", paddingBottom: "80px" }}>
            <div style={{ fontSize: "14px", color: "var(--ink-faint)", marginBottom: "32px" }}>
              <Link href="/" style={{ color: "var(--ink-faint)", textDecoration: "none" }}>首页</Link>
              {" / "}<Link href="/java-basics/" style={{ color: "var(--ink-faint)", textDecoration: "none" }}>Java 面试笔记</Link>
              {" / "}{meta.title}
            </div>

            <header style={{ marginBottom: "40px" }}>
              <p style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center", gap: "6px", fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", color: "var(--accent)", marginBottom: "12px" }}>
                JAVA · 卷{getZH(meta.volume)} · {vol?.title || ""}
              </p>
              <h1 style={{ fontFamily: "'AlimamaShuHeiTi', var(--sans)", fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 900, color: "var(--ink)", lineHeight: 1.2 }}>
                {meta.title}
              </h1>
              <div style={{ display: "flex", gap: "6px", marginTop: "12px" }}>
                {meta.tags.map((t) => (
                  <span key={t} className="chip chip-ready" style={{ fontSize: "11px", padding: "2px 10px" }}>{t}</span>
                ))}
              </div>
            </header>

            <div className="lesson-body" dangerouslySetInnerHTML={{ __html: content }} />

            <nav style={{ display: "flex", justifyContent: "space-between", marginTop: "48px", paddingTop: "24px", borderTop: "1px solid var(--line)" }}>
              {prev ? (
                <Link href={`/java-interview/${encodeURIComponent(prev.slug)}/`} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "999px", border: "2px solid var(--line)", color: "var(--ink-soft)", fontWeight: 700, fontSize: "13px", textDecoration: "none" }}>
                  ← {prev.title.length > 15 ? prev.title.slice(0, 15) + "…" : prev.title}
                </Link>
              ) : <span />}
              {next ? (
                <Link href={`/java-interview/${encodeURIComponent(next.slug)}/`} className="btn btn-dark" style={{ padding: "10px 24px", color: "#fff", textDecoration: "none" }}>
                  {next.title.length > 15 ? next.title.slice(0, 15) + "…" : next.title} →
                </Link>
              ) : <span />}
            </nav>
          </article>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `(function(){var b=document.getElementById('reading-progress');if(!b)return;window.addEventListener('scroll',function(){var h=document.documentElement.scrollHeight-window.innerHeight;b.style.width=h>0?(window.scrollY/h*100)+'%':'0%';});})();` }} />
    </div>
  );
}

function getZH(n: number): string { return ["", "一", "二", "三", "四", "五"][n] || String(n); }
