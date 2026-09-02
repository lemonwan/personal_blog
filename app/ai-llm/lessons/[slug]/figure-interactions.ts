// @ts-nocheck
// 参照 https://www.xuanyuancode.com/ai-llm 复刻的交互式 SVG 演示：
// 拖动旋钮/滑块，神经元加权求和、softmax、判定直线、两层网络、激活函数等图形实时重算。
// 纯原生 DOM 实现，与 LessonClient 的既有交互风格一致。

const fmt1 = (n: number) => n.toFixed(1);
const fmt2 = (n: number) => n.toFixed(2);
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

function byLabel(root: HTMLElement, label: string): SVGSVGElement | null {
  const svg = root.querySelector<SVGSVGElement>(`svg[aria-label="${label}"]`);
  return svg;
}

function allByLabel(root: HTMLElement, label: string): SVGSVGElement[] {
  const exact = Array.from(root.querySelectorAll<SVGSVGElement>(`svg[aria-label="${label}"]`));
  if (exact.length) return exact;
  return Array.from(root.querySelectorAll<SVGSVGElement>(`svg[aria-label^="${label}"]`));
}

// 神经元 4 输入的权重与单价偏置（nn-01 / nn-02 共用）
const INPUT_KEYS = ["size", "red", "sweet", "water"];
const INPUT_WEIGHTS: Record<string, number> = { size: 0.4, red: 2.8, sweet: 1.6, water: 0.4 };
const NEURON_BIAS = -2.4;

// softmax 四个水果的原型向量（与输入特征的顺序一致：尺寸/颜色/酸甜/水分）
const FRUITS = [
  { name: "苹果", emoji: "🍎", color: "#C0481E", p: [0.5, 0.9, 0.65, 0.55] },
  { name: "香蕉", emoji: "🍌", color: "#C9A227", p: [0.55, 0.1, 0.8, 0.35] },
  { name: "西瓜", emoji: "🍉", color: "#3E8F5A", p: [0.95, 0.2, 0.7, 0.95] },
  { name: "柠檬", emoji: "🍋", color: "#B8A21E", p: [0.35, 0.15, 0.1, 0.6] },
];

/* ─────────────────────────────────────────────
   ① 单个神经元（nn-01）：四旋钮 → z → σ → 苹果概率
───────────────────────────────────────────── */
function bindSingleNeuron(root: HTMLElement) {
  allByLabel(root, "单个神经元结构图，数字随旋钮实时变化").forEach((svg) => {
    const lab = svg.closest(".fruit-lab") as HTMLElement | null;
    if (!lab) return;
    const knobs = Array.from(lab.querySelectorAll<HTMLInputElement>(".fruit-knobs input[type=range]"));
    if (knobs.length !== 4) return;

    // 4 个输入 <g>（svg 的直属 g，按顺序 尺寸/颜色/酸甜度/水分）
    const groups = Array.from(svg.children).filter((c) => c.tagName === "g") as SVGGElement[];
    const rows = groups.map((g) => ({
      line: g.querySelector<SVGLineElement>("line"),
      value: g.querySelectorAll("text")[1] as unknown as SVGTextElement | undefined,
    }));

    // 通过文案定位 z 值 / 输出概率 / 计算式 / 概率条
    const texts = Array.from(svg.querySelectorAll("text"));
    const zValue = texts[texts.findIndex((t) => t.textContent?.trim() === "加权总分 z") + 1];
    const outLabelIdx = texts.findIndex((t) => t.textContent?.trim() === "苹果概率");
    const outValue = (() => {
      // 输出值在「苹果概率」后面，且是用等宽字体渲染的百分比文本
      for (let i = outLabelIdx + 1; i < texts.length; i++) {
        if (/%$/.test(texts[i].textContent?.trim() || "")) return texts[i];
      }
      return null;
    })();

    const calcLine = lab.querySelector<HTMLElement>(".calc-line");
    const calcX = calcLine ? Array.from(calcLine.querySelectorAll<HTMLElement>(".calc-x")) : [];
    const calcZ = calcLine ? calcLine.querySelector<HTMLElement>(".calc-z") : null;
    const probRows = Array.from(lab.querySelectorAll<HTMLElement>(".prob-block .prob-row"));

    const CY = 116, CX = 208, R = 40, X0 = 104;
    const ROW_Y = [30, 84, 138, 192];

    const render = () => {
      const x = knobs.map((k) => parseFloat(k.value));
      const prod = x.map((v, i) => v * INPUT_WEIGHTS[INPUT_KEYS[i]]);
      const maxW = Math.max(...Object.values(INPUT_WEIGHTS));
      const z = prod.reduce((s, v) => s + v, 0) + NEURON_BIAS;
      const h = sigmoid(z);

      prod.forEach((pv, i) => {
        const c = maxW > 0 ? pv / maxW : 0;
        const row = rows[i];
        if (row.line) {
          row.line.setAttribute("stroke-width", (1 + 4 * c).toFixed(4));
          row.line.setAttribute("opacity", (0.25 + 0.65 * c).toFixed(4));
          const nx = X0 - CX, ny = ROW_Y[i] - CY;
          const len = Math.hypot(nx, ny) || 1;
          row.line.setAttribute("x2", (CX + (R * nx) / len).toFixed(2));
          row.line.setAttribute("y2", (CY + (R * ny) / len).toFixed(2));
        }
        if (row.value) row.value.textContent = fmt2(x[i]);
      });

      if (zValue) zValue.textContent = fmt2(z);
      if (outValue) outValue.textContent = Math.round(h * 100) + "%";
      if (calcX.length === 4) calcX.forEach((el, i) => (el.textContent = fmt2(x[i])));
      if (calcZ) calcZ.textContent = fmt2(z);

      // 概率条：🍎 苹果 / 🚫 非苹果
      const vals = [h, 1 - h];
      probRows.forEach((row, i) => {
        const fill = row.querySelector<HTMLElement>(".prob-fill");
        const pct = row.querySelector<HTMLElement>(".prob-pct");
        if (fill) fill.style.width = Math.round(vals[i] * 100) + "%";
        if (pct) pct.textContent = Math.round(vals[i] * 100) + "%";
        row.classList.toggle("prob-win", i === (h >= 0.5 ? 0 : 1));
      });
    };

    knobs.forEach((k) => k.addEventListener("input", render));
    render();
  });
}

/* ─────────────────────────────────────────────
   ② 四个神经元 + softmax（nn-01 / nn-03-network / nn-04）
───────────────────────────────────────────── */
function bindSoftmaxFruit(root: HTMLElement) {
  allByLabel(root, "四个神经元加 softmax 的结构图，分数随旋钮实时变化").forEach((svg) => {
    const lab = svg.closest(".fruit-lab") as HTMLElement | null;
    if (!lab) return;
    const knobs = Array.from(lab.querySelectorAll<HTMLInputElement>(".fruit-knobs input[type=range]"));
    if (knobs.length !== 4) return;

    const groups = Array.from(svg.children).filter((c) => c.tagName === "g") as SVGGElement[];
    // 输入组（含 rect）与神经元组（含 circle），各自按顺序
    const inputValue: SVGTextElement[] = [];
    const scoreText: SVGTextElement[] = [];
    groups.forEach((g) => {
      const texts = Array.from(g.querySelectorAll("text"));
      if (g.querySelector("rect")) inputValue.push(texts[1] as unknown as SVGTextElement);
      else if (g.querySelector("circle")) scoreText.push(texts[texts.length - 1] as unknown as SVGTextElement);
    });

    const winner = lab.querySelector<HTMLElement>(".winner-line b");
    const probRows = Array.from(lab.querySelectorAll<HTMLElement>(".prob-block .prob-row"));

    const render = () => {
      const x = knobs.map((k) => parseFloat(k.value));
      const scores = FRUITS.map((f) => {
        const dot = f.p.reduce((s, p, i) => s + p * x[i], 0);
        const sq = f.p.reduce((s, p) => s + p * p, 0);
        return 3 * (2 * dot - sq);
      });
      const mx = Math.max(...scores);
      const exps = scores.map((s) => Math.exp(s - mx));
      const sum = exps.reduce((s, v) => s + v, 0);
      const probs = exps.map((v) => v / sum);
      const best = probs.indexOf(Math.max(...probs));

      inputValue.forEach((t, i) => (t.textContent = fmt2(x[i])));
      scoreText.forEach((t, i) => (t.textContent = fmt1(scores[i])));
      if (winner) winner.textContent = `${FRUITS[best].emoji} ${FRUITS[best].name}`;
      probRows.forEach((row, i) => {
        const fill = row.querySelector<HTMLElement>(".prob-fill");
        const pct = row.querySelector<HTMLElement>(".prob-pct");
        if (fill) fill.style.width = Math.round(probs[i] * 100) + "%";
        if (pct) pct.textContent = Math.round(probs[i] * 100) + "%";
        row.classList.toggle("prob-win", i === best);
      });
    };

    knobs.forEach((k) => k.addEventListener("input", render));
    render();
  });
}

/* ─────────────────────────────────────────────
   ③ 一特征判定直线（nn-01）：w / b 两个滑块
───────────────────────────────────────────── */
function bindDecisionLine(root: HTMLElement) {
  allByLabel(root, "一个特征下的判定直线").forEach((svg) => {
    const lab = svg.closest(".fruit-lab") as HTMLElement | null;
    if (!lab) return;
    const inputs = Array.from(lab.querySelectorAll<HTMLInputElement>(".bnd-row input[type=range]"));
    if (inputs.length !== 2) return;
    const [wInput, bInput] = inputs;

    const GOOD = [0.72, 0.85, 0.78, 0.9];
    const BAD = [0.2, 0.35, 0.15, 0.28];
    const PX = (feature: number) => 54 + 340 * feature; // 特征值 → 像素 x
    const PY = (z: number) => 200 - 340 * z; // 输出 z → 像素 y

    // 动态元素：红线、红带、判定点虚线 + 标签、读数
    const zLine = svg.querySelector<SVGLineElement>('g[clip-path] line[stroke="#C0481E"]');
    const band = svg.querySelector<SVGRectElement>('rect[fill="#C0481E"]');
    const markerLine = svg.querySelector<SVGLineElement>('line[stroke="#5C6B79"][stroke-dasharray]');
    const markerLabel = (() => {
      const t = Array.from(svg.querySelectorAll("text")).find((x) => x.textContent?.trim() === "判定点");
      return (t as unknown as SVGTextElement) || null;
    })();
    const readout = lab.querySelector<HTMLElement>(".gd-readout");
    const calcZ = readout ? Array.from(readout.querySelectorAll<HTMLElement>(".calc-z")) : [];

    const render = () => {
      const w = parseFloat(wInput.value);
      const b = parseFloat(bInput.value);

      // 红线 z = w·x + b
      if (zLine) {
        zLine.setAttribute("x1", "54"); zLine.setAttribute("x2", "394");
        zLine.setAttribute("y1", PY(b).toFixed(2));
        zLine.setAttribute("y2", PY(w + b).toFixed(2));
      }

      // 红色区域（z>0）
      const c = w !== 0 ? -b / w : NaN;
      let d = 0, f = 0;
      if (w > 0) { d = clamp(c, 0, 1); f = 1; }
      else if (w < 0) { d = 0; f = clamp(c, 0, 1); }
      else if (b > 0) { d = 0; f = 1; }
      if (band) {
        if (f > d) { band.setAttribute("x", PX(d).toFixed(2)); band.setAttribute("width", (340 * (f - d)).toFixed(2)); band.removeAttribute("display"); }
        else band.setAttribute("display", "none");
      }

      // 判定点（z=0 的分界）
      if (markerLine && markerLabel) {
        if (w !== 0) {
          const pxx = clamp(PX(c), 54, 394);
          markerLine.setAttribute("x1", pxx.toFixed(2)); markerLine.setAttribute("x2", pxx.toFixed(2));
          markerLabel.setAttribute("x", pxx.toFixed(2));
          markerLine.removeAttribute("display"); markerLabel.removeAttribute("display");
        } else {
          markerLine.setAttribute("display", "none"); markerLabel.setAttribute("display", "none");
        }
      }

      // 分对计数
      const correct = GOOD.filter((g) => w * g + b > 0).length + BAD.filter((b_) => 0 > w * b_ + b).length;

      // 读数：z = w·个头 + (b)；分对 x/8
      if (calcZ.length >= 3) {
        calcZ[0].textContent = fmt1(w);
        calcZ[1].textContent = fmt1(b);
        calcZ[2].textContent = String(correct);
      }
    };

    inputs.forEach((i) => i.addEventListener("input", render));
    render();
  });
}

/* ─────────────────────────────────────────────
   ④ 两层网络识别好苹果（nn-02）：个头滑块 → 前向传播
───────────────────────────────────────────── */
function bindTwoLayer(root: HTMLElement) {
  allByLabel(root, "两层神经网络识别好苹果").forEach((svg) => {
    const lab = svg.closest(".fruit-lab") as HTMLElement | null;
    if (!lab) return;
    const slider = lab.querySelector<HTMLInputElement>('input[aria-label="个头大小"]');
    if (!slider) return;

    // 神经元①② 各自的动态节点（借助「加权和 z」「输出 h」文案定位）
    const zTexts = Array.from(svg.querySelectorAll("text")).filter((t) => t.textContent?.trim() === "加权和 z");
    const hTexts = Array.from(svg.querySelectorAll("text")).filter((t) => t.textContent?.trim() === "输出 h");
    const valueTexts = Array.from(svg.querySelectorAll("text")).filter(
      (t) => /^(-?\d+(\.\d+)?)$/.test(t.textContent?.trim() || "") && t.getAttribute("font-size") === "13"
    );
    // 个头 x 值（font-size 14）
    const xText = Array.from(svg.querySelectorAll("text")).find(
      (t) => /^\d(\.\d+)?$/.test(t.textContent?.trim() || "") && t.getAttribute("font-size") === "14"
    ) as unknown as SVGTextElement | undefined;

    // 输出 y 值（字体 17）
    const yText = Array.from(svg.querySelectorAll("text")).find(
      (t) => /^-?\d+$/.test(t.textContent?.trim() || "") && t.getAttribute("font-size") === "17"
    ) as unknown as SVGTextElement | undefined;

    const fruitLabel = Array.from(svg.querySelectorAll("text")).find((t) => t.textContent?.trim() === "是苹果" || t.textContent?.trim() === "不是苹果") as unknown as SVGTextElement | undefined;

    // 数字轴 marker（第二个 svg）
    const axisSvg = Array.from(lab.querySelectorAll("svg"))[1] as unknown as SVGSVGElement | undefined;
    const axisMarker = axisSvg?.querySelector<SVGLineElement>('line[stroke="#C0481E"]');
    const axisDot = axisSvg?.querySelector<SVGCircleElement>('circle[fill="#C0481E"]');

    const calcZ = lab ? Array.from(lab.querySelectorAll<HTMLElement>(".calc-line .calc-z")) : [];
    const calcLineEl = lab.querySelector<HTMLElement>(".calc-line");
    const alphaB = lab.querySelector<HTMLElement>(".gd-alpha b");

    // 计算式里的判定文字（纯文本节点「是苹果 / 不是苹果」）
    const judgeTextNode = (() => {
      if (!calcLineEl) return null;
      for (const node of Array.from(calcLineEl.childNodes)) {
        if (node.nodeType === 3 && /^(是苹果|不是苹果)$/.test((node.textContent || "").trim())) return node;
      }
      return null;
    })();

    const render = () => {
      const x = parseFloat(slider.value);
      const z1 = x - 0.4, h1 = z1 >= 0 ? 1 : 0;
      const z2 = x - 0.7, h2 = z2 >= 0 ? 1 : 0;
      const y = h1 - h2;

      if (xText) xText.textContent = fmt2(x);
      if (alphaB) alphaB.textContent = fmt2(x);
      // z1 / h1 / z2 / h2 的数值文本（按出现顺序：valueTexts = [z1, h1, z2, h2]? 修正为按 y 位置）
      // valueTexts 顺序与 DOM 顺序一致：z1, h1(?), z2, h2(?) —— 直接按 index 断言
      if (valueTexts.length >= 4) {
        valueTexts[0].textContent = fmt2(z1);
        valueTexts[1].textContent = String(h1);
        valueTexts[2].textContent = fmt2(z2);
        valueTexts[3].textContent = String(h2);
      }
      if (yText) yText.textContent = String(y);
      const isApple = y > 0;
      if (fruitLabel) fruitLabel.textContent = isApple ? "是苹果" : "不是苹果";
      if (judgeTextNode) judgeTextNode.textContent = isApple ? "是苹果" : "不是苹果";

      // 神经元激活/未激活的配色
      const actOn = (el: SVGElement | null, on: boolean) => {
        if (!el) return;
        el.setAttribute("stroke", on ? "#C0481E" : "#C9BBA2");
      };
      const n1 = zTexts[0]?.parentElement;
      const n2 = zTexts[1]?.parentElement;
      if (n1) {
        Array.from(n1.querySelectorAll<SVGElement>("line,circle,rect")).forEach((el) => actOn(el, !!h1));
      }
      if (n2) {
        Array.from(n2.querySelectorAll<SVGElement>("line,circle,rect")).forEach((el) => actOn(el, !!h2));
      }

      // 数字轴 marker
      const mx = 44 + 552 * x;
      if (axisMarker) { axisMarker.setAttribute("x1", mx.toFixed(1)); axisMarker.setAttribute("x2", mx.toFixed(1)); }
      if (axisDot) axisDot.setAttribute("cx", mx.toFixed(1));

      // 计算式
      if (calcZ.length >= 5) {
        calcZ[0].textContent = fmt2(z1);
        calcZ[1].textContent = String(h1);
        calcZ[2].textContent = fmt2(z2);
        calcZ[3].textContent = String(h2);
        calcZ[4].textContent = String(y);
      }
    };

    slider.addEventListener("input", render);
    render();
  });
}

/* ─────────────────────────────────────────────
   ⑤ 激活函数（nn-02）：四旋钮 + 弯折器切换 + 曲线 marker
───────────────────────────────────────────── */
const ACTS = [
  { tag: "阶跃", f: (z: number) => (z >= 0 ? 1 : 0), d: () => 0, ylo: -0.25, yhi: 1.25 },
  { tag: "Sigmoid", f: sigmoid, d: (z: number) => { const s = sigmoid(z); return s * (1 - s); }, ylo: -0.25, yhi: 1.25 },
  { tag: "tanh", f: Math.tanh, d: (z: number) => 1 - Math.tanh(z) ** 2, ylo: -1.25, yhi: 1.25 },
  { tag: "ReLU", f: (z: number) => Math.max(0, z), d: (z: number) => (z > 0 ? 1 : 0), ylo: -1, yhi: 6 },
];

function bindActivation(root: HTMLElement) {
  allByLabel(root, "神经元加权求和与激活函数，数字随旋钮实时变化").forEach((svg) => {
    const lab = svg.closest(".fruit-lab") as HTMLElement | null;
    if (!lab) return;
    const knobs = Array.from(lab.querySelectorAll<HTMLInputElement>(".fruit-knobs input[type=range]"));
    if (knobs.length !== 4) return;

    const groups = Array.from(svg.children).filter((c) => c.tagName === "g") as SVGGElement[];
    const rows = groups.map((g) => ({
      line: g.querySelector<SVGLineElement>("line"),
      value: g.querySelectorAll("text")[1] as unknown as SVGTextElement | undefined,
    }));
    const texts = Array.from(svg.querySelectorAll("text"));
    const zValue = texts[texts.findIndex((t) => t.textContent?.trim() === "加权总分 z") + 1];
    const outLabelIdx = texts.findIndex((t) => t.textContent?.trim() === "输出");
    const outValue = outLabelIdx >= 0 ? texts[outLabelIdx + 1] : null;

    // 曲线 marker：虚线 + 圆点（无 data-variant 的）
    const markerLines = Array.from(svg.querySelectorAll<SVGLineElement>('line[stroke="#C0481E"][stroke-dasharray]'));
    const markerCircle = svg.querySelector<SVGCircleElement>('circle[fill="#C0481E"]');
    const calcLine = lab.querySelector<HTMLElement>(".calc-line");
    const calcZ = calcLine ? Array.from(calcLine.querySelectorAll<HTMLElement>(".calc-z")) : [];
    // 计算式里的激活函数名（纯文本节点「Sigmoid / 阶跃 / tanh / ReLU」）
    const tagTextNode = (() => {
      if (!calcLine) return null;
      for (const node of Array.from(calcLine.childNodes)) {
        if (node.nodeType === 3 && /^(阶跃|Sigmoid|tanh|ReLU)$/.test((node.textContent || "").trim())) return node;
      }
      return null;
    })();
    const hint = lab.querySelector<HTMLElement>(".lab-hint");

    // 当前选中的激活函数（跟随 .act-btn.on）
    const btns = Array.from(lab.querySelectorAll<HTMLElement>(".act-btns [data-variant-btn]"));
    let actIdx = Math.max(0, btns.findIndex((b) => b.classList.contains("on")));

    const CY = 112, CX = 206, R = 38;
    const ROW_Y = [34, 86, 138, 190];
    const V = (z: number) => 324 + ((z + 6) / 12) * 188;

    const render = () => {
      const x = knobs.map((k) => parseFloat(k.value));
      const prod = x.map((v, i) => v * INPUT_WEIGHTS[INPUT_KEYS[i]]);
      const maxW = Math.max(...Object.values(INPUT_WEIGHTS));
      const z = prod.reduce((s, v) => s + v, 0) + NEURON_BIAS;
      const act = ACTS[actIdx];
      const out = act.f(z);
      const der = act.d(z);

      prod.forEach((pv, i) => {
        const c = maxW > 0 ? pv / maxW : 0;
        const row = rows[i];
        if (row.line) {
          row.line.setAttribute("stroke-width", (1 + 4 * c).toFixed(4));
          row.line.setAttribute("opacity", (0.25 + 0.65 * c).toFixed(4));
          const nx = 104 - CX, ny = ROW_Y[i] - CY;
          const len = Math.hypot(nx, ny) || 1;
          row.line.setAttribute("x2", (CX + (R * nx) / len).toFixed(2));
          row.line.setAttribute("y2", (CY + (R * ny) / len).toFixed(2));
        }
        if (row.value) row.value.textContent = fmt2(x[i]);
      });

      if (zValue) zValue.textContent = fmt2(z);

      // 曲线 marker
      const F = clamp(z, -6, 6);
      const mx = V(F);
      const my = 196 - ((act.f(F) - act.ylo) / (act.yhi - act.ylo)) * 170;
      if (markerLines.length >= 2) {
        markerLines[0].setAttribute("x1", mx.toFixed(1)); markerLines[0].setAttribute("x2", mx.toFixed(1));
        markerLines[0].setAttribute("y1", my.toFixed(1)); markerLines[0].setAttribute("y2", "196");
        markerLines[1].setAttribute("x1", "324"); markerLines[1].setAttribute("x2", mx.toFixed(1));
        markerLines[1].setAttribute("y1", my.toFixed(1)); markerLines[1].setAttribute("y2", my.toFixed(1));
      }
      if (markerCircle) { markerCircle.setAttribute("cx", mx.toFixed(1)); markerCircle.setAttribute("cy", my.toFixed(1)); }

      if (outValue) outValue.textContent = fmt2(out);

      // 计算式：z = {z} → {tag}(z) = {out}；此处斜率（导数）= {der}
      if (calcZ.length >= 3) {
        calcZ[0].textContent = fmt2(z);
        calcZ[1].textContent = fmt2(out);
        calcZ[2].textContent = fmt2(der);
      }
      if (tagTextNode) tagTextNode.textContent = act.tag;
      if (hint) hint.textContent = ACTS[actIdx].tag === "阶跃" ? "够「弯」，但除了跳变那一点，处处平坦（斜率 = 0），对输入毫无反应——太死板，实践中几乎不用。"
        : ACTS[actIdx].tag === "Sigmoid" ? "平滑、好懂、还能当概率读。但把颜色/酸甜拧到两端、z 变大时曲线压平、斜率趋近 0，变得很迟钝。"
        : ACTS[actIdx].tag === "tanh" ? "Sigmoid 的近亲，一样是 S 形，但输出落在 −1~1、以 0 为中心，通常比 Sigmoid 更好训练；两端同样会饱和变迟钝。"
        : "正区间原样放过、斜率恒为 1，又快又稳；负区间直接归零。现代深层网络的默认选择。";
    };

    knobs.forEach((k) => k.addEventListener("input", render));
    btns.forEach((b) => {
      b.addEventListener("click", () => {
        const idx = Number(b.dataset.variantBtn);
        if (!Number.isNaN(idx)) { actIdx = idx; render(); }
      });
    });
    render();
  });
}

/* ─────────────────────────────────────────────
   ⑥ 三维平面（nn-01）：Plotly 3D 散点 + 神经元平面
───────────────────────────────────────────── */
let plotlyPromise: Promise<any> | null = null;
function loadPlotly(): Promise<any> {
  if (plotlyPromise) return plotlyPromise;
  const w = window as any;
  if (w.Plotly) { plotlyPromise = Promise.resolve(w.Plotly); return plotlyPromise; }
  plotlyPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/plotly.js-dist-min@2.35.2/plotly.min.js";
    s.onload = () => resolve(w.Plotly);
    s.onerror = () => { plotlyPromise = null; reject(new Error("plotly load failed")); };
    document.head.appendChild(s);
  });
  return plotlyPromise;
}

function bindPlanePlot(root: HTMLElement) {
  const plot = root.querySelector<HTMLElement>(".plane-plot");
  if (!plot || plot.dataset.bound === "1") return;
  plot.dataset.bound = "1";

  const lab = plot.closest(".fruit-lab") as HTMLElement | null;
  if (!lab) return;
  const inputs = Array.from(lab.querySelectorAll<HTMLInputElement>(".bnd-row input[type=range]"));
  if (inputs.length !== 3) return;

  const GOOD = [[0.78, 0.72], [0.9, 0.86], [0.68, 0.92], [0.85, 0.6]];
  const BAD = [[0.22, 0.32], [0.34, 0.16], [0.16, 0.44], [0.4, 0.24]];
  const readout = lab.querySelector<HTMLElement>(".gd-readout");
  const calcZ = readout ? Array.from(readout.querySelectorAll<HTMLElement>(".calc-z")) : [];

  const build = (w1: number, w2: number, b: number) => {
    const pts = [...GOOD, ...BAD];
    const grid = Array.from({ length: 13 }, (_, t) => t / 12);
    const zSurface = grid.map((i) => grid.map((j) => w1 * i + w2 * j + b));
    const range = Math.abs(w1) + Math.abs(w2) + Math.abs(b) + 0.5;

    const dropX: (number | null)[] = [], dropY: (number | null)[] = [], dropZ: (number | null)[] = [];
    pts.forEach((p) => { dropX.push(p[0], p[0], null); dropY.push(p[1], p[1], null); dropZ.push(0, w1 * p[0] + w2 * p[1] + b, null); });

    return [
      {
        type: "surface", x: grid, y: grid, z: zSurface,
        cmin: -range, cmax: range,
        colorscale: [[0, "#3E6B8F"], [0.5, "#F4ECDD"], [1, "#C0481E"]],
        opacity: 0.9, showscale: false, hoverinfo: "skip",
        lighting: { ambient: 0.82, diffuse: 0.4, specular: 0.05 },
        contours: { x: { highlight: false }, y: { highlight: false }, z: { highlight: false } },
      },
      { type: "scatter3d", mode: "lines", x: dropX, y: dropY, z: dropZ, line: { color: "#B7AC97", width: 3 }, hoverinfo: "skip" },
      {
        type: "scatter3d", mode: "markers",
        x: pts.map((p) => p[0]), y: pts.map((p) => p[1]), z: pts.map(() => 0),
        marker: { size: 5, color: [...GOOD.map(() => "#C0481E"), ...BAD.map(() => "#5C6B79")], symbol: [...GOOD.map(() => "diamond"), ...BAD.map(() => "circle")] },
        hoverinfo: "skip",
      },
    ];
  };

  const layout = {
    paper_bgcolor: "#FFFDF8", margin: { l: 0, r: 0, t: 0, b: 0 }, height: 330, showlegend: false,
    scene: {
      camera: { eye: { x: 1.5, y: -1.7, z: 0.7 } },
      aspectmode: "manual" as const, aspectratio: { x: 1, y: 1, z: 0.62 }, bgcolor: "#FFFDF8",
      xaxis: { title: { text: "颜色 x₁", font: { size: 11, color: "#5C6B79" } }, gridcolor: "#DCD2BF", tickfont: { size: 9, color: "#93A0AC" }, showspikes: false },
      yaxis: { title: { text: "酸甜 x₂", font: { size: 11, color: "#5C6B79" } }, gridcolor: "#DCD2BF", tickfont: { size: 9, color: "#93A0AC" }, showspikes: false },
      zaxis: { title: { text: "神经元输出 z", font: { size: 11, color: "#5C6B79" } }, gridcolor: "#DCD2BF", tickfont: { size: 9, color: "#93A0AC" }, showspikes: false },
    },
  };

  const render = () => {
    const w1 = parseFloat(inputs[0].value);
    const w2 = parseFloat(inputs[1].value);
    const b = parseFloat(inputs[2].value);
    const correct = GOOD.filter((p) => w1 * p[0] + w2 * p[1] + b > 0).length + BAD.filter((p) => 0 > w1 * p[0] + w2 * p[1] + b).length;

    if (calcZ.length >= 3) {
      calcZ[0].textContent = fmt1(w1);
      calcZ[1].textContent = fmt1(w2);
      calcZ[2].textContent = fmt1(b);
    }
    // 分对 x/8
    const correctEl = readout?.querySelectorAll<HTMLElement>(".calc-z");
    if (correctEl && correctEl.length >= 4) correctEl[3].textContent = String(correct);

    loadPlotly().then((Plotly) => {
      Plotly.react(plot, build(w1, w2, b), layout, { displayModeBar: false, responsive: true });
    }).catch(() => {});
  };

  // 首次绘制 + 监听滑块
  loadPlotly().then(() => render()).catch(() => {});
  inputs.forEach((i) => i.addEventListener("input", render));
}

/* ── 对外入口 ── */
export function bindFigureInteractions(root: HTMLElement) {
  bindSingleNeuron(root);
  bindSoftmaxFruit(root);
  bindDecisionLine(root);
  bindTwoLayer(root);
  bindActivation(root);
  bindPlanePlot(root);
}