/* ============================================================
   DB Softwares — Animações Suaves
   Scroll reveal · Input focus · Progress · Ripple · Resultado
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. SCROLL REVEAL ──────────────────────────────────────── */
  function initScrollReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('fieldset').forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${i * 0.06}s`);
      observer.observe(el);
    });
  }

  /* ── 2. RIPPLE NOS BOTÕES ──────────────────────────────────── */
  function createRipple(e) {
    const btn = e.currentTarget;
    const existing = btn.querySelector('.ripple');
    if (existing) existing.remove();

    const circle = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.8;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    circle.classList.add('ripple');
    circle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
    `;

    btn.appendChild(circle);
    circle.addEventListener('animationend', () => circle.remove());
  }

  function initRipple() {
    document.querySelectorAll('button').forEach((btn) => {
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.addEventListener('click', createRipple);
    });
  }

  /* ── 3. HIGHLIGHT DE FOCUS NOS INPUTS ─────────────────────── */
  function initInputFocus() {
    document.querySelectorAll('input, select, textarea').forEach((el) => {
      el.addEventListener('focus', () => {
        const group = el.closest('.form-group');
        if (group) group.classList.add('focused');
      });
      el.addEventListener('blur', () => {
        const group = el.closest('.form-group');
        if (group) group.classList.remove('focused');
      });

      // Marca como preenchido
      el.addEventListener('input', () => {
        el.classList.toggle('has-value', el.value !== '' && el.value !== null);
      });
      el.addEventListener('change', () => {
        el.classList.toggle('has-value', el.value !== '' && el.value !== null);
      });
      // Estado inicial
      if (el.value) el.classList.add('has-value');
    });
  }

  /* ── 4. BARRA DE PROGRESSO ─────────────────────────────────── */
  function initProgressBar() {
    const bar = document.createElement('div');
    bar.classList.add('db-progress-bar');
    bar.innerHTML = `
      <div class="db-progress-track"><div class="db-progress-fill"></div></div>
      <span class="db-progress-label">0%</span>
    `;
    document.body.appendChild(bar);

    const form = document.querySelector('form');
    if (!form) return;

    function updateProgress() {
      const required = Array.from(
        form.querySelectorAll('[required]')
      );
      const filled = required.filter((el) => {
        if (el.type === 'checkbox') return el.checked;
        return el.value && el.value !== '';
      });

      const pct = required.length
        ? Math.round((filled.length / required.length) * 100)
        : 0;

      const fill = bar.querySelector('.db-progress-track .db-progress-fill');
      const label = bar.querySelector('.db-progress-label');
      fill.style.width = `${pct}%`;
      label.textContent = `${pct}%`;
      bar.setAttribute('data-pct', pct);

      // Cor muda conforme progresso
      if (pct === 100) {
        fill.style.background = 'linear-gradient(90deg, #3E569E, #BDA07E)';
        label.style.color = '#3E569E';
      } else if (pct >= 60) {
        fill.style.background = 'linear-gradient(90deg, #3E569E, #4A65B5)';
        label.style.color = '#3E569E';
      } else {
        fill.style.background = 'linear-gradient(90deg, #A8895F, #BDA07E)';
        label.style.color = '#A8895F';
      }
    }

    form.addEventListener('input', updateProgress);
    form.addEventListener('change', updateProgress);
    updateProgress();
  }

  /* ── 5. ANIMAÇÃO DO RESULTADO ──────────────────────────────── */
  function initResultadoReveal() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          // Resultado principal
          if (
            node.classList?.contains('resultado-card') ||
            node.id === 'resultadoArea'
          ) {
            animateResultado(node);
          }
          // Conteúdo injetado dentro do resultado
          const card = document.querySelector(
            '.resultado-card, #resultadoArea'
          );
          if (card && card.style.display !== 'none') {
            animateResultado(card);
          }
        });
      });
    });

    const container = document.querySelector('form') || document.body;
    observer.observe(container, { childList: true, subtree: true });

    // Observa mudança de display no resultadoArea
    const resultArea = document.getElementById('resultadoArea');
    if (resultArea) {
      const styleObserver = new MutationObserver(() => {
        if (resultArea.style.display !== 'none') {
          animateResultado(resultArea);
        }
      });
      styleObserver.observe(resultArea, {
        attributes: true,
        attributeFilter: ['style'],
      });
    }
  }

  function animateResultado(el) {
    el.classList.remove('resultado-reveal');
    void el.offsetWidth; // reflow
    el.classList.add('resultado-reveal');

    // Anima filhos um por um
    const children = el.querySelectorAll(
      'h3, h4, p, li, .resultado-row, .tag-pill, [class*="resultado"]'
    );
    children.forEach((child, i) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(12px)';
      setTimeout(() => {
        child.style.transition =
          'opacity 0.38s cubic-bezier(0.16,1,0.3,1), transform 0.38s cubic-bezier(0.16,1,0.3,1)';
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      }, 120 + i * 60);
    });

    // Scroll suave até o resultado
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  /* ── 6. FIELDSET HOVER SHINE ───────────────────────────────── */
  function initCardShine() {
    document.querySelectorAll('fieldset').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--shine-x', `${x}%`);
        card.style.setProperty('--shine-y', `${y}%`);
      });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--shine-x', '50%');
        card.style.setProperty('--shine-y', '50%');
      });
    });
  }

  /* ── 7. TOP BAR SHADOW AO SCROLL ──────────────────────────── */
  function initTopBarScroll() {
    const topBar = document.querySelector('.top-bar');
    if (!topBar) return;
    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 8) {
          topBar.classList.add('scrolled');
        } else {
          topBar.classList.remove('scrolled');
        }
      },
      { passive: true }
    );
  }

  /* ── 8. CHECKBOX MICRO-ANIMAÇÃO ────────────────────────────── */
  function initCheckboxAnimation() {
    document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener('change', () => {
        const label = cb.closest('label');
        if (!label) return;
        label.classList.remove('cb-bounce');
        void label.offsetWidth;
        label.classList.add('cb-bounce');
        label.addEventListener('animationend', () => {
          label.classList.remove('cb-bounce');
        }, { once: true });
      });
    });
  }

  /* ── 9. DATA ATUAL ─────────────────────────────────────────── */
  function initCurrentDate() {
    const el = document.getElementById('currentDate');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  /* ── 10. SELECT FILL VISUAL ────────────────────────────────── */
  function initSelectFill() {
    document.querySelectorAll('select').forEach((sel) => {
      function update() {
        sel.classList.toggle('has-value', sel.value !== '');
      }
      sel.addEventListener('change', update);
      update();
    });
  }

  /* ── INIT ──────────────────────────────────────────────────── */
  function init() {
    initScrollReveal();
    initRipple();
    initInputFocus();
    initProgressBar();
    initResultadoReveal();
    initCardShine();
    initTopBarScroll();
    initCheckboxAnimation();
    initCurrentDate();
    initSelectFill();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
