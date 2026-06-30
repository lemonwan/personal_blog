import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WAN — Java 开发工程师",
  description: "Java 技术笔记与 AI 大模型原理教程",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full bg-[#FFF8F0] text-[#1C1C1C] flex flex-col">
        {/* ── Header（深色毛玻璃）── */}
        <header className="fixed left-0 right-0 top-0 z-50">
          <div className="absolute inset-0 border-b border-white/10" style={{ background: "rgba(28,28,28,0.96)", backdropFilter: "blur(12px)" }} />
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-10">
                <a href="/" className="flex-shrink-0 font-black text-xl text-[#FAC94A] hover:opacity-80 transition-opacity">WAN</a>
                <nav className="hidden items-center gap-6 md:flex">
                  <a href="/" className="text-sm font-semibold text-white/60 hover:text-white transition-colors">首页</a>
                  <a href="/ai-llm/" className="text-sm font-semibold text-[#FAC94A] transition-colors">AI 大模型教程</a>
                  <a href="/java-basics/" className="text-sm font-semibold text-white/60 hover:text-white transition-colors">Java 笔记</a>
                </nav>
              </div>
              <button className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white md:hidden" aria-label="菜单">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </header>
        <main className="pt-16 flex-1">{children}</main>
        <footer className="section-dark py-8 text-center text-sm text-white/40">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between gap-4">
            <span>© 2026 wan. Crafted with intent.</span>
            <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">浙ICP备2022022811号-1</a>
            <span />
          </div>
        </footer>
      </body>
    </html>
  );
}
