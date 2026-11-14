/* 小鸟英语乐园 Service Worker：离线可用 + 秒开
   缓存策略：
   - 页面导航：网络优先（在线永远拿到最新版页面，发版即生效；断网回退缓存）
   - 带版本号的静态资源：缓存优先（版本号变更即新 URL，天然绕开旧缓存）
   - 本地离线音频 audio/：独立缓存 AUDIO_CACHE，**正常发版不清**
     （听过一次就永久零网络；重建音频时换一个缓存名，activate 里删掉旧的那个）
   - 外站请求：v8 起站内不再有任何第三方发音请求，这里也就不再为它留分支。
     历史遗留的 opaque 缓存会在 activate 时随旧缓存一起清掉。 */
const CACHE = 'birdie-abc-v200';
const AUDIO_CACHE = 'birdie-audio-v5';   // 每次重做音频换新名，旧的在 activate 里删掉
/* 三个 async 图库都不进 BOOT（会拖慢激活），但都列进 CORE 后台补齐：
   emoji-core.js 给轻页面，emoji-svg.js 是 7 个重页面唯一图库（由 app.js
   动态注入，不在 HTML 里静态引用），emoji-svg2.js 只给 getsmart/pep。
   2026-11-13.5：装好 PWA 却只打开过首页就断网时，重页面词图与图标
   不该退化成系统字体黑白剪影 —— 全量库漏在 CORE 之外就是这个原因。 */
const CORE = [
  './', './index.html', './letters.html', './words.html', './getsmart.html', './pep.html',
  './grammar.html', './games.html', './parents.html', './disclaimer.html', './404.html',
  './css/style.css?v=53', './js/words-data.js?v=46', './svg/word-svg.js?v=7', './js/data.js?v=45', './js/app.js?v=141', './js/sentence.js?v=51', './js/speech.js?v=1', './js/grammar-engine.js?v=9', './js/ipa.js?v=9', './js/ipa-gs.js?v=2', './js/build-data.js?v=3', './js/getsmart-data.js?v=16', './js/pep-data.js?v=2', './js/pep-lessons.js?v=2', './js/pep-mem.js?v=5', './js/pep-points.js?v=24', './svg/emoji-core.js?v=3', './svg/emoji-svg.js?v=6', './svg/emoji-svg2.js?v=3',
  './manifest.json', './js/audio-list.js?v=7', './favicon.ico', './icon.svg?v=2', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png?v=2', './og-cover.png'
];
/* 启动最小集：只等这几个就激活接管，慢网下几秒内让缓存策略生效。
   原 addAll(CORE) 是原子的：32 个文件约 700KB 全下完才激活，跨境慢网要等几十秒；
   而且任一文件 404 就让整个 SW 装不上（曾因 CORE 里一个多余逗号全站失效）。
   其余资源在 activate 后逐个后台补，失败只跳过自己、不连累别人。 */
const BOOT = [
  './', './index.html', './css/style.css?v=53',
  './js/app.js?v=141', './js/data.js?v=45'
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
    const nc = await caches.open(CACHE);
    /* ★ 2026-11-07 白屏事故：发版把旧缓存整个删掉，新缓存只预装了 BOOT 6 个文件，
       老用户刷新时 26 个静态资源 + 2 个大图库要全部重下（原始约 2.5MB）。
       带 ?v= 的 URL 内容不可变，旧缓存里的字节就是新版本要用的字节，
       所以先把旧版本缓存搬过来、再删——发版不再等于「清空重下」。 */
    for (const k of keys) {
      if (k === CACHE || k === AUDIO_CACHE || !/^birdie-abc-v/.test(k)) continue;
      try {
        const oc = await caches.open(k);
        const reqs = await oc.keys();
        await Promise.all(reqs.map(async req => {
          const u = new URL(req.url);
          if (u.origin !== location.origin) return;        // 外站响应不迁
          if (/\.html?$|\/$/.test(u.pathname)) return;      // 导航页用新版本
          if (await nc.match(req)) return;                  // 已有不覆盖
          const res = await oc.match(req);
          if (res && (res.ok || res.type === 'opaque')) await nc.put(req, res).catch(() => {});
        }));
      } catch (err) {}
      await caches.delete(k).catch(() => {});
    }
    await Promise.all(keys.filter(k => k !== CACHE && k !== AUDIO_CACHE && !/^birdie-abc-v/.test(k))
      .map(k => caches.delete(k).catch(() => {})));
    /* ★ 2026-11-09：单词音频 V3 重烘（改合成参数、不换声线），旧缓存的条目再也用不到。
       只换 AUDIO_CACHE 名字会留下上一代整包 30MB 白占空间，这里主动删掉。 */
    await Promise.all(keys.filter(k => /^birdie-audio-/.test(k) && k !== AUDIO_CACHE)
      .map(k => caches.delete(k).catch(() => {})));
    await self.clients.claim();      // 先接管：页面立刻能用上搬过来的缓存
    /* 后台补齐只补真正缺的（版本号变了的），低并发 + 宽限期，
       绝不和首屏的同步脚本抢浏览器仅有的 6 个连接。
       ★ 2026-11-08 晚：窄带（2g/3g/省流量）下**整批跳过**。CORE 有 30+ 个文件
         约 700KB，逐个后台下在 20KB/s 的链路上就是和首屏抢带宽，用户看到的
         就是「页面半天转圈」。缺什么以后用到时由 fetch 分支按需入缓存。 */
    const conn = self.navigator && self.navigator.connection;
    const slow = !!(conn && (conn.saveData || /^(slow-)?2g|3g$/.test(conn.effectiveType || '')));
    await new Promise(r => setTimeout(r, 1200));
    const c = await caches.open(CACHE);
    const todo = [];
    for (const u of CORE) { if (!(await c.match(u))) todo.push(u); }
    /* ★ 2026-11-12.3：pep-lessons.js / pep-mem.js 是这次新增的文件，
       activate 的「旧缓存搬迁」对它们无效（上一代缓存里根本没有）。
       老用户升级后若马上打开课本页，缺数据会静默没讲解/没记忆法。
       把它们排到后台补齐队列最前面，先补完再补其余 CORE。 */
    const pri = u => /pep-lessons|pep-mem/.test(u) ? 0 : 1;
    todo.sort((a, b) => pri(a) - pri(b));
    for (let i = 0; i < todo.length && !slow; i += 2) {
      await Promise.all(todo.slice(i, i + 2).map(u => c.add(u).catch(() => {})));
    }
  })());
});
/* 指令：SKIP_WAITING = 旧版兼容；FORCE_REFRESH = 当前页「下一次导航」强制回源。
   ★ 2026-11-13 更新条死循环：点刷新若只做 location.reload()，导航是
     stale-while-revalidate，reload 拿到的还是缓存里的旧 HTML，旧 HTML 还引用旧 ?v=
     的脚本 → BUILD 追不上 version.json → 4 秒后又弹更新条。
   ★ 刻意「一个字节缓存都不删」：11-07 整页白底黑字就是清空旧缓存造成的。
     这里只在内存里给当前 pathname 记一次性标记，下一次导航跳过缓存直接走网络；
     网络失败时下面的 same / home 缓存兜底全部还在，弱网也不会白屏。
     SW 若在点击与 reload 之间被回收，标记自然消失 —— 最坏只是回到旧行为，
     而 app.js 的 sessionStorage 幂等仍会挡住反复弹条。 */
const forceNav = new Set();
self.addEventListener('message', e => {
  const d = e.data;
  if (d === 'SKIP_WAITING') { self.skipWaiting(); return; }
  if (!d || d.t !== 'FORCE_REFRESH') return;
  try {
    const u = new URL(d.url || (e.source && e.source.url) || self.location.href);
    forceNav.add(u.pathname);
    setTimeout(() => forceNav.delete(u.pathname), 30000);
  } catch (err) {}
  if (e.ports && e.ports[0]) { try { e.ports[0].postMessage('ok'); } catch (err) {} }
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  /* 坏缓存自愈判定：缓存里存过的 404/5xx 一律视为未命中（历史毒化自动修复） */
  const good = hit => !!hit && (hit.ok || hit.type === 'opaque');
  /* 页面导航：缓存优先 + 后台更新（stale-while-revalidate）。
     ★ 2026-11-08 晚：原来是「网络优先」——在线时每次打开都要等 GitHub Pages 的
       响应头，跨境窄带（实测 13~21KB/s）下浏览器就停在「服务器正在响应，请稍候」
       转十几秒，而且**每次**都这样，缓存帮不上忙。
       现在有缓存立刻回页面（老用户秒开），网络请求在后台刷新缓存；
       发新版本由 version.json 的更新条提示用户点刷新。
     ★ 绝不在 controllerchange 里 location.reload()：那是「一加载就弹回上一级」的老 bug。
     ★ 仍然只缓存成功响应——绝不再把 404/5xx 毒进缓存。 */
  if (e.request.mode === 'navigate') {
    /* 点过「有新版本」后的这一次导航强制回源：缓存里的旧 HTML 引用旧 ?v=，
       不绕开它就永远追不上新 BUILD。缓存条目本身一个都不删（离线兜底留着）。 */
    const force = forceNav.has(url.pathname);
    if (force) forceNav.delete(url.pathname);
    const cacheP = caches.open(CACHE);
    const netP = fetch(e.request).then(res => {
      if (res && res.ok) {
        const copy = res.clone();
        cacheP.then(c => c.put(e.request, copy)).catch(() => {});
      }
      return res;
    }).catch(() => null);
    e.waitUntil(netP.then(() => {}).catch(() => {}));   // 刷新缓存的请求要跑完
    e.respondWith((async () => {
      const c = await cacheP;
      const cached = force ? null : await c.match(e.request, { ignoreSearch: true });
      if (good(cached)) return cached;                  // 秒开，新版本靠更新条
      const res = await netP;
      if (res && res.ok) return res;
      /* 断网且没缓存：先找同页（忽略查询串，别把 ?flow=1 的深链变首页），
         实在没有才回首页；连首页都没有就明确报离线，不静默装作成功。 */
      const same = await c.match(e.request, { ignoreSearch: true });
      if (good(same)) return same;
      const home = await c.match('./index.html');
      if (good(home)) return home;
      return new Response('<!doctype html><meta charset="utf-8"><p style="font:16px/1.6 system-ui;padding:24px">暂时打不开，请检查网络后重试一下～</p>',
        { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    })());
    return;
  }
  /* 音频清单 audio/manifest.json 已废弃（2026-11-08）：清单改成
     js/audio-list.js 常量，跟其他带版本号的脚本一样走缓存优先，
     每翻一页不再多一次网络往返。下面两类请求照旧。 */
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
      caches.open(CACHE).then(c => c.match(e.request).then(async hit => {
        if (good(hit)) return hit;
        /* ★ 2026-11-11 整页黑白事故：样式/脚本 URL 带 ?v=，发版迁移或删旧缓存的
           窗口期里切导航容易恰好 miss。原来这时只要网络抖一下就直接返回
           504 空响应 —— 浏览器拿到 0 字节 CSS，整页退化成白底黑字。
           现在三级兜底，绝不轻易交白卷：
             ① 再试一次网络（单次抖动最常见）
             ② 找同路径任意 ?v= 的旧版本缓存（CSS/JS 向后兼容，远好过裸 HTML）
             ③ 真的什么都没有才 504；非脚本/样式资源才回首页 */
        const isAsset = e.request.destination === 'script' ||
                        e.request.destination === 'style' ||
                        e.request.destination === 'audio';
        const net = async () => {
          try {
            const res = await fetch(e.request.clone());
            if (res && res.ok) {
              const copy = res.clone(); c.put(e.request, copy).catch(() => {});
              return res;
            }
          } catch (err) {}
          return null;
        };
        let res = await net();
        if (!res) res = await net();
        if (res) return res;
        if (isAsset) {
          const older = (await c.matchAll(e.request, { ignoreSearch: true })).find(good);
          if (older) return older;
          return new Response('', { status: 504, statusText: 'offline' });
        }
        return caches.match('./index.html');
      }))
    );
    return;
  }
});
