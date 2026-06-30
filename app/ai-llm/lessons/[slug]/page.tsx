import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getLessonContent, getLessonBySlug, AI_LESSONS, getLessonsByVolume, VOLUMES } from "@/lib/content";
import { LessonClient } from "./LessonClient";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return AI_LESSONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = getLessonBySlug(slug);
  if (!meta) return { title: "课程未找到" };
  return {
    title: `第${String(meta.lessonNum).padStart(2, "0")}课 · ${meta.title} | AI 大模型原理教程`,
    description: meta.question,
  };
}

export default async function LessonPage({ params }: Props) {
  const { slug } = await params;
  const meta = getLessonBySlug(slug);
  if (!meta) notFound();

  const content = getLessonContent(slug);
  const lessonIdx = AI_LESSONS.findIndex((l) => l.slug === slug);
  const prev = lessonIdx > 0 ? AI_LESSONS[lessonIdx - 1] : null;
  const next = lessonIdx < AI_LESSONS.length - 1 ? AI_LESSONS[lessonIdx + 1] : null;
  const vol = VOLUMES.find((v) => v.num === meta.volume);

  return (
    <div className="ai-llm-scope">
      {/* ── Reading progress bar（对标源站 reading-bar）── */}
      <div className="reading-bar" style={{
        position: "fixed", top: "64px", left: 0, right: 0, height: "3px",
        background: "var(--line)", zIndex: 40
      }}>
        <div id="reading-progress" style={{ height: "100%", width: "0%", background: "var(--accent)", transition: "width 0.1s linear" }} />
      </div>

      {/* ── Lesson layout ── */}
      <div className="lesson-layout" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
        <div style={{ display: "flex", gap: "48px" }}>
          {/* ── Left sidebar: lesson rail ── */}
          <aside className="lesson-rail" style={{
            width: "var(--rail-w, 220px)", flexShrink: 0, paddingTop: "56px",
          }}>
            <div style={{ position: "sticky", top: "80px" }}>
              {vol && (
                <div style={{ marginBottom: "24px" }}>
                  <div style={{
                    fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700,
                    letterSpacing: "0.15em", color: "var(--ink-faint)", marginBottom: "12px",
                    textTransform: "uppercase"
                  }}>
                    卷{getZH(vol.num)} · {vol.title}
                  </div>
                  <ul className="sidebar-lesson-list" style={{ listStyle: "none" }}>
                    {getLessonsByVolume(meta.volume).map((l) => (
                      <li key={l.slug}>
                        <Link
                          href={`/ai-llm/lessons/${l.slug}/`}
                          style={{
                            display: "flex", alignItems: "center", gap: "10px",
                            padding: "6px 10px", borderRadius: "6px",
                            fontSize: "14px", textDecoration: "none",
                            color: l.slug === slug ? "var(--accent)" : "var(--ink-soft)",
                            fontWeight: l.slug === slug ? 700 : 400,
                            background: l.slug === slug ? "var(--accent-wash)" : "transparent",
                            transition: "all 0.12s",
                          }}
                        >
                          <span style={{ fontFamily: "var(--mono)", fontSize: "12px", minWidth: "24px", opacity: l.slug === slug ? 1 : 0.6 }}>
                            {String(l.lessonNum).padStart(2, "0")}
                          </span>
                          <span style={{ lineHeight: 1.3 }}>{l.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div style={{ borderTop: "1px solid var(--line)", margin: "20px 0" }} />
              <Link href="/ai-llm/" style={{ fontSize: "13px", color: "var(--ink-faint)", textDecoration: "none" }}>
                ← 返回学习地图
              </Link>
            </div>
          </aside>

          {/* ── Main lesson content ── */}
          <article className="lesson-content" style={{
            flex: 1, minWidth: 0, maxWidth: "var(--content-w, 788px)",
            paddingTop: "48px", paddingBottom: "80px"
          }}>
            {/* Breadcrumb */}
            <div className="lesson-breadcrumb" style={{ fontSize: "14px", color: "var(--ink-faint)", marginBottom: "32px" }}>
              <Link href="/" style={{ color: "var(--ink-faint)", textDecoration: "none" }}>首页</Link>
              {" / "}
              <Link href="/ai-llm/" style={{ color: "var(--ink-faint)", textDecoration: "none" }}>AI 大模型教程</Link>
              {" / "}第 {String(meta.lessonNum).padStart(2, "0")} 课
            </div>

            {/* Lesson hero */}
            <header className="lesson-hero reveal" style={{ marginBottom: "40px" }}>
              <p className="lesson-meta reveal" style={{
                display: "inline-flex", flexWrap: "wrap", alignItems: "center", gap: "6px",
                fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 700,
                letterSpacing: "0.15em", color: "var(--accent)", marginBottom: "12px", textTransform: "uppercase"
              }}>
                LESSON {String(meta.lessonNum).padStart(2, "0")} · 卷{getZH(vol?.num || meta.volume)} · {vol?.title || ""}
              </p>
              <h1 className="reveal" style={{
                fontFamily: "'AlimamaShuHeiTi', var(--sans)", fontSize: "clamp(28px, 3.5vw, 40px)",
                fontWeight: 900, color: "var(--ink)", marginBottom: "12px", lineHeight: 1.2
              }}>
                {meta.title}
              </h1>
              <p className="lesson-lede reveal" style={{
                fontSize: "17px", color: "var(--ink-soft)", fontStyle: "italic", lineHeight: 1.6
              }}>
                ❝ {meta.question} ❞
              </p>
            </header>

            {/* Lesson body content */}
            {content ? (
              <LessonClient content={content} />
            ) : (
              <div style={{ textAlign: "center", padding: "80px 0", color: "var(--ink-faint)" }}>
                <p>课程内容加载中…</p>
              </div>
            )}

            {/* Next/Prev navigation */}
            <nav style={{
              display: "flex", justifyContent: "space-between", marginTop: "48px",
              paddingTop: "24px", borderTop: "1px solid var(--line)"
            }}>
              {prev ? (
                <Link href={`/ai-llm/lessons/${prev.slug}/`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    padding: "10px 20px", borderRadius: "999px",
                    border: "2px solid var(--line)", color: "var(--ink-soft)",
                    fontWeight: 700, fontSize: "13px", textDecoration: "none"
                  }}>
                  ← {prev.title}
                </Link>
              ) : <span />}
              {next ? (
                <Link href={`/ai-llm/lessons/${next.slug}/`}
                  className="btn btn-dark" style={{ padding: "10px 24px", color: "#fff", textDecoration: "none" }}>
                  {next.title} →
                </Link>
              ) : <span />}
            </nav>
          </article>
        </div>
      </div>

      {/* Reading progress JS */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          var bar=document.getElementById('reading-progress');
          if(!bar)return;
          window.addEventListener('scroll',function(){
            var h=document.documentElement.scrollHeight-window.innerHeight;
            bar.style.width=h>0?(window.scrollY/h*100)+'%':'0%';
          });
        })();
      `}} />
    </div>
  );
}

function getZH(n: number): string { return ["", "一", "二", "三", "四", "五"][n] || String(n); }
