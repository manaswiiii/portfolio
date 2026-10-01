// Theme toggle: flips between light and dark and remembers the choice.
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

// Keep the footer year current.
document.getElementById('year').textContent = new Date().getFullYear();
