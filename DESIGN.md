---
version: alpha
name: 51cba Journal
description: Neo-brutalist personal blog styled like an independent print journal — thick borders, hard shadows, warm-paper canvas, journal volume/lesson structure.
colors:
  # 主品牌色（DESIGN.md 官方 primary 别名，实际语义看下方分工表）
  primary: "#FAC94A"
  # 主背景：暖纸底（首页 / Java 目录 / 文章正文）
  paper: "#F5EDDB"
  # 深一级暖纸（页脚上方 method 区、recap 卡片）
  paper-deep: "#EDE3C4"
  # 卡片纯白（feature-card / srcbox 外壳 / think 块）
  paper-card: "#FFFFFF"
  # 暖白（interlude 反白文字底色）
  paper-warm: "#FFF8F0"
  # 主墨色（正文 / header / footer / 硬阴影 / 主 CTA 背景）
  ink: "#1C1C1C"
  # 次级文字（章节副标题 / lede / rm-cap-gloss）
  ink-soft: "#57544E"
  # 三级文字（lesson-no / lesson-q / rm-flag）
  ink-faint: "#8C8676"
  # 分割线 / 弱边框
  line: "#D8CEB6"
  # 品牌金黄（Hero 标题高亮 / 导航当前页 / chip-ready / BackToTop 环）
  brand: "#FAC94A"
  # 品牌金黄悬浮（chip hover / feature card hover）
  brand-hover: "#F5C033"
  # 品牌次金（Java 卷次高亮）
  brand-alt: "#F4D35E"
  # 强调焦橙（LLM 卷标签 / 章节序号描边 / 文章内 code / 主要交互色）
  accent: "#C2410C"
  # 焦橙深（link hover / cap-t）
  accent-deep: "#9A3010"
  # 焦橙暖（accent-warm，暂未大量使用）
  accent-warm: "#E0561F"
  # 焦橙淡底（accent-wash：code 背景 / crack 底 / lesson hover 底）
  accent-wash: "#FBE6C7"
  # 图表蓝（takeaway 块的对比色）
  chart-blue: "#3E6B8F"
  # 页脚字色（暖米色）
  footer-text: "#F5EDDB"

typography:
  # ── 大字号 ──
  h1:
    fontFamily: AlimamaShuHeiTi
    fontSize: 3rem
    fontWeight: 900
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  h2:
    fontFamily: AlimamaShuHeiTi
    fontSize: 1.4rem
    fontWeight: 800
    lineHeight: 1.4
  h3:
    fontFamily: AlimamaShuHeiTi
    fontSize: 1.15rem
    fontWeight: 800
    lineHeight: 1.5
  # ── 章节栏目 ──
  section-title:
    fontFamily: AlimamaShuHeiTi
    fontSize: 2.25rem
    fontWeight: 900
    lineHeight: 1.2
  section-kicker:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.28em"
  # ── 正文 ──
  body:
    fontFamily: Noto Sans SC
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.9
  body-sm:
    fontFamily: Noto Sans SC
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.7
  # ── UI 组件 ──
  nav:
    fontFamily: Noto Sans SC
    fontSize: 14px
    fontWeight: 900
    lineHeight: 1
  code-inline:
    fontFamily: JetBrains Mono
    fontSize: 0.88em
    fontWeight: 500
  mono-label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: 800
    letterSpacing: "0.15em"

rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 20px
  pill: 999px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  "2xl": 48px
  "3xl": 68px
  "4xl": 80px

shadows:
  # 硬阴影：neo-brutalist 灵魂 —— 无羽化、纯黑、偏移
  hard-sm: "1.5px 1.5px 0 #1C1C1C"
  hard-md: "3px 3px 0 #1C1C1C"
  hard-lg: "6px 6px 0 #1C1C1C"
  # 柔阴影：nb-card 提亮用（保留一个逃生口，不要滥用）
  soft-card: "0 8px 24px rgba(28,28,28,0.06)"

layout:
  container-max: 1280px
  content-max: 788px   # 单栏文章正文最大宽
  sidebar-w: 220px      # Java 详情页左侧栏
  gutter: 48px          # 桌面容器左右
  gutter-mobile: 16px

breakpoints:
  md: 900px            # 侧栏折叠 / method 单列 / rm-line 单列
  sm: 640px            # Hero h1 降级

components:
  # ── Neo-brutalist 按钮 ──
  btn-dark:
    backgroundColor: "{colors.ink}"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
    typography: "{typography.nav}"
  btn-white:
    backgroundColor: "{colors.paper-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  btn-white-hover:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.ink}"

  # ── Hero 主 CTA (丛书按钮) ──
  hero-cta-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.brand}"
    rounded: "{rounded.none}"
    padding: "14px 22px 14px 18px"
  hero-cta-secondary:
    backgroundColor: "{colors.paper-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "14px 22px 14px 18px"
  hero-cta-secondary-hover:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.ink}"

  # ── Chip (状态标签) ──
  chip-ready:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "4px 16px"
  chip-go-hover:
    backgroundColor: "{colors.brand-hover}"
    textColor: "{colors.ink}"

  # ── Header/Footer 深色带 ──
  section-dark:
    backgroundColor: "{colors.ink}"
    textColor: "#FFFFFF"

  # ── Feature Card (首页丛书封面卡) ──
  feature-card:
    backgroundColor: "{colors.paper-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "32px"
  feature-card-hover:
    backgroundColor: "{colors.paper-card}"
    textColor: "{colors.ink}"

  # ── nb-card (通用精致卡片) ──
  nb-card:
    backgroundColor: "{colors.paper-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"

  # ── 阅读容器 ──
  lesson-body:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"

  # ── 特殊阅读块 ──
  think-block:
    backgroundColor: "{colors.paper-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "22px 26px"
  crack-block:
    backgroundColor: "{colors.accent-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "22px 28px"
  takeaway-block:
    backgroundColor: "{colors.paper-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px 28px"
  recap-block:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px 28px"

  # ── 深色代码块 (srcbox) ──
  srcbox:
    backgroundColor: "#282838"
    textColor: "#E4E4EF"
    rounded: "{rounded.lg}"
    padding: "18px 22px"

  # ── BackToTop 浮动按钮 ──
  back-to-top:
    backgroundColor: "rgba(28,28,28,0.35)"
    textColor: "{colors.brand}"
    rounded: "{rounded.pill}"
    size: "44px"
---

## Overview

**51cba Journal** 是一套 **neo-brutalist / 独立出版年鉴** 风格的个人技术博客体系。它借用纸质丛书的视觉语言（暖纸底、卷号、章节序号、粗黑边、硬阴影、Alimama 粗黑体），把「技术学习笔记」当作正在连载的**印刷刊物**来经营，而不是常见的 SaaS 落地页。

三个不变的姿势：

- **暖，不冷。** 底色永远是 `#F5EDDB` 暖纸而非白或灰，`#FFF8F0` 是次级暖白。冷灰系（`#F5F5F5`、蓝灰）不进入调色板。
- **硬阴影，不羽化。** `neo-brutalist` 的骨架 —— 纯黑偏移阴影 `3px 3px 0 #1C1C1C`，不用 `blur`。柔阴影 `0 8px 24px rgba(...)` 只在 `nb-card` 上做次一级提亮。
- **金黄是品牌，焦橙是交互。** `#FAC94A` 只做身份识别（Hero 高亮、导航当前页、chip-ready、进度环）；`#C2410C` 承载全部行动语义（链接、章节序号、code、hover）。**不混用。**

## Colors

### 纸底与墨色

- **paper `#F5EDDB`** — 全站主底色，模拟做旧新闻纸质感。所有页面 `<body>` 都是这个。
- **paper-deep `#EDE3C4`** — 次级面，用于 `method` 区、`recap` 块、表格斑马纹偶数行。视觉作用是「同色系分层」，不用灰阶。
- **paper-card `#FFFFFF`** — 卡片实心底。**只用于卡片**，不用作页面底。
- **paper-warm `#FFF8F0`** — Interlude（焦橙横条上的反白文字底色）。
- **ink `#1C1C1C`** — 唯一真「黑」，也是**唯一硬阴影颜色**。header/footer 反白也用这个做底。
- **ink-soft `#57544E`** / **ink-faint `#8C8676`** — 次级 / 三级文字。三级文字永远搭配 `paper` 或更浅底色，不放深底上。
- **line `#D8CEB6`** — 弱分割线。比 paper 深一级即可，不用真灰。

### 品牌金 & 强调焦橙

**这两条色轴分工严格：**

| 用途 | 色号 | 出现位置 |
|---|---|---|
| 品牌身份 | `#FAC94A` brand | Hero 标题高亮、导航当前页、chip-ready 底、BackToTop 进度环、srcbox 文件名 |
| 交互 / 行动 | `#C2410C` accent | 所有链接、章节序号描边、行内 `code`、hover 焦色、章节 kicker、pager 焦色 |
| 焦橙淡底 | `#FBE6C7` accent-wash | 行内 code 背景、lesson row hover、crack 块底 |
| 图表对比 | `#3E6B8F` chart-blue | 仅用于 `takeaway` 块的边框和标签色（跟焦橙形成互补） |

**Do**：Hero「让 AI Agent 落地在真实业务里」的「AI Agent」用金黄，正文里想强调的字用**加粗黑色**或**焦橙**。

**Don't**：不要用金黄做正文强调（对比度不够）；不要把焦橙铺成大面积背景（除 Interlude 那一条焦橙带以外）；不要把两个品牌色叠加或做渐变。

### 页脚字色

- **footer-text `#F5EDDB`（暖米色，`opacity: 0.45`）** — 页脚正文字。深色带上白色 40% 会显得太冷，用暖米更贴调性。
- 页脚链接 `hover` 回到 `#FAC94A` 金黄。

## Typography

**主字体阶梯：**

- **`AlimamaShuHeiTi`（阿里妈妈数黑体）** — 承担所有大标题（Hero h1 / section-title / volume h3 / station h2 / lesson-title / hero-cta-title）。粗、硬、方，是「丛书感」的核心承重梁。**不可替换成 Noto Sans SC 粗体**——两者的粗黑度和骨架不同。
- **`Noto Sans SC`（思源黑体）** — 正文、导航、按钮文字、chip 标签。
- **`JetBrains Mono`** — 章节 kicker、卷号（`卷一 · 并发编程`）、`code`、srcbox 内代码、rm-cap、mono-label。**所有等宽出现都是「作为印刷元素」**，不是「code 感」——line-height 与字距刻意调大。
- **`Noto Serif SC` / `Songti SC`** — 已声明为 `--serif`，但目前**未使用**。保留给未来「引用块 / 卷首语」这类需要文脉切换的场景。

**字号纪律：**

- 正文永远 `17px × 1.9 line-height`，移动端降到 `16px × 1.85`。
- 章节 `<h3>` 用左边 `4px` 焦橙实线代替下划线或色块。
- Hero h1 桌面 `48px+`，移动端强制降到 `28px` (`@media 640px`)。
- **章节 kicker (`section-kicker`)** 是全站视觉招牌：`12px` JetBrains Mono、`letter-spacing: 0.28em`、焦橙色、上下方 `12px` 空气。任何新页面都先想「这一段的 kicker 是什么」再动大字。

## Layout & Spacing

- **容器最大宽：1280px**（`.article-shell` / `.method-inner` / `.map-section` / `.volumes-wrap`）。
- **正文最大宽：788px**（`article-main` / lesson body）。中文长行阅读的舒适上限。
- **侧栏宽：220px**（Java 详情页），跟正文的间距 `48px`。
- **左右 padding：桌面 48px / 移动 16-20px**。
- **section 之间垂直呼吸：60-80px**。方式统一用 `margin-top`，不用两侧 `padding`。

**900px 断点** 是最关键的响应式分界：侧栏折叠、method loop 从五列变一列、rm-line 从两列变一列、正文 padding 收窄。

## Elevation & Depth

**只有两级：**

1. **硬阴影（hard-sm / hard-md / hard-lg）** — neo-brutalist 骨架。用于 `hero-cta`、`chip-ready`、`feature-card`、`btn-white`、`btn-dark`。hover 时**同时缩短阴影 + `translate(3px, 3px)`**，模拟「按下去」的物理感。
2. **柔阴影（soft-card）** — 只用在 `nb-card` hover 上做轻微提亮。滥用会破坏 neo-brutalist 骨架。

**BackToTop 浮动按钮**是唯一例外：`box-shadow: 0 2px 10px rgba(0,0,0,0.12)` + `backdrop-blur(8px)`——因为它需要浮在任意背景上，不能带硬阴影方向感。

## Shapes

- **卡片圆角：12px (`rounded.lg`)** —— nb-card / 特殊阅读块（think / crack / takeaway / recap）/ srcbox。
- **胶囊按钮：999px** —— 所有主 CTA、chip、pager-btn、导航链接的 hover 底。
- **Hero CTA / Feature Card：0 圆角（直角）** —— 这是它们「丛书封面感」的关键，**不要给它们加圆角**。
- **章节序号描边：`-webkit-text-stroke: 1.5px var(--accent)`** —— 独立出版物的杂志封面质感。

## Components

### `hero-cta-primary` / `hero-cta-secondary`

首页 Hero 的两颗大按钮。**这是全站视觉锚点**，任何变化都会牵动首页调性：

- 直角 + 3px 黑边 + `6px 6px 0 #1C1C1C` 硬阴影
- 内含 icon (42×42, 2.5px 边) + 中英标题（Alimama）+ mono 副标题
- Hover：`translate(3px, 3px)` + 阴影缩到 3px
- Primary 是墨底金字，Secondary 是白底墨字（hover 变金底）

### `chip-ready`

「已开更」标签。金黄底 + 黑边 + 硬阴影，是 neo-brutalist 语言的最小单位。任何列表项想标记状态都用它。

### `feature-card`

首页丛书封面卡。3px 黑边 + `6px 6px 0` 硬阴影 + 直角，hover 用 `.feature-card:hover` 缩短阴影 + 位移。**不要加圆角、不要加渐变、不要加投影模糊**——那会立刻从「独立出版」跌回「SaaS 卡片」。

### `nb-card`

阅读容器里的通用卡片（12px 圆角 + 1px 弱边 + 轻柔阴影 hover）。这是**书内插图**的语言，跟 feature-card 的**书封面**语言并存但不混用。

### `BackToTop`

- 44×44 半透明毛玻璃（`rgba(28,28,28,0.35)` + `blur(8px)`）
- 金黄 (`#FAC94A`) 上箭头 + 外圈 2px 金黄环形进度条
- `r=21` 与按钮外沿同心
- 底距 `max(88px, safe-area + 72px)` 避开页脚
- 只在滚动 > 400px 才淡入

### `section-dark`

Header 和 Footer 的共用底纹。墨底 + 白字 / 金黄高亮。整站唯二的深色带。

## Do's and Don'ts

**Do**

- 用 `paper` / `paper-deep` / `paper-card` 三级暖底做纵深，不用灰阶。
- 硬阴影只用 `#1C1C1C`、只用整数像素偏移、`0` 模糊半径。
- 每个新的板块先想「kicker 是什么」（12px mono 焦橙 `letter-spacing: 0.28em`）。
- 章节标题用 Alimama 粗黑体；正文用 Noto Sans SC；不要在同一屏出现第三种中文字体。
- 交互态永远是「颜色变 + 位移 + 阴影收缩」的三合一，不是单纯变色。

**Don't**

- 不要用蓝 / 冷灰 / 纯白做底色。
- 不要给 hero-cta 或 feature-card 加圆角、加渐变、加模糊阴影。
- 不要用金黄做正文强调（对比度会掉到 3:1 以下）。
- 不要把焦橙做成渐变或大面积背景色，Interlude 那一条焦橙带是唯一大面积焦橙的位置。
- 不要在同一模块混用「硬阴影」和「柔阴影」——选一种。
- 不要用 emoji 装饰标题，emoji 只出现在正文特殊块（`.think::before` 是唯一批准的例外）。
- 不要写「用 AI 赋能开发」「打造沉浸式阅读体验」这类词。这不是 SaaS 官网。
