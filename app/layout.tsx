import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WAN — Java 开发工程师",
  description: "Java 技术笔记与 AI 大模型原理教程",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full bg-[#FFF8F0] text-[#1C1C1C] flex flex-col">
        {/* ── Header（深色毛玻璃）── */}
        <header className="fixed left-0 right-0 top-0 z-50">
          <div className="absolute inset-0 border-b border-white/10" style={{ background: "rgba(28,28,28,0.96)", backdropFilter: "blur(12px)" }} />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex h-16 items-center justify-between gap-3">
              <a href="/" aria-label="首页" className="flex-shrink-0 hover:opacity-80 transition-opacity">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/avatar.png"
                  alt="WAN"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full ring-2 ring-[#FAC94A]/60 shadow-sm"
                />
              </a>
              {/* 导航：手机上也可见（右对齐、字号缩小），桌面拉开间距 */}
              <nav className="flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar">
                <a href="/" className="whitespace-nowrap text-xs sm:text-sm font-semibold text-white/60 hover:text-white transition-colors">首页</a>
                <a href="/ai-llm/" className="whitespace-nowrap text-xs sm:text-sm font-semibold text-[#FAC94A] transition-colors">LLM 笔记</a>
                <a href="/java-basics/" className="whitespace-nowrap text-xs sm:text-sm font-semibold text-white/60 hover:text-white transition-colors">Java 笔记</a>
              </nav>
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
