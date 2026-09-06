import type { Metadata } from "next";
import { Suspense } from "react";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "全站搜索 | WAN",
  description: "检索全站 LLM 笔记、Java 笔记与 React 笔记文章",
};

export default function SearchPage() {
  return (
    <div className="ai-llm-scope">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 py-14">
        <p
          className="mb-2 font-mono text-xs font-bold uppercase"
          style={{ letterSpacing: "0.28em", color: "var(--accent)" }}
        >
          Search · 全站检索
        </p>
        <h1
          className="text-3xl font-black mb-8"
          style={{ fontFamily: "'AlimamaShuHeiTi', sans-serif", color: "var(--ink)" }}
        >
          搜索文章
        </h1>
        <Suspense fallback={<SearchSkeleton />}>
          <SearchClient />
        </Suspense>
      </div>
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div
      className="h-14 rounded-xl animate-pulse"
      style={{ background: "var(--paper-deep)", border: "3px solid var(--ink)" }}
    />
  );
}
