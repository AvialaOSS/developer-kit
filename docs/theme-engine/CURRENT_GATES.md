# 当前完成门槛（2026-09-24）

本页只整理仍影响下一步的已知缺口；历史迁移日志不是当前待办清单，直接Token引用数量也不是完成率。全组件迁移按用户后续授权属于本Goal。

## 等待产品决定

| 项目               | 已核对证据                                                                           | 等待决定                                                                                |
| ------------------ | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Card heading       | 用户确认新增可选Title行并保留title/description；Web已实现                            | Figma连接器缺少OPPO Sans 4.0 SemiBold，写入前字体加载失败，原文件未变；待字体可用后同步 |
| Upload图标         | 普通/大号图标直连基础文字色；大号尺寸固定16px、无组件绑定                            | 新增Upload组件Token保持外观，或改用Button图标规格                                       |
| Button destructive | 线上Button集合129:5仅8种Mode，无destructive，局部变量也没有相应路径；Web仍用旧错误色 | Ask待选择补齐Figma/组件Token、明确Web兼容例外，或审阅迁移后停用                         |

Upload与Button选项正在Ask面板中；不把未答选项视为授权，不提前改写Figma语义。Card产品决定已确认，剩余为字体环境阻碍。此表不是全部未验收属性的穷举。

## 已解除的缺口

- TimePicker可选秒列：showSeconds、seconds值模型、显示与轮列回调、秒列Token、Story及ThemeCat预览已实现；默认时分行为保留，真实交互仍待验收。

- Table间距：用户确认行列均为0，table/size/gap保留但当前不用；Web现有Flex默认间距与设计一致。

- Nested Segmentator选中阴影：Figma6变量、8变体已绑定，Engine修订14，Web16px且随效果轴，ThemeCat基础0.1.5。
- Select Tag多选：独立MultiSelect、ThemeCat预览、声明和属性文档已实现；交互验收仍待。
- ButtonGroup：公共入口、可选Caption说明槽、Card复用与ThemeCat预览已实现。
- Layout Helper/Group：用户明确为设计占位工具，12项Token保留、Web不适用。
- 近期输入组件禁用分层、ListItem两处分隔线、Alert链接模式、Avatar高度及Loading冗余属性：按各组件最新记录，不重复提出已解决的问题。

## 不能由非交互检查代替的门槛

- 用户暂缓Computer Use。ScrollPicker已有历史八模式/动态几何/真实滚轮证据，但之后的滚轮所有权、边界CSS和单位换算尚未真实设备回归；触摸仍未验收。
- 全组件各变体、状态、局部主题、旧覆盖、RTL/窄宽和实际消费者的交互/视觉检查仍按各迁移记录保留，不能以包安装通过统一销项。
- TestVar创建、回读、失败撤销已有证据；用户暂缓的更新后主动撤销未完成。
- ThemeCat基础升级审阅已有核心/界面代码和定向测试，浏览器操作不能由这些检查替代。

## 当前非交互产物证据

- 标准项目修订14：2008个Token，组件Token1720项；直接引用1546项仅作定位（包含可选表头图标）。
- 7项静态/运行时/包入口检查通过；Nested阴影八模式检查通过。
- 最新独立安装验收见package-verification-latest-20260924.json；覆盖实际tgz的ESM/CJS、SSR、属性文档和列明CSS，不证明浏览器行为。
- 该安装记录之后修复了字符串 Token 的 CSS 转义；源码15项与构建后6项检查通过，tokens已重建。此前tgz哈希不覆盖此修复，下一次最终打包须包含该改动。
- 上述重打包已完成：最新独立安装记录为package-verification-card-seconds-20260924.json，包含字符串修复、Card heading、TimePicker秒列及既有验收脚本范围；旧tgz记录仅作历史证据。
- ThemeCat网页和独立插件构建通过，基础0.1.5以新版本保存，未覆盖旧发布包。

当前证据不足以声明Goal完成；保留所有未验证边界。没有远端发布。

Card字体环境重新只读核对：Primary账号连接器仍返回8927个可用字体、OPPO匹配0项；loadFontAsync(OPPO Sans 4.0/SemiBold)明确报告family不存在。未修改Figma节点。复用带文本实例不能绕过字体加载规则；继续保留Web已完成/Figma未完成的区分。ThemeCat网页/插件在滚动结束兜底与无位移修复后重新构建通过；不代表浏览器滚动验证。

ScrollPicker结束处理再次补齐无位移边界（首项Home）：不再留下无法由事件解除的程序滚动标记。新增失败用例修复后通过，当前4项回调序列+8项SSR共12项。真实滚动/触摸仍未验收，独立安装记录尚未覆盖这批结束处理修改。

ScrollPicker及DatePicker/TimePicker时间轮列补齐程序滚动结束定时器：两项回调序列测试先复现缺少scrollend后不能继续提交用户选值，修复后与八项既有SSR检查共10项通过。模拟hooks/几何不等于真实动画或触摸验收；详见SCROLL_PICKER_MIGRATION.md。最新独立tgz记录早于此修复，下一次最终批次纳入。

最新批次独立安装验证见package-verification-runtime-profile-20260924.json：包含TableHead图标、ALD惰性初始化及共享Aviala字体单位配置；在全新目录从三个tgz安装80个依赖，确认Spiral三包不是工作区链接且不带TypeScript。扩展后的installed-package-check-20260924.mjs全部通过，覆盖ESM/CJS表头结构和rem/px配置及既有清单。该记录取代下方历史段落中“独立安装尚未包含”的时效描述，不扩展为浏览器或Figma验收。

ThemeCat字体单位差异已修复：新增无DOM依赖的avialaProjectCssOptions，静态生成、ALD运行时、ThemeCat iframe及CSS导出共用原Aviala约定（size/line-height下的px数值输出rem，其他单位保留）。通用projectCssVariables不自动套用此约定，也不修改标准项目。ThemeCat两项导出检查和tokens六项静态/运行时/纯ES声明检查通过；例如size-small=0.75rem、line-height-small=1rem，padding-small仍为6px。真实根字号变化的浏览器验收仍待恢复界面验证后执行。

后续补齐TableHead可选左右图标槽：定向测试、Docs类型检查、Spiral及ThemeCat构建通过；上述独立安装包早于此改动，最终打包时再纳入。未执行Computer Use验收。

ThemeCat预览已改用applyProjectTheme/removeProjectTheme，不再删除根元素的整个style。现有定向测试验证静态/运行时声明一致、保留外部属性与后续用户改动、恢复原important值；ThemeCat网页/插件构建通过。此为核心模拟样式对象测试，不等同iframe生命周期实测。主入口导入使网页主JS从2.71MB增至3.50MB（gzip513.67KB→619.10KB）；下一批需检查纯运行时入口/打包副作用，避免预览引入不需要的生成器数据。

上述体积回归已定位到ald-project的顶层parseProject及派生选项；改为首次ALD生成时惰性初始化并缓存，继续使用原公共入口及同一份样式归属存储。tokens构建及7项静态/运行时/包入口检查通过；ThemeCat重新构建主JS为2,810.82KB、gzip536.61KB（index-BTSIg-7P.js），相较回归版本减少689.54KB、gzip82.49KB，仍比未接入运行时API时略大。网页及插件构建通过，无Computer Use验证。独立tgz安装记录尚未包含这项变更，最终批次打包时纳入。
