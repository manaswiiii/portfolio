// Theme toggle: flips between graph paper (light) and blueprint (dark) and remembers the choice.
(function () {
  var root = document.documentElement;
  var btn = document.querySelector('.theme-toggle');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function currentTheme() {
    return root.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light');
  }

  function updateLabel() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    btn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
  }

  btn.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    updateLabel();
  });

  systemDark.addEventListener('change', updateLabel);
  updateLabel();
})();

// Mobile menu: open/close the nav list on small screens.
(function () {
  var toggle = document.querySelector('.menu-toggle');
  var links = document.getElementById('nav-links');

  function setOpen(open) {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Close after picking a section, or on Escape.
  links.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
})();

// Skills: turn each item into a colored, slightly tilted, draggable sticker.
(function () {
  var colors = ['s-yellow', 's-lime', 's-pink', 's-purple', 's-blue', 's-white'];
  var tilts = [-4, 3, -2, 5, -5, 2, 4, -3];
  document.querySelectorAll('.stickers li').forEach(function (li, i) {
    li.classList.add('sticker', colors[i % colors.length]);
    li.style.setProperty('--r', tilts[i % tilts.length] + 'deg');
    li.setAttribute('data-drag', '');
  });
})();

// Dragging: any [data-drag] element can be moved around with mouse or touch.
(function () {
  var active = null;
  var startX = 0, startY = 0, baseX = 0, baseY = 0;
  var z = 10;

  function px(el, name) {
    return parseFloat(el.style.getPropertyValue(name)) || 0;
  }

  document.addEventListener('pointerdown', function (e) {
    var el = e.target.closest('[data-drag]');
    if (!el || e.button > 0) return;
    active = el;
    startX = e.clientX;
    startY = e.clientY;
    baseX = px(el, '--dx');
    baseY = px(el, '--dy');
    el.classList.add('dragging');
    el.style.zIndex = String(++z);
    el.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  document.addEventListener('pointermove', function (e) {
    if (!active) return;
    active.style.setProperty('--dx', baseX + (e.clientX - startX) + 'px');
    active.style.setProperty('--dy', baseY + (e.clientY - startY) + 'px');
  });

  function stop() {
    if (!active) return;
    active.classList.remove('dragging');
    active = null;
  }
  document.addEventListener('pointerup', stop);
  document.addEventListener('pointercancel', stop);

  // "tidy up" puts every sticker back where it started.
  var tidy = document.querySelector('.tidy-btn');
  if (tidy) {
    tidy.addEventListener('click', function () {
      document.querySelectorAll('[data-drag]').forEach(function (el) {
        el.style.removeProperty('--dx');
        el.style.removeProperty('--dy');
      });
    });
  }
})();

// Scroll-in effects: highlighter marks draw in and the stamp thunks down.
// Content is always visible; this only replays a small animation when it appears.
(function () {
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('mark.hl, .stamp').forEach(function (el) { io.observe(el); });
})();

// Keep the footer year current.
document.getElementById('year').textContent = new Date().getFullYear();
