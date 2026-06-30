import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getGenericContent, getArticleSlugs } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getArticleSlugs(".").map((s) => ({ slug: s }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, " ")} — Java 笔记` };
}

export default async function JavaArticlePage({ params }: Props) {
  const { slug } = await params;
  const content = getGenericContent(slug);
  if (!content) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 pt-20 pb-20">
      <div className="text-sm text-white/40 mb-6">
        <Link href="/" className="hover:text-white transition-colors">首页</Link>
        {" / "}
        <Link href="/java-basics/" className="hover:text-white transition-colors">Java 笔记</Link>
      </div>
      <article
        className="prose prose-invert max-w-none [&_.header]:nb-card [&_.header]:mb-8 [&_.station]:nb-card [&_.station]:mb-6 [&_code]:font-mono [&_code]:text-[#FAC94A] [&_pre]:bg-[#111] [&_pre]:border [&_pre]:border-white/10 [&_pre]:rounded-lg [&_pre]:p-4 [&_table]:nb-table"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div className="mt-12 pt-8 border-t border-white/10 text-center">
        <Link href="/java-basics/" className="btn-outline text-sm">← 返回 Java 笔记目录</Link>
      </div>
    </div>
  );
}
