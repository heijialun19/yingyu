/* 小鸟英语乐园 Service Worker：离线可用 + 秒开
   缓存策略：
   - 页面导航：网络优先（在线永远拿到最新版页面，发版即生效；断网回退缓存）
   - 带版本号的静态资源：缓存优先（版本号变更即新 URL，天然绕开旧缓存）
   - 本地离线音频 audio/：独立缓存 AUDIO_CACHE，**发版不清**
     （6.6MB 只下一次；重建音频时把 AUDIO_VER 与这里同时 +1）
   - 有道发音：原样转发 + 原样缓存。opaque 响应的 body 读不到、头也改不了，
     所以这里绝不读 body、绝不 new Response 重建（那样会全站失声） */
const CACHE = 'birdie-abc-v70';
const AUDIO_CACHE = 'birdie-audio-v1';   // 与 js/app.js 的 AUDIO_VER 同步
const CORE = [
  './', './index.html', './letters.html', './words.html', 
  './grammar.html', './games.html', './parents.html', './disclaimer.html', './404.html',
  './css/style.css?v=42', './js/words-data.js?v=31', './svg/word-svg.js?v=2', './js/data.js?v=32', './js/app.js?v=52', './js/sentence.js?v=43', './js/grammar-engine.js?v=4', './js/ipa.js?v=2', './js/build-data.js?v=1',
  './manifest.json', './icon.svg?v=2', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png?v=2', './og-cover.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== AUDIO_CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
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
  /* 本地离线音频：单独一个缓存，发版不清理。
     词是固定的、文件是不可变的（改内容会变 AUDIO_VER 的查询串），
     所以缓存优先最省流量：听过一次之后永久零网络、离线可听。 */
  if (url.origin === location.origin && /\/audio\//.test(url.pathname)) {
    e.respondWith(
      caches.open(AUDIO_CACHE).then(c => c.match(e.request).then(hit => {
        if (hit) return hit;
        return fetch(e.request).then(res => {
          if (res && res.ok) { const copy = res.clone(); c.put(e.request, copy).catch(() => {}); }
          return res;
        }).catch(() => new Response('', { status: 504, statusText: 'offline' }));
      })).catch(() => new Response('', { status: 504, statusText: 'offline' }))
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
        if (e.request.destination === 'script' || e.request.destination === 'style' || e.request.destination === 'audio') {
          return new Response('', { status: 504, statusText: 'offline' });
        }
        return caches.match('./index.html');
      }))
    );
    return;
  }
  /* 有道发音：原样转发 + 原样缓存
     ★ 血泪教训（2026-10-25 全站失声事故）：有道不返回 CORS 头，SW 里 fetch 到的是
     opaque 响应——body 读不到（arrayBuffer 直接抛错），响应头也改不了。
     所以这里绝不能"读字节"，也不能 new Response(bytes) 重建响应；
     只能原样返回、原样入缓存。
     opaque 的 res.ok 恒为 false，判断要不要缓存要看 res.type === 'opaque'。 */
  if (url.hostname === 'dict.youdao.com') {
    e.respondWith(
      caches.match(e.request).then(hit => {
        if (hit) return hit;
        return fetch(e.request).then(res => {
          if (res && (res.ok || res.type === 'opaque')) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
          }
          return res;
        }).catch(() => new Response('', { status: 504, statusText: 'offline' }));
      })
    );
  }
});
