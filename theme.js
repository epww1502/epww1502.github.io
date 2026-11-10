// Light/dark toggle. Follows the device setting until the visitor picks one.
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  function current() {
    return root.dataset.theme || (media.matches ? 'dark' : 'light');
  }
  function render() {
    btn.textContent = current() === 'dark' ? '라이트 모드' : '다크 모드';
  }
  btn.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    render();
  });
  media.addEventListener && media.addEventListener('change', render);
  render();
})();
