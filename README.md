# 51cba Journal

Neo-brutalist 风格的个人技术笔记站 —— 暖纸底、粗黑边、硬阴影，按"丛书 + 卷"的方式来组织技术学习笔记。

## 内容板块

| 板块 | 路由 | 规模 |
|---|---|---|
| LLM 基础概念 | `/ai-llm/` | 32 课 × 5 卷（向量 → Transformer → 前沿） |
| Java 面试笔记 | `/java-basics/` | 70 篇 × 7 卷（集合/并发/JVM/Spring/中间件/分布式） |
| 家庭指南 | `/family-guide/` | 1 页（手工 HTML） |

## 技术栈

- **框架**：Next.js 16（App Router，Turbopack）+ React 19 + Tailwind CSS 4
- **输出**：`output: "export"` 纯静态导出，可部署到任意静态托管
- **内容管道**：纯 HTML 内容文件放 `content/`，构建时由 `lib/content.ts` 提取 `<body>`、剥掉旧样式后注入页面

## 目录结构

```
app/                    # 路由与组件
├─ page.tsx             # 首页
├─ layout.tsx           # 全站外壳（Header / Footer / BackToTop）
├─ ai-llm/              # LLM 课程：分类页 + 32 节详情页
├─ java-basics/         # Java 目录页（Route Map + 逐卷展开）
├─ java-interview/      # Java 详情页 [slug]
└─ family-guide/        # 家庭指南

lib/content.ts          # 内容注册表 + HTML 加载/清洗
content/                # 纯内容 HTML（唯一内容源）
├─ ai-llm/*.html        # 32 篇课程
├─ java-basics/*.html   # 70 篇面试笔记
└─ family-guide.html

public/                 # 静态资源（头像、favicon、KaTeX 公式字体）
DESIGN.md               # 设计规范（调色板 / 字体 / 阴影纪律）
```

新增一篇文章的流程：`content/` 下放 HTML → `lib/content.ts` 的对应数组里登记元信息 → `npm run build`。

## 常用命令

```bash
npm run dev      # 开发（Turbopack 热更新）
npm run build    # 静态导出到 out/
npm run lint     # eslint
```

## 设计规范

改样式前先读 `DESIGN.md`：暖纸系底色、硬阴影只用 `#1C1C1C`、金黄 `brand` 只做身份识别、焦橙 `accent` 承载交互语义，两者不混用。
