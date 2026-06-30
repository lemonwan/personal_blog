/* ═══════════════════════════════════════════════════════════════
   AI-LLM 教程 · 全站共享交互脚本
   恢复静态化后丢失的前端交互：小测验判分、动物图拖拽等。
   各组件均做存在性判断，页面没有对应元素时安全跳过。
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─────────────────────────────────────────
     1. 小测验 QUIZ
     - 选项单选高亮
     - 提交后按 data-correct（0-based 正确项序号）判分
     - 可选讲解：选项上的 data-explain，或题目上的 data-explain
     ───────────────────────────────────────── */
  function initQuiz() {
    document.querySelectorAll('.quiz-item').forEach(function (item) {
      var options = Array.prototype.slice.call(item.querySelectorAll('.quiz-option'));
      var submit = item.querySelector('.quiz-submit');
      if (!options.length) return;

      var chosen = -1;

      options.forEach(function (opt, idx) {
        opt.addEventListener('click', function () {
          if (item.dataset.answered === '1') return;
          chosen = idx;
          options.forEach(function (o) { o.setAttribute('aria-checked', 'false'); });
          opt.setAttribute('aria-checked', 'true');
          if (submit) submit.disabled = false;
        });
      });

      if (!submit) return;
      submit.disabled = true;
      submit.addEventListener('click', function () {
        if (chosen < 0 || item.dataset.answered === '1') return;
        item.dataset.answered = '1';

        var correct = parseInt(item.getAttribute('data-correct'), 10);
        options.forEach(function (o, idx) {
          o.disabled = true;
          if (idx === correct) o.classList.add('is-correct');
          else if (idx === chosen) o.classList.add('is-wrong');
        });

        var isRight = chosen === correct;
        // 讲解文本：优先取正确项的 data-explain，其次题目的 data-explain
        var explainText =
          (options[correct] && options[correct].getAttribute('data-explain')) ||
          item.getAttribute('data-explain') || '';
        var box = document.createElement('div');
        box.className = 'quiz-explain ' + (isRight ? 'verdict-right' : 'verdict-wrong');
        var verdict = isRight ? '✓ 回答正确' : '✗ 回答错误';
        box.innerHTML = '<span class="verdict">' + verdict + '</span>' +
          (explainText ? explainText : (isRight ? '' : '正确答案是 ' + 'ABCD'[correct] + '。'));
        item.appendChild(box);

        submit.style.display = 'none';
      });
    });
  }

  /* ─────────────────────────────────────────
     2. 动物地图 / 注意力图 —— 可拖拽 SVG 点
     约定：容器 .lab svg 内带 style*="cursor:grab" 的 <g> 是可拖拽手柄，
     其余 <circle> 为固定点。拖动时实时找最近点并更新 .readout。
     ───────────────────────────────────────── */
  function initDragLab() {
    document.querySelectorAll('.lab svg, .fruit-lab svg').forEach(function (svg) {
      var handle = svg.querySelector('g[style*="cursor:grab"], g[style*="cursor: grab"]');
      if (!handle) return;
      var dot = handle.querySelector('circle');
      var readout = svg.parentNode.querySelector('.readout');
      // 固定点：带文字标签的动物点
      var fixed = [];
      svg.querySelectorAll('g').forEach(function (g) {
        if (g === handle) return;
        var c = g.querySelector('circle');
        var t = g.querySelector('text');
        if (c && t) fixed.push({ x: +c.getAttribute('cx'), y: +c.getAttribute('cy'), name: t.textContent.trim() });
      });
      // 连线（若有）
      var link = svg.querySelector('line[stroke-dasharray]');

      var dragging = false;

      function pt(evt) {
        var r = svg.getBoundingClientRect();
        var vb = svg.viewBox.baseVal;
        var cx = (evt.touches ? evt.touches[0].clientX : evt.clientX) - r.left;
        var cy = (evt.touches ? evt.touches[0].clientY : evt.clientY) - r.top;
        return { x: cx / r.width * vb.width, y: cy / r.height * vb.height };
      }
      function move(p) {
        handle.setAttribute('transform', 'translate(' + p.x + ',' + p.y + ')');
        if (!fixed.length) return;
        var best = null, bd = Infinity;
        fixed.forEach(function (f) {
          var d = Math.hypot(f.x - p.x, f.y - p.y);
          if (d < bd) { bd = d; best = f; }
        });
        if (best && link) {
          link.setAttribute('x1', p.x); link.setAttribute('y1', p.y);
          link.setAttribute('x2', best.x); link.setAttribute('y2', best.y);
        }
        if (readout && best) readout.textContent = '离它最近的是「' + best.name + '」';
      }

      function down(e) { dragging = true; handle.style.cursor = 'grabbing'; move(pt(e)); e.preventDefault(); }
      function drag(e) { if (dragging) move(pt(e)); }
      function up() { dragging = false; handle.style.cursor = 'grab'; }

      handle.addEventListener('mousedown', down);
      window.addEventListener('mousemove', drag);
      window.addEventListener('mouseup', up);
      handle.addEventListener('touchstart', down, { passive: false });
      window.addEventListener('touchmove', function (e) { if (dragging) { drag(e); e.preventDefault(); } }, { passive: false });
      window.addEventListener('touchend', up);
    });
  }

  /* ─────────────────────────────────────────
     3. 通用滑块联动：带 data-bind 的 range 实时更新同名输出
     <input type="range" data-bind="alpha"> ... <span data-out="alpha"></span>
     ───────────────────────────────────────── */
  function initRangeBinds() {
    document.querySelectorAll('input[type="range"][data-bind]').forEach(function (r) {
      var key = r.getAttribute('data-bind');
      var outs = document.querySelectorAll('[data-out="' + key + '"]');
      function sync() { outs.forEach(function (o) { o.textContent = r.value; }); }
      r.addEventListener('input', sync);
      sync();
    });
  }

  /* ─────────────────────────────────────────
     4. 旋钮行 .knob-row：滑块实时更新本行 .knob-val 数字
     （静态搬运后丢失的最常见交互，10+ 页复用）
     ───────────────────────────────────────── */
  function initKnobs() {
    document.querySelectorAll('.knob-row').forEach(function (row) {
      var slider = row.querySelector('input[type="range"]');
      var val = row.querySelector('.knob-val');
      if (!slider || !val) return;
      function fmt(v) {
        // 0~1 的特征值显示两位小数，其余按原样（去掉无意义末尾0）
        var n = parseFloat(v);
        return (slider.step && parseFloat(slider.step) < 1) ? n.toFixed(2) : String(n);
      }
      function sync() { val.textContent = fmt(slider.value); }
      slider.addEventListener('input', sync);
      sync();
    });
  }

  /* ─────────────────────────────────────────
     5. 学习率滑块 .gd-alpha：拖动更新其中的 <b> 数字
     （梯度下降相关页面的轻量交互，6 页复用）
     ───────────────────────────────────────── */
  function initAlphaSliders() {
    document.querySelectorAll('.gd-alpha').forEach(function (wrap) {
      var slider = wrap.querySelector('input[type="range"]');
      var b = wrap.querySelector('b');
      if (!slider || !b) return;
      function sync() { b.textContent = parseFloat(slider.value).toFixed(1); }
      slider.addEventListener('input', sync);
      sync();
    });
  }

  function init() {
    initQuiz();
    initDragLab();
    initRangeBinds();
    initKnobs();
    initAlphaSliders();
    // 各页专属交互：若页面定义了 window.__lessonInit 则调用
    if (typeof window.__lessonInit === 'function') {
      try { window.__lessonInit(); } catch (e) { /* 单页交互失败不影响整页 */ }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
