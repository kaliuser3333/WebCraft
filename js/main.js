// ============ НАВИГАЦИЯ ПРИ СКРОЛЛЕ ============
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });
}

// ============ МОБИЛЬНОЕ МЕНЮ ============
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ============ АНИМАЦИЯ ПРИ СКРОЛЛЕ ============
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => revealObserver.observe(el));

// ============ ПЛАВНЫЙ СКРОЛЛ К ЯКОРЯМ ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============ СЧЁТЧИК ЦИФР (если есть на странице) ============
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const duration = 1500;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  });
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

const countersSection = document.querySelector('[data-counters]');
if (countersSection) counterObserver.observe(countersSection);

// ============ АКТИВНАЯ ССЫЛКА В МЕНЮ ============
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const linkPage = link.getAttribute('href');
  if (linkPage === currentPage) {
    link.style.color = 'var(--accent)';
  }
});

// ============ ФОРМА ЗАЯВКИ ============
// ВАЖНО: замени BOT_TOKEN и CHAT_ID на свои
const BOT_TOKEN = 'ТВОЙ_ТОКЕН_БОТА';
const CHAT_ID = 'ТВОЙ_CHAT_ID';

async function submitContact(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Отправка...';

  const formData = new FormData(e.target);
  const name = formData.get('name') || '—';
  const contact = formData.get('contact') || '—';
  const service = formData.get('service') || '—';
  const message = formData.get('message') || '—';

  const text =
    `📩 *Новая заявка с сайта!*\n\n` +
    `👤 Имя: ${name}\n` +
    `📞 Контакт: ${contact}\n` +
    `🛠 Услуга: ${service}\n` +
    `💬 Сообщение: ${message}`;

  try {
    if (BOT_TOKEN !== 'ТВОЙ_ТОКЕН_БОТА') {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' })
      });
    }
    alert('✅ Спасибо! Я получил вашу заявку и свяжусь с вами в течение 1 часа.');
    e.target.reset();
  } catch (err) {
    alert('❌ Ошибка отправки. Попробуйте ещё раз или напишите в Telegram.');
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

// Привязка формы, если она есть на странице
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', submitContact);
}

// ============ ЗАГОЛОВОК СТРАНИЦЫ В TAB ============
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.title = '👋 Вернись на сайт!';
  } else {
    const baseTitle = document.body.dataset.title || 'WebCraft — Сайты, боты, Mini Apps';
    document.title = baseTitle;
  }
});

// ============ КНОПКА "НАВЕРХ" ============
const topBtn = document.createElement('button');
topBtn.innerHTML = '↑';
topBtn.style.cssText = `
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  border: none;
  font-size: 22px;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: 0.3s;
  z-index: 90;
  box-shadow: 0 8px 24px rgba(99,102,241,0.4);
`;
document.body.appendChild(topBtn);

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    topBtn.style.opacity = '1';
    topBtn.style.pointerEvents = 'auto';
  } else {
    topBtn.style.opacity = '0';
    topBtn.style.pointerEvents = 'none';
  }
});

topBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============ КОНСОЛЬ (для отладки) ============
console.log('%c🚀 WebCraft', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; color: transparent;');
console.log('%cСайт загружен успешно!', 'font-size: 14px; color: #8b92a8;');