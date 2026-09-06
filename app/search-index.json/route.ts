import { buildSearchIndex } from "@/lib/search";

// 静态导出：构建期把全站索引固化为 out/search-index.json（仅支持 GET）
export const dynamic = "force-static";

export async function GET() {
  return Response.json(buildSearchIndex());
}
