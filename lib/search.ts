import {
  AI_LESSONS,
  JAVA_ARTICLES,
  REACT_ARTICLES,
  VOLUMES,
  JAVA_VOLUMES,
  REACT_VOLUMES,
  getLessonContent,
  getJavaContent,
  getReactContent,
  getGenericContent,
  decodeEntities,
} from "./content";

export interface SearchDoc {
  title: string;
  url: string;
  section: string;
  meta: string;
  desc: string;
  tags: string[];
  body: string;
}

/** 正文 HTML → 纯文本（去 script/style/标签、解码实体、压缩空白） */
function htmlToText(html: string | null): string {
  if (!html) return "";
  return decodeEntities(
    html
      .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

const ROMAN = ["", "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ"];

/**
 * 构建全站检索文档（仅在构建期的 Route Handler 中执行）。
 * 元数据与正文分别来自 lib/content.ts 与 content/*.html，
 * 无正文的占位文章仍可通过标题/简介/标签被搜到。
 */
export function buildSearchIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [];
  const seen = new Set<string>();

  const push = (d: SearchDoc) => {
    if (seen.has(d.url)) return;
    seen.add(d.url);
    docs.push(d);
  };

  for (const l of AI_LESSONS) {
    const vol = VOLUMES.find((v) => v.num === l.volume);
    push({
      title: l.title,
      url: `/ai-llm/lessons/${l.slug}/`,
      section: "LLM 笔记",
      meta: `Vol.${ROMAN[l.volume]} ${vol?.title ?? ""} · 第 ${String(l.lessonNum).padStart(2, "0")} 课`,
      desc: l.question,
      tags: [],
      body: htmlToText(getLessonContent(l.slug)),
    });
  }

  for (const a of JAVA_ARTICLES) {
    const vol = JAVA_VOLUMES.find((v) => v.num === a.volume);
    push({
      title: a.title,
      url: `/java-interview/${encodeURIComponent(a.slug)}/`,
      section: "Java 笔记",
      meta: `Vol.${ROMAN[a.volume]} ${vol?.title ?? ""} · DAY ${String(a.lessonNum).padStart(2, "0")}`,
      desc: a.desc,
      tags: [...a.tags, a.difficulty, a.interviewFreq],
      body: htmlToText(getJavaContent(a.slug)),
    });
  }

  for (const a of REACT_ARTICLES) {
    const vol = REACT_VOLUMES.find((v) => v.num === a.volume);
    push({
      title: a.title,
      url: `/react-notes/${encodeURIComponent(a.slug)}/`,
      section: "React 笔记",
      meta: `Vol.${ROMAN[a.volume]} ${vol?.title ?? ""} · #${String(a.lessonNum).padStart(2, "0")}`,
      desc: a.desc,
      tags: [...a.tags, a.level],
      body: htmlToText(getReactContent(a.slug)),
    });
  }

  push({
    title: "杭州五常亲子出游攻略",
    url: "/family-guide/",
    section: "生活",
    meta: "亲子出游",
    desc: "杭州五常周边亲子出游攻略",
    tags: ["生活", "亲子"],
    body: htmlToText(getGenericContent("family-guide")),
  });

  return docs;
}
