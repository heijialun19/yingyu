/* 小鸟英语乐园 Service Worker：离线可用 + 秒开
   缓存策略：
   - 页面导航：网络优先（在线永远拿到最新版页面，发版即生效；断网回退缓存）
   - 带版本号的静态资源：缓存优先（版本号变更即新 URL，天然绕开旧缓存）
   - 有道发音：边播边缓存（听过一次，离线还能再听） */
const CACHE = 'birdie-abc-v40';
const CORE = [
  './', './index.html', './letters.html', './words.html', './books.html',
  './grammar.html', './games.html', './parents.html', './disclaimer.html', './404.html',
  './css/style.css?v=28', './js/words-data.js?v=26', './js/data.js?v=26', './js/app.js?v=37', './js/sentence.js?v=39',
  './manifest.json', './icon.svg', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png', './og-cover.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
/* 收到新版本激活指令 */
self.addEventListener('message', e => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  /* 页面导航：网络优先，杜绝用户拿到旧页面 */
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match(e.request).then(hit => hit || caches.match('./index.html')))
    );
    return;
  }
  /* 同站静态资源：缓存优先 */
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => {
        // 脚本/样式离线缺失时返回 504——绝不能回退 index.html，
        // 否则浏览器会把 HTML 当 JS 解析，页面静默半死（不报错但全站失灵）
        if (e.request.destination === 'script' || e.request.destination === 'style') {
          return new Response('', { status: 504, statusText: 'offline' });
        }
        return caches.match('./index.html');
      }))
    );
    return;
  }
  /* 有道发音：边播边缓存 */
  if (url.hostname === 'dict.youdao.com') {
    e.respondWith(
      caches.open(CACHE).then(async c => {
        const hit = await c.match(e.request);
        const net = fetch(e.request).then(res => { if (res.ok) c.put(e.request, res.clone()); return res; }).catch(() => hit);
        return hit || net;
      })
    );
  }
});
