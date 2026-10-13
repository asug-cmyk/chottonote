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

// A8.net リンクマネージャー（アフィリエイトリンクの自動置換タグ）。
// 全ページ共通の静的HTMLが無いため、全ページで読み込まれるこのファイルから注入している
// （header.js 自体はナビ用だが、サイト全体で唯一の共通読み込みファイルのため、ここに同居させた）。
(function () {
  var s1 = document.createElement('script');
  s1.src = '//statics.8me.jp/a8link/a8linkmgr.js';
  document.head.appendChild(s1);
  s1.onload = function () {
    if (typeof window.a8linkmgr === 'function') {
      window.a8linkmgr({ config_id: 'Xq3PzSru9UG7RXE5K0j8' });
    }
  };
})();
