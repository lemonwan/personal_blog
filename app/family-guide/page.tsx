import Link from "next/link";
import { getGenericContent } from "@/lib/content";

export const metadata = { title: "杭州五常亲子出游攻略" };

export default function FamilyGuidePage() {
  const content = getGenericContent("family-guide");

  return (
    <div className="mx-auto max-w-3xl px-6 pt-20 pb-20">
      <div className="text-sm text-white/40 mb-6">
        <Link href="/" className="hover:text-white transition-colors">首页</Link>
        {" / "}亲子攻略
      </div>
      {content ? (
        <article
          className="[&_.container]:max-w-none [&_.container]:p-0 [&_h1]:text-3xl [&_h1]:font-black [&_h1]:text-[#FAC94A] [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_.card]:nb-card [&_.card]:mb-6 [&_td]:border [&_td]:border-white/10 [&_td]:p-3 [&_th]:bg-[#242424] [&_th]:p-3 [&_th]:text-[#FAC94A]"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <p className="text-white/40 text-center py-20">内容加载中…</p>
      )}
    </div>
  );
}
