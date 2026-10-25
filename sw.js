/* 小鸟英语乐园 Service Worker：离线可用 + 秒开
   缓存策略：
   - 页面导航：网络优先（在线永远拿到最新版页面，发版即生效；断网回退缓存）
   - 带版本号的静态资源：缓存优先（版本号变更即新 URL，天然绕开旧缓存）
   - 有道发音：真正缓存 + 注入 CORS 头（Web Audio 归一化要能 fetch 到音频字节） */
const CACHE = 'birdie-abc-v44';
const CORE = [
  './', './index.html', './letters.html', './words.html', './books.html',
  './grammar.html', './games.html', './parents.html', './disclaimer.html', './404.html',
  './css/style.css?v=28', './js/words-data.js?v=26', './js/data.js?v=27', './js/app.js?v=39', './js/sentence.js?v=40',
  './manifest.json', './icon.svg?v=2', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png?v=2', './og-cover.png'
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
  /* 有道发音：缓存 + CORS 注入 + MP3 校验
     为什么重写：① 页面要用 Web Audio 做音量归一化，必须能 fetch 到音频字节，
     而有道不返回 Access-Control-Allow-Origin——由 SW 把响应包一层还回去；
     ② 旧代码在 no-cors 下拿到的是 opaque 响应（res.ok 恒为 false），
     "边播边缓存"从未真正生效，离线也听不了——现在按 URL 存真实 200 响应。
     注意：SW 内部一律用 no-cors 重新请求（cors 模式会被有道的 CORS 策略挡掉），
     opaque 响应看不到状态码，所以校验 body 确实是 MP3（帧同步/ID3）才缓存，
     错误页（500）不会被缓存、也不会喂给播放器。 */
  if (url.hostname === 'dict.youdao.com') {
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      const hit = await c.match(e.request);
      if (hit) {
        const h = new Headers();
        hit.headers.forEach((v, k) => h.set(k, v));
        h.set('Access-Control-Allow-Origin', '*');
        return new Response(hit.body, { status: hit.status, statusText: hit.statusText, headers: h });
      }
      let res = null;
      try { res = await fetch(new Request(e.request.url, { mode: 'no-cors' })); } catch (err) {}
      if (!res) return new Response('', { status: 504, statusText: 'offline' });
      let bytes = null;
      try { bytes = await res.arrayBuffer(); } catch (err) {}
      if (!bytes || !bytes.byteLength || !__isMp3(bytes)) {
        return new Response('', { status: 502, statusText: 'bad-audio' });   // 错误页/空响应：不缓存
      }
      const wrapped = new Response(bytes, {
        status: 200, statusText: 'OK',
        headers: { 'Content-Type': 'audio/mpeg', 'Access-Control-Allow-Origin': '*' }
      });
      try { await c.put(e.request, wrapped.clone()); } catch (err) {}
      return wrapped;
    })());
  }
});
/* MP3 校验：ID3 标签头或 MPEG 音频帧同步字（0xFFE_ mask） */
function __isMp3(b) {
  const u = new Uint8Array(b);
  if (u.length < 4) return false;
  if (u[0] === 0x49 && u[1] === 0x44 && u[2] === 0x33) return true;   // 'ID3'
  return u[0] === 0xFF && (u[1] & 0xE0) === 0xE0;                     // 帧同步
}
