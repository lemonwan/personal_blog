import Link from "next/link";

export const metadata = {
  title: "Java 面试笔记 — WAN",
  description: "系统整理 Java 核心知识，覆盖集合框架、并发编程、JVM、设计模式等高频面试主题。",
};

export default function JavaBasicsPage() {
  return (
    <div>
      <section className="px-6 pt-20 pb-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-widest text-[#FAC94A] mb-4">Java 面试笔记</p>
          <h1 className="text-4xl font-black text-white">15 篇文章 · 7 个主题</h1>
          <p className="mt-4 max-w-xl text-white/60">
            系统整理 Java 核心知识，覆盖集合框架、并发编程、JVM、设计模式等高频面试主题。
            每篇配套源码解读与典型例题。
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[
              { href: "/java-interview-day33-synchronized原理/", title: "synchronized 原理", tags: ["JVM", "并发"], num: 33 },
              { href: "/java-interview-day35-volatile关键字可见性有序性不保证原子性happens-before/", title: "volatile 关键字", tags: ["JVM", "并发"], num: 35 },
              { href: "/java-interview-day25-双亲委派模型及其破坏场景/", title: "双亲委派模型", tags: ["JVM", "类加载"], num: 25 },
              { href: "/java-interview-day16-completablefuture-异步编程/", title: "CompletableFuture 异步编程", tags: ["并发"], num: 16 },
            ].map((a) => (
              <Link key={a.href} href={a.href} className="nb-card group block">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-[#FAC94A]">Day {a.num}</span>
                  <div className="flex gap-2">
                    {a.tags.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-white/40">{t}</span>
                    ))}
                  </div>
                </div>
                <h3 className="font-bold text-white group-hover:text-[#FAC94A] transition-colors">{a.title}</h3>
              </Link>
            ))}
          </div>
          <p className="mt-8 text-sm text-white/40">
            更多 Java 面试笔记请访问{" "}
            <a href="/java-interview-java基础-lambda-表达式与函数式接口/" className="text-[#FAC94A] hover:underline">
              完整文章列表 →
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
