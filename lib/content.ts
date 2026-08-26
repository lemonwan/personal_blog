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

/* ── Java 学习笔记 元数据（对标阿里 P6+ 高级工程师面试标准） ── */
export type Difficulty = "初级" | "中级" | "高级" | "深度";
export type InterviewFreq = "必问" | "极高" | "高频" | "中高" | "常考";

export interface JavaArticleMeta {
  slug: string;
  title: string;
  volume: number;
  lessonNum: number;
  tags: string[];
  difficulty: Difficulty;
  interviewFreq: InterviewFreq;
  desc: string;
}

export const JAVA_VOLUMES = [
  { num: 1, title: "集合框架源码", subtitle: "数据结构·源码·线程安全", emoji: "📦",
    desc: "HashMap 红黑树、ConcurrentHashMap CAS、ArrayList 扩容——从 JDK 源码级理解每一行代码的设计意图。面试必考，工作必用。" },
  { num: 2, title: "并发编程", subtitle: "线程·锁·JMM·异步", emoji: "⚡",
    desc: "线程池参数调优、AQS 锁框架、volatile 内存语义、CompletableFuture 编排——P6+ 面试重中之重，从原理到生产级实战。" },
  { num: 3, title: "JVM 原理与调优", subtitle: "内存·GC·类加载·故障排查", emoji: "🔧",
    desc: "堆内存分代、G1/ZGC 对比、类加载双亲委派、CPU 100% 排查——深入 JVM 内核，掌握线上问题定位与性能调优。" },
  { num: 4, title: "Java 高级特性", subtitle: "函数式·泛型·反射·设计模式", emoji: "📖",
    desc: "Lambda 底层实现、泛型擦除与桥方法、注解处理器、23 种设计模式——超越 CRUD，写出框架级代码。" },
  { num: 5, title: "Spring 生态核心原理", subtitle: "IoC·AOP·事务·自动装配", emoji: "🌱",
    desc: "Bean 生命周期、三级缓存解循环依赖、事务传播与失效、Boot 自动装配 SPI——面试几乎必问的 Spring 全家桶。" },
  { num: 6, title: "数据库与中间件实战", subtitle: "MySQL·Redis·MQ·分库分表", emoji: "🗄️",
    desc: "B+ 树索引、MVCC 事务隔离、Redis 持久化与缓存策略、RocketMQ 原理、分库分表方案——后端工程师的硬核中间件能力。" },
  { num: 7, title: "分布式系统设计", subtitle: "CAP·一致性·高可用·实战", emoji: "🌐",
    desc: "分布式锁四种实现、事务 2PC/TCC/Saga、限流熔断降级、高可用架构设计——从工程师到架构师的跃迁之路。" },
];

export const JAVA_ARTICLES: JavaArticleMeta[] = [
  // ═══════════════════════════════════════════════════════════════
  // 卷一：集合框架源码（9 篇）
  // ═══════════════════════════════════════════════════════════════
  { slug: "java-interview-day1-hashmap",
    title: "HashMap 源码精讲：数组+链表+红黑树",
    volume: 1, lessonNum: 1,
    tags: ["集合", "核心", "源码"],
    difficulty: "高级", interviewFreq: "必问",
    desc: "从 put() 方法一路追到 resize()，理解 hash 扰动、链表转红黑树的阈值 8、扩容时的 rehash 优化。面试率最高的集合类。" },
  { slug: "java-interview-一-集合框架-HashMap底层实现",
    title: "HashMap 高频面试题全解：null key、遍历顺序、线程安全",
    volume: 1, lessonNum: 2,
    tags: ["集合", "面试", "核心"],
    difficulty: "中级", interviewFreq: "必问",
    desc: "HashMap 为什么允许 null key？遍历顺序为什么不保证？多线程下 HashMap 会出什么问题？一次搞懂所有高频追问。" },
  { slug: "java-interview-Java基础-HashMap底层实现",
    title: "HashMap vs Hashtable vs LinkedHashMap 横向对比",
    volume: 1, lessonNum: 3,
    tags: ["集合", "对比"],
    difficulty: "中级", interviewFreq: "极高",
    desc: "三者都是 Map 实现，设计目标截然不同。从线程安全、有序性、性能三个维度做横向对比，面试追问利器。" },
  { slug: "java-interview-day2-concurrenthashmap",
    title: "ConcurrentHashMap 演进：JDK7 分段锁 → JDK8 CAS+synchronized",
    volume: 1, lessonNum: 4,
    tags: ["集合", "并发", "核心"],
    difficulty: "高级", interviewFreq: "必问",
    desc: "为什么抛弃分段锁？CAS 在哪里用？synchronized 锁的是哪个对象？size() 怎么保证准确？逐一拆解。" },
  { slug: "java-interview-一-集合框架-ConcurrentHashMap分段锁到CAS+synchronized的演进",
    title: "ConcurrentHashMap 深度剖析：put 流程、size 统计与扩容",
    volume: 1, lessonNum: 5,
    tags: ["集合", "并发", "源码"],
    difficulty: "深度", interviewFreq: "极高",
    desc: "完整跟踪一次 put 操作：hash 计算 → CAS 写入 → 链表/红黑树转换 → 扩容协助。面试中最有区分度的回答。" },
  { slug: "java-interview-java基础-arraylist-vs-linkedlist-使用场景",
    title: "ArrayList vs LinkedList：从源码看使用场景",
    volume: 1, lessonNum: 6,
    tags: ["集合", "对比"],
    difficulty: "初级", interviewFreq: "极高",
    desc: "ArrayList 随机访问 O(1)，LinkedList 中间插入 O(n)——用数据说话，打破「LinkedList 插入快」的常见误区。" },
  { slug: "java-interview-一-集合框架-ArrayList-vs-LinkedList-使用场景",
    title: "ArrayList 扩容机制与性能调优",
    volume: 1, lessonNum: 7,
    tags: ["集合", "源码", "性能"],
    difficulty: "中级", interviewFreq: "高频",
    desc: "1.5 倍扩容公式、ensureCapacity 预分配、System.arraycopy 开销——写出高性能的集合操作代码。" },
  { slug: "java-interview-java基础-hashset-treeset-底层原理",
    title: "HashSet 与 TreeSet 底层原理：Map 的「马甲」",
    volume: 1, lessonNum: 8,
    tags: ["集合", "源码"],
    difficulty: "中级", interviewFreq: "高频",
    desc: "HashSet 内部就是 HashMap，TreeSet 内部就是 TreeMap。理解委托模式，一个知识点覆盖两个类。" },
  { slug: "java-interview-java基础-iterator-遍历机制和-fail-fast-机制",
    title: "Iterator 与 fail-fast：集合遍历的安全边界",
    volume: 1, lessonNum: 9,
    tags: ["集合", "机制"],
    difficulty: "中级", interviewFreq: "中高",
    desc: "modCount 怎么检测并发修改？fail-fast 和 fail-safe 有什么区别？ConcurrentModificationException 的正确处理方式。" },

  // ═══════════════════════════════════════════════════════════════
  // 卷二：并发编程（14 篇）— P6+ 面试重中之重
  // ═══════════════════════════════════════════════════════════════
  { slug: "java-interview-day31-线程创建方式",
    title: "线程创建五种方式：Thread、Runnable、Callable、线程池、CompletableFuture",
    volume: 2, lessonNum: 10,
    tags: ["并发", "基础"],
    difficulty: "初级", interviewFreq: "极高",
    desc: "不止继承 Thread 和实现 Runnable。Callable+Future、线程池提交、CompletableFuture.supplyAsync——生产级写法全在这。" },
  { slug: "java-interview-day32-线程状态与转换",
    title: "线程生命周期：6 种状态与 12 次转换",
    volume: 2, lessonNum: 11,
    tags: ["并发", "基础"],
    difficulty: "中级", interviewFreq: "高频",
    desc: "NEW → RUNNABLE → BLOCKED → WAITING → TIMED_WAITING → TERMINATED，每一次转换对应什么 API？画出完整状态机。" },
  { slug: "java-interview-day33-synchronized原理",
    title: "synchronized 锁升级：偏向锁 → 轻量级锁 → 重量级锁",
    volume: 2, lessonNum: 12,
    tags: ["并发", "核心", "JVM"],
    difficulty: "高级", interviewFreq: "必问",
    desc: "对象头 Mark Word 结构、锁标志位、Monitor 对象——JDK 6 之后 synchronized 不再是「重量级」的代名词。" },
  { slug: "java-interview-day35-volatile关键字可见性有序性不保证原子性happens-before",
    title: "volatile 深入：可见性、有序性与 happens-before",
    volume: 2, lessonNum: 13,
    tags: ["并发", "JMM", "核心"],
    difficulty: "高级", interviewFreq: "必问",
    desc: "volatile 不保证原子性——i++ 为什么不安全？内存屏障怎么阻止指令重排？DCL 单例为什么要 volatile？" },
  { slug: "java-interview-day16-completablefuture-异步编程",
    title: "CompletableFuture 异步编排：从回调地狱到流式组合",
    volume: 2, lessonNum: 14,
    tags: ["并发", "异步"],
    difficulty: "中级", interviewFreq: "高频",
    desc: "thenApply、thenCompose、allOf、exceptionally——用 CompletableFuture 写出优雅的多任务编排代码。" },
  { slug: "threadpool-executor-deep-dive",
    title: "线程池 ThreadPoolExecutor：7 大参数与 4 种拒绝策略",
    volume: 2, lessonNum: 15,
    tags: ["并发", "核心", "面试必问"],
    difficulty: "高级", interviewFreq: "必问",
    desc: "corePoolSize、maximumPoolSize、keepAliveTime、workQueue 类型选择——生产环境线程池参数怎么定？附带调优公式。" },
  { slug: "aqs-reentrantlock-deep-dive",
    title: "AQS 框架与 ReentrantLock：独占锁、公平锁、Condition",
    volume: 2, lessonNum: 16,
    tags: ["并发", "核心", "锁"],
    difficulty: "深度", interviewFreq: "极高",
    desc: "AQS 的 state + CLH 队列是一切锁的基石。ReentrantLock 的 lock/unlock 全流程、公平 vs 非公平的实现差异。" },
  { slug: "readwritelock-stampedlock",
    title: "读写锁 ReentrantReadWriteLock 与 StampedLock",
    volume: 2, lessonNum: 17,
    tags: ["并发", "锁"],
    difficulty: "高级", interviewFreq: "高频",
    desc: "读多写少场景的利器。ReadWriteLock 的锁降级、StampedLock 的乐观读——什么时候用哪种？" },
  { slug: "threadlocal-deep-dive",
    title: "ThreadLocal 原理与内存泄漏：弱引用的坑",
    volume: 2, lessonNum: 18,
    tags: ["并发", "核心", "内存"],
    difficulty: "高级", interviewFreq: "必问",
    desc: "ThreadLocal 的 Entry 为什么用弱引用？内存泄漏在什么场景发生？remove() 为什么必须调用？TransmittableThreadLocal 解决了什么？" },
  { slug: "concurrent-util-toolkit",
    title: "并发工具全解：CountDownLatch、CyclicBarrier、Semaphore、Phaser",
    volume: 2, lessonNum: 19,
    tags: ["并发", "工具"],
    difficulty: "中级", interviewFreq: "高频",
    desc: "四大并发工具的使用场景、底层实现与区别。CountDownLatch 是一次性的，CyclicBarrier 可复用——面试题总爱在这里挖坑。" },
  { slug: "jmm-happens-before",
    title: "JMM 内存模型：happens-before 八条规则全解",
    volume: 2, lessonNum: 20,
    tags: ["并发", "JMM", "深度"],
    difficulty: "深度", interviewFreq: "极高",
    desc: "主内存与工作内存、8 条 happens-before 规则、内存屏障 LoadLoad/StoreStore——理解 JMM 才能真正理解并发。" },
  { slug: "cas-atomic-unsafe",
    title: "CAS 与原子操作：AtomicInteger 到 LongAdder",
    volume: 2, lessonNum: 21,
    tags: ["并发", "原子", "CAS"],
    difficulty: "高级", interviewFreq: "高频",
    desc: "CAS 的 ABA 问题怎么解决？AtomicStampedReference 原理。LongAdder 为什么比 AtomicLong 快 10 倍？分段思想的又一次胜利。" },
  { slug: "thread-safety-patterns",
    title: "线程安全设计模式：不可变对象、Thread-safe Singleton、生产者-消费者",
    volume: 2, lessonNum: 22,
    tags: ["并发", "设计模式"],
    difficulty: "中级", interviewFreq: "中高",
    desc: "5 种单例写法（含 DCL 和枚举）、不可变对象的设计、BlockingQueue 实现生产者-消费者——并发编程的最佳实践。" },
  { slug: "fork-join-parallel-stream",
    title: "Fork/Join 框架与并行 Stream",
    volume: 2, lessonNum: 23,
    tags: ["并发", "框架"],
    difficulty: "中级", interviewFreq: "中高",
    desc: "分治思想的并行实现。work-stealing 算法、RecursiveTask 使用、parallelStream 的线程安全陷阱。" },

  // ═══════════════════════════════════════════════════════════════
  // 卷三：JVM 原理与调优（14 篇）
  // ═══════════════════════════════════════════════════════════════
  { slug: "java-interview-jvm-堆的分代结构-年轻代与老年代",
    title: "JVM 堆内存：年轻代三区与老年代的生命周期",
    volume: 3, lessonNum: 24,
    tags: ["JVM", "内存", "核心"],
    difficulty: "中级", interviewFreq: "必问",
    desc: "Eden + Survivor0 + Survivor1 + Old Gen，对象在哪里出生、在哪里晋升、什么时候进入老年代——GC 调优的基础。" },
  { slug: "java-interview-jvm-原理与调优-对象创建过程-tlab-指针碰撞-空闲列表-",
    title: "对象创建全过程：类加载检查 → TLAB → 内存分配 → 初始化",
    volume: 3, lessonNum: 25,
    tags: ["JVM", "内存"],
    difficulty: "高级", interviewFreq: "极高",
    desc: "new 一个对象，JVM 内部发生了什么？指针碰撞 vs 空闲列表、TLAB 分配、对象头布局——从字节码到内存的完整链路。" },
  { slug: "java-interview-jvm-判断对象存活的方法-引用计数-vs-可达性分析-",
    title: "对象存活判定：引用计数 vs 可达性分析",
    volume: 3, lessonNum: 26,
    tags: ["JVM", "GC"],
    difficulty: "中级", interviewFreq: "极高",
    desc: "Python 用引用计数，Java 用可达性分析——为什么？循环引用怎么处理？finalize() 该不该用？" },
  { slug: "java-interview-jvm原理与调优-gc-roots-概念",
    title: "GC Roots 详解：哪些对象不会被回收？",
    volume: 3, lessonNum: 27,
    tags: ["JVM", "GC", "核心"],
    difficulty: "中级", interviewFreq: "必问",
    desc: "栈帧引用、静态变量、常量池引用、JNI 全局引用——5 种 GC Roots 逐一解析，这是理解内存泄漏的关键。" },
  { slug: "java-interview-day30-gc-日志分析",
    title: "GC 日志分析实战：读懂每一行 GC 输出",
    volume: 3, lessonNum: 28,
    tags: ["JVM", "调优", "实战"],
    difficulty: "高级", interviewFreq: "高频",
    desc: "GC 日志里的 Young GC、Full GC、Mixed GC 怎么看？pause 时间、heap 变化、GC cause——用真实日志手把手分析。" },
  { slug: "java-interview-day27-常用参数-xms-xmx-xmn-xxmetaspacesize-等",
    title: "JVM 调优参数手册：30 个最常用参数速查",
    volume: 3, lessonNum: 29,
    tags: ["JVM", "调优", "手册"],
    difficulty: "中级", interviewFreq: "高频",
    desc: "-Xms、-Xmx、-Xmn、-XX:MetaspaceSize、-XX:+UseG1GC 等 30 个核心参数，每个附带推荐值和使用场景。" },
  { slug: "java-interview-day28-内存泄漏排查heap-dumpmatvisualvm-使用",
    title: "内存泄漏排查：Heap Dump + MAT + VisualVM 实战",
    volume: 3, lessonNum: 30,
    tags: ["JVM", "调优", "实战"],
    difficulty: "高级", interviewFreq: "高频",
    desc: "从 jmap 导出堆转储到 MAT 分析大对象，完整排查一次内存泄漏。ThreadLocal 泄漏、连接池泄漏、缓存泄漏——三大典型场景。" },
  { slug: "java-interview-day29-cpu-100-排查流程top-jstack-jmap",
    title: "CPU 100% 排查：top → jstack → 代码定位五步法",
    volume: 3, lessonNum: 31,
    tags: ["JVM", "调优", "实战"],
    difficulty: "高级", interviewFreq: "极高",
    desc: "线上 CPU 飙高怎么办？top 找进程 → top -Hp 找线程 → jstack 抓栈 → printf 转 16 进制 → 定位代码行。完整 SOP。" },
  { slug: "java-interview-day25-双亲委派模型及其破坏场景",
    title: "类加载机制：双亲委派模型与三种破坏场景",
    volume: 3, lessonNum: 32,
    tags: ["JVM", "类加载", "核心"],
    difficulty: "高级", interviewFreq: "必问",
    desc: "Bootstrap → Extension → Application 三层委派。SPI 机制（JDBC/SLF4J）如何打破双亲委派？Tomcat 的类加载隔离怎么做？" },
  { slug: "java-interview-day26-自定义类加载器",
    title: "自定义类加载器：热部署与模块化隔离",
    volume: 3, lessonNum: 33,
    tags: ["JVM", "类加载"],
    difficulty: "高级", interviewFreq: "中高",
    desc: "loadClass vs findClass 的区别。自定义类加载器实现热部署、OSGi 的模块化隔离——框架开发者必备技能。" },
  { slug: "jvm-runtime-data-areas",
    title: "JVM 运行时数据区全景：堆、栈、方法区、程序计数器",
    volume: 3, lessonNum: 34,
    tags: ["JVM", "内存", "核心"],
    difficulty: "中级", interviewFreq: "必问",
    desc: "6 大运行时区域各自的职责、线程共享性、溢出场景。方法区 → 元空间的演进历史。StackOverflowError vs OutOfMemoryError。" },
  { slug: "gc-collectors-comparison",
    title: "垃圾收集器全览：Serial → Parallel → CMS → G1 → ZGC",
    volume: 3, lessonNum: 35,
    tags: ["JVM", "GC", "核心"],
    difficulty: "深度", interviewFreq: "极高",
    desc: "五代收集器的设计目标与取舍。CMS 的并发标记问题、G1 的 Region 化、ZGC 的染色指针——面试中最有深度的回答。" },
  { slug: "jit-escape-analysis",
    title: "JIT 编译优化：逃逸分析与标量替换",
    volume: 3, lessonNum: 36,
    tags: ["JVM", "JIT", "性能"],
    difficulty: "深度", interviewFreq: "中高",
    desc: "逃逸分析如何让对象「不出方法」？标量替换把对象拆成基本类型、栈上分配避免 GC——理解 JVM 的终极优化手段。" },
  { slug: "oom-diagnosis",
    title: "OOM 排查实战：六种 OutOfMemoryError 全解",
    volume: 3, lessonNum: 37,
    tags: ["JVM", "实战", "排查"],
    difficulty: "高级", interviewFreq: "高频",
    desc: "Java heap space、Metaspace、Direct buffer、Unable to create new native thread、GC overhead limit——每种 OOM 的根因与解法。" },

  // ═══════════════════════════════════════════════════════════════
  // 卷四：Java 高级特性（14 篇）
  // ═══════════════════════════════════════════════════════════════
  { slug: "java-interview-java基础-lambda-表达式与函数式接口",
    title: "Lambda 底层实现：invokedynamic 与函数式接口",
    volume: 4, lessonNum: 38,
    tags: ["Java", "函数式"],
    difficulty: "中级", interviewFreq: "极高",
    desc: "Lambda 编译后不是匿名内部类！invokedynamic + LambdaMetafactory 的工作原理。Predicate、Function、Consumer、Supplier 四大核心接口。" },
  { slug: "java-interview-java基础-stream-api-常用操作-map-filter-collect-reduce-",
    title: "Stream API 深度使用：map、flatMap、reduce、Collector",
    volume: 4, lessonNum: 39,
    tags: ["Java", "函数式"],
    difficulty: "中级", interviewFreq: "极高",
    desc: "惰性求值、短路操作、自定义 Collector、groupingBy + downstream——把 Stream 用到极致。" },
  { slug: "java-interview-java基础-泛型擦除机制及绕过方法",
    title: "泛型深入：擦除机制、通配符 PECS 与桥方法",
    volume: 4, lessonNum: 40,
    tags: ["Java", "泛型"],
    difficulty: "高级", interviewFreq: "极高",
    desc: "List<String> 和 List<Integer> 运行时是同一个类？extends vs super 怎么选？编译器生成的桥方法长什么样？" },
  { slug: "java-interview-java-基础-try-with-resources-原理",
    title: "try-with-resources 底层原理：编译器做了什么？",
    volume: 4, lessonNum: 41,
    tags: ["Java", "IO"],
    difficulty: "中级", interviewFreq: "高频",
    desc: "AutoCloseable 接口、编译器自动生成的 finally 块、异常抑制（suppressed）——TWR 比 try-finally 好在哪里。" },
  { slug: "java-interview-java基础-异常处理最佳实践",
    title: "异常处理最佳实践：自定义异常与全局处理",
    volume: 4, lessonNum: 42,
    tags: ["Java", "异常", "实战"],
    difficulty: "中级", interviewFreq: "高频",
    desc: "什么时候自定义异常？异常链怎么传递？Spring 的 @ExceptionHandler 全局异常处理设计。" },
  { slug: "java-interview-java基础-受检异常-vs-非受检异常的设计哲学",
    title: "受检 vs 非受检异常：设计哲学与选型",
    volume: 4, lessonNum: 43,
    tags: ["Java", "异常"],
    difficulty: "中级", interviewFreq: "中高",
    desc: "为什么 Spring 全面拥抱 RuntimeException？受检异常的优点和缺点？新项目该怎么选？" },
  { slug: "java-interview-java-基础-接口默认方法-静态方法",
    title: "接口进化：默认方法、静态方法与私有方法",
    volume: 4, lessonNum: 44,
    tags: ["Java", "接口"],
    difficulty: "初级", interviewFreq: "高频",
    desc: "Java 8 给接口加了默认方法（解决多继承冲突）、Java 9 加了私有方法——接口的演进方向。" },
  { slug: "java-interview-java基础-注解的定义-使用及元注解-html",
    title: "注解体系：元注解、自定义注解与运行时处理",
    volume: 4, lessonNum: 45,
    tags: ["Java", "注解"],
    difficulty: "中级", interviewFreq: "极高",
    desc: "@Retention、@Target、@Repeatable 等元注解。如何自定义注解并通过反射在运行时处理？Spring 的注解驱动是怎么实现的？" },
  { slug: "java-interview-java基础-反射的性能开销-在实际框架中的应用-spring-ioc-di-html",
    title: "反射原理：性能开销分析与 Spring IoC 中的应用",
    volume: 4, lessonNum: 46,
    tags: ["Java", "反射", "Spring"],
    difficulty: "高级", interviewFreq: "极高",
    desc: "反射为什么慢？Method.setAccessible(true) 做了什么？Spring 怎么用反射实现依赖注入？如何优化反射性能？" },
  { slug: "java-design-patterns-interview",
    title: "面试必会设计模式：单例、工厂、策略、观察者、模板方法",
    volume: 4, lessonNum: 47,
    tags: ["设计模式", "面试"],
    difficulty: "中级", interviewFreq: "必问",
    desc: "5 种最高频面试设计模式，每种给出 JDK/Spring 中的真实应用案例。不是纸上谈兵，是面试官想听到的回答。" },
  { slug: "java-io-nio-reactor",
    title: "IO 模型：BIO、NIO 与 Reactor 模式",
    volume: 4, lessonNum: 48,
    tags: ["Java", "IO", "网络"],
    difficulty: "高级", interviewFreq: "高频",
    desc: "阻塞 vs 非阻塞、同步 vs 异步。NIO 的 Channel/Buffer/Selector 三件套。Reactor 模式如何支撑 Netty 的高性能？" },
  { slug: "java-serialization-deep-dive",
    title: "序列化机制：Serializable、transient 与 serialVersionUID",
    volume: 4, lessonNum: 49,
    tags: ["Java", "序列化"],
    difficulty: "中级", interviewFreq: "中高",
    desc: "serialVersionUID 为什么重要？transient 字段怎么恢复？Externalizable 接口。为什么生产环境推荐 Protobuf/Hessian？" },
  { slug: "strong-soft-weak-phantom-ref",
    title: "四种引用类型：强引用、软引用、弱引用、虚引用",
    volume: 4, lessonNum: 50,
    tags: ["Java", "GC", "引用"],
    difficulty: "中级", interviewFreq: "高频",
    desc: "SoftReference 做缓存、WeakReference 做 ThreadLocal、PhantomReference 做清理——四种引用的使用场景与 GC 行为。" },
  { slug: "java-8-to-21-features",
    title: "Java 8 → 21 核心特性速览：var、record、sealed、虚拟线程",
    volume: 4, lessonNum: 51,
    tags: ["Java", "新特性"],
    difficulty: "中级", interviewFreq: "中高",
    desc: "Java 8 Lambda → 10 var → 14 record → 17 sealed class → 21 虚拟线程。每个版本最值得用的特性一览。" },

  // ═══════════════════════════════════════════════════════════════
  // 卷五：Spring 生态核心原理（8 篇）— 面试几乎必问
  // ═══════════════════════════════════════════════════════════════
  { slug: "spring-ioc-container",
    title: "Spring IoC 容器原理：BeanFactory 与 ApplicationContext",
    volume: 5, lessonNum: 52,
    tags: ["Spring", "IoC", "核心"],
    difficulty: "高级", interviewFreq: "必问",
    desc: "IoC 不是「帮你 new 对象」那么简单。BeanFactory vs ApplicationContext、三级缓存、容器启动流程——面试最有深度的回答。" },
  { slug: "spring-aop-proxy",
    title: "Spring AOP 原理：JDK 动态代理 vs CGLIB",
    volume: 5, lessonNum: 53,
    tags: ["Spring", "AOP", "代理"],
    difficulty: "高级", interviewFreq: "必问",
    desc: "有接口用 JDK 代理，没接口用 CGLIB——Spring Boot 2.x 之后默认改 CGLIB 了。切面执行顺序、代理失效场景全解。" },
  { slug: "spring-bean-lifecycle",
    title: "Bean 生命周期：从实例化到销毁的完整流程",
    volume: 5, lessonNum: 54,
    tags: ["Spring", "Bean", "核心"],
    difficulty: "深度", interviewFreq: "极高",
    desc: "实例化 → 属性注入 → Aware 回调 → BeanPostProcessor → InitializingBean → init-method → 使用 → 销毁。14 步完整链路。" },
  { slug: "spring-transaction-propagation",
    title: "Spring 事务传播机制与 @Transactional 失效的 8 种场景",
    volume: 5, lessonNum: 55,
    tags: ["Spring", "事务", "面试高频"],
    difficulty: "高级", interviewFreq: "必问",
    desc: "7 种传播行为（REQUIRED/REQUIRES_NEW/NESTED 等）。自调用失效、异常类型不匹配、private 方法——@Transactional 踩坑大全。" },
  { slug: "spring-boot-autoconfig",
    title: "Spring Boot 自动装配：@EnableAutoConfiguration 原理",
    volume: 5, lessonNum: 56,
    tags: ["Spring Boot", "自动装配"],
    difficulty: "高级", interviewFreq: "极高",
    desc: "spring.factories → AutoConfiguration → @Conditional 条件装配。自己写一个 Starter 需要几步？从原理到实战。" },
  { slug: "spring-circular-dependency",
    title: "Spring 循环依赖：三级缓存解决方案",
    volume: 5, lessonNum: 57,
    tags: ["Spring", "核心", "面试高频"],
    difficulty: "深度", interviewFreq: "极高",
    desc: "singletonObjects → earlySingletonObjects → singletonFactories。为什么两级不够？构造器注入为什么不行？Spring Boot 2.6 之后默认禁止循环依赖。" },
  { slug: "spring-mvc-request-flow",
    title: "Spring MVC 请求处理全流程：DispatcherServlet 到 View",
    volume: 5, lessonNum: 58,
    tags: ["Spring MVC", "请求"],
    difficulty: "中级", interviewFreq: "高频",
    desc: "DispatcherServlet → HandlerMapping → HandlerAdapter → Controller → ViewResolver。一次 HTTP 请求在 Spring 内部的完整旅程。" },
  { slug: "spring-annotation-cheatsheet",
    title: "Spring 核心注解速查：@Autowired vs @Resource、@Component vs @Bean",
    volume: 5, lessonNum: 59,
    tags: ["Spring", "注解"],
    difficulty: "初级", interviewFreq: "极高",
    desc: "@Autowired byType vs @Resource byName、@Component 扫描 vs @Bean 显式声明、@Value vs @ConfigurationProperties——别再搞混了。" },

  // ═══════════════════════════════════════════════════════════════
  // 卷六：数据库与中间件实战（6 篇）
  // ═══════════════════════════════════════════════════════════════
  { slug: "mysql-index-btree",
    title: "MySQL 索引原理：B+ 树、聚簇索引与覆盖索引",
    volume: 6, lessonNum: 60,
    tags: ["MySQL", "索引", "核心"],
    difficulty: "高级", interviewFreq: "必问",
    desc: "B+ 树为什么比 B 树更适合做索引？聚簇索引 vs 非聚簇索引、回表查询、覆盖索引、最左前缀匹配——面试高频题全解。" },
  { slug: "mysql-transaction-mvcc",
    title: "MySQL 事务与 MVCC：四种隔离级别与 ReadView",
    volume: 6, lessonNum: 61,
    tags: ["MySQL", "事务", "MVCC"],
    difficulty: "深度", interviewFreq: "必问",
    desc: "Read Uncommitted → Read Committed → Repeatable Read → Serializable。MVCC 的 undo log + ReadView 机制。RR 级别下怎么防幻读？" },
  { slug: "redis-data-structures",
    title: "Redis 五大核心数据结构与应用场景",
    volume: 6, lessonNum: 62,
    tags: ["Redis", "数据结构"],
    difficulty: "中级", interviewFreq: "必问",
    desc: "String/List/Hash/Set/ZSet 的底层编码（SDS、ziplist、skiplist、hashtable、intset）。每种结构的典型应用场景。" },
  { slug: "redis-persistence-cluster",
    title: "Redis 持久化与高可用：RDB、AOF 与 Cluster 集群",
    volume: 6, lessonNum: 63,
    tags: ["Redis", "持久化", "集群"],
    difficulty: "高级", interviewFreq: "极高",
    desc: "RDB 快照 vs AOF 追加日志、混合持久化。哨兵模式 vs Cluster 分片集群。Redis 单线程为什么这么快？" },
  { slug: "cache-strategy-design",
    title: "缓存设计：穿透、击穿、雪崩与一致性方案",
    volume: 6, lessonNum: 64,
    tags: ["缓存", "设计", "面试必问"],
    difficulty: "高级", interviewFreq: "必问",
    desc: "缓存穿透用布隆过滤器、击穿用互斥锁、雪崩用过期时间随机化。双写一致性：先删缓存还是先更新数据库？延迟双删怎么做？" },
  { slug: "mq-rocketmq-kafka",
    title: "消息队列核心原理：RocketMQ vs Kafka 架构对比",
    volume: 6, lessonNum: 65,
    tags: ["MQ", "RocketMQ", "Kafka"],
    difficulty: "高级", interviewFreq: "极高",
    desc: "消息可靠投递、顺序消息、重复消费幂等性。RocketMQ 的事务消息、Kafka 的分区与消费者组——两大 MQ 的架构差异。" },

  // ═══════════════════════════════════════════════════════════════
  // 卷七：分布式系统设计（5 篇）
  // ═══════════════════════════════════════════════════════════════
  { slug: "cap-consistency",
    title: "CAP 理论与一致性模型：从理论到工程取舍",
    volume: 7, lessonNum: 66,
    tags: ["分布式", "CAP", "理论"],
    difficulty: "高级", interviewFreq: "极高",
    desc: "CP（ZooKeeper）vs AP（Eureka）的工程选择。强一致性 vs 最终一致性。BASE 理论对 CAP 的工程化延伸。" },
  { slug: "distributed-lock-implementations",
    title: "分布式锁四种实现：Redis、ZooKeeper、数据库与 Redisson",
    volume: 7, lessonNum: 67,
    tags: ["分布式", "锁", "面试必问"],
    difficulty: "高级", interviewFreq: "必问",
    desc: "Redis SETNX + 看门狗续期、ZooKeeper 临时顺序节点、数据库悲观锁。Redisson 的 RedLock 为什么有争议？" },
  { slug: "distributed-transaction-patterns",
    title: "分布式事务：2PC、TCC、Saga 与最终一致性",
    volume: 7, lessonNum: 68,
    tags: ["分布式", "事务"],
    difficulty: "深度", interviewFreq: "极高",
    desc: "两阶段提交的阻塞问题、TCC 的 Try-Confirm-Cancel、Saga 编排 vs 协同。Seata 框架四种模式对比。" },
  { slug: "rate-limiting-circuit-breaker",
    title: "限流、熔断与降级：Sentinel 与 Hystrix 原理",
    volume: 7, lessonNum: 69,
    tags: ["高可用", "限流", "熔断"],
    difficulty: "高级", interviewFreq: "高频",
    desc: "令牌桶 vs 滑动窗口限流。熔断器的关闭/打开/半开三态。Sentinel 的热点参数限流与系统自适应保护。" },
  { slug: "ha-architecture-design",
    title: "高可用架构设计：从单点到百万 QPS 的演进",
    volume: 7, lessonNum: 70,
    tags: ["架构", "高可用", "系统设计"],
    difficulty: "深度", interviewFreq: "极高",
    desc: "负载均衡 → 读写分离 → 缓存 → 消息队列 → 微服务拆分 → 服务网格。从 0 到 1 设计一个高可用电商系统。" },
];

export function getJavaArticlesByVolume(volume: number): JavaArticleMeta[] {
  return JAVA_ARTICLES.filter((a) => a.volume === volume);
}

export function getJavaArticle(slug: string): JavaArticleMeta | undefined {
  return JAVA_ARTICLES.find((a) => a.slug === slug);
}

/** 加载 Java 文章内容（content/java-basics/{slug}.html） */
export function getJavaContent(slug: string): string | null {
  return getGenericContent(`java-basics/${slug}`);
}

/* ── React 学习笔记 元数据（面向 Java 后端转型全栈，AI 时代） ── */
export type ReactLevel = "入门" | "进阶" | "实战";

export interface ReactArticleMeta {
  slug: string;
  title: string;
  volume: number;
  lessonNum: number;
  tags: string[];
  level: ReactLevel;
  focus: boolean; // true = 核心必学
  desc: string;
}

export const REACT_VOLUMES = [
  { num: 1, title: "核心原语", subtitle: "组件·JSX·State·渲染模型", emoji: "⚛️",
    desc: "从后端视角看懂 React：声明式 UI、JSX、组件、State 与虚拟 DOM。用 Java/Spring 的类比快速建立前端心智模型，这是后端转全栈的第一道分水岭。" },
  { num: 2, title: "Hooks 精讲", subtitle: "useState 之外的 React 灵魂", emoji: "🪝",
    desc: "useEffect、useMemo、useRef、自定义 Hook——Hooks 是 React 的骨架，也是后端转前端最容易踩坑的地方。把副作用、闭包、依赖数组一次讲透。" },
  { num: 3, title: "状态管理", subtitle: "客户端状态与服务端数据", emoji: "🗃️",
    desc: "Context、Zustand、Redux Toolkit 与 TanStack Query。理清「UI 状态」和「服务端数据」的分界（对应后端 DAO/缓存分层），别再一把梭。" },
  { num: 4, title: "组件设计与工程化", subtitle: "组合·复用·TypeScript", emoji: "🧩",
    desc: "组合优于继承、受控组件、复合组件模式，以及 TypeScript 加持下的类型安全 React——把 Java 的工程素养迁移到前端，写出可维护的代码。" },
  { num: 5, title: "路由与数据获取", subtitle: "Router·请求·缓存·竞态", emoji: "🧭",
    desc: "React Router 嵌套路由（对比 Spring @RequestMapping）、fetch/axios 请求、TanStack Query 服务端缓存——把「取数」这件事做对、做干净。" },
  { num: 6, title: "性能优化与部署", subtitle: "渲染·缓存·构建·上线", emoji: "🚀",
    desc: "重渲染剖析、memo 策略、代码分割、Vite 构建（对比 Maven/Gradle）与 CI/CD 部署——让 React 应用又快又稳地跑在生产环境。" },
  { num: 7, title: "AI 时代的前端进阶", subtitle: "RSC·流式 UI·LLM 集成", emoji: "🤖",
    desc: "Next.js 服务端组件、流式响应、与 LLM 集成的对话式体验——AI 时代全栈工程师的最后一公里。" },
];

export const REACT_ARTICLES: ReactArticleMeta[] = [
  // ═══════════════════════════════════════════════════════════════
  // 卷一：核心原语（8 篇）— 已完成正文
  // ═══════════════════════════════════════════════════════════════
  { slug: "react-01-declarative-ui",
    title: "声明式 UI：从命令式 DOM 到 React 的心智转变",
    volume: 1, lessonNum: 1,
    tags: ["核心", "心智模型"],
    level: "入门", focus: true,
    desc: "对比手写 DOM / jQuery 的命令式做法，理解 React 的声明式「状态 → 视图」模型——后端转前端的第一道分水岭。" },
  { slug: "react-02-jsx",
    title: "JSX 详解：它到底是模板还是代码？",
    volume: 1, lessonNum: 2,
    tags: ["核心", "语法"],
    level: "入门", focus: true,
    desc: "JSX 不是字符串模板，而是 JavaScript 表达式，经 Babel 编译成 createElement 调用。对比 JSP/Thymeleaf 看懂本质。" },
  { slug: "react-03-components-props",
    title: "组件与 Props：前端的「方法」和「参数」",
    volume: 1, lessonNum: 3,
    tags: ["核心", "组件"],
    level: "入门", focus: true,
    desc: "函数组件 + 单向数据流。用 Java 的「方法签名 + 不可变参数」类比 Props，理解为什么 Props 只读、不可修改。" },
  { slug: "react-04-state",
    title: "State 与 useState：数据驱动的视图更新",
    volume: 1, lessonNum: 4,
    tags: ["核心", "Hooks"],
    level: "入门", focus: true,
    desc: "state 是组件的「实例字段」，setState 触发重渲染。对比 JavaBean 的字段 + setter，看清 React 为什么要求不可变更新。" },
  { slug: "react-05-rendering",
    title: "渲染模型：虚拟 DOM 与协调 diff",
    volume: 1, lessonNum: 5,
    tags: ["核心", "原理"],
    level: "进阶", focus: true,
    desc: "为什么 React 不直接操作真实 DOM？虚拟 DOM + 协调算法的本质。对比后端 MVC 的整页重绘，理解性能从哪来。" },
  { slug: "react-06-events",
    title: "事件处理与合成事件系统",
    volume: 1, lessonNum: 6,
    tags: ["核心", "事件"],
    level: "入门", focus: false,
    desc: "React 的合成事件、事件委托，以及函数组件里「this」没了去哪儿。对比 Java 的事件监听器模型。" },
  { slug: "react-07-list-key",
    title: "列表渲染与 key：diff 的正确打开方式",
    volume: 1, lessonNum: 7,
    tags: ["核心", "列表"],
    level: "入门", focus: true,
    desc: "map 渲染列表，key 为什么不能是数组下标？对比 Java 循环，理解 React 靠 key 做增删改的最小化 diff。" },
  { slug: "react-08-todo",
    title: "第一章实战：手写一个待办清单组件",
    volume: 1, lessonNum: 8,
    tags: ["实战", "综合"],
    level: "实战", focus: true,
    desc: "用 JSX + Props + State + 事件 + 列表渲染，从零实现一个 Todo 组件，串联第一章所有知识点。" },

  // ═══════════════════════════════════════════════════════════════
  // 卷二：Hooks 精讲（8 篇）
  // ═══════════════════════════════════════════════════════════════
  { slug: "react-09-useeffect",
    title: "useEffect 与生命周期：副作用该放哪？",
    volume: 2, lessonNum: 9,
    tags: ["Hooks", "副作用"],
    level: "进阶", focus: true,
    desc: "把数据请求、订阅、定时器放进 useEffect。对比 Spring Bean 的初始化/销毁回调，理解清理函数（cleanup）的价值。" },
  { slug: "react-10-stale-closure",
    title: "依赖数组与闭包陷阱：stale closure",
    volume: 2, lessonNum: 10,
    tags: ["Hooks", "闭包"],
    level: "进阶", focus: true,
    desc: "为什么 effect 里读到的是旧状态？依赖数组的机制与 ESLint 规则。闭包陷阱是后端转前端最困惑的一点。" },
  { slug: "react-11-memo",
    title: "useMemo 与 useCallback：何时真正需要？",
    volume: 2, lessonNum: 11,
    tags: ["Hooks", "性能"],
    level: "进阶", focus: false,
    desc: "缓存值 vs 缓存函数。绝大多数场景你并不需要它们——先搞清「引用相等」和「重渲染」，再谈优化。" },
  { slug: "react-12-useref",
    title: "useRef：访问 DOM 与「可变而不可渲染」的值",
    volume: 2, lessonNum: 12,
    tags: ["Hooks", "DOM"],
    level: "进阶", focus: false,
    desc: "useRef 既是 DOM 的句柄，也是不触发渲染的可变容器。类似 Java 里的实例字段，但改了不会重新渲染。" },
  { slug: "react-13-custom-hook",
    title: "自定义 Hook：复用的正确姿势",
    volume: 2, lessonNum: 13,
    tags: ["Hooks", "复用"],
    level: "进阶", focus: true,
    desc: "把重复的 state + effect 逻辑抽成自定义 Hook，对比 Java 的工具类与策略模式。这是 React 里最重要的复用手段。" },
  { slug: "react-14-lifting-state",
    title: "状态提升与单向数据流",
    volume: 2, lessonNum: 14,
    tags: ["状态", "数据流"],
    level: "进阶", focus: true,
    desc: "父子组件共享状态时「把 state 往上提」。理解 React 单向数据流的约束，以及它为什么让应用更可预测。" },
  { slug: "react-15-context",
    title: "useContext：跨层传递的广播机制",
    volume: 2, lessonNum: 15,
    tags: ["状态", "Context"],
    level: "进阶", focus: false,
    desc: "props 层层透传太痛苦？Context 提供一条「广播通道」。但滥用会导致全树重渲染——何时该用、何时不该用。" },
  { slug: "react-16-hook-rules",
    title: "Hooks 规则与十大常见陷阱",
    volume: 2, lessonNum: 16,
    tags: ["Hooks", "规范"],
    level: "进阶", focus: true,
    desc: "为什么 Hooks 不能写在条件判断里？React 靠调用顺序识别 Hook。配合实战总结后端易犯的 10 个高频坑。" },

  // ═══════════════════════════════════════════════════════════════
  // 卷三：状态管理（6 篇）
  // ═══════════════════════════════════════════════════════════════
  { slug: "react-17-state-kinds",
    title: "客户端状态 vs 服务端状态：先分清再谈方案",
    volume: 3, lessonNum: 17,
    tags: ["状态", "架构"],
    level: "进阶", focus: true,
    desc: "「UI 选中哪一项」和「数据库里有哪些用户」是两种状态。对比后端 DAO/缓存分层，别把服务端数据塞进全局 store。" },
  { slug: "react-18-zustand",
    title: "Zustand：轻量状态管理实战",
    volume: 3, lessonNum: 18,
    tags: ["状态", "Zustand"],
    level: "实战", focus: true,
    desc: "几行代码搞定全局状态，无 Provider、无样板。对比单例 + 观察者，Zustand 是当下小型应用的事实标准。" },
  { slug: "react-19-redux",
    title: "Redux Toolkit 与单向数据流",
    volume: 3, lessonNum: 19,
    tags: ["状态", "Redux"],
    level: "进阶", focus: false,
    desc: "Flux 架构、Reducer、不可变更新。Redux Toolkit 大幅简化了样板。理解「单一数据源 + 单向流动」的设计哲学。" },
  { slug: "react-20-state-pick",
    title: "Context / Zustand / Redux 如何选型",
    volume: 3, lessonNum: 20,
    tags: ["状态", "选型"],
    level: "进阶", focus: false,
    desc: "三者的适用边界与取舍。给出一个可执行的选型决策树，避免「为了用而用」的过度设计。" },
  { slug: "react-21-form-state",
    title: "表单状态管理（对比 Spring 表单绑定）",
    volume: 3, lessonNum: 21,
    tags: ["表单", "实战"],
    level: "实战", focus: false,
    desc: "受控表单 + 校验三件套（React Hook Form / Zod）。对比 Spring MVC 的 @ModelAttribute，理解前端的表单数据流。" },
  { slug: "react-22-persist",
    title: "状态持久化与多端同步",
    volume: 3, lessonNum: 22,
    tags: ["状态", "持久化"],
    level: "实战", focus: false,
    desc: "状态写进 localStorage、与后端同步、多标签页联动。持久化中间件的原理与陷阱。" },

  // ═══════════════════════════════════════════════════════════════
  // 卷四：组件设计与工程化（7 篇）
  // ═══════════════════════════════════════════════════════════════
  { slug: "react-23-composition",
    title: "组合优于继承：Java 设计原则的前端回响",
    volume: 4, lessonNum: 23,
    tags: ["组件", "设计"],
    level: "进阶", focus: true,
    desc: "React 几乎没有继承，全靠组合。Java 里「组合优于继承」的前车之鉴，在 React 里被推到了极致。" },
  { slug: "react-24-controlled",
    title: "受控组件与非受控组件",
    volume: 4, lessonNum: 24,
    tags: ["组件", "表单"],
    level: "进阶", focus: true,
    desc: "表单值由 React state 控制 vs 由 DOM 自身管理。两种模式的取舍与适用场景，面试和实战都常考。" },
  { slug: "react-25-children",
    title: "children 与复合组件模式",
    volume: 4, lessonNum: 25,
    tags: ["组件", "模式"],
    level: "进阶", focus: false,
    desc: "把 JSX 当参数传入组件。复合组件（Compound Components）如何构建灵活又类型安全的组件库。" },
  { slug: "react-26-hoc",
    title: "高阶组件与 render props：历史与现状",
    volume: 4, lessonNum: 26,
    tags: ["组件", "模式"],
    level: "进阶", focus: false,
    desc: "HOC 和 render props 曾是复用利器，如今大多被自定义 Hook 取代。了解它们，才能读懂老代码。" },
  { slug: "react-27-architecture",
    title: "组件拆分与职责边界（对比三层架构）",
    volume: 4, lessonNum: 27,
    tags: ["架构", "工程化"],
    level: "实战", focus: true,
    desc: "UI 组件 / 容器组件 / 逻辑 Hook 的分层，对应后端的 View / Controller / Service。让目录结构体现架构意图。" },
  { slug: "react-28-typescript",
    title: "TypeScript 与 React：类型安全的组件",
    volume: 4, lessonNum: 28,
    tags: ["TypeScript", "类型"],
    level: "实战", focus: true,
    desc: "给 Props、state、事件用 TS 建模，对比 Java 的泛型与接口。类型安全能拦住一大半前端 bug，Java 程序员上手极快。" },
  { slug: "react-29-structure",
    title: "目录结构与代码规范",
    volume: 4, lessonNum: 29,
    tags: ["工程化", "规范"],
    level: "实战", focus: false,
    desc: "按功能 vs 按类型组织目录、命名约定、ESLint/Prettier 配置。把 Java 项目的规范意识带到前端。" },

  // ═══════════════════════════════════════════════════════════════
  // 卷五：路由与数据获取（7 篇）
  // ═══════════════════════════════════════════════════════════════
  { slug: "react-30-router",
    title: "React Router 与嵌套路由（对比 @RequestMapping）",
    volume: 5, lessonNum: 30,
    tags: ["路由", "Router"],
    level: "实战", focus: true,
    desc: "路由表、嵌套布局、Outlet。用 Spring 的 @RequestMapping / 拦截器类比，快速建立前端路由心智。" },
  { slug: "react-31-dynamic-route",
    title: "动态路由与参数解析",
    volume: 5, lessonNum: 31,
    tags: ["路由", "参数"],
    level: "实战", focus: false,
    desc: "路径参数、查询参数、useParams/useSearchParams。对应对后端的 @PathVariable / @RequestParam。" },
  { slug: "react-32-fetch",
    title: "数据获取：fetch / axios 与 useEffect 取数",
    volume: 5, lessonNum: 32,
    tags: ["数据", "请求"],
    level: "实战", focus: true,
    desc: "在组件里发起请求、处理 JSON。为什么 useEffect 取数有竞态问题，以及前置方案的历史包袱。" },
  { slug: "react-33-query",
    title: "TanStack Query：服务端缓存管理",
    volume: 5, lessonNum: 33,
    tags: ["数据", "缓存"],
    level: "实战", focus: true,
    desc: "把服务端状态交给 TanStack Query 管理：自动缓存、失效重取、乐观更新。对比 MyBatis 的二级缓存。" },
  { slug: "react-34-async-ui",
    title: "加载态 / 错误态 / 竞态处理",
    volume: 5, lessonNum: 34,
    tags: ["数据", "健壮性"],
    level: "实战", focus: false,
    desc: "isLoading / isError / 竞态取消。把「请求的三种状态」建模清楚，前端代码立刻稳妥一个档次。" },
  { slug: "react-35-auth",
    title: "认证与路由守卫（对比拦截器）",
    volume: 5, lessonNum: 35,
    tags: ["认证", "路由"],
    level: "实战", focus: false,
    desc: "登录态存储、受保护路由、token 注入。用 Spring Security / 拦截器的思路理解前端认证流程。" },
  { slug: "react-36-pagination",
    title: "分页与无限滚动",
    volume: 5, lessonNum: 36,
    tags: ["数据", "交互"],
    level: "实战", focus: false,
    desc: "分页组件、IntersectionObserver 无限滚动、游标与偏移量的取舍。" },

  // ═══════════════════════════════════════════════════════════════
  // 卷六：性能优化与部署（6 篇）
  // ═══════════════════════════════════════════════════════════════
  { slug: "react-37-rerender",
    title: "重渲染剖析：memo 何时真正有用",
    volume: 6, lessonNum: 37,
    tags: ["性能", "渲染"],
    level: "进阶", focus: true,
    desc: "父组件重渲染，子组件一定跟着刷吗？理解引用相等与 props 比对，才知道 memo 该加在哪。" },
  { slug: "react-38-virtual-list",
    title: "虚拟列表与大数据渲染",
    volume: 6, lessonNum: 38,
    tags: ["性能", "列表"],
    level: "进阶", focus: false,
    desc: "万行列表只渲染可视区。react-window / 虚拟滚动的原理，对比后端分页返回的思路。" },
  { slug: "react-39-code-split",
    title: "代码分割与懒加载",
    volume: 6, lessonNum: 39,
    tags: ["性能", "打包"],
    level: "进阶", focus: false,
    desc: "React.lazy + Suspense、按路由拆包。对比后端的模块化/插件化，首屏不再加载一整个 app。" },
  { slug: "react-40-vite",
    title: "Vite 构建原理（对比 Maven/Gradle）",
    volume: 6, lessonNum: 40,
    tags: ["构建", "工程化"],
    level: "实战", focus: false,
    desc: "ESM + esbuild + Rollup 的构建链路。用 Maven 依赖解析/打包类比，理解前端构建产物是什么。" },
  { slug: "react-41-profiler",
    title: "性能监控与 React Profiler",
    volume: 6, lessonNum: 41,
    tags: ["性能", "监控"],
    level: "进阶", focus: false,
    desc: "用 React DevTools Profiler 定位慢渲染，结合 Lighthouse 打生产包。像排查后端慢接口一样排查前端。" },
  { slug: "react-42-deploy",
    title: "部署：静态站 / Nginx / CI 流水线",
    volume: 6, lessonNum: 42,
    tags: ["部署", "DevOps"],
    level: "实战", focus: false,
    desc: "把 React 应用部署到 Nginx/静态托管、配置回退路由、接 GitHub Actions 自动构建发布。后端部署经验直接复用。" },

  // ═══════════════════════════════════════════════════════════════
  // 卷七：AI 时代的前端进阶（8 篇）
  // ═══════════════════════════════════════════════════════════════
  { slug: "react-43-roadmap",
    title: "Java 后端全栈转型路线图",
    volume: 7, lessonNum: 43,
    tags: ["转型", "路线"],
    level: "入门", focus: true,
    desc: "AI 时代为什么后端更需要全栈能力？一条从 React 到全栈的可执行路径，以及各阶段的里程碑。" },
  { slug: "react-44-rsc",
    title: "Next.js 服务端组件：一次范式转移",
    volume: 7, lessonNum: 44,
    tags: ["Next.js", "RSC"],
    level: "进阶", focus: true,
    desc: "Server Components 让组件直接在服务端渲染——后端程序员反而有主场优势。理解「客户端边界」的精髓。" },
  { slug: "react-45-stream-ui",
    title: "流式 UI 与 LLM 响应",
    volume: 7, lessonNum: 45,
    tags: ["流式", "LLM"],
    level: "实战", focus: true,
    desc: "把 LLM 的分词响应用 SSE 流式渲染到界面，做出打字机效果。这是 AI 产品体验的核心一环。" },
  { slug: "react-46-llm-integration",
    title: "集成 LLM 的前端实践",
    volume: 7, lessonNum: 46,
    tags: ["LLM", "实战"],
    level: "实战", focus: true,
    desc: "对话界面、消息列表、停止生成、错误重试。拆解一个 AI Chat 前端的完整实现思路。" },
  { slug: "react-47-ai-pair",
    title: "与 AI 结对编程：V0 / Cursor 提效",
    volume: 7, lessonNum: 47,
    tags: ["AI", "效率"],
    level: "实战", focus: false,
    desc: "用 AI 生成组件骨架、审阅代码、重构。前提是你先读懂这本笔记——AI 是放大器，不是替代品。" },
  { slug: "react-48-agent-ui",
    title: "Agent 前端：工具调用与状态机",
    volume: 7, lessonNum: 48,
    tags: ["Agent", "状态机"],
    level: "进阶", focus: false,
    desc: "Agent 的多轮 tool-call 如何在前端建模？用状态机组织「思考中/调用工具/生成中/完成」的界面。" },
  { slug: "react-49-fullstack",
    title: "从 React 到全栈：一个项目打通",
    volume: 7, lessonNum: 49,
    tags: ["全栈", "实战"],
    level: "实战", focus: true,
    desc: "用 React + Next.js + 你的 Java 后端做一个端到端小项目，把前面六章串成一次真实交付。" },
  { slug: "react-50-frontier",
    title: "前沿展望：Server Actions / 边缘计算",
    volume: 7, lessonNum: 50,
    tags: ["前沿", "趋势"],
    level: "进阶", focus: false,
    desc: "Server Actions、Partial Prerendering、边缘运行时——Next.js 演进的下一个方向，保持视野在线。" },
];

export function getReactArticlesByVolume(volume: number): ReactArticleMeta[] {
  return REACT_ARTICLES.filter((a) => a.volume === volume);
}

export function getReactArticle(slug: string): ReactArticleMeta | undefined {
  return REACT_ARTICLES.find((a) => a.slug === slug);
}

/** 加载 React 文章内容（content/react-notes/{slug}.html） */
export function getReactContent(slug: string): string | null {
  return getGenericContent(`react-notes/${slug}`);
}
