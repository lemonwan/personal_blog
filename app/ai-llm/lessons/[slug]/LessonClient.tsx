// @ts-nocheck
"use client";

import { useEffect, useRef } from "react";
import { bindFigureInteractions } from "./figure-interactions";

export function LessonClient({ content }: { content: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    /* ── Think button（停下来，想一想 → 我想好了，看答案）── */
    root.querySelectorAll(".think").forEach((think) => {
      if (think.querySelector(".think-btn")) return;
      const btn = document.createElement("button");
      btn.className = "think-btn";
      btn.type = "button";
      btn.textContent = "我想好了，看答案";
      btn.addEventListener("click", () => {
        const parentStation = think.closest(".station");
        if (parentStation) {
          const nextStation = parentStation.nextElementSibling;
          if (nextStation && nextStation.classList.contains("station")) {
            nextStation.scrollIntoView({ behavior: "smooth", block: "start" });
            nextStation.style.transition = "box-shadow 0.3s ease";
            (nextStation as HTMLElement).style.boxShadow = "0 0 0 3px var(--brand)";
            setTimeout(() => { (nextStation as HTMLElement).style.boxShadow = ""; }, 2500);
          }
        }
        // Show confirmation text
        const note = document.createElement("p");
        note.style.cssText = "margin-top:8px;font-size:13px;color:var(--ink-faint);font-style:italic";
        note.textContent = "↓ 答案在下一站";
        think.appendChild(note);
        (btn as HTMLButtonElement).style.display = "none";
        (btn as HTMLButtonElement).disabled = true;
      });
      think.appendChild(btn);
    });

    /* ── Quiz grading ── */
    root.querySelectorAll(".quiz-item").forEach((item) => {
      const options = Array.from(item.querySelectorAll<HTMLElement>(".quiz-option"));
      const submit = item.querySelector<HTMLButtonElement>(".quiz-submit");
      if (!options.length) return;
      let chosen = -1;
      options.forEach((opt, idx) => {
        opt.addEventListener("click", () => {
          if (item.dataset.answered === "1") return;
          chosen = idx;
          options.forEach((o) => o.setAttribute("aria-checked", "false"));
          opt.setAttribute("aria-checked", "true");
          if (submit) submit.disabled = false;
        });
      });
      if (!submit) return;
      submit.disabled = true;
      submit.addEventListener("click", () => {
        if (chosen < 0 || item.dataset.answered === "1") return;
        item.dataset.answered = "1";
        const correct = parseInt(item.getAttribute("data-correct") || "0", 10);
        options.forEach((o, idx) => {
          (o as HTMLButtonElement).disabled = true;
          if (idx === correct) o.classList.add("is-correct");
          else if (idx === chosen) o.classList.add("is-wrong");
        });
        const isRight = chosen === correct;
        const explainText = options[correct]?.getAttribute("data-explain") || item.getAttribute("data-explain") || "";
        const box = document.createElement("div");
        box.className = "quiz-explain";
        box.style.cssText = `margin-top:12px;padding:10px 14px;border-radius:8px;font-size:14px;border:1.5px solid ${
          isRight ? "var(--accent-green, #3E8F5A)" : "var(--accent-red, #C0481E)"
        };background:${isRight ? "rgba(62,143,90,0.08)" : "rgba(192,72,30,0.08)"}`;
        box.innerHTML = `<span style="font-weight:700;color:${isRight ? "#3E8F5A" : "#C0481E"}">${isRight ? "✓ 正确" : "✗ 错误"}</span>${explainText ? " " + explainText : ""}`;
        item.appendChild(box);
        submit.style.display = "none";
      });
    });

    /* ── Knob slider sync ── */
    root.querySelectorAll(".knob-row").forEach((row) => {
      const slider = row.querySelector<HTMLInputElement>("input[type=range]");
      const val = row.querySelector<HTMLElement>(".knob-val");
      if (!slider || !val) return;
      const fmt = (v: string) => { const n = parseFloat(v); return (slider.step && parseFloat(slider.step) < 1) ? n.toFixed(2) : String(v); };
      slider.addEventListener("input", () => { val.textContent = fmt(slider.value); });
      val.textContent = fmt(slider.value);
    });

    /* ── Alpha slider sync ── */
    root.querySelectorAll(".gd-alpha").forEach((wrap) => {
      const slider = wrap.querySelector<HTMLInputElement>("input[type=range]");
      const b = wrap.querySelector("b");
      if (!slider || !b) return;
      slider.addEventListener("input", () => { b.textContent = parseFloat(slider.value).toFixed(1); });
      b.textContent = parseFloat(slider.value).toFixed(1);
    });

    /* ── Lab drag（Pointer Events + 屏幕坐标精确映射，参照 xuanyuancode 原版交互）── */
    root.querySelectorAll(".lab svg, .fruit-lab svg").forEach((svg) => {
      const handle = svg.querySelector('g[style*="cursor:grab"], g[style*="cursor: grab"]');
      const readout = svg.parentNode?.querySelector(".readout");
      const link = svg.querySelector('line[stroke-dasharray]');
      if (!handle) return;

      // 固定点：只取「<g> 的直属子节点是 circle + text」的点（跳过外层包裹 g 与把手）
      const fixed = [];
      svg.querySelectorAll("g").forEach((g) => {
        if (g === handle) return;
        let c = null;
        let t = null;
        for (const child of Array.from(g.children)) {
          if (child.tagName === "circle") c = child;
          else if (child.tagName === "text") t = child;
        }
        if (c && t && c.getAttribute("cx") && c.getAttribute("cy")) {
          fixed.push({ x: parseFloat(c.getAttribute("cx")), y: parseFloat(c.getAttribute("cy")), name: (t.textContent || "").trim(), circle: c });
        }
      });

      // 坐标归一化（math-01 动物地图）：data-vec-map="x0,y0,sx,sy" 把 SVG 像素映射到 [0,1] 向量空间
      let vecMap = null;
      const mapAttr = svg.getAttribute("data-vec-map");
      if (mapAttr) {
        const [X0, Y0, SX, SY] = mapAttr.split(",").map(parseFloat);
        vecMap = { X0, Y0, SX, SY };
        fixed.forEach((f) => { f.nx = (f.x - X0) / SX; f.ny = (Y0 - f.y) / SY; });
      }

      // 初始位置：内容里没写 transform 时，用固定点重心（否则会停在 SVG 左上角 (0,0)）
      let cur = { x: 0, y: 0 };
      if (fixed.length) {
        cur = { x: fixed.reduce((s, f) => s + f.x, 0) / fixed.length, y: fixed.reduce((s, f) => s + f.y, 0) / fixed.length };
      } else {
        const vb = (svg as SVGSVGElement).viewBox.baseVal;
        cur = { x: vb.width / 2, y: vb.height / 2 };
      }
      const existing = handle.getAttribute("transform");
      if (existing) {
        const m = /translate\(\s*([-\d.eE]+)[,\s]+([-\d.eE]+)\)/.exec(existing);
        if (m) cur = { x: parseFloat(m[1]), y: parseFloat(m[2]) };
      }

      function draw(p) {
        handle.setAttribute("transform", `translate(${p.x},${p.y})`);
        if (!fixed.length) return;
        const np = vecMap ? { x: (p.x - vecMap.X0) / vecMap.SX, y: (vecMap.Y0 - p.y) / vecMap.SY } : null;
        let best = fixed[0], bd = Infinity;
        fixed.forEach((f) => {
          const d = np ? Math.hypot(f.nx - np.x, f.ny - np.y) : Math.hypot(f.x - p.x, f.y - p.y);
          f.circle.setAttribute("fill", "#3E6B8F");
          f.circle.setAttribute("r", "7");
          if (d < bd) { bd = d; best = f; }
        });
        best.circle.setAttribute("fill", "#C0481E");
        best.circle.setAttribute("r", "9");
        if (link) { link.setAttribute("x1", String(p.x)); link.setAttribute("y1", String(p.y)); link.setAttribute("x2", String(best.x)); link.setAttribute("y2", String(best.y)); }
        if (readout) {
          readout.innerHTML = np
            ? `神秘动物 = [ ${np.x.toFixed(2)} , ${np.y.toFixed(2)} ] —— 离它最近的是 <strong>${best.name}</strong>（距离 ${bd.toFixed(2)}）`
            : `离它最近的是「${best.name}」`;
        }
      }

      function toSvg(evt) {
        const s = svg as SVGSVGElement;
        const p = s.createSVGPoint();
        p.x = evt.clientX; p.y = evt.clientY;
        const ctm = s.getScreenCTM();
        if (!ctm) return cur;
        const m = p.matrixTransform(ctm.inverse());
        return { x: m.x, y: m.y };
      }

      let dragging = false;
      const down = (e) => {
        dragging = true;
        try { (svg as SVGSVGElement).setPointerCapture(e.pointerId); } catch {}
        handle.style.cursor = "grabbing";
        draw(toSvg(e));
        e.preventDefault();
      };
      const move = (e) => { if (dragging) draw(toSvg(e)); };
      const up = () => { dragging = false; handle.style.cursor = "grab"; };

      svg.addEventListener("pointerdown", down);
      svg.addEventListener("pointermove", move);
      svg.addEventListener("pointerup", up);
      svg.addEventListener("pointercancel", up);

      draw(cur); // 初始绘制：定位 + 最近点高亮 + 连线 + 读数
    });

    /* ── act-btn 变体切换（nn-02 激活曲线 / nlp-03 上下文词读数）── */
    root.querySelectorAll(".act-btns").forEach((grp) => {
      const btns = Array.from(grp.querySelectorAll<HTMLElement>("[data-variant-btn]"));
      if (!btns.length) return;
      const scope = grp.closest(".fig") || grp.closest(".station") || root;
      const variants = Array.from(scope.querySelectorAll<HTMLElement>("[data-variant]"));
      btns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = btn.dataset.variantBtn;
          btns.forEach((b) => b.classList.toggle("on", b === btn));
          variants.forEach((v) => {
            const on = v.dataset.variant === idx;
            if (v instanceof SVGElement) v.style.opacity = on ? "1" : "0";
            else v.style.display = on ? "block" : "none";
          });
        });
      });
    });

    /* ── 记忆条步进器（nlp-04 / nlp-05：「读下一个词」逐词显现）── */
    root.querySelectorAll(".gd-alpha").forEach((wrap) => {
      if (!wrap.textContent.includes("读到第")) return;
      const fig = wrap.closest(".fig");
      if (!fig) return;
      const steps = Array.from(fig.querySelectorAll<SVGElement>("[data-step]"));
      if (!steps.length) return;
      const counter = wrap.querySelector("b");
      const m = wrap.textContent.match(/(\d+)\s*个词/);
      const N = m ? parseInt(m[1], 10) : steps.length;
      const btns = Array.from(fig.querySelectorAll<HTMLButtonElement>(".act-btn"));
      const prev = btns.find((b) => b.textContent.includes("上一词"));
      const next = btns.find((b) => b.textContent.includes("读下一个词"));
      const reset = btns.find((b) => b.textContent.includes("重置"));
      let k = 1;
      const apply = () => {
        steps.forEach((el) => { el.style.opacity = +el.dataset.step <= k ? "1" : "0"; });
        if (counter) counter.textContent = String(k);
        if (prev) (prev as HTMLButtonElement).disabled = k <= 1;
        if (next) (next as HTMLButtonElement).disabled = k >= N;
      };
      prev?.addEventListener("click", () => { k = Math.max(1, k - 1); apply(); });
      next?.addEventListener("click", () => { k = Math.min(N, k + 1); apply(); });
      reset?.addEventListener("click", () => { k = 1; apply(); });
      apply();
    });

    /* ── 注意力实验台（tf-01：点词看目光 / 切换句子）── */
    root.querySelectorAll(".lab").forEach((lab) => {
      const rows = Array.from(lab.querySelectorAll<HTMLElement>("[data-sent-row]"));
      if (!rows.length) return;
      const readout = lab.querySelector(".readout");
      const alphaOf = (w: number) => Math.min(0.72, 0.03 + 0.52 * Math.pow(w / 60, 1.1));
      const labelOf = (tk: HTMLElement) => (tk.firstChild?.textContent || "").trim();
      const paint = (row: HTMLElement, queryIdx: number) => {
        const tokens = Array.from(row.querySelectorAll<HTMLElement>(".token"));
        const atts = (tokens[queryIdx].dataset.att || "").split(",").map(Number);
        tokens.forEach((t, i) => {
          const label = labelOf(t);
          if (i === queryIdx) {
            t.classList.add("selected");
            t.style.background = ""; t.style.borderColor = "";
            t.innerHTML = `${label}<span class="token-w">Q</span>`;
          } else {
            const w = atts[i] ?? 0;
            t.classList.remove("selected");
            t.style.background = `rgba(192,72,30,${alphaOf(w)})`;
            t.innerHTML = `${label}<span class="token-w">${w}%</span>`;
          }
        });
        if (readout) {
          let best = -1, bw = -1;
          atts.forEach((w, i) => { if (i !== queryIdx && w > bw) { bw = w; best = i; } });
          readout.innerHTML = `「<strong>${labelOf(tokens[queryIdx])}</strong>」的目光主要落在「<strong>${labelOf(tokens[best])}</strong>」上（${bw}%）`;
        }
      };
      rows.forEach((row) => {
        row.querySelectorAll<HTMLElement>(".token").forEach((tk, i) => {
          tk.addEventListener("click", () => paint(row, i));
        });
      });
      const sentBtns = Array.from(lab.querySelectorAll<HTMLElement>("[data-sent]"));
      sentBtns.forEach((b) => {
        b.addEventListener("click", () => {
          const s = b.dataset.sent;
          rows.forEach((r) => { r.style.display = r.dataset.sentRow === s ? "" : "none"; });
          sentBtns.forEach((x) => { (x.style as HTMLElement).opacity = x === b ? "1" : "0.55"; });
        });
      });
    });

    /* ── 割线滑块（math-04：Δx → 割线贴向切线）── */
    root.querySelectorAll(".secant-slider").forEach((wrap) => {
      const input = wrap.querySelector<HTMLInputElement>("input[type=range]");
      const fig = wrap.closest(".fig");
      const line = fig?.querySelector(".secant-line");
      if (!input || !line) return;
      const q = fig.querySelector(".secant-q");
      const ql = fig.querySelector(".secant-qlabel");
      const gh = fig.querySelector(".secant-guide-h");
      const gv = fig.querySelector(".secant-guide-v");
      const dxl = fig.querySelector(".secant-dx");
      const dhl = fig.querySelector(".secant-dh");
      const readout = fig.querySelector(".secant-readout");
      const PX0 = 115.68, SX = 110.8333, SY = 22.48, BASE = 269.3;
      const H = (x: number) => 1.2 * (x - 4) * (x - 4);
      const xOf = (px: number) => 1 + (px - 60) / SX;
      const pyOf = (h: number) => BASE - SY * h;
      const update = () => {
        const dx = parseFloat(input.value);
        const x0 = xOf(PX0), x1q = x0 + dx;
        const y0 = H(x0), y1 = H(x1q);
        const slope = (y1 - y0) / dx;
        const spx = -slope * (SY / SX);
        // 从 P 向两侧延伸，裁进画面 [60,524]×[12,308]
        let ax = 60, bx = 524;
        let ay = pyOf(y0) + spx * (ax - PX0), by = pyOf(y0) + spx * (bx - PX0);
        if (ay < 12) { ax = PX0 + (12 - pyOf(y0)) / spx; ay = 12; }
        if (by > 308) { bx = PX0 + (308 - pyOf(y0)) / spx; by = 308; }
        line.setAttribute("x1", ax.toFixed(1)); line.setAttribute("y1", ay.toFixed(1));
        line.setAttribute("x2", bx.toFixed(1)); line.setAttribute("y2", by.toFixed(1));
        const qx = 60 + (x1q - 1) * SX, qy = pyOf(y1);
        q?.setAttribute("cx", qx.toFixed(1)); q?.setAttribute("cy", qy.toFixed(1));
        ql?.setAttribute("x", (qx + 9).toFixed(1)); ql?.setAttribute("y", (qy + 14).toFixed(1));
        gh?.setAttribute("x2", qx.toFixed(1));
        gv?.setAttribute("x1", qx.toFixed(1)); gv?.setAttribute("y2", qy.toFixed(1));
        if (dxl) { dxl.setAttribute("x", ((PX0 + qx) / 2).toFixed(1)); }
        if (dhl) { dhl.setAttribute("x", (qx + 8).toFixed(1)); dhl.setAttribute("y", ((pyOf(y0) + qy) / 2).toFixed(1)); }
        if (readout) readout.textContent = `Δx = ${dx.toFixed(2)} · 割线斜率 ≈ ${slope.toFixed(2)} → 正在贴近切线斜率 ${(2 * 1.2 * (x0 - 4)).toFixed(2)}`;
      };
      input.addEventListener("input", update);
      update();
    });

    /* ── 交叉熵损失实验台（nn-03：旋钮 + 真实答案 → 黑点滑动、损失实时变化）── */
    root.querySelectorAll("[data-losslab]").forEach((fig) => {
      const weights = (fig.dataset.weights || "").split(",").map(Number);
      const bias = parseFloat(fig.dataset.bias || "0");
      const knobs = Array.from(fig.querySelectorAll<HTMLInputElement>(".fruit-knobs input[type=range]"));
      const marker = fig.querySelector<SVGCircleElement>(".loss-marker circle");
      const readout = fig.querySelector("[data-loss-readout]");
      const yBtns = Array.from(fig.querySelectorAll<HTMLElement>("[data-y]"));
      if (!knobs.length || !marker) return;
      let y = 1;
      const CX0 = 46, CX1 = 344, BASEY = 178, K = 41.47;
      const update = () => {
        const xs = knobs.map((k) => parseFloat(k.value));
        const z = xs.reduce((s, v, i) => s + v * (weights[i] || 0), bias);
        const p = 1 / (1 + Math.exp(-z));
        const pc = y === 1 ? p : 1 - p;
        const L = pc > 0.0005 ? -Math.log(pc) : 7.6;
        marker.setAttribute("cx", (CX0 + (CX1 - CX0) * pc).toFixed(1));
        marker.setAttribute("cy", Math.max(16, BASEY - K * (pc > 0.001 ? -Math.log(pc) : 7.6)).toFixed(1));
        if (readout) readout.innerHTML = `预测 P(苹果) = <b>${(p * 100).toFixed(0)}%</b> · 给「正确答案」的概率 pᶜ = <b>${(pc * 100).toFixed(0)}%</b> · 交叉熵损失 = −log(pᶜ) = <b>${L.toFixed(2)}</b>`;
      };
      knobs.forEach((k) => k.addEventListener("input", update));
      yBtns.forEach((b) => b.addEventListener("click", () => {
        y = +b.dataset.y;
        yBtns.forEach((x) => x.classList.toggle("on", x === b));
        update();
      }));
      update();
    });

    /* ── 梯度下降训练台（nn-05 单神经元 / nn-06 小网络）── */
    root.querySelectorAll("[data-gd-kind]").forEach((fig) => {
      const kind = fig.dataset.gdKind;
      const body = fig.querySelector(".gd-log-body");
      const btns = Array.from(fig.querySelectorAll<HTMLButtonElement>("[data-gd]"));
      if (!body || !btns.length) return;
      let timer: ReturnType<typeof setInterval> | null = null;
      let baseline = body.innerHTML;
      const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

      if (kind === "single") {
        const x = parseFloat(fig.dataset.x || "0.92"), y = parseFloat(fig.dataset.y || "1");
        const alphaInput = fig.querySelector<HTMLInputElement>(".gd-alpha input[type=range]");
        const svg = fig.querySelector("svg");
        const allT = svg ? Array.from(svg.querySelectorAll("text")) : [];
        const xT = allT.find((t) => /^[\d.]+$/.test(t.textContent?.trim() || ""));
        const zT = allT.find((t) => /^[\d.]+$/.test(t.textContent?.trim() || "") && t !== xT);
        const wChip = allT.find((t) => t.textContent?.includes("× w ="));
        const bChip = allT.find((t) => /^b = /.test(t.textContent?.trim() || ""));
        const pT = allT.find((t) => t.textContent?.trim() === "50%");
        const ezT = allT.find((t) => t.textContent?.includes("eᶻ"));
        const sumT = allT.find((t) => t.textContent?.includes("和 = "));
        const fills = Array.from(fig.querySelectorAll<HTMLElement>(".prob-fill"));
        const pcts = Array.from(fig.querySelectorAll<HTMLElement>(".prob-pct"));
        const bigL = fig.querySelector(".gd-loss-big b");
        const stepL = fig.querySelector(".gd-loss-steps .calc-z");
        const strip = Array.from(fig.querySelectorAll<HTMLElement>("div,span,p")).find((e) => /第\s*0\s*步/.test(e.textContent || "") && (e.textContent || "").length < 60);
        let k = 0, w = 0, b = 0;
        const render = () => {
          const z = w * x + b, p = 1 / (1 + Math.exp(-z)), L = -Math.log(p);
          if (wChip) wChip.textContent = `× w = ${w.toFixed(2)}`;
          if (bChip) bChip.textContent = `b = ${b.toFixed(2)}`;
          if (zT) zT.textContent = z.toFixed(2);
          if (pT) pT.textContent = `${(p * 100).toFixed(0)}%`;
          if (ezT) ezT.textContent = `🍎 eᶻ = ${Math.exp(z).toFixed(2)}`;
          if (sumT) sumT.textContent = `和 = ${(Math.exp(z) + 1).toFixed(2)}`;
          if (fills[0]) fills[0].style.width = `${(p * 100).toFixed(0)}%`;
          if (fills[1]) fills[1].style.width = `${((1 - p) * 100).toFixed(0)}%`;
          if (pcts[0]) pcts[0].textContent = `${(p * 100).toFixed(0)}%`;
          if (pcts[1]) pcts[1].textContent = `${((1 - p) * 100).toFixed(0)}%`;
          if (bigL) bigL.textContent = L.toFixed(3);
          if (stepL) stepL.textContent = L.toFixed(3);
          if (strip) strip.innerHTML = `第 <b>${k}</b> 步 w = <b>${w.toFixed(2)}</b> b = <b>${b.toFixed(2)}</b>`;
          if (k === 0) { body.innerHTML = baseline; }
          else {
            const row = document.createElement("div");
            row.className = "gd-log-row";
            row.innerHTML = `<span>${k}</span><span>${w.toFixed(2)}</span><span>${b.toFixed(2)}</span><span>${L.toFixed(3)}</span>`;
            body.appendChild(row);
          }
          body.scrollTop = body.scrollHeight;
        };
        btns.forEach((btn) => btn.addEventListener("click", () => {
          const act = btn.dataset.gd;
          const alpha = alphaInput ? parseFloat(alphaInput.value) : 1;
          if (act === "step") { stop(); const p = 1 / (1 + Math.exp(-(w * x + b))); w -= alpha * (p - y) * x; b -= alpha * (p - y); k++; render(); }
          if (act === "reset") { stop(); k = 0; w = 0; b = 0; render(); }
          if (act === "auto") {
            if (timer) { stop(); btn.textContent = "▶ 自动训练"; return; }
            btn.textContent = "⏸ 暂停";
            timer = setInterval(() => {
              const al = alphaInput ? parseFloat(alphaInput.value) : 1;
              const p = 1 / (1 + Math.exp(-(w * x + b)));
              w -= al * (p - y) * x; b -= al * (p - y); k++;
              render();
              if (k > 15) { stop(); btn.textContent = "▶ 自动训练"; }
            }, 650);
          }
        }));
      }

      if (kind === "net") {
        const W0 = (fig.dataset.w || "0.6,0.5,0.1,0.4,-0.3,0.2,-0.1").split(",").map(Number);
        const x2 = 0.8;
        const alphaInput = fig.querySelector<HTMLInputElement>('.bpx-sec[data-page="6"] input[type=range]');
        const x1Input = root.querySelector<HTMLInputElement>('input[aria-label="颜色"]');
        const yBtns = Array.from(root.querySelectorAll<HTMLElement>("[data-y]"));
        const note = fig.querySelector("[data-sim-note]");
        let y = 0, k = 0, W = [...W0];
        const sig = (z: number) => 1 / (1 + Math.exp(-z));
        const forward = (w: number[]) => {
          const x1 = x1Input ? parseFloat(x1Input.value) : 0.9;
          const zh = w[0] * x1 + w[1] * x2 + w[2], ah = sig(zh);
          const z1 = w[3] * ah + w[5], z2 = w[4] * ah + w[6];
          const p1 = Math.exp(z1) / (Math.exp(z1) + Math.exp(z2));
          return { x1, zh, ah, z1, z2, p1, L: y === 0 ? -Math.log(p1) : -Math.log(1 - p1) };
        };
        const stepOnce = () => {
          const { ah, p1 } = forward(W);
          const alpha = alphaInput ? parseFloat(alphaInput.value) : 0.5;
          const d1 = p1 - (y === 0 ? 1 : 0), d2 = (1 - p1) - (y === 1 ? 1 : 0);
          const dah = d1 * W[3] + d2 * W[4], dzh = dah * ah * (1 - ah);
          const x1 = x1Input ? parseFloat(x1Input.value) : 0.9;
          W = [W[0] - alpha * dzh * x1, W[1] - alpha * dzh * x2, W[2] - alpha * dzh, W[3] - alpha * d1 * ah, W[4] - alpha * d2 * ah, W[5] - alpha * d1, W[6] - alpha * d2];
          k++;
        };
        const render = () => {
          const rows: string[] = [];
          let Wk = [...W0], kk = 0;
          while (kk <= k) {
            const st = forward(Wk);
            rows.push(`<div class="gd-log-row"><span>${kk}</span><span>${Wk[0].toFixed(3)}</span><span>${Wk[1].toFixed(3)}</span><span>${st.L.toFixed(3)}</span><span>${(st.p1 * 100).toFixed(1)}%</span></div>`);
            if (kk === k) break;
            const { ah, p1 } = forward(Wk);
            const alpha = alphaInput ? parseFloat(alphaInput.value) : 0.5;
            const d1 = p1 - (y === 0 ? 1 : 0), d2 = (1 - p1) - (y === 1 ? 1 : 0);
            const dah = d1 * Wk[3] + d2 * Wk[4], dzh = dah * ah * (1 - ah);
            Wk = [Wk[0] - alpha * dzh * st.x1, Wk[1] - alpha * dzh * x2, Wk[2] - alpha * dzh, Wk[3] - alpha * d1 * ah, Wk[4] - alpha * d2 * ah, Wk[5] - alpha * d1, Wk[6] - alpha * d2];
            kk++;
          }
          body.innerHTML = rows.join("");
          if (note) note.innerHTML = `当前：真实答案 = <b>${y === 0 ? "🍉 西瓜" : "🚫 不是西瓜"}</b> · 颜色 x₁ = <b>${x1Input ? parseFloat(x1Input.value).toFixed(2) : "0.90"}</b> · 学习率 α = <b>${alphaInput ? parseFloat(alphaInput.value).toFixed(2) : "0.50"}</b> · 已训练 <b>${k}</b> 轮`;
        };
        const resetAll = () => { stop(); k = 0; W = [...W0]; render(); };
        btns.forEach((btn) => btn.addEventListener("click", () => {
          const act = btn.dataset.gd;
          if (act === "step") { stop(); stepOnce(); render(); }
          if (act === "reset") resetAll();
          if (act === "auto") {
            if (timer) { stop(); btn.textContent = "▶ 自动训练"; return; }
            btn.textContent = "⏸ 暂停";
            timer = setInterval(() => {
              stepOnce(); render();
              if (k > 11) { stop(); btn.textContent = "▶ 自动训练"; }
            }, 650);
          }
        }));
        const onChange = () => { stop(); k = 0; W = [...W0]; render(); };
        yBtns.forEach((b) => b.addEventListener("click", () => {
          y = +b.dataset.y;
          yBtns.forEach((x) => x.classList.toggle("on", x === b));
          onChange();
        }));
        x1Input?.addEventListener("input", onChange);
        alphaInput?.addEventListener("input", render);
        render();
      }
    });

    /* ── Transformer 3D 全景：逐步推演（appendix）── */
    root.querySelectorAll(".tf3d-play").forEach((btn) => {
      const shell = btn.closest(".tf3d");
      if (!shell) return;
      const hls = Array.from(shell.querySelectorAll<SVGElement>("[data-step]"));
      const note = shell.querySelector(".tf3d-note");
      const notes = [
        "① 分词：句子切成 4 个 token，各自配一个 id（第 22 课）",
        "② 词向量：查表变成一列数字 —— token embedding（第 1 / 15 课）",
        "③ 加位置：token embedding ＋ position embedding = 当前位置表示 x（红色节点）",
        "④ 自注意力：x 投影出 Q/K/V → QKᵀ 打分 → softmax → A·V 混合上下文（第 19 / 20 课）",
        "⑤ FFN：每个位置各自经过 W1 → GELU → W2（第 21 课）",
        "⑥ 输出：Block ×2 之后，取末位置做 logits → softmax，得到下一个词概率（第 11 / 24 课）",
      ];
      const idle = "点击下方按钮，跟随高亮逐站推演一次前向传播";
      let k = 0;
      btn.addEventListener("click", () => {
        k = k >= 6 ? 0 : k + 1;
        hls.forEach((h) => { h.style.opacity = +h.dataset.step === k ? "1" : "0"; });
        if (note) note.textContent = k === 0 ? idle : notes[k - 1];
        btn.innerHTML = k === 0 ? `<span aria-hidden="true">▶</span>开始训练：逐步推演` : k === 6 ? `↺ 重新开始` : `下一步（${k}/6）`;
      });
    });

    /* ── 交互式 SVG 演示（nn-01 / nn-02 / nn-03-network / nn-04 等）── */
    try {
      bindFigureInteractions(root);
    } catch (e) {
      console.error("[figure-interactions] failed", e);
    }

    /* ── bpx 标签页（nn-06 完整案例六页）── */
    root.querySelectorAll(".bpx-nav").forEach((nav) => {
      const btns = Array.from(nav.querySelectorAll<HTMLElement>(".bpx-nav-btn"));
      const scope = nav.closest(".fig") || nav.parentElement;
      const secs = Array.from(scope?.querySelectorAll<HTMLElement>(".bpx-sec") || []);
      if (!btns.length || !secs.length) return;
      const show = (i: number) => {
        btns.forEach((b, j) => b.classList.toggle("active", i === j));
        secs.forEach((s, j) => { s.style.display = i === j ? "" : "none"; });
      };
      btns.forEach((b, i) => b.addEventListener("click", () => show(i)));
      const init = btns.findIndex((b) => b.classList.contains("active"));
      show(init >= 0 ? Math.min(init, secs.length - 1) : 0);
    });
  }, [content]);

  return (
    <div
      ref={ref}
      className="lesson-body text-[var(--ink)]
        [&_.station]:bg-[var(--paper-card)] [&_.station]:border [&_.station]:border-[var(--line)] [&_.station]:rounded-xl [&_.station]:p-6 [&_.station]:mb-6
        [&_.formula]:bg-[color-mix(in_srgb,var(--accent-wash)_30%,transparent)] [&_.formula]:border [&_.formula]:border-[var(--line)] [&_.formula]:rounded-xl [&_.formula]:p-4 [&_.formula]:my-5 [&_.formula]:text-center [&_.formula]:font-mono
        [&_code]:font-mono [&_code]:text-[var(--accent)] [&_code]:bg-[var(--accent-wash)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
        [&_.think]:flex [&_.think]:items-baseline [&_.think]:gap-2 [&_.think]:py-1 [&_.think]:my-6
        [&_.think-q]:text-[var(--accent)] [&_.think-q]:text-[1.1em] [&_.think-q]:leading-none
        [&_.think-btn]:inline-block [&_.think-btn]:px-3 [&_.think-btn]:py-1 [&_.think-btn]:rounded-full [&_.think-btn]:border-2 [&_.think-btn]:border-[var(--accent)] [&_.think-btn]:bg-transparent [&_.think-btn]:text-[var(--accent)] [&_.think-btn]:text-sm [&_.think-btn]:font-bold [&_.think-btn]:cursor-pointer [&_.think-btn]:transition-all [&_.think-btn]:whitespace-nowrap [&_.think-btn]:flex-shrink-0
        [&_.think-btn:hover]:bg-[var(--accent)] [&_.think-btn:hover]:text-white
        [&_.takeaway]:bg-[color-mix(in_srgb,var(--chart-blue)_8%,transparent)] [&_.takeaway]:border-2 [&_.takeaway]:border-[var(--chart-blue)] [&_.takeaway]:rounded-xl [&_.takeaway]:p-5 [&_.takeaway]:my-5
        [&_.takeaway-label]:text-[var(--chart-blue)] [&_.takeaway-label]:font-bold [&_.takeaway-label]:text-xs [&_.takeaway-label]:uppercase [&_.takeaway-label]:tracking-wider
        [&_.recap]:bg-[color-mix(in_srgb,var(--accent3)_8%,transparent)] [&_.recap]:border-2 [&_.recap]:border-[var(--accent3)] [&_.recap]:rounded-xl [&_.recap]:p-5 [&_.recap]:my-5
        [&_.fig]:bg-[var(--paper)] [&_.fig]:border [&_.fig]:border-[var(--line)] [&_.fig]:rounded-xl [&_.fig]:p-6 [&_.fig]:my-6 [&_.fig]:text-center [&_.fig]:overflow-x-auto
        [&_.figcaption]:text-sm [&_.figcaption]:text-[var(--ink-faint)] [&_.figcaption]:mt-4 [&_.figcaption]:text-left
        [&_.fig-no]:text-[var(--chart-blue)] [&_.fig-no]:font-bold
        [&_.station-head]:flex [&_.station-head]:items-center [&_.station-head]:gap-3 [&_.station-head]:mb-4 [&_.station-head]:pb-3 [&_.station-head]:border-b [&_.station-head]:border-[var(--line)]
        [&_.station-no]:inline-flex [&_.station-no]:items-center [&_.station-no]:justify-center [&_.station-no]:h-10 [&_.station-no]:rounded-lg [&_.station-no]:bg-[var(--accent)] [&_.station-no]:text-white [&_.station-no]:font-bold [&_.station-no]:text-sm [&_.station-no]:px-4 [&_.station-no]:w-auto [&_.station-no]:whitespace-nowrap
        [&_.quiz-submit]:inline-flex [&_.quiz-submit]:items-center [&_.quiz-submit]:gap-2 [&_.quiz-submit]:rounded-full [&_.quiz-submit]:border-2 [&_.quiz-submit]:border-[var(--ink)] [&_.quiz-submit]:bg-[var(--ink)] [&_.quiz-submit]:text-white [&_.quiz-submit]:font-bold [&_.quiz-submit]:text-sm [&_.quiz-submit]:px-5 [&_.quiz-submit]:py-2 [&_.quiz-submit]:cursor-pointer
        [&_.quiz-submit:hover]:bg-[var(--accent-deep)]
        [&_.quiz-option]:flex [&_.quiz-option]:items-center [&_.quiz-option]:gap-3 [&_.quiz-option]:w-full [&_.quiz-option]:text-left [&_.quiz-option]:p-3 [&_.quiz-option]:rounded-lg [&_.quiz-option]:border [&_.quiz-option]:border-[var(--line)] [&_.quiz-option]:bg-white [&_.quiz-option]:cursor-pointer [&_.quiz-option]:transition-all
        [&_.quiz-option:hover]:border-[var(--accent)]
        [&_.quiz-option[aria-checked=true]]:border-[var(--accent)] [&_.quiz-option[aria-checked=true]]:bg-[var(--accent-wash)]
        [&_.quiz-option-key]:w-7 [&_.quiz-option-key]:h-7 [&_.quiz-option-key]:flex [&_.quiz-option-key]:items-center [&_.quiz-option-key]:justify-center [&_.quiz-option-key]:rounded-md [&_.quiz-option-key]:bg-[var(--paper-deep)] [&_.quiz-option-key]:font-mono [&_.quiz-option-key]:font-bold [&_.quiz-option-key]:text-xs
        [&_.is-correct]:!border-[#3E8F5A] [&_.is-correct]:!bg-[rgba(62,143,90,0.08)] [&_.is-correct_.quiz-option-key]:!bg-[#3E8F5A] [&_.is-correct_.quiz-option-key]:text-white
        [&_.is-wrong]:!border-[#C0481E] [&_.is-wrong]:!bg-[rgba(192,72,30,0.08)] [&_.is-wrong_.quiz-option-key]:!bg-[#C0481E] [&_.is-wrong_.quiz-option-key]:text-white
        [&_.lab]:rounded-xl [&_.lab]:border [&_.lab]:border-[var(--line)] [&_.lab]:bg-white [&_.lab]:p-5 [&_.lab]:my-6
        [&_.crack]:bg-[color-mix(in_srgb,var(--accent)_5%,transparent)] [&_.crack]:border [&_.crack]:border-[var(--accent)]/20 [&_.crack]:rounded-xl [&_.crack]:p-5 [&_.crack]:my-5
        [&_.crack-label]:text-[var(--accent)] [&_.crack-label]:font-bold [&_.crack-label]:text-xs [&_.crack-label]:uppercase
      "
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
