/* Яндекс Метрика для сайта Mercura.
   1) Создайте счётчик на metrika.yandex.ru (см. ИНСТРУКЦИЯ.md, шаг 7).
   2) Впишите его номер вместо 0 в строке ниже и сохраните файл.
   Пока здесь 0, Метрика выключена и баннер про cookie не показывается. */
var YM_ID = 0;

(function () {
  if (!YM_ID) return;
  (function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
    m[i].l = 1 * new Date();
    k = e.createElement(t); a = e.getElementsByTagName(t)[0]; k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
  // webvisor выключен: Метрика не записывает, что люди вводят в форму
  ym(YM_ID, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false });
  window.__goal = function (name) { try { ym(YM_ID, 'reachGoal', name); } catch (e) {} };

  // короткое уведомление о cookie, один раз
  var KEY = 'mercura_cookie_ok';
  try { if (localStorage.getItem(KEY)) return; } catch (e) {}
  function show() {
    var b = document.createElement('div');
    b.setAttribute('role', 'region'); b.setAttribute('aria-label', 'Уведомление о cookie');
    b.style.cssText = 'position:fixed;left:16px;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:45;max-width:460px;' +
      'background:rgba(13,13,22,.96);color:#ecebf5;border:1px solid #23233a;border-radius:16px;padding:14px 16px;' +
      'font:14px/1.5 Manrope,system-ui,sans-serif;display:flex;gap:14px;align-items:center;box-shadow:0 20px 50px -20px #000';
    b.innerHTML = '<span style="flex:1">Сайт использует cookie и Яндекс Метрику для статистики посещений. ' +
      '<a href="privacy.html" style="color:#7ef9ff">Подробнее</a></span>' +
      '<button type="button" style="flex:none;border:0;border-radius:99px;padding:9px 16px;font:700 13px Manrope,sans-serif;cursor:pointer;' +
      'background:linear-gradient(100deg,#7ef9ff,#b48cff,#ff8ad8);color:#0a0a12">Понятно</button>';
    document.body.appendChild(b); document.body.classList.add('cookie-on');
    b.querySelector('button').onclick = function () {
      try { localStorage.setItem(KEY, '1'); } catch (e) {}
      b.remove(); document.body.classList.remove('cookie-on');
    };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show); else show();
})();
