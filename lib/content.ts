import fs from "fs";
import path from "path";
import { cache } from "react";

const BACKUP_DIR = path.join(process.cwd(), "content");
const AI_LLM_DIR = path.join(BACKUP_DIR, "ai-llm");

export interface LessonMeta {
  slug: string;
  title: string;
  question: string;
  volume: number;
  lessonNum: number;
}

// Lesson slugs and metadata — mirrors the backup file names
export const AI_LESSONS: LessonMeta[] = [
  // Vol 1: 基础数学
  { slug: "math-01-vector", title: "什么是向量", question: "计算机只认识数字，它怎么知道「猫」和「老虎」比「猫」和「金鱼」更像？", volume: 1, lessonNum: 1 },
  { slug: "math-02-ops", title: "向量的常见运算", question: "「相似」可以被计算吗？——加法、点积、余弦相似度", volume: 1, lessonNum: 2 },
  { slug: "math-03-matrix", title: "什么是矩阵", question: "神经网络每一层把一组数字变成另一组数字——这个变换用什么来表示？", volume: 1, lessonNum: 3 },
  { slug: "math-03-transform", title: "什么是线性变换", question: "矩阵乘法到底在做什么？——把整个空间一起旋转、拉伸、搬动", volume: 1, lessonNum: 4 },
  { slug: "math-04-gradient", title: "什么是梯度", question: "蒙着眼睛站在山坡上，怎么走到山谷最低点？", volume: 1, lessonNum: 5 },
  { slug: "math-05-prob", title: "概率与信息", question: "神经网络的输出为什么叫「概率」？——从频率到交叉熵损失", volume: 1, lessonNum: 6 },
  // Vol 2: 神经网络
  { slug: "nn-01-neuron", title: "神经元结构", question: "一个「脑细胞」是怎么工作的？——输入、加权、激活", volume: 2, lessonNum: 7 },
  { slug: "nn-02-activation", title: "激活函数", question: "为什么神经网络不能全是线性的？——非线性的力量", volume: 2, lessonNum: 8 },
  { slug: "nn-03-network", title: "神经网络与训练", question: "神经网络是怎么「学习」的？——前向传播与反向传播", volume: 2, lessonNum: 9 },
  { slug: "nn-03-loss", title: "损失函数", question: "怎么衡量「预测错了」？——从MSE到交叉熵", volume: 2, lessonNum: 10 },
  { slug: "nn-04-softmax", title: "Softmax", question: "一组任意大小的分数，怎么变成一组加起来等于1的概率？", volume: 2, lessonNum: 11 },
  { slug: "nn-05-sgd", title: "梯度下降与优化器", question: "知道了往哪走是下坡，一步该迈多大？", volume: 2, lessonNum: 12 },
  { slug: "nn-06-backprop", title: "反向传播", question: "输出层错了，第一层的某个权重该负多大责任？", volume: 2, lessonNum: 13 },
  // Vol 3: 自然语言处理
  { slug: "nlp-01-ngram", title: "语言的概率游戏：N-gram", question: "在「我爱」后面，最可能接哪个字？——统计语言模型的开端", volume: 3, lessonNum: 14 },
  { slug: "nlp-02-word2vec", title: "词向量", question: "「国王 - 男人 + 女人 ≈ 女王」是怎么做到的？", volume: 3, lessonNum: 15 },
  { slug: "nlp-03-ffnn-lm", title: "前馈神经网络语言模型", question: "用神经网络来预测下一个词——比N-gram强在哪里？", volume: 3, lessonNum: 16 },
  { slug: "nlp-04-rnn", title: "RNN 循环神经网络", question: "句子长短不一，神经网络怎么处理任意长度的序列？", volume: 3, lessonNum: 17 },
  { slug: "nlp-05-lstm", title: "LSTM 长短期记忆网络", question: "RNN的记忆为什么传不远？——给记忆装上「阀门」", volume: 3, lessonNum: 18 },
  // Vol 4: 大语言模型
  { slug: "tf-01-attention", title: "注意力机制", question: "翻译「它」的时候，该看句子里的哪个词？", volume: 4, lessonNum: 19 },
  { slug: "tf-02-multihead", title: "多头注意力", question: "注意力只能有一种看法吗？——同时关注语法、语义、指代关系", volume: 4, lessonNum: 20 },
  { slug: "tf-transformer", title: "Transformer 架构", question: "当注意力机制遇到残差连接和层归一化——质变发生了", volume: 4, lessonNum: 21 },
  { slug: "tf-03-tokenizer", title: "Tokenizer 分词器", question: "大模型输入的不是字，不是词——那到底是什么？", volume: 4, lessonNum: 22 },
  { slug: "tf-04-arch", title: "编码器、解码器与大语言模型", question: "同样是Transformer，BERT为什么不能生成文章，GPT为什么是主流？", volume: 4, lessonNum: 23 },
  { slug: "tf-05-residual", title: "残差连接与层归一化", question: "96层Transformer——梯度怎么从第96层传回第1层而不消失？", volume: 4, lessonNum: 24 },
  { slug: "tf-06-training", title: "预训练 · 监督微调 · 强化学习", question: "「会接话」和「会帮忙」之间有一道鸿沟——ChatGPT的三个训练阶段", volume: 4, lessonNum: 25 },
  { slug: "tf-07-sparse", title: "KV缓存、稀疏注意力与FlashAttention", question: "注意力的账单是O(n²)——处理一本书，工程师用什么手段把它变快？", volume: 4, lessonNum: 26 },
  { slug: "tf-08-moe", title: "MoE 混合专家架构", question: "GPT-4据说有1.8万亿参数——推理每次却只用其中一小部分，怎么做到的？", volume: 4, lessonNum: 27 },
  { slug: "tf-09-distill", title: "模型蒸馏", question: "大模型的能力能「传授」给小模型吗？——软标签里藏着什么「暗知识」？", volume: 4, lessonNum: 28 },
  { slug: "tf-10-recap", title: "串讲：从N-gram到Transformer", question: "学了这么多细节，怎么把它们重新串成一条线？——每一代技术，都是来解上一代死结的", volume: 4, lessonNum: 29 },
  { slug: "tf-11-frontier", title: "前沿与未来：下一程", question: "ChatGPT之后呢？——当下最活跃的研究方向，与大模型可能的演变", volume: 4, lessonNum: 30 },
  // Appendix
  { slug: "appendix-transformer-3d", title: "Transformer 3D 全景图", question: "一图看尽Transformer的每一层、每一个组件", volume: 5, lessonNum: 31 },
  { slug: "appendix-attention-paper", title: "《Attention Is All You Need》原文", question: "回到那篇改变了一切的论文——现在你能完全读懂它了", volume: 5, lessonNum: 32 },
];

export const VOLUMES = [
  { num: 1, title: "基础数学", subtitle: "把世界变成数字", emoji: "📐", count: 6 },
  { num: 2, title: "神经网络", subtitle: "让数字学会学习", emoji: "🧠", count: 7 },
  { num: 3, title: "自然语言处理", subtitle: "教机器读懂语言", emoji: "📝", count: 5 },
  { num: 4, title: "大语言模型", subtitle: "一路长成ChatGPT", emoji: "🚀", count: 12 },
  { num: 5, title: "附录", subtitle: "回到原典与全景", emoji: "📚", count: 2 },
];

// Extract cleaned body HTML from backup lesson file
export const getLessonContent = cache((slug: string): string | null => {
  const filePath = path.join(AI_LLM_DIR, `${slug}.html`);
  try {
    let html = fs.readFileSync(filePath, "utf-8");
    // Extract body content
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (!bodyMatch) return null;
    let body = bodyMatch[1];
    // Remove inline style blocks (neobrutalism handles styling)
    body = body.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
    // Remove site.css/katex links (handled elsewhere)
    body = body.replace(/<link[^>]*rel="stylesheet"[^>]*\/?>/gi, "");
    // Remove old script tags (quiz/slider handled by our new system)
    body = body.replace(/<script[^>]*defer[^>]*src="[^"]*site\.js"[^>]*><\/script>/gi, "");
    body = body.replace(/<script[^>]*defer[^>]*src="[^"]*theme\.js"[^>]*><\/script>/gi, "");
    // Remove like-button residue
    body = body.replace(/<div[^>]*aria-label="点赞"[^>]*>[\s\S]*?人看过<\/div><\/div>/gi, "");
    // Remove duplicate next-card (keep outer one from layout)
    body = body.replace(/<a[^>]*class="next-card"[^>]*>[\s\S]*?<\/a>/gi, "");
    return body.trim();
  } catch {
    return null;
  }
});

export function getLessonBySlug(slug: string): LessonMeta | undefined {
  return AI_LESSONS.find((l) => l.slug === slug);
}

export function getLessonsByVolume(volume: number): LessonMeta[] {
  return AI_LESSONS.filter((l) => l.volume === volume);
}

/* ── Generic content loader (Java articles, family-guide, etc.) ── */
export function getGenericContent(relPath: string): string | null {
  const filePath = path.join(BACKUP_DIR, `${relPath}.html`);
  try {
    let html = fs.readFileSync(filePath, "utf-8");
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (!bodyMatch) return null;
    let body = bodyMatch[1];
    body = body.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
    body = body.replace(/<link[^>]*rel="stylesheet"[^>]*\/?>/gi, "");
    body = body.replace(/<script[^>]*defer[^>]*src="[^"]*site\.js"[^>]*><\/script>/gi, "");
    body = body.replace(/<script[^>]*defer[^>]*src="[^"]*theme\.js"[^>]*><\/script>/gi, "");
    return body.trim();
  } catch {
    return null;
  }
}

export function getArticleSlugs(dir: string): string[] {
  try {
    return fs.readdirSync(path.join(BACKUP_DIR, dir))
      .filter(f => f.endsWith('.html') && !f.startsWith('index') && f !== 'family-guide.html')
      .map(f => f.replace(/\.html$/, ''));
  } catch { return []; }
}

/* ── Java 面试笔记 元数据 ── */
export interface JavaArticleMeta {
  slug: string;
  title: string;
  volume: number;
  lessonNum: number;
  tags: string[];
}

export const JAVA_VOLUMES = [
  { num: 1, title: "集合框架", subtitle: "数据结构与容器", emoji: "📦", desc: "HashMap、ConcurrentHashMap、ArrayList——Java 世界里最常用的数据结构，从底层实现到线程安全。" },
  { num: 2, title: "并发编程", subtitle: "多线程与锁机制", emoji: "⚡", desc: "synchronized、volatile、CompletableFuture——理解 Java 并发模型，写出正确的多线程代码。" },
  { num: 3, title: "JVM 原理与调优", subtitle: "虚拟机内核与性能", emoji: "🔧", desc: "类加载、内存模型、GC 算法、性能调优——深入 JVM 内部，掌握排查与优化能力。" },
  { num: 4, title: "Java 基础与高级特性", subtitle: "语言核心与设计哲学", emoji: "📖", desc: "Lambda、Stream、泛型、反射、异常处理——回归语言本源，理解设计者的意图。" },
];

export const JAVA_ARTICLES: JavaArticleMeta[] = [
  // 卷一：集合框架
  { slug: "java-interview-day1-hashmap", title: "HashMap 底层实现", volume: 1, lessonNum: 1, tags: ["集合", "核心"] },
  { slug: "java-interview-day2-concurrenthashmap", title: "ConcurrentHashMap 演进", volume: 1, lessonNum: 2, tags: ["集合", "并发"] },
  { slug: "java-interview-Java基础-HashMap底层实现", title: "HashMap 源码深度解析", volume: 1, lessonNum: 3, tags: ["集合", "源码"] },
  { slug: "java-interview-java基础-arraylist-vs-linkedlist-使用场景", title: "ArrayList vs LinkedList", volume: 1, lessonNum: 4, tags: ["集合", "对比"] },
  { slug: "java-interview-一-集合框架-ArrayList-vs-LinkedList-使用场景", title: "ArrayList vs LinkedList 深入对比", volume: 1, lessonNum: 5, tags: ["集合", "对比"] },
  { slug: "java-interview-一-集合框架-HashMap底层实现", title: "HashMap 底层原理详解", volume: 1, lessonNum: 6, tags: ["集合", "核心"] },
  { slug: "java-interview-一-集合框架-ConcurrentHashMap分段锁到CAS+synchronized的演进", title: "ConcurrentHashMap 锁演进", volume: 1, lessonNum: 7, tags: ["集合", "并发"] },
  { slug: "java-interview-java基础-hashset-treeset-底层原理", title: "HashSet 与 TreeSet 底层原理", volume: 1, lessonNum: 8, tags: ["集合", "源码"] },
  { slug: "java-interview-java基础-iterator-遍历机制和-fail-fast-机制", title: "Iterator 与 fail-fast 机制", volume: 1, lessonNum: 9, tags: ["集合", "机制"] },

  // 卷二：并发编程
  { slug: "java-interview-day31-线程创建方式", title: "线程创建方式", volume: 2, lessonNum: 10, tags: ["并发", "基础"] },
  { slug: "java-interview-day32-线程状态与转换", title: "线程状态与转换", volume: 2, lessonNum: 11, tags: ["并发", "基础"] },
  { slug: "java-interview-day33-synchronized原理", title: "synchronized 原理", volume: 2, lessonNum: 12, tags: ["并发", "核心"] },
  { slug: "java-interview-day35-volatile关键字可见性有序性不保证原子性happens-before", title: "volatile 关键字", volume: 2, lessonNum: 13, tags: ["并发", "JMM"] },
  { slug: "java-interview-day16-completablefuture-异步编程", title: "CompletableFuture 异步编程", volume: 2, lessonNum: 14, tags: ["并发", "异步"] },

  // 卷三：JVM
  { slug: "java-interview-jvm-堆的分代结构-年轻代与老年代", title: "堆的分代结构", volume: 3, lessonNum: 15, tags: ["JVM", "内存"] },
  { slug: "java-interview-jvm-原理与调优-对象创建过程-tlab-指针碰撞-空闲列表-", title: "对象创建过程", volume: 3, lessonNum: 16, tags: ["JVM", "内存"] },
  { slug: "java-interview-jvm-判断对象存活的方法-引用计数-vs-可达性分析-", title: "判断对象存活的方法", volume: 3, lessonNum: 17, tags: ["JVM", "GC"] },
  { slug: "java-interview-jvm原理与调优-gc-roots-概念", title: "GC Roots 概念", volume: 3, lessonNum: 18, tags: ["JVM", "GC"] },
  { slug: "java-interview-day30-gc-日志分析", title: "GC 日志分析", volume: 3, lessonNum: 19, tags: ["JVM", "调优"] },
  { slug: "java-interview-day27-常用参数-xms-xmx-xmn-xxmetaspacesize-等", title: "JVM 常用参数", volume: 3, lessonNum: 20, tags: ["JVM", "调优"] },
  { slug: "java-interview-day28-内存泄漏排查heap-dumpmatvisualvm-使用", title: "内存泄漏排查", volume: 3, lessonNum: 21, tags: ["JVM", "调优"] },
  { slug: "java-interview-day29-cpu-100-排查流程top-jstack-jmap", title: "CPU 100% 排查流程", volume: 3, lessonNum: 22, tags: ["JVM", "调优"] },
  { slug: "java-interview-day25-双亲委派模型及其破坏场景", title: "双亲委派模型", volume: 3, lessonNum: 23, tags: ["JVM", "类加载"] },
  { slug: "java-interview-day26-自定义类加载器", title: "自定义类加载器", volume: 3, lessonNum: 24, tags: ["JVM", "类加载"] },

  // 卷四：Java 基础
  { slug: "java-interview-java基础-lambda-表达式与函数式接口", title: "Lambda 表达式与函数式接口", volume: 4, lessonNum: 25, tags: ["基础", "函数式"] },
  { slug: "java-interview-java基础-stream-api-常用操作-map-filter-collect-reduce-", title: "Stream API 常用操作", volume: 4, lessonNum: 26, tags: ["基础", "函数式"] },
  { slug: "java-interview-java基础-泛型擦除机制及绕过方法", title: "泛型擦除机制及绕过", volume: 4, lessonNum: 29, tags: ["基础", "泛型"] },
  { slug: "java-interview-java-基础-try-with-resources-原理", title: "try-with-resources 原理", volume: 4, lessonNum: 30, tags: ["基础", "IO"] },
  { slug: "java-interview-java基础-异常处理最佳实践", title: "异常处理最佳实践", volume: 4, lessonNum: 31, tags: ["基础", "异常"] },
  { slug: "java-interview-java基础-受检异常-vs-非受检异常的设计哲学", title: "受检 vs 非受检异常", volume: 4, lessonNum: 32, tags: ["基础", "异常"] },
  { slug: "java-interview-java-基础-接口默认方法-静态方法", title: "接口默认方法与静态方法", volume: 4, lessonNum: 33, tags: ["基础", "接口"] },
  { slug: "java-interview-java基础-注解的定义-使用及元注解-html", title: "注解的定义与使用", volume: 4, lessonNum: 34, tags: ["基础", "注解"] },
  { slug: "java-interview-java基础-反射的性能开销-在实际框架中的应用-spring-ioc-di-html", title: "反射的性能开销与 Spring 应用", volume: 4, lessonNum: 35, tags: ["基础", "反射"] },
];

export function getJavaArticlesByVolume(volume: number): JavaArticleMeta[] {
  return JAVA_ARTICLES.filter((a) => a.volume === volume);
}

export function getJavaArticle(slug: string): JavaArticleMeta | undefined {
  return JAVA_ARTICLES.find((a) => a.slug === slug);
}

// Get content from either root or java-basics backup
export function getJavaContent(slug: string): string | null {
  return getGenericContent(slug) || getGenericContent(`java-basics/${slug}`);
}
