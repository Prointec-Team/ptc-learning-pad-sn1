/* ============================================
   LEARNING PAD — App Logic
   Navigation, Dark Mode, Accordions, Quizzes
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initThemeToggle();
  initAccordions();
  initQuizzes();
  initMobileMenu();
  initCopyPrompts();
});

/* ---------- Navigation ---------- */
function initNavigation() {
  const links = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('.section');

  function showSection(id) {
    sections.forEach(s => s.classList.remove('active'));
    links.forEach(l => l.classList.remove('active'));

    const target = document.getElementById(id);
    const link = document.querySelector(`.nav-link[data-section="${id}"]`);

    if (target) target.classList.add('active');
    if (link) link.classList.add('active');

    // Update breadcrumb with current section name (text nodes only, no emoji/badge)
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb && link) {
      const label = Array.from(link.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => n.textContent.trim())
        .filter(Boolean)
        .join('');
      breadcrumb.textContent = label || 'Inicio';
    }

    // Close mobile menu
    document.querySelector('.sidebar')?.classList.remove('open');
    document.querySelector('.overlay')?.classList.remove('active');

    // Scroll to top
    window.scrollTo({ top: 0 });

    // Save state
    localStorage.setItem('lp-current-section', id);
  }

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(link.dataset.section);
    });
  });

  // Overview cards + flow nodes navigation
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.overview-card[data-section], .flow-node[data-section]');
    if (card) {
      e.preventDefault();
      showSection(card.dataset.section);
    }
  });

  // Restore last section or show home
  const saved = localStorage.getItem('lp-current-section');
  if (saved && document.getElementById(saved)) {
    showSection(saved);
  } else {
    showSection('home');
  }
}

/* ---------- Theme Toggle ---------- */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  const icon = toggle?.querySelector('.theme-icon');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lp-theme', theme);
    if (icon) icon.textContent = theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
  }

  // Detect saved or system preference
  const saved = localStorage.getItem('lp-theme');
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  toggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

/* ---------- Accordions ---------- */
function initAccordions() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.accordion-trigger');
    if (!trigger) return;

    const item = trigger.closest('.accordion-item');
    if (!item) return;

    // Close siblings
    const accordion = item.closest('.accordion');
    if (accordion) {
      accordion.querySelectorAll('.accordion-item.open').forEach(i => {
        if (i !== item) i.classList.remove('open');
      });
    }

    item.classList.toggle('open');
  });
}

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.overlay');

  toggle?.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
    overlay?.classList.toggle('active');
  });

  overlay?.addEventListener('click', () => {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('active');
  });
}

/* ---------- Quizzes ---------- */
function initQuizzes() {
  document.querySelectorAll('.quiz-container').forEach(container => {
    const quizId = container.dataset.quiz;
    const questions = container.querySelectorAll('.quiz-question');
    const totalQ = questions.length;
    let answered = 0;
    let correct = 0;

    questions.forEach((q, idx) => {
      const options = q.querySelectorAll('.quiz-option');
      const correctIdx = parseInt(q.dataset.correct);
      const explanation = q.querySelector('.quiz-explanation');

      options.forEach((opt, optIdx) => {
        opt.addEventListener('click', () => {
          // Prevent re-answer
          if (q.classList.contains('answered')) return;
          q.classList.add('answered');
          answered++;

          // Mark selected
          opt.classList.add('selected');

          // Show result
          const correctOpt = options[correctIdx];
          correctOpt.classList.add('correct');

          if (optIdx === correctIdx) {
            correct++;
          } else {
            opt.classList.add('incorrect');
          }

          // Disable others
          options.forEach(o => {
            if (!o.classList.contains('correct') && !o.classList.contains('incorrect')) {
              o.classList.add('disabled');
            }
          });

          // Show explanation
          if (explanation) explanation.classList.add('show');

          // Update progress
          updateProgress(container, answered, totalQ);

          // Show score when all answered
          if (answered === totalQ) {
            showScore(container, correct, totalQ);
          }
        });
      });
    });
  });
}

function updateProgress(container, answered, total) {
  const fill = container.querySelector('.quiz-progress-fill');
  const text = container.querySelector('.quiz-progress-text');
  const pct = Math.round((answered / total) * 100);
  if (fill) fill.style.width = pct + '%';
  if (text) text.textContent = `${answered} / ${total}`;
}

function showScore(container, correct, total) {
  const scoreEl = container.querySelector('.quiz-score');
  if (!scoreEl) return;

  const pct = Math.round((correct / total) * 100);
  scoreEl.querySelector('.score-number').textContent = `${correct}/${total}`;
  scoreEl.querySelector('.score-pct').textContent = `${pct}%`;
  scoreEl.style.display = 'block';

  if (pct >= 70) {
    scoreEl.classList.add('pass');
    scoreEl.querySelector('.score-msg').textContent = 'Aprobado';
  } else {
    scoreEl.classList.add('fail');
    scoreEl.querySelector('.score-msg').textContent = 'No alcanza el 70% requerido. Revisa los temas y vuelve a intentar.';
  }
}

/* ---------- Reset quiz ---------- */
function resetQuiz(quizId) {
  const container = document.querySelector(`.quiz-container[data-quiz="${quizId}"]`);
  if (!container) return;

  container.querySelectorAll('.quiz-question').forEach(q => {
    q.classList.remove('answered');
    q.querySelectorAll('.quiz-option').forEach(o => {
      o.classList.remove('selected', 'correct', 'incorrect', 'disabled');
    });
    const expl = q.querySelector('.quiz-explanation');
    if (expl) expl.classList.remove('show');
  });

  const scoreEl = container.querySelector('.quiz-score');
  if (scoreEl) {
    scoreEl.style.display = 'none';
    scoreEl.classList.remove('pass', 'fail');
  }

  updateProgress(container, 0, container.querySelectorAll('.quiz-question').length);

  // Re-init this quiz
  initSingleQuiz(container);
}

/* ---------- Copy AI Prompts ---------- */
function initCopyPrompts() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-copy');
    if (!btn) return;
    const text = btn.dataset.text;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = '✓ Copiado';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copiar';
        btn.classList.remove('copied');
      }, 2000);
    });
  });
}

function initSingleQuiz(container) {
  const questions = container.querySelectorAll('.quiz-question');
  const totalQ = questions.length;
  let answered = 0;
  let correct = 0;

  questions.forEach(q => {
    const options = q.querySelectorAll('.quiz-option');
    const correctIdx = parseInt(q.dataset.correct);
    const explanation = q.querySelector('.quiz-explanation');

    // Clone to remove old listeners
    options.forEach((opt, optIdx) => {
      const newOpt = opt.cloneNode(true);
      opt.parentNode.replaceChild(newOpt, opt);

      newOpt.addEventListener('click', () => {
        if (q.classList.contains('answered')) return;
        q.classList.add('answered');
        answered++;

        newOpt.classList.add('selected');
        const allOpts = q.querySelectorAll('.quiz-option');
        allOpts[correctIdx].classList.add('correct');

        if (optIdx === correctIdx) {
          correct++;
        } else {
          newOpt.classList.add('incorrect');
        }

        allOpts.forEach(o => {
          if (!o.classList.contains('correct') && !o.classList.contains('incorrect')) {
            o.classList.add('disabled');
          }
        });

        if (explanation) explanation.classList.add('show');
        updateProgress(container, answered, totalQ);

        if (answered === totalQ) {
          showScore(container, correct, totalQ);
        }
      });
    });
  });
}
