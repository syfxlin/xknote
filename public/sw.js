/* eslint-disable no-undef */
importScripts(
  "https://cdn.jsdelivr.net/npm/workbox-cdn@4.3.1/workbox/workbox-sw.js"
);
workbox.setConfig({
  modulePathPrefix: "https://cdn.jsdelivr.net/npm/workbox-cdn@4.3.1/workbox/"
});

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

let cacheSuffixVersion = "-191120";
const maxEntries = 100;

workbox.routing.registerRoute(
  // Cache Image File
  /.*\.(?:png|jpg|jpeg|svg|gif|webp)/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "img-cache" + cacheSuffixVersion,
    plugins: [
      // 使用 expiration 插件实现缓存条目数目和时间控制
      new workbox.expiration.Plugin({
        // 最大保存项目
        maxEntries,
        // 缓存 30 天
        maxAgeSeconds: 30 * 24 * 60 * 60
      }),
      // 使用 cacheableResponse 插件缓存状态码为 0 的请求
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

workbox.routing.registerRoute(
  // Cache CSS & JS files
  /.*\.(css|js)/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "static-assets-cache",
    plugins: [
      // 使用 expiration 插件实现缓存条目数目和时间控制
      new workbox.expiration.Plugin({
        // 最大保存项目
        maxEntries,
        // 缓存 30 天
        maxAgeSeconds: 30 * 24 * 60 * 60
      }),
      // 使用 cacheableResponse 插件缓存状态码为 0 的请求
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

workbox.routing.registerRoute(
  // Cache Fonts files
  /.*\.(woff|woff2)/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "static-assets-cache",
    plugins: [
      // 使用 expiration 插件实现缓存条目数目和时间控制
      new workbox.expiration.Plugin({
        // 最大保存项目
        maxEntries,
        // 缓存 30 天
        maxAgeSeconds: 30 * 24 * 60 * 60
      }),
      // 使用 cacheableResponse 插件缓存状态码为 0 的请求
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

workbox.routing.registerRoute(/.*\/api.*/i, workbox.strategies.networkOnly());

// 其他的默认规则
workbox.routing.setDefaultHandler(
  workbox.strategies.networkFirst({
    options: [
      {
        // 超过 3s 请求没有响应则 fallback 到 cache
        networkTimeoutSeconds: 3
      }
    ]
  })
);

//workbox.skipWaiting();
//workbox.clientsClaim();
