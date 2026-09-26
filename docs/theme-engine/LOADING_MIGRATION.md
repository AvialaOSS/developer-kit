# Loading 组件 Token 迁移

2026-09-24 状态更新：用户已确认保持 Figma BiggerSize 设计现状，Web 不新增 BiggerSize 属性。下文历史待确认记录已由该决定解决。

2026-09-23 用户确认：保持 Figma BiggerSize 设计现状，Web 暂不暴露 BiggerSize。该语义决定已完成，不再作为迁移阻碍；不推导额外尺寸或创建放大 Token。下文待决定表述为历史记录。

状态：31/31项组件Token已消费，八模式几何、渐变、新旧覆盖及按钮嵌入已验证；BiggerSize设计缺口待决定。静态盘点仅识别23项直接var引用，另8项渐变Token通过loadingRingStyle参数生成var表达式，已在浏览器核对，不能以静态计数替代此证据。

## 设计来源

只读检查 Response And Feedback 页157:784、Loading Icon集合157:1214。七档Level都有heightOnly、both和off；部分还有BiggerSize变体。已核对七档Theme/BiggerSize=NO的三种对齐结构，以及Text的BiggerSize=YES样本。Web现有boolean lineHeightFix对应heightOnly/off，尚未提供both或BiggerSize API。

图标尺寸绑定loadingIcon/size/{level}/icon-width，Display另有icon-height；外层heightOnly绑定container-height，both另绑定container-width。环形描边绑定loadingIcon/size/stroke-width。设计Text BiggerSize样本当前与NO都为14×14、外层高度18，不能仅凭名称推导放大系数。

## 本次实现

七档图标宽度、Display独立高度、七档对齐高度与描边共16项接入组件Token。私有变量承接默认图标尺寸，显式旧loading-icon-size仍覆盖宽高；旧loading-ring-stroke仍优先。全局固定描边默认移至legacy名称，避免覆盖组件Token。没有改动字体指标、旋转时长、颜色或组件结构。

## 验证

浏览器ModeMatrixLineHeightFix当前Mobile Friendly模式：display/headline1/headline2/title/subtitle/text/caption图标宽高分别38/30/26/22/20/18/16；容器高度44/34/30/26/26/24/20；描边2px。

GeometryOverrides中，新Token覆盖图标40×36、容器高48、描边3px均生效；旧覆盖图标28×28、关闭对齐后容器高28、描边4px均生效。Tokens构建及五工作区类型检查通过；类名检查仅原有5项非类名字串误报。

## 剩余验收

- BiggerSize实际无差异，已通过Ask询问处理方法，不能静默扩大。
- 旋转时长0.8s沿用现有实现，暂无组件Timing Token；白色遮罩是SVG亮度蒙版的实现常量，不是主题颜色。
- 当前源码导入盘点仅Button直接消费Loading，已覆盖；后续新增消费者需随各自组件验收。

## 独立渐变与双轴对齐

进一步只读检查Text四种颜色的真实strokes：Theme、Theme-Text、Black起止色均为不透明，White终点alpha为0，位置均0→1。因此不能统一以终点颜色推导透明起点。实现分别消费8项gradient Token；显式旧loading-fg覆盖通过私有自定义属性保留原有透明→指定前景色渐变。inherit保持currentColor行为。

lineHeightFix现在支持heightOnly/both/off，同时true仍为heightOnly、false/null为off。both消费七项container-width；LoadingAlignment类型由公共入口导出。

浏览器ComponentTokens验证七档×四种颜色：Mobile Friendly的both容器分别44×44、34×34、30×30、22×26、26×26、24×24、20×20。Title宽22高26来源于两个独立Token，未强行改成正方形。Light渐变分别为255/233/227→255/85/50、255/233/227→131/22/17、175/173/173→38/37/37、白色→254/252/252 alpha0。新起止色20/40/60→80/100/120独立覆盖生效；旧前景40/90/60仍为透明→该色。Tokens构建和五工作区类型检查通过。

## 八模式与按钮回归

新增ProjectModes独立ThemeProvider，覆盖7档×3种对齐×4种颜色=84个Loading及旧覆盖。八种颜色/密度/效果组合逐项断言图标宽高、容器宽高和渐变非空，共672个组合尺寸均符合预期。Default图标38/30/26/22/16/14/12，对齐高44/34/30/22/22/18/16；Mobile Friendly数据同上。旧覆盖19×19、描边3px在八模式不变。

Dark的Theme渐变93/34/31→255/138/113，ThemeText同起点→255/222/214，Black为68/68/68→213/213/213，White为黑色→254/252/252 alpha0。ON/OFF不改变Loading颜色或尺寸，未引入不存在的效果Token。

Default密度下四档Button切换加载前后高度均保持24/32/36/40；加载图标12/14/14/14。加载时disabled及aria-busy为true，结束后点击计数由1增加到2。文字按钮添加加载图标会增加宽度，保持既有布局行为。旋转动画读取为running、0.8s，两次观测transform不同；浏览器无错误，故事UI类型检查通过。

进一步只读比较全部56对BiggerSize YES/NO：递归尺寸、变量绑定、fills、strokes、strokeWeight、padding和显式模式全部相同。已向用户询问保持现状、补充放大Token或移除冗余设计属性；尚无决定，不新增猜测行为。
