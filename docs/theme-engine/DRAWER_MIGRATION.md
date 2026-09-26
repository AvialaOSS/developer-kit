# Drawer Token 迁移

状态：首批容器与分区样式接入，未完成整组件验收。

Figma Section2051:26823：头部2053:29549，操作区2053:29550，正文变体2053:29353/2053:29355，View2057:29611，四方向Wrapper2057:29661、2067:1783、2058:29663、2067:1785。

已核对并接入：Wrapper背景及横纵留白（默认18），View gap/padding/radius/stroke及border色；头部gap、四向留白、info间距与背景；正文/操作区顶部描边厚度、颜色、背景、横纵留白。独立正文和操作区使用普通padding Token，View内对应实例2055:29580/2055:29587使用view/padding Token，CSS通过局部内部变量保留此区别。

四方向位置仍沿用原实现，但横纵边距独立消费；最大宽度默认根据横向边距计算，显式旧drawer-inset/content-max-width仍优先。迁移的旧默认别名移到_legacy，调用方显式设置旧变量继续生效。

待处理：头部内部结构、图标、文字、正文slot与操作slot/按钮组、root效果、动画/窄屏/Portal及主题模式与兼容验收。Wrapper gap只有单个View子项，当前未加多子项布局API。宽度310和上下抽屉最大高度400尚保留旧几何常量。

按用户要求，本批仅做CSS构建及UI样式拷贝，均通过；未运行浏览器模式矩阵，不将其记作已验收。

## 头部与文字批次

Figma2053:29453 info gap10，content2053:29456 gap4，headline2053:29457 gap4/padding10×0，文字组gap0；图标slot gap0/padding2×0，图标宽22/高22分别绑定icon-width和icon-container-height；按钮slot gap4/padding2×0。已补齐Web头部content/close-slot两层容器并接入上述变量，保留显式旧覆盖。

头部TEXT分别绑定drawerHeadArea/color/heading/text-default及description/text-default；正文Text变体两行分别绑定drawerContentArea/color/heading/text-default及body/text-default。已接入四项颜色并移除首个渲染行的强制semibold，字体指标由Typography负责。关闭按钮颜色、正文/操作slot、按钮组、效果和完整模式交互仍待处理。此批浏览器验收延期至阶段末。

正文/操作slot批次：默认正文新增body-slot，消费已读取2053:29354的gap10和padding10×10；Text模式不增加此插槽。操作区新增footer-slot，对应2053:29560的gap0/padding0，并包含Button Group及Button Slot两层，分别消费共享gap4/8。正文外层gap10和操作区外层gap10独立接入。新容器会改变调用方依赖直接子元素选择器或flex item的布局，需阶段检查自定义内容。类型检查及CSS构建通过，Drawer完整渲染矩阵尚未验收。
