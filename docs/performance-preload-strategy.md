# 首页关键资源预加载策略

## 目标

首页首屏需要优先还原客户原站视觉，同时避免 WordPress 时代的大量插件脚本、购物车脚本、视频和动态图阻塞首屏。

## 当前策略

- `index.html` 只预加载首屏必需资源：
  - `Montserrat` 主字体，减少标题和导航的字体闪动。
  - 首页抽象背景图 `/assets/007-abstract-swirl-h9lw4ldbk2-768x512.webp`。
  - 首页右侧主视觉图 `/assets/017-2-1024x615.webp`。
- 首页右侧主视觉 `<img>` 使用 `fetchPriority="high"` 和 `decoding="async"`。
- 首页视频保持 `preload="none"`，只在用户滚动到视频区域或手动播放时消耗更多带宽。
- `Summaries` 城市街景动效不参与首屏预加载，默认先显示压缩 WebP 静态帧，滚动接近该区块后再加载无声 MP4 动态层。
- 非首页路由使用 TanStack `lazyRouteComponent` 懒加载，避免首页一次性下载文章页、列表页、联系页、关于页代码。

## 不应加入首屏预加载的资源

- `summary-city-street.mp4`：只允许接近 `Summaries` 区块时延迟加载，不能加入首页 preload。
- `023-demo.mp4`：视频必须保持懒加载或用户触发加载。
- 文章图片、联系页地图、合作伙伴大图：不属于首页首屏。
- 后续新增页面 chunk：由 TanStack 路由按需加载。

## 修改入口

- CSS 入口：`src/styles.css`
- CSS 分层目录：`src/styles/`
- 路由懒加载：`src/router.jsx`
- 首页首屏图：`src/pages/home/HeroSection.jsx`
- Summary 动图懒加载逻辑：`src/hooks/usePageEffects.js`
