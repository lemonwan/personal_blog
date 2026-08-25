import Link from "next/link";
import { getGenericContent } from "@/lib/content";

export const metadata = { title: "杭州五常亲子出游攻略" };

export default function FamilyGuidePage() {
  const content = getGenericContent("family-guide");

  return (
    <div className="ai-llm-scope">
      <div className="article-shell">
        <div className="article-main" style={{ margin: "0 auto" }}>
          {/* 面包屑 */}
          <div style={{ fontSize: "14px", color: "var(--ink-faint)", marginBottom: "28px" }}>
            <Link href="/" style={{ color: "var(--ink-faint)", textDecoration: "none" }}>首页</Link>
            {" / "}亲子攻略
          </div>

          {content ? (
            <article className="family-guide" dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--ink-faint)" }}>
              <p>内容加载中…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
