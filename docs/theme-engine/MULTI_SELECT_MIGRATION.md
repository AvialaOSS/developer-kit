# MultiSelect / Select Tag 模式

2026-09-24 用户确认补齐多选 Tag 模式。新增公共 MultiSelect，原 Select 单选 API 保持兼容。

Figma SelectInput 275:4630 的 Tag 分支 input area 为水平不换行布局，gap 绑定 selectInput/size/tag-gap，regular/big 的上下留白分别绑定各自 slot-padding-y。内部 Tag 为 Text、LineHeightFix OFF、Normal，关闭图标开启。禁用外层内容55%，Tag实例仍100%；实现通过已有Tag内部normal透明度保留这一关系，不重复叠加Tag disabled透明度。

API：options（value/label/disabled）、value/defaultValue/onValueChange（字符串数组）、size、allRound、disabled、error、placeholder、name。受控值不会擅自移除未出现在options中的身份，重复值归一；禁用选项不能切换或删除。hidden input 按选值重复name，禁用时不参与表单提交。

交互：选择后菜单保持打开；Tag关闭可移除，关闭菜单时Backspace移除最后可移除值；方向键/Home/End导航，Enter/Space切换，文本输入定位，Escape交由Popover关闭并恢复焦点。选中项只增加主题高亮check。菜单通过共享Overlay容器保留局部主题；ThemeCat iframe预览显式把Portal挂到iframe body。

验证：2项SSR测试验证受控值优先、去重/未知值保留、表单值、无嵌套button及全部禁用移除按钮；Storybook类型检查通过。故事含普通、禁用、大尺寸全圆角、受控用例。真实键盘、焦点、滚动、窄屏与主题模式视觉验收按用户要求暂缓；SSR不能替代交互验收。

依赖现有 Select 的 input-effects.css 与 Tag 的 information-display-extras.css。未修改Tag或Select通用设计。

收尾：方向键改用共享 roving-focus 边界函数，ArrowUp 打开无选值菜单时从末项进入；非受控表单 reset 恢复 defaultValue，尊重被取消的 reset，不接管受控值。2项SSR与11项共享导航函数测试通过；实际表单重置、菜单焦点仍待交互验收。
