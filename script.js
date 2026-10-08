// ==========================================================================
// PORTFOLIO INTERACTION SCRIPT
// - Pixel Art Vertical Navbar: Drawer, ScrollSpy, Smooth Scroll
// - Night Mode Toggle with CSS Media Query Theme Detection & Persistence
// - Interactive Retro Chat Terminal
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. NIGHT MODE TOGGLE (with CSS Media Query Detection)
  // ------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  function getEffectiveTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
      return savedTheme;
    }
    return prefersDarkScheme.matches ? 'dark' : 'light';
  }

  function updateToggleUI(isDark) {
    if (!themeToggleBtn) return;
    themeToggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    themeToggleBtn.setAttribute(
      'aria-label',
      isDark ? 'Switch to daylight mode' : 'Switch to night mode'
    );
    const themeText = themeToggleBtn.querySelector('.theme-text');
    if (themeText) {
      themeText.textContent = isDark ? 'DAY MODE' : 'NIGHT MODE';
    }
  }

  // Initialize theme
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateToggleUI(savedTheme === 'dark');
  } else {
    updateToggleUI(prefersDarkScheme.matches);
  }

  // Listen to OS theme changes if user hasn't chosen manually
  prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      updateToggleUI(e.matches);
    }
  });

  // Manual Toggle Event
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = getEffectiveTheme();
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      updateToggleUI(newTheme === 'dark');
    });
  }

  // ------------------------------------------------------------------------
  // 2. MOBILE SIDEBAR DRAWER TOGGLE & ACCESSIBILITY
  // ------------------------------------------------------------------------
  const menuToggleBtn = document.getElementById('pixel-menu-toggle');
  const menuCloseBtn = document.getElementById('pixel-menu-close');
  const sidebar = document.getElementById('pixel-sidebar-nav');
  const backdrop = document.getElementById('pixel-nav-backdrop');

  function openMobileNav() {
    if (!sidebar) return;
    sidebar.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-active');
    if (menuToggleBtn) menuToggleBtn.setAttribute('aria-expanded', 'true');
    // Focus first link in sidebar for keyboard accessibility
    const firstLink = sidebar.querySelector('.pixel-nav-link');
    if (firstLink) firstLink.focus();
  }

  function closeMobileNav() {
    if (!sidebar) return;
    sidebar.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-active');
    if (menuToggleBtn) {
      menuToggleBtn.setAttribute('aria-expanded', 'false');
      menuToggleBtn.focus();
    }
  }

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', () => {
      const isOpen = sidebar && sidebar.classList.contains('is-open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (menuCloseBtn) {
    menuCloseBtn.addEventListener('click', closeMobileNav);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMobileNav);
  }

  // Close drawer when Escape is pressed
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('is-open')) {
      closeMobileNav();
    }
  });

  // ------------------------------------------------------------------------
  // 3. SCROLLSPY & SMOOTH SCROLLING FOR ALL 8 LINKS
  // ------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.pixel-nav-link');
  const sections = document.querySelectorAll('section[id], header#hero');

  // Handle clicking navigation links
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });

          // Update active link state
          setActiveLink(link.getAttribute('data-nav'));

          // Close mobile menu if open
          if (window.innerWidth < 1024) {
            closeMobileNav();
          }
        }
      }
    });
  });

  function setActiveLink(sectionId) {
    navLinks.forEach((link) => {
      const navTarget = link.getAttribute('data-nav');
      if (navTarget === sectionId) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  // IntersectionObserver for accurate ScrollSpy
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        setActiveLink(id);
      }
    });
  }, observerOptions);

  document.querySelectorAll('section[id]').forEach((section) => {
    observer.observe(section);
  });

  // ------------------------------------------------------------------------
  // 4. INTERACTIVE RETRO CHAT TERMINAL
  // ------------------------------------------------------------------------
  const chatMessages = document.getElementById('pixel-terminal-messages');
  const chatForm = document.getElementById('pixel-chat-form');
  const chatInput = document.getElementById('pixel-chat-input');
  const promptButtons = document.querySelectorAll('.pixel-prompt-btn');

  function appendChatMessage(sender, text, isUser = false) {
    if (!chatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `terminal-msg ${isUser ? 'user' : 'bot'}`;

    const senderSpan = document.createElement('span');
    senderSpan.className = 'msg-sender';
    senderSpan.textContent = `[${sender}]:`;

    const textSpan = document.createElement('span');
    textSpan.className = 'msg-text';
    textSpan.textContent = ` ${text}`;

    msgDiv.appendChild(senderSpan);
    msgDiv.appendChild(textSpan);
    chatMessages.appendChild(msgDiv);

    // Auto-scroll to bottom of terminal
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Handle quick prompt buttons
  promptButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const userText = btn.textContent.replace(/[⚡🚀✉️💼]/g, '').trim();
      const botReply = btn.getAttribute('data-reply');

      appendChatMessage('GUEST', userText, true);
      setTimeout(() => {
        appendChatMessage('BOT_SINDHU', botReply, false);
      }, 400);
    });
  });

  // Handle custom text input
  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = chatInput.value.trim();
      if (!query) return;

      appendChatMessage('GUEST', query, true);
      chatInput.value = '';

      // Simple simulated bot response tailored to Sindhu M
      setTimeout(() => {
        const lower = query.toLowerCase();
        let reply = "Thanks for your message! Explore my Projects and Skills sections, or reach out through the Contact section!";

        if (lower.includes('skill') || lower.includes('stack') || lower.includes('tech') || lower.includes('python') || lower.includes('java')) {
          reply = "Sindhu develops with Python, Java, HTML5, CSS3, JavaScript, and relational database concepts!";
        } else if (lower.includes('project') || lower.includes('build') || lower.includes('work') || lower.includes('app')) {
          reply = "Sindhu builds practical applications with Python, Java, and interactive web technologies, focusing on clean code and user experience.";
        } else if (lower.includes('interest') || lower.includes('learn') || lower.includes('hobby')) {
          reply = "Sindhu enjoys learning new technologies, experimenting with coding projects, and continuously improving problem-solving abilities!";
        } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
          reply = "Hello! Welcome to Sindhu M's portfolio. Feel free to ask anything about her skills, projects, or interests!";
        }

        appendChatMessage('BOT_SINDHU', reply, false);
      }, 500);
    });
  }
});
