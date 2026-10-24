﻿/* 小鸟英语乐园 Service Worker：离线可用 + 秒开 */
const CACHE = 'birdie-abc-v28';
const CORE = [
  './', './index.html', './letters.html', './words.html', './books.html',
  './grammar.html', './games.html', './parents.html', './disclaimer.html',
  './css/style.css?v=25', './js/words-data.js?v=25', './js/data.js?v=25', './js/app.js?v=28', './js/sentence.js?v=27',
  './manifest.json', './icon.svg'
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
  // 同站资源：缓存优先（离线秒开）
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match('./index.html')))
    );
    return;
  }
  // 有道发音：边播边缓存（听过一次，离线还能再听）
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
