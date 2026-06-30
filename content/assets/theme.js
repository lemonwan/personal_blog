/* ═══════════════════════════════════════════════════════════════
   全站主题切换 · theme.js
   - 默认浅色；首次访问读取系统 prefers-color-scheme
   - localStorage 记忆选择
   - 右下角浮动 ☀/🌙 按钮切换
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var KEY = 'site-theme';

  function current() {
    try {
      var saved = localStorage.getItem(KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    // 首次访问：跟随系统，默认浅色
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function apply(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = theme === 'dark' ? '☀' : '🌙';
      btn.setAttribute('aria-label', theme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
      btn.setAttribute('title', theme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
    }
  }

  // 尽早应用主题，减少闪烁（此脚本以 defer 加载，DOM 已就绪）
  var theme = current();
  apply(theme);

  function build() {
    if (document.getElementById('theme-toggle')) { apply(theme); return; }
    var btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.type = 'button';
    btn.addEventListener('click', function () {
      theme = (document.documentElement.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
      try { localStorage.setItem(KEY, theme); } catch (e) {}
      apply(theme);
    });
    document.body.appendChild(btn);
    apply(theme);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
