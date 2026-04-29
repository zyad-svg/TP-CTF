document.addEventListener('DOMContentLoaded', () => {

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  const sections = document.querySelectorAll('.section');
  const navItems = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(item => item.classList.remove('active'));
        const id = entry.target.id;
        const active = document.querySelector(`.nav-link[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));

  const terminalInput = document.getElementById('terminal-input');

  const cmdMap = {
    '/home': '#home',
    '/challenges': '#challenges',
    '/about': '#about',
    '/contact': '#contact',
    'help': null,
  };

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = terminalInput.value.trim().toLowerCase();
        if (cmdMap[val] !== undefined) {
          if (cmdMap[val]) {
            const target = document.querySelector(cmdMap[val]);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }
        }
        terminalInput.value = '';
      }
    });
  }

  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.challenge-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  const counters = document.querySelectorAll('.stat-num');

  const countUp = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1200;
    const step = Math.max(1, Math.floor(target / (duration / 16)));
    let current = 0;

    const tick = () => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString();
      if (current < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        feedback.textContent = '> ERROR: all fields required.';
        feedback.className = 'form-feedback error';
        return;
      }

      feedback.textContent = '> Sending...';
      feedback.className = 'form-feedback dim';

      setTimeout(() => {
        feedback.textContent = '> Message sent. We will get back to you shortly.';
        feedback.className = 'form-feedback success';
        form.reset();
      }, 1200);
    });
  }

  const typeLines = document.querySelectorAll('.t-line');

  typeLines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateX(-8px)';
    line.style.transition = 'opacity 0.2s, transform 0.2s';
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateX(0)';
    }, i * 80 + 200);
  });

});
