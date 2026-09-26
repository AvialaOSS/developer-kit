# Upload 迁移

只读核对Information Collect / Upload527:56239两个变体527:56238/527:56237。外层均无fill/effect，绑定upload/size/gap、padding-x/y（默认0）；内部实例Button521:57303默认regular primary，524:57345大尺寸big tertiaryCustom，内部Button拥有自己的padding/radius/颜色/阴影。Large图标16×16未绑定，Typeface文字需继续读取下层绑定。

首轮分离外层容器与交互表面，接入3项容器Token；保留原按钮ref、属性和交互处理。ContainerTokens浏览器验证默认容器padding0，覆盖容器padding9×17/gap5，内部普通6×10与Large8×14未被替换。新增容器下的按钮继续填满可用宽度。CSS构建和Docs类型检查通过。

待办：内部Button复用或精确Token消费、Upload文字颜色、图标绑定缺口、hover/active/drag与禁用、八模式、布局兼容和文件交互验证。未操作文件对话框。

## 内部尺寸与文字

只读补充Large文本节点I524:57345;380:21255;168:150;128:105与168:153;128:108，分别绑定upload/color/text/text-default与caption/text-default。接入两项文字Token，普通按钮文字保留primary/text-default，字号等共用Typography。内部普通/大尺寸padding、radius使用对应Button Token；默认背景按Figma primary/tertiaryCustom绑定。显式旧覆盖优先。

独立项目4变体×8模式浏览器验证：Default密度普通高30、大号50，Mobile Friendly高36/60；padding6×10与8×14。亮暗普通背景255/85/50→255/138/113、文字254/253/253→2；Large背景240/239/239→37，主文案38/37/37→213，说明97/96/96→142。主文案14/18→18/24，说明12/16→16/20。禁用opacity仍0.55，尚未按内部Button语义完成。CSS构建和Docs类型检查通过。

Upload heading/text-default暂未发现渲染分支，不强行套到当前textCaption主文案。按钮阴影、图标及Large hover/active/drag仍需继续。

## 按钮阴影与普通图标

只读核对521:57303的primary inner/outer与524:57345的tertiaryCustom inner阴影均绑定完整几何和颜色Token，现全部直接消费。保留upload-shadow/upload-large-shadow显式覆盖。普通图标宽高与槽高度采用Button regular Token，默认文字/图标opacity采用已读Button绑定。

八模式4变体浏览器验证普通glyph16→20、槽16×18→20×24，Large仍16×16；普通阴影ON内alpha0.08/外0.12、Large0.04，OFF全部alpha0。当前默认文字/图标透明度Token为1，禁用整体0.55仍是旧行为。CSS构建与Docs类型检查通过。

实际图标glyph S1普通绑定text/text-normal-text-white，Large绑定text/text-normal-text-black；没有对应组件级颜色绑定，Large尺寸也未绑定。已Ask补齐方案，未静默按近似名字替换。heading Token仍无对应显示分支。
