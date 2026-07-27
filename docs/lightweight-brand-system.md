# 轻量品牌规范

## 原则

首页优先保持客户原站观感，同时用少量 CSS token 统一按钮、标题、强调色和字体角色。规范化只发生在 CSS 层，不新增字体、图片、脚本或运行时依赖。

## 色彩角色

- `--brand-cta`: 主 CTA 橙色，用于内容区主要按钮和橙色分隔线。
- `--brand-cta-bright`: Hero 首屏橙色按钮，保留原站更亮的橙色效果。
- `--brand-tech`: 科技青蓝色，用于普通强调、链接和默认按钮。
- `--brand-tech-bright`: Hero 中 `SOLUTION` 文字强调。
- `--brand-tech-line`: Hero 中 `SOLUTION` 外框线。
- `--brand-heading`: 白底区块主标题。
- `--brand-dark`: 深色视频或暗色背景上的黑色按钮。

## 按钮规则

- 内容区主按钮使用橙色 `--brand-cta`。
- Hero 的白色按钮和橙色按钮按原站保留。
- Summary 深色背景使用黑色按钮。
- 默认 `button-primary` 保持科技青蓝色，供非首页或通用组件使用。

## 字体规则

- 标题、导航、按钮使用 `--font-body`，即 Montserrat 优先。
- 原站风格正文段落使用 `--font-copy`，即 Helvetica Neue 优先。
- 不新增外部字体，避免增加首屏资源。
