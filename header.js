(function () {
  var header = document.querySelector('.site-header');
  var navToggle = header ? header.querySelector('.nav-toggle') : null;
  if (!header || !navToggle) return;

  var closeNav = function () {
    header.classList.remove('is-nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', function () {
    var isOpen = header.classList.toggle('is-nav-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  header.querySelectorAll('.header-right a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });
})();
