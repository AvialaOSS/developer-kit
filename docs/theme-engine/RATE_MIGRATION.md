# Rate / RateIcon

2026-09-23：新增 Spiral Rate、RateIcon 公共组件与 Storybook 示例，消费现有组件颜色、尺寸、遮罩、间距与禁用透明度 Token。Rate 容器垂直 padding 3px 来自 Figma 布局；字号等指标保持共享基础引用。

来源：Components / Information Collect，Rate `516:55613`，Rateicon `518:55703`。Like 使用 CommunicateLike，Star 使用 SymbolStar，均为 fill 图形，前后两层叠加遮罩。Star 保留现有 Figma 遮罩几何。

经用户授权，已修改原 Figma Like 的 9 个变体：Empty 遮罩透明、Half 遮罩为图标半宽、Fill 遮罩为图标全宽；均从 (0,0) 覆盖完整图标高度。同步修改 18 个尺寸变量，并让 Half selected-default 引用与 Fill 相同的主题选中色，保留变量身份及绑定。

Web 支持受控/非受控值、整数/半分、再次点击清空、键盘方向键与 Home/End、禁用/只读、隐藏表单字段。

遵循用户要求，本轮不进行 Computer Use 或浏览器视觉测试；Figma 返回的变体尺寸、绑定和变量值已核对。视觉表现与真实键盘交互仍待后续人工验收。
