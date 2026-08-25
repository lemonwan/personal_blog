# 51cba Journal — Design Audit Report

**日期**：2026-07-04
**基准**：`nextjs-src/DESIGN.md`
**范围**：`nextjs-src/app/` + `nextjs-src/components/`（12 个源文件）

## Executive Summary

| 维度 | 现状 | 判定 |
|---|---|---|
| Token 一致性 | 大部分组件走 CSS 变量或已定义色号 | 🟡 中等 |
| Off-palette 硬编码 | **28 个未定义色号**（Java 目录页 4 组 + Quiz 组件 2 组 + srcbox 主题 15 组 + 难度点 7 组） | 🔴 严重 |
| 字重混用 | `black`(24) + `bold`(17) + `700`(13) + `800`(8) + `900`(7) + `600`(4) 六种权重共存 | 🟡 中等 |
| 圆角 | 3 种硬编码值 `12px / 999px / 50%`，DESIGN.md 已定义但代码没走 token | 🟢 轻微 |
| 硬阴影 | `hard-md 3px 3px 0 #1C1C1C` 用得一致 | 🟢 良好 |
| 字体族 | Alimama 粗黑体 / Noto Sans SC 分工清楚 | 🟢 良好 |

## 🔴 严重：Java 目录页调色板"平行宇宙"

`app/java-basics/page.tsx`（Java 卷次目录页）用了**一整套未在 DESIGN.md 定义的暖灰调色板**和**彩虹色难度点**，跟站点其它页面的 neo-brutalist 系统**完全脱节**。

### Issue 1：暖灰色系（未定义）

| 色号 | 出现 | 用途 | 应该改成 |
|---|---|---|---|
| `#A09889` | 3 次 | 副标题、卷号 mono 标 | `ink-faint #8C8676` |
| `#B0A898` | 2 次 | 卷首字幕 mono | `ink-faint #8C8676` |
| `#C5B99B` | 3 次 | 分隔线、tag 文字 | `line #D8CEB6` 或 `ink-faint` |
| `#E8E0D0` | 3 次 | 装饰线、渐变端点 | `line #D8CEB6` 或 `paper-deep` |

**问题本质**：这一页有独立的"暖灰四阶"，跟站点的 `ink-soft → ink-faint → line` 三阶重叠但不复用。

### Issue 2：难度点彩虹色（8 色未定义）

`page.tsx:12-14` 定义了一张卷号 → 颜色映射表：

```ts
1: "#3B82F6",  // 蓝
2: "#EA580C",  // 橙
3: "#10B981",  // 绿
4: "#8B5CF6",  // 紫
5: "#059669",  // 深绿
6: "#EF4444",  // 红
7: "#6366F1",  // 靛
初级: "#66BB6A"  // 亮绿
```

**判定**：**完全违反 DESIGN.md 的色彩纪律**。DESIGN.md 明确说"金黄是身份，焦橙是交互，两个品牌色不做渐变"。这里冒出一堆 Tailwind 默认色 (`blue-500 orange-600 emerald-500 violet-500 …`)，把独立出版感直接拉回 SaaS 面板。

**建议**：卷次颜色统一走 `accent #C2410C`，或用**深浅焦橙**做卷次区分（`accent-warm / accent / accent-deep`），最多 3 阶。

## 🔴 严重：AI Quiz 组件独立 semantic 色

`app/ai-llm/lessons/[slug]/LessonClient.tsx:73-166` 有一对：

```
正确：#3E8F5A （深绿）
错误：#C0481E （砖红）
```

**这两个色**在 DESIGN.md 里**根本没有** —— DESIGN.md 缺 semantic success/error 定义。

**修复方向（二选一）**：
- **A**：DESIGN.md **补上** `success #3E8F5A` / `danger #C0481E`，把它们正式纳入调色板
- **B**：Quiz 反馈改用 `accent #C2410C`（错）+ 加粗字（对）而不引入绿色

推荐 A — 面试题反馈需要清晰语义色，视觉分离是有理由的。

## 🟡 中等：srcbox 代码块深色主题（15 色）

`globals.css:237-249` 定义了完整的深色语法主题（macOS 窗口红黄绿灯 + One Dark 风代码色）：

```
#2d2d3a #1e1e2e #282838 #e4e4ef #8b8ba0   (壳)
#ff5f56 #ffbd2e #27c93f                   (窗口灯)
#c792ea #c3e88d #82aaff #f78c6c #6a7a8c   (语法着色)
```

**判定**：这**可以保留**——代码高亮是**独立子系统**，就像 Prism/Shiki 主题一样。但 DESIGN.md 应该**显式承认**这个子系统，避免以后被误当作违规清理掉。

**修复**：DESIGN.md 加一段 `## Sub-systems: srcbox theme`，把这 15 个色作为一个封装单元列出（不参与主 palette）。

## 🟡 中等：字重混用

统计（全项目）：

```
black    24×
bold     17×
700      13×
800       8×
900       7×
600       4×
semibold  3×
medium    2×
```

问题：
- **`black` (24) + `900` (7) + `bold` (17) + `700` (13)** 表达的是同一件事——都是"最重"和"次重"，但用了 4 种写法。
- **`800` (8) + `600` (4) + `semibold` (3) + `medium` (2)** 中间层次太多，DESIGN.md 只需 900/800/700/400 四档就够。

**修复方向**：约定**只用 4 档字重** `400 / 700 / 800 / 900`，全部走 Tailwind `font-normal / font-bold / font-extrabold / font-black`，禁用其它数字/关键字。这个改动落到 CSS 有具体的 diff，交给 Step 3 一起收。

## 🟡 中等：token 硬编码（未走 CSS 变量）

即使颜色**都在 palette 内**，很多地方没走 `var(--brand)` 而是**直接写 hex**：

| 色号 | 硬编码次数 |
|---|---:|
| `#1c1c1c` (ink) | **65** |
| `#fac94a` (brand) | **28** |
| `#ffffff` (paper-card) | 17 |
| `#c2410c` (accent) | 7 |
| `#f5eddb` (paper) | 5 |

**判定**：`#1c1c1c` 出现 65 次意味着"改主色调"是**一场大手术**，理论上应该改一处 `--ink` 就全站生效。

**修复方向**：`app/globals.css` 的 `@theme inline` 已经定义了 `--color-*` 变量，Tailwind v4 语法允许 `text-ink bg-brand`，只是很多地方还在写 `bg-[#1C1C1C]`。**这不需要立刻大改**，但作为**规则**要写进 DESIGN.md：新代码禁止硬编码 hex，只能走 `var(--*)` 或 Tailwind semantic class。

## 🟡 中等：`#333` btn-dark:hover

`globals.css:99`：

```css
.ai-llm-scope .btn-dark:hover { background: #333; ... }
```

`#333333` 不在 palette。改成 `color-mix(in srgb, var(--ink) 88%, white)` 或直接加进 palette 作为 `ink-hover`。

## 🟢 良好：硬阴影一致

`3px 3px 0 #1C1C1C`、`6px 6px 0 #1C1C1C`、`1.5px 1.5px 0 #1C1C1C` 三档硬阴影全站用得**很干净**，没发现走样。**这是站点视觉最稳定的部分。**

## 🟢 良好：字体族分工

- `AlimamaShuHeiTi` — 只出现在标题和 hero-cta-title
- `Noto Sans SC` — 只出现在正文和 UI
- `JetBrains Mono` — 只出现在 kicker/code/mono-label

分工干净，无越界。

## 优先级建议（Step 3 用）

**必须改**：
1. Java 目录页 4 组暖灰色 + 8 色难度点收归 palette
2. Quiz semantic 色 → 补进 DESIGN.md（推荐方案 A）
3. `#333` `btn-dark:hover` 归一

**应该改**：
4. 字重四档纪律，全站排查一遍
5. srcbox 主题在 DESIGN.md 里显式声明为"子系统"

**可以放**：
6. `#1c1c1c` 65 次硬编码不必大改；只需**新代码约束**"不再新增"
7. rgba 硬编码（都是低透明度装饰阴影，不影响调色板一致性）

---

**下一步**：Step 3 打磨时优先解决 1 / 2 / 3 / 4，视觉一致性能提升最明显。5 是文档补丁，改 DESIGN.md 就够，不动代码。
