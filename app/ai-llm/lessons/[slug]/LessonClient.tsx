// @ts-nocheck
"use client";

import { useEffect, useRef } from "react";

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

    /* ── Lab drag ── */
    root.querySelectorAll(".lab svg, .fruit-lab svg").forEach((svg) => {
      const handle = svg.querySelector('g[style*="cursor:grab"], g[style*="cursor: grab"]');
      if (!handle) return;
      const readout = svg.parentNode?.querySelector(".readout");
      const fixed = [];
      svg.querySelectorAll("g").forEach((g) => {
        if (g === handle) return;
        const c = g.querySelector("circle");
        const t = g.querySelector("text");
        if (c && t) fixed.push({ x: +c.getAttribute("cx"), y: +c.getAttribute("cy"), name: t.textContent.trim() });
      });
      const link = svg.querySelector('line[stroke-dasharray]');
      let dragging = false;
      function pt(evt) {
        const r = svg.getBoundingClientRect();
        const vb = (svg as SVGSVGElement).viewBox.baseVal;
        const cx = evt.touches ? evt.touches[0].clientX : evt.clientX;
        const cy = evt.touches ? evt.touches[0].clientY : evt.clientY;
        return { x: (cx - r.left) / r.width * vb.width, y: (cy - r.top) / r.height * vb.height };
      }
      function move(p) {
        handle.setAttribute("transform", `translate(${p.x},${p.y})`);
        if (!fixed.length) return;
        let best = null, bd = Infinity;
        fixed.forEach((f) => { const d = Math.hypot(f.x - p.x, f.y - p.y); if (d < bd) { bd = d; best = f; } });
        if (best && link) { link.setAttribute("x1", String(p.x)); link.setAttribute("y1", String(p.y)); link.setAttribute("x2", String(best.x)); link.setAttribute("y2", String(best.y)); }
        if (readout && best) readout.textContent = `离它最近的是「${best.name}」`;
      }
      function down(e) { dragging = true; handle.style.cursor = "grabbing"; move(pt(e)); e.preventDefault(); }
      function drag(e) { if (dragging) move(pt(e)); }
      function up() { dragging = false; handle.style.cursor = "grab"; }
      handle.addEventListener("mousedown", down);
      window.addEventListener("mousemove", drag);
      window.addEventListener("mouseup", up);
      handle.addEventListener("touchstart", down, { passive: false });
      window.addEventListener("touchmove", (e) => { if (dragging) { drag(e); e.preventDefault(); } }, { passive: false });
      window.addEventListener("touchend", up);
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
