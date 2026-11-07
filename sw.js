/* 小鸟英语乐园 Service Worker：离线可用 + 秒开
   缓存策略：
   - 页面导航：网络优先（在线永远拿到最新版页面，发版即生效；断网回退缓存）
   - 带版本号的静态资源：缓存优先（版本号变更即新 URL，天然绕开旧缓存）
   - 本地离线音频 audio/：独立缓存 AUDIO_CACHE，**发版不清**
     （6.6MB 只下一次；重建音频时把 AUDIO_VER 与这里同时 +1）
   - 有道发音：原样转发 + 原样缓存。opaque 响应的 body 读不到、头也改不了，
     所以这里绝不读 body、绝不 new Response 重建（那样会全站失声） */
const CACHE = 'birdie-abc-v122';
const AUDIO_CACHE = 'birdie-audio-v2';   // 与 js/app.js 的 AUDIO_VER 同步
const CORE = [
  './', './index.html', './letters.html', './words.html', './getsmart.html', './pep.html',
  './grammar.html', './games.html', './parents.html', './disclaimer.html', './404.html',
  './css/style.css?v=48', './js/words-data.js?v=32', './svg/word-svg.js?v=3', './js/data.js?v=33', './js/app.js?v=65', './js/sentence.js?v=46', './js/speech.js?v=1', './js/grammar-engine.js?v=5', './js/ipa.js?v=2', './js/build-data.js?v=1', './js/getsmart-data.js?v=10', './js/pep-data.js?v=1', './js/pep-points.js?v=10',
  './manifest.json', './audio/manifest.json', './icon.svg?v=2', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png?v=2', './og-cover.png'
];
/* 启动最小集：只等这几个就激活接管，慢网下几秒内让缓存策略生效。
   原 addAll(CORE) 是原子的：32 个文件约 700KB 全下完才激活，跨境慢网要等几十秒；
   而且任一文件 404 就让整个 SW 装不上（曾因 CORE 里一个多余逗号全站失效）。
   其余资源在 activate 后逐个后台补，失败只跳过自己、不连累别人。 */
const BOOT = [
  './', './index.html', './css/style.css?v=48',
  './js/app.js?v=65', './js/data.js?v=33', './audio/manifest.json'
];
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(BOOT.map(u => c.add(u).catch(() => {})));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE && k !== AUDIO_CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
    /* 后台补齐，不 await：不拖慢激活。页面随后请求的静态资源本来也会被
       fetch 策略自动缓存，两道保险保证离线可用。 */
    const c = await caches.open(CACHE);
    CORE.filter(u => BOOT.indexOf(u) < 0).forEach(u => { c.add(u).catch(() => {}); });
  })());
});
/* 收到新版本激活指令 */
self.addEventListener('message', e => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  /* 坏缓存自愈判定：缓存里存过的 404/5xx 一律视为未命中（历史毒化自动修复） */
  const good = hit => !!hit && (hit.ok || hit.type === 'opaque');
  /* 页面导航：网络优先；只缓存成功响应——绝不再把 404/5xx 毒进缓存 */
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); }
        return res;
      }).catch(() => caches.match(e.request).then(hit => good(hit) ? hit : caches.match('./index.html')))
    );
    return;
  }
  /* 音频清单：网络优先、断网回退缓存。
     ★ 2026-11-07：补进 108 个例句用词的音频后，如果这里仍是「缓存优先」，
       老用户永远拿到旧清单 → 新词查不到本地文件 → 又绕回外网/断网没声。
       发版时不能改 AUDIO_VER（一改，已缓存的 2136 个 mp3 全部失效、要重下 32MB），
       所以让清单本身走网络，add 新文件即刻生效，旧音频缓存原样保留。 */
  if (url.origin === location.origin && /\/audio\/manifest\.json$/.test(url.pathname)) {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' }).then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); }
        return res;
      }).catch(() => caches.match(e.request).then(hit => hit || new Response('{"audio":[]}', { headers: { 'Content-Type': 'application/json' } })))
    );
    return;
  }
  /* 本地离线音频：单独一个缓存，发版不清理。
     词是固定的、文件是不可变的（改内容会变 AUDIO_VER 的查询串），
     所以缓存优先最省流量：听过一次之后永久零网络、离线可听。 */
  if (url.origin === location.origin && /\/audio\//.test(url.pathname)) {
    e.respondWith(
      caches.open(AUDIO_CACHE).then(c => c.match(e.request).then(hit => {
        if (good(hit)) return hit;
        return fetch(e.request).then(res => {
          if (res && res.ok) { const copy = res.clone(); c.put(e.request, copy).catch(() => {}); }
          return res;
        }).catch(() => new Response('', { status: 504, statusText: 'offline' }));
      })).catch(() => new Response('', { status: 504, statusText: 'offline' }))
    );
    return;
  }
  /* 版本探针：不进缓存，永远走网络。它是「有没有新版本」的唯一判据，
     一旦被 SW 缓存住就等于永远说"你是最新的」。 */
  if (url.origin === location.origin && /\/version\.json$/.test(url.pathname)) {
    e.respondWith(fetch(e.request, { cache: 'no-store' }).catch(() => new Response('{"build":""}', { headers: { 'Content-Type': 'application/json' } })));
    return;
  }
  /* 同站静态资源：缓存优先；缓存命中若是坏响应自动走网络自愈；只缓存成功响应 */
  if (url.origin === location.origin) {
    e.respondWith(
      caches.open(CACHE).then(c => c.match(e.request).then(hit => {
        if (good(hit)) return hit;
        return fetch(e.request).then(res => {
          if (res && res.ok) { const copy = res.clone(); c.put(e.request, copy).catch(() => {}); }
          return res;
        }).catch(() => {
          // 脚本/样式离线缺失时返回 504——绝不能回退 index.html，
          // 否则浏览器会把 HTML 当 JS 解析，页面静默半死（不报错但全站失灵）
          if (e.request.destination === 'script' || e.request.destination === 'style' || e.request.destination === 'audio') {
            return new Response('', { status: 504, statusText: 'offline' });
          }
          return caches.match('./index.html');
        });
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
    /* 只给「单词 / 两词短语」做缓存。三词以上的整句请求有道一律返回
       500 的 120 字节 JSON，但响应是 opaque、SW 分不出好坏——曾经把这条
       错误响应钉死在缓存里，同一句每次点都白等 24 秒。现在长句纯转发
       不入缓存，并顺手清掉历史遗留的坏条目（老用户自愈）。 */
    const phrase = decodeURIComponent(url.searchParams.get('audio') || '');
    const cacheable = phrase.trim().split(/\s+/).filter(Boolean).length <= 2;
    e.respondWith(
      caches.match(e.request).then(hit => {
        if (hit && cacheable) return hit;
        if (hit) caches.open(CACHE).then(c => c.delete(e.request)).catch(() => {});
        return fetch(e.request).then(res => {
          if (cacheable && res && (res.ok || res.type === 'opaque')) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
          }
          return res;
        }).catch(() => new Response('', { status: 504, statusText: 'offline' }));
      })
    );
  }
});
