/* ============================================================
   小鸟英语乐园 · 壳内适配层（Shell Bridge）
   ------------------------------------------------------------
   存在意义：站点既要能当网页用，也要能原样装进 Android/iOS 壳里跑。
   两者的差别全部收在这一个文件里，用**运行时判定**分流：
     - 网页版：本文件只定义 window.Shell / __isNativeShell，其余一个分支都不进；
     - 壳内：补上 App 才需要的行为（禁 SW、真实文件导出、返回键、换屏归零）。

   ★ 为什么不做「构建时补丁」：
     补丁靠字符串锚点改站点文件，站点一改版锚点就失效，而且线上与壳里跑的是
     两份不同的代码，问题无法在浏览器里复现。运行时判定只有一份代码。

   ★ 判定方式：
     Capacitor 会在页面脚本之前注入 window.Capacitor。
     另留 ?shell=1 / ?shell=0 手动开关，方便在桌面浏览器里验证壳内分支
     （真机才能验的坑太多，能提前在浏览器里跑一遍是一条捷径）。
   ============================================================ */
(function () {
  'use strict';

  var cap = window.Capacitor;
  var byCap = !!(cap && (typeof cap.isNativePlatform === 'function'
    ? cap.isNativePlatform()
    : (cap.platform && cap.platform !== 'web')));
  var q = String(location.search || '');
  var forced = /[?&]shell=1\b/.test(q) ? true : (/[?&]shell=0\b/.test(q) ? false : null);
  var NATIVE = forced === null ? byCap : forced;

  window.__isNativeShell = NATIVE;
  try {
    document.documentElement.setAttribute('data-shell', NATIVE ? '1' : '0');
    if (NATIVE) document.documentElement.classList.add('shell');
  } catch (e) {}

  /* ---------------- 返回键钩子栈 ----------------
     页面把「当前这一屏该怎么退」注册进来，后注册的先执行（栈）。
     处理了返回 true，没处理返回 false，交给壳继续按
     「有历史 → history.back()；在首页 → 双击退出」处理。 */
  var backStack = [];
  function onBack(fn) {
    if (typeof fn !== 'function') return function () {};
    backStack.push(fn);
    return function () {
      var i = backStack.lastIndexOf(fn);
      if (i >= 0) backStack.splice(i, 1);
    };
  }
  function back() {
    for (var i = backStack.length - 1; i >= 0; i--) {
      try { if (backStack[i]() === true) return true; } catch (e) {}
    }
    return false;
  }

  /* ---------------- 文件名安全化 ----------------
     Android 的 / 和 \0 会让写文件直接失败；中文名本身没问题，
     但要把路径分隔符与保留字符换掉，避免孩子把档案名写成「A/B」。 */
  function safeName(s) {
    return String(s == null ? '' : s)
      .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_')
      .replace(/^\.+/, '')
      .slice(0, 60) || '小朋友';
  }

  function toast(msg) {
    try { if (typeof window.toast === 'function') { window.toast(msg); return; } } catch (e) {}
  }

  /* UTF-8 → base64（分块，避免大文件时 apply 参数过多爆栈） */
  function toB64(text) {
    var bytes = new TextEncoder().encode(String(text));
    var bin = '';
    var CH = 0x8000;
    for (var i = 0; i < bytes.length; i += CH) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
    }
    return btoa(bin);
  }

  /* ---------------- 导出备份 ----------------
     网页：Blob + a[download]；
     壳内：WebView 不处理 blob 下载（点了提示已下载、实际什么都没有），
           改走 Capacitor Filesystem 真写文件。
     返回 Promise<{ok, where}>，调用方不用区分平台。 */
  function saveFile(filename, text, mime) {
    var name = safeName(filename);
    var Fs = NATIVE && cap && cap.Plugins && cap.Plugins.Filesystem;
    if (Fs && typeof Fs.writeFile === 'function') {
      var path = name + '.json';
      return Fs.writeFile({
        path: path,
        data: toB64(text),
        directory: 'DOCUMENTS',
        encoding: 'base64',
        recursive: true
      }).then(function (res) {
        var uri = (res && (res.uri || res.path)) || path;
        /* 只显示路径末两段，整条 content:// 太长会把 toast 撑爆 */
        var shown = String(uri).split('/').slice(-2).join('/');
        toast('📤 已保存到「文档」：' + shown);
        return { ok: true, where: uri };
      }).catch(function (err) {
        /* 不许静默失败：写不进去就明确告诉用户短码仍可用 */
        var msg = (err && (err.message || err.errorMessage)) || '未知错误';
        toast('⚠️ 文件没写成（' + String(msg).slice(0, 40) + '），请用上面的短码备份');
        return { ok: false, where: '', error: msg };
      });
    }
    /* 网页（或壳里没装 Filesystem 插件）：保持原样 */
    try {
      var blob = new Blob([text], { type: mime || 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = name + '.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { try { URL.revokeObjectURL(a.href); a.remove(); } catch (e) {} }, 4000);
      return Promise.resolve({ ok: true, where: 'download' });
    } catch (e) {
      return Promise.resolve({ ok: false, where: '', error: 'blob-download-unsupported' });
    }
  }

  /* ---------------- 换屏滚动归零 ----------------
     站点有五个页面（words / pep / getsmart / grammar / games）用 innerHTML
     整屏替换。网页里滚动位置是用户自己滚的，替换后停在原处还算合理；
     壳里换屏却应该从顶部开始，否则新屏一打开就在半截。
     ★ 只认「容器第一个元素变了」= 真的换屏；答题反馈、字母台摆块这类
       原位更新首元素不变，绝不误滚（这是这段代码唯一的难点）。 */
  var scrollReset = NATIVE;      // 网页端只做「不让人停在空白处」的兜底
  function afterScreenChange() {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        try {
          if (scrollReset) { window.scrollTo(0, 0); return; }
          var h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
          var max = Math.max(0, h - window.innerHeight);
          if (window.scrollY > max + 80) window.scrollTo(0, max);
        } catch (e) {}
      });
    });
  }
  function watchScreen(el) {
    if (!el || el.__shellWatched) return;
    el.__shellWatched = true;
    var last = el.firstElementChild;
    var mo = new MutationObserver(function () {
      var now = el.firstElementChild;
      if (now === last) return;       // 原位更新，不是换屏
      last = now;
      afterScreenChange();
    });
    mo.observe(el, { childList: true });
  }

  /* ============================================================
     以下只在壳内执行。网页版到这一行就结束，零副作用。
     ============================================================ */
  if (NATIVE) {
    /* ★ 最重要的一处：壳内必须彻底关掉 Service Worker。
       站点 sw.js 对未命中缓存的请求执行 fetch(e.request)，而 SW 的网络栈
       绕过 WebView 的本地资源拦截器，直连 https://localhost 这个不存在的
       服务器 → 504 空响应。表现是「第一个音频有声，之后全哑」，
       极容易被误判成音频文件缺失。
       注册是异步的：首屏还没被接管时正常，接管之后全哑 —— 所以必须
       ① 不注册；② 注销上一版 APK 留在同一 origin 上的旧 SW；③ 清缓存。 */
    try {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function (rs) {
          rs.forEach(function (r) { try { r.unregister(); } catch (e) {} });
        }).catch(function () {});
      }
      /* ?shell=1 只是浏览器里的调试开关，不要真去清用户缓存 */
      if (byCap && window.caches && caches.keys) {
        caches.keys().then(function (ks) {
          ks.forEach(function (k) { try { caches.delete(k); } catch (e) {} });
        }).catch(function () {});
      }
    } catch (e) {}

    /* 换屏归零：等 DOM 就绪后再挂观察器 */
    var hookScreens = function () {
      ['#app', '#phStage'].forEach(function (sel) {
        try { watchScreen(document.querySelector(sel)); } catch (e) {}
      });
      /* 兜底：没有 #app 的页面（index/letters/read/parents）如果将来也做
         整屏替换，观察 main 的首元素即可，同样不会误伤原位更新。 */
      var main = document.querySelector('main');
      if (main && !document.querySelector('#app')) watchScreen(main);
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', hookScreens);
    } else { hookScreens(); }
  }

  window.Shell = {
    isNative: NATIVE,
    /* 手动判定：某些页面在 DOMContentLoaded 之后才动态渲染容器 */
    watchScreen: watchScreen,
    resetScroll: function () { try { window.scrollTo(0, 0); } catch (e) {} },
    setScrollReset: function (on) { scrollReset = !!on; },
    onBack: onBack,
    back: back,
    saveFile: saveFile,
    safeName: safeName,
    toast: toast
  };
})();
