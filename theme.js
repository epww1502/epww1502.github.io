// Light/dark toggle. Follows the device setting until the visitor picks one.
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;
  var svg = function (body) {
    return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  };
  var MOON = svg('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>');
  var SUN = svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>');
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  function current() {
    return root.dataset.theme || (media.matches ? 'dark' : 'light');
  }
  function render() {
    var dark = current() === 'dark';
    var tip = dark ? '라이트 모드' : '다크 모드';
    btn.innerHTML = dark ? SUN : MOON;
    btn.setAttribute('data-tip', tip);
    btn.setAttribute('aria-label', tip);
  }
  btn.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    render();
  });
  if (media.addEventListener) media.addEventListener('change', render);
  render();
})();
