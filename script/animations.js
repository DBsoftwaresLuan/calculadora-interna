/* ============================================================
   DB Softwares — Animações & UX Avançado v2
   Scroll reveal · Ripple · Progress · Resultado · Tooltips
   Toasts · Shake · Confetti · Contagem · Stepper · Char count
   ============================================================ */

(function () {
  'use strict';

  /* ── HELPERS ───────────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

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
      { threshold: 0.06, rootMargin: '0px 0px -30px 0px' }
    );

    $$('fieldset').forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${i * 0.07}s`);
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
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    circle.classList.add('ripple');
    circle.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    btn.appendChild(circle);
    circle.addEventListener('animationend', () => circle.remove());
  }

  function initRipple() {
    $$('button').forEach((btn) => {
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.addEventListener('click', createRipple);
    });
  }

  /* ── 3. HIGHLIGHT DE FOCUS NOS INPUTS ─────────────────────── */
  function initInputFocus() {
    $$('input, select, textarea').forEach((el) => {
      el.addEventListener('focus', () => {
        el.closest('.form-group')?.classList.add('focused');
      });
      el.addEventListener('blur', () => {
        el.closest('.form-group')?.classList.remove('focused');
      });
      const mark = () => el.classList.toggle('has-value', el.value !== '');
      el.addEventListener('input', mark);
      el.addEventListener('change', mark);
      if (el.value) el.classList.add('has-value');
    });
  }

  /* ── 4. BARRA DE PROGRESSO ─────────────────────────────────── */
  let confettiDone = false;

  function initProgressBar() {
    const bar = document.createElement('div');
    bar.classList.add('db-progress-bar');
    bar.setAttribute('title', 'Progresso do formulário');
    bar.innerHTML = `
      <div class="db-progress-track"><div class="db-progress-fill"></div></div>
      <span class="db-progress-label">0%</span>
    `;
    document.body.appendChild(bar);

    const form = $('form');
    if (!form) return;

    function updateProgress() {
      const required = $$('[required]', form);
      const filled = required.filter((el) => {
        if (el.type === 'checkbox') return el.checked;
        return el.value && el.value !== '';
      });

      const pct = required.length
        ? Math.round((filled.length / required.length) * 100)
        : 0;

      const fill = bar.querySelector('.db-progress-fill');
      const label = bar.querySelector('.db-progress-label');
      fill.style.width = `${pct}%`;
      label.textContent = `${pct}%`;
      bar.setAttribute('data-pct', pct);

      if (pct === 100) {
        fill.style.background = 'linear-gradient(90deg,#3E569E,#BDA07E)';
        label.style.color = '#3E569E';
        if (!confettiDone) {
          confettiDone = true;
          launchConfetti();
          showToast('Formulário completo! Clique em Calcular Plano.', 'success');
        }
      } else if (pct >= 60) {
        fill.style.background = 'linear-gradient(90deg,#3E569E,#4A65B5)';
        label.style.color = '#3E569E';
        confettiDone = false;
      } else {
        fill.style.background = 'linear-gradient(90deg,#A8895F,#BDA07E)';
        label.style.color = '#A8895F';
        confettiDone = false;
      }
    }

    form.addEventListener('input', updateProgress);
    form.addEventListener('change', updateProgress);
    updateProgress();
  }

  /* ── 5. TOAST NOTIFICATIONS ─────────────────────────────────── */
  let toastContainer = null;

  function getToastContainer() {
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'db-toast-container';
      document.body.appendChild(toastContainer);
    }
    return toastContainer;
  }

  function showToast(msg, type = 'info', duration = 3800) {
    const container = getToastContainer();
    const toast = document.createElement('div');
    toast.className = `db-toast db-toast--${type}`;

    const icons = {
      success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
      error:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
      info:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
      warn:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    };

    toast.innerHTML = `
      <span class="db-toast__icon">${icons[type] || icons.info}</span>
      <span class="db-toast__msg">${msg}</span>
      <button class="db-toast__close" aria-label="Fechar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    container.appendChild(toast);

    // Force reflow then animate in
    void toast.offsetWidth;
    toast.classList.add('db-toast--visible');

    const close = () => {
      toast.classList.remove('db-toast--visible');
      toast.classList.add('db-toast--out');
      setTimeout(() => toast.remove(), 380);
    };

    toast.querySelector('.db-toast__close').addEventListener('click', close);
    setTimeout(close, duration);
  }

  /* ── 6. ANIMAÇÃO DO RESULTADO ──────────────────────────────── */
  function initResultadoReveal() {
    const resultArea = document.getElementById('resultadoArea');
    if (!resultArea) return;

    const styleObserver = new MutationObserver(() => {
      if (resultArea.style.display !== 'none') {
        animateResultado(resultArea);
      }
    });
    styleObserver.observe(resultArea, {
      attributes: true,
      attributeFilter: ['style'],
    });

    const mutObs = new MutationObserver(() => {
      if (resultArea.style.display !== 'none') {
        animateResultado(resultArea);
      }
    });
    mutObs.observe(resultArea, { childList: true, subtree: true });
  }

  function animateResultado(el) {
    el.classList.remove('resultado-reveal');
    void el.offsetWidth;
    el.classList.add('resultado-reveal');

    // Anima filhos escalonados
    const children = el.querySelectorAll(
      'h3, h4, p, li, .resultado-row, .tag-pill, [class*="resultado"], strong, .score-value, .tier-badge'
    );
    children.forEach((child, i) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(14px)';
      setTimeout(() => {
        child.style.transition =
          'opacity 0.42s cubic-bezier(0.16,1,0.3,1), transform 0.42s cubic-bezier(0.16,1,0.3,1)';
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      }, 100 + i * 55);
    });

    // Anima contagem numérica nos scores
    setTimeout(() => animateNumbers(el), 200);

    // Scroll suave até o resultado
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);

    showToast('Diagnóstico calculado com sucesso!', 'success', 4000);
  }

  /* ── 7. ANIMAÇÃO DE CONTAGEM NUMÉRICA ───────────────────────── */
  function animateNumbers(ctx = document) {
    ctx.querySelectorAll('.score-value, [data-count]').forEach((el) => {
      const raw = el.textContent.replace(/[^\d.]/g, '');
      const target = parseFloat(raw);
      if (isNaN(target) || target === 0) return;

      const duration = 1000;
      const startTime = performance.now();
      const isFloat = raw.includes('.');
      const decimals = isFloat ? (raw.split('.')[1] || '').length : 0;
      const prefix = el.textContent.replace(/[\d.]+.*/, '');
      const suffix = el.textContent.replace(/^[^\d]*[\d.]+/, '');

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = target * ease;
        el.textContent = prefix + current.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    });
  }

  /* ── 8. FIELDSET HOVER SHINE ───────────────────────────────── */
  function initCardShine() {
    $$('fieldset').forEach((card) => {
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

  /* ── 9. TOP BAR SHADOW AO SCROLL ──────────────────────────── */
  function initTopBarScroll() {
    const topBar = $('.top-bar');
    if (!topBar) return;
    window.addEventListener('scroll', () => {
      topBar.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  /* ── 10. CHECKBOX MICRO-ANIMAÇÃO ───────────────────────────── */
  function initCheckboxAnimation() {
    $$('.checkbox-group input[type="checkbox"]').forEach((cb) => {
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

  /* ── 11. DATA ATUAL ────────────────────────────────────────── */
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

  /* ── 12. SELECT FILL VISUAL ────────────────────────────────── */
  function initSelectFill() {
    $$('select').forEach((sel) => {
      const update = () => sel.classList.toggle('has-value', sel.value !== '');
      sel.addEventListener('change', update);
      update();
    });
  }

  /* ── 13. TOOLTIP DE AJUDA ──────────────────────────────────── */
  const FIELD_HINTS = {
    tipo_processo:        'Categoria principal do processo que será analisado.',
    area_responsavel:     'Departamento ou setor que executa este processo.',
    criticidade:          'Nível de impacto caso o processo apresente falha.',
    volume:               'Quantidade de transações ou registros processados.',
    frequencia:           'Com que regularidade o processo é executado.',
    sazonalidade:         'Se o volume varia bastante em épocas específicas.',
    numero_usuarios:      'Quantas pessoas participam diretamente deste processo.',
    varia_cenario:        'Se o processo muda de acordo com situações diferentes.',
    excecoes:             'Ocorrências que fogem do fluxo padrão do processo.',
    padronizacao:         'Se é possível seguir sempre o mesmo passo a passo.',
    dependencia_humana:   'Se o processo depende de conhecimento de poucos.',
    execucao_atual:       'Como o processo é feito hoje em dia.',
    natureza_processo:    'Se o processo é repetitivo ou exige análise/raciocínio.',
    ia_interpretativa:    'Se alguma etapa precisa de julgamento humano contextual.',
    sistemas:             'Ferramentas ou plataformas usadas no processo.',
    qualidade_dados:      'Confiabilidade e completude dos dados disponíveis.',
    conectividade:        'Como os sistemas se conectam para trocar informações.',
    acessos:              'Status das credenciais e permissões para acesso.',
    interlocutor:         'Pessoa responsável por responder dúvidas técnicas.',
    /* industrial */
    gargalo_planta:       'Se este processo limita a velocidade da operação inteira.',
    redundancia_tecnica:  'Se existe um backup ou alternativa caso o processo falhe.',
    risco_incidente:      'Se uma falha pode causar risco ambiental ou de segurança.',
    custo_hora_parada:    'Quanto custa financeiramente cada hora de parada.',
    frequencia_paradas:   'Com que frequência o processo para de forma não planejada.',
    mttr:                 'Tempo médio para retomar após uma parada.',
    impacto_logistico:    'Se a parada afeta entregas ou contratos externos.',
    processo_batelada:    'Se o processo trabalha em lotes/bateladas.',
    evento_falha:         'O que acontece com o lote em caso de falha.',
    valor_batelada:       'Valor estimado de cada lote ou batelada.',
    frequencia_perda:     'Com que frequência ocorrem perdas de lote.',
    variabilidade_insumo: 'Se as matérias-primas variam em qualidade ou composição.',
    qualidade_oscila:     'Se o produto final varia significativamente entre rodadas.',
    ajustes_frequentes:   'Se os operadores precisam ajustar parâmetros constantemente.',
    variabilidade_turno:  'Se há diferença de desempenho entre turnos diferentes.',
    necessidade_explicacao: 'Se as decisões exigem contexto e análise de causa-raiz.',
    base_decisao:         'Com base em quê as decisões operacionais são tomadas.',
    sensores_clp:         'Se existem sensores, CLPs ou sistemas SCADA instalados.',
    uso_dados:            'Como os dados coletados são utilizados atualmente.',
    complexidade_conectividade: 'Complexidade de integrar os sistemas existentes.',
  };

  let activeTooltip = null;

  function createTooltip(text) {
    const tip = document.createElement('div');
    tip.className = 'db-tooltip';
    tip.textContent = text;
    document.body.appendChild(tip);
    return tip;
  }

  function positionTooltip(tip, anchor) {
    const rect = anchor.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    tip.style.left = `${rect.left + scrollX + rect.width / 2}px`;
    tip.style.top = `${rect.top + scrollY - 8}px`;
    tip.style.transform = 'translate(-50%, -100%)';
  }

  function initTooltips() {
    $$('select, input[type="text"]').forEach((el) => {
      const id = el.id;
      if (!id || !FIELD_HINTS[id]) return;

      const group = el.closest('.form-group');
      if (!group) return;

      const label = group.querySelector('label');
      if (!label) return;

      // Cria o botão de ajuda
      const helpBtn = document.createElement('button');
      helpBtn.type = 'button';
      helpBtn.className = 'db-help-btn';
      helpBtn.setAttribute('aria-label', 'Ajuda sobre este campo');
      helpBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
      label.appendChild(helpBtn);

      helpBtn.addEventListener('mouseenter', (e) => {
        if (activeTooltip) activeTooltip.remove();
        activeTooltip = createTooltip(FIELD_HINTS[id]);
        positionTooltip(activeTooltip, helpBtn);
        void activeTooltip.offsetWidth;
        activeTooltip.classList.add('db-tooltip--visible');
      });

      helpBtn.addEventListener('mouseleave', () => {
        if (activeTooltip) {
          activeTooltip.classList.remove('db-tooltip--visible');
          const t = activeTooltip;
          setTimeout(() => t.remove(), 220);
          activeTooltip = null;
        }
      });

      helpBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showToast(FIELD_HINTS[id], 'info', 5000);
      });
    });
  }

  /* ── 14. CONTADOR DE CARACTERES NO TEXTAREA ─────────────────── */
  function initCharCount() {
    $$('textarea').forEach((ta) => {
      const max = ta.getAttribute('maxlength') || 500;
      ta.setAttribute('maxlength', max);

      const counter = document.createElement('div');
      counter.className = 'db-char-count';
      counter.textContent = `0 / ${max}`;
      ta.parentNode.insertBefore(counter, ta.nextSibling);

      ta.addEventListener('input', () => {
        const len = ta.value.length;
        counter.textContent = `${len} / ${max}`;
        counter.classList.toggle('db-char-count--warn', len >= max * 0.8);
        counter.classList.toggle('db-char-count--max', len >= max);
      });
    });
  }

  /* ── 15. SHAKE CAMPOS INVÁLIDOS ────────────────────────────── */
  function initShakeOnInvalid() {
    const form = $('form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      const invalids = $$('[required]', form).filter((el) => !el.value || el.value === '');
      if (invalids.length > 0) {
        e.preventDefault();
        invalids.forEach((el, idx) => {
          const group = el.closest('.form-group') || el.closest('fieldset');
          if (!group) return;
          setTimeout(() => {
            group.classList.remove('db-shake');
            void group.offsetWidth;
            group.classList.add('db-shake');
            group.addEventListener('animationend', () => {
              group.classList.remove('db-shake');
            }, { once: true });
          }, idx * 60);
        });

        // Scroll para o primeiro inválido
        const firstInvalid = invalids[0];
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => firstInvalid.focus(), 400);

        showToast(`Preencha os campos obrigatórios destacados.`, 'warn', 4500);
      }
    }, true);
  }

  /* ── 16. STEPPER DE BLOCOS ─────────────────────────────────── */
  function initStepper() {
    const fieldsets = $$('fieldset');
    if (fieldsets.length < 2) return;

    const stepper = document.createElement('div');
    stepper.className = 'db-stepper';
    stepper.setAttribute('aria-label', 'Blocos do formulário');

    fieldsets.forEach((fs, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'db-stepper__dot';
      dot.setAttribute('aria-label', `Ir para bloco ${i + 1}`);
      dot.setAttribute('title', fs.querySelector('legend')?.textContent?.trim() || `Bloco ${i + 1}`);

      dot.addEventListener('click', () => {
        fs.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      stepper.appendChild(dot);
    });

    document.body.appendChild(stepper);

    // Destaca o dot ativo conforme scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = fieldsets.indexOf(entry.target);
          stepper.querySelectorAll('.db-stepper__dot').forEach((d, i) => {
            d.classList.toggle('db-stepper__dot--active', i === idx);
            d.classList.toggle('db-stepper__dot--done', i < idx);
          });
        }
      });
    }, { threshold: 0.4 });

    fieldsets.forEach((fs) => observer.observe(fs));
  }

  /* ── 17. CONFETTI ──────────────────────────────────────────── */
  function launchConfetti() {
    const colors = ['#3E569E', '#BDA07E', '#A8895F', '#4A65B5', '#f0c070', '#ffffff'];
    const canvas = document.createElement('canvas');
    canvas.className = 'db-confetti-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const particles = [];
    const count = 90;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10 - Math.random() * 100,
        w: 6 + Math.random() * 8,
        h: 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 2.5 + Math.random() * 4,
        drift: (Math.random() - 0.5) * 2.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.12,
        opacity: 0.9 + Math.random() * 0.1,
      });
    }

    let frame;
    let elapsed = 0;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      elapsed++;

      let alive = false;
      particles.forEach((p) => {
        p.y += p.speed;
        p.x += p.drift;
        p.rotation += p.rotSpeed;
        if (elapsed > 80) p.opacity -= 0.008;

        if (p.y < canvas.height + 20 && p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });

      if (alive) {
        frame = requestAnimationFrame(draw);
      } else {
        canvas.remove();
      }
    }

    frame = requestAnimationFrame(draw);

    // cleanup safety
    setTimeout(() => {
      cancelAnimationFrame(frame);
      canvas.remove();
    }, 5000);
  }

  /* ── 18. HIGHLIGHT AO LIMPAR FORMULÁRIO ─────────────────────── */
  function initClearFeedback() {
    // Intercepta a função limparFormulario se existir
    const original = window.limparFormulario;
    if (typeof original === 'function') {
      window.limparFormulario = function (...args) {
        original.apply(this, args);
        showToast('Formulário limpo.', 'info', 2500);
        // Reset has-value
        setTimeout(() => {
          $$('select, input, textarea').forEach((el) => {
            el.classList.remove('has-value');
          });
        }, 100);
      };
    }
  }

  /* ── 19. BADGE DE CAMPO PREENCHIDO ─────────────────────────── */
  function initFieldCompletionFeedback() {
    const important = ['nome_processo', 'cliente', 'consultor'];
    important.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('blur', () => {
        if (el.value.trim().length > 1) {
          const group = el.closest('.form-group');
          if (group && !group.querySelector('.db-field-check')) {
            const check = document.createElement('span');
            check.className = 'db-field-check';
            check.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><polyline points="20 6 9 17 4 12"/></svg>`;
            group.style.position = 'relative';
            group.appendChild(check);
          }
        }
      });
    });
  }

  /* ── 20. ANIMAÇÃO DE SELECT CHANGE ─────────────────────────── */
  function initSelectChangeAnimation() {
    $$('select').forEach((sel) => {
      sel.addEventListener('change', () => {
        if (!sel.value) return;
        sel.classList.remove('db-select-pop');
        void sel.offsetWidth;
        sel.classList.add('db-select-pop');
        sel.addEventListener('animationend', () => {
          sel.classList.remove('db-select-pop');
        }, { once: true });
      });
    });
  }

  /* ── 21. SCROLL TO TOP BUTTON ───────────────────────────────── */
  function initScrollToTop() {
    const btn = document.createElement('button');
    btn.className = 'db-scroll-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Voltar ao topo');
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      btn.classList.toggle('db-scroll-top--visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 22. PARTICULAS DE FUNDO ─────────────────────────────────── */
  function initBackgroundParticles() {
    const canvas = document.createElement('canvas');
    canvas.className = 'db-bg-particles';
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const particles = [];
    const NUM = 28;

    for (let i = 0; i < NUM; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 1.2 + Math.random() * 2.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        opacity: 0.06 + Math.random() * 0.12,
        color: Math.random() > 0.5 ? '#3E569E' : '#A8895F',
      });
    }

    window.addEventListener('resize', () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    });

    let running = true;
    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      requestAnimationFrame(draw);
    }
    draw();

    // Pausa quando aba está em segundo plano
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) draw();
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
    initTooltips();
    initCharCount();
    initShakeOnInvalid();
    initStepper();
    initClearFeedback();
    initFieldCompletionFeedback();
    initSelectChangeAnimation();
    initScrollToTop();
    initBackgroundParticles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
