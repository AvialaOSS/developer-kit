# Slider 迁移

只读定位 Information Collect / Slider 384:21585，核对八个可用性/尺寸/单值与范围变体。轨道高度 regular6/big10；滑块 regular14×14/big16×16；分别绑定 track radius、thumb radius。大尺寸进度条左右端另有 inner-radius，尚未迁移，不能简单继承轨道圆角。

首轮接入8项：两档轨道厚度、滑块宽高、轨道和滑块圆角。移除旧全局尺寸默认的遮挡；显式 slider-track-height/slider-thumb-size 等仍优先。竖向轨道厚度随同接入，滑块宽高保持物理轴定义。

ComponentGeometry浏览器验证：横向/纵向两档轨道厚度9/15，滑块20×24及26×30，轨道radius5、滑块radius7。旧覆盖轨道7、滑块18×18优先。CSS构建和Docs类型检查通过。

尚需：标记层尺寸/颜色、普通/禁用颜色、完整阴影绑定、进度条端点圆角、数值提示、八模式、拖拽/键盘/范围/RTL/表单及ColorPicker等消费者验收。Radix依赖版本未改动。

## 普通/禁用颜色、标记与阴影

只读确认1837:24532/24570/24530的标记层：regular8×8、big10×10，分别有width/height与thumb-mark/radius绑定，普通/禁用颜色独立。滑块两层阴影完整绑定各自color/radius/spread/offset-x/y。接入这些属性及8项普通/禁用颜色，目前31/34项直接消费；未接入gap及进度两类圆角，不代表组件完成。

独立项目4变体×8模式共32样式记录：亮暗轨道240/239/239→26、禁用249/248/248→18；进度/标记255/85/50→255/138/113，禁用255/198/182→136/60/52；滑块255→0。标记两档8/10不随密度变更。

发现两层阴影颜色在标准项目中均为literal黑色alpha0.08/0.18，因此OFF仍保留；已Ask选择共享效果引用/明确例外/Web单独控制，未擅改数据。

ComponentGeometry横纵覆盖验证标记6×10、radius2，阴影第一层3/4/5/2与alpha0.3；旧覆盖mark5×5、track100/60/40、shadow none均优先。CSS构建、Docs类型检查通过。范围/拖拽/RTL/表单/消费者等仍待验收。

## 进度端点和方向

接入剩余gap、progress radius及inner-radius，34项Token已有直接消费，但不等于完整验收。依据已读Figma：默认尺寸进度两端使用radius；big单值起点radius、滑块端inner-radius；big范围两端inner-radius。通过逻辑圆角与inverted属性支持横向RTL，纵向按取值起点翻转。

ProgressCorners浏览器32组合（横纵×LTR/RTL×正常/反向×单值/范围×两尺寸）核对圆角及进度实际insets。覆盖radius4/inner1：big横LTR默认为4/1/1/4，反向1/4/4/1，RTL交换；纵默认1/1/4/4、反向4/4/1/1；big范围全部1，默认尺寸全部4。八种big单值方向键：横向Right依方向从40→41/39；纵向Up正常41、反向39，RTL不改变纵轴。

CSS构建与Docs类型检查通过。效果OFF语义待Ask，拖拽、范围约束、表单、数值提示和ColorPicker/Video等消费者仍待验收。

## 范围与原生表单首轮

新增FormBehavior：单值step5、受控范围step5/minStepsBetweenThumbs2、禁用字段。浏览器单值40→45；范围下界连续右移停在50，上界60再左移仍保持50/60，确认最小10单位间隔。

发现禁用Slider隐藏输入仍出现在FormData。检查当前Radix BubbleInput源码，其禁用状态必须显式传入；现已从Root传递到每个Thumb的BubbleInput。复验提交仅volume40与interval[]20/60，locked不再提交，DOM确认其input.disabled=true。新增3项回归测试（单值/范围禁用与普通启用）全部通过；Docs类型检查通过。动态禁用/fieldset/reset、拖拽、提示和消费者仍需继续。

## 拖拽及格式化提示

FormBehavior浏览器实际拖拽：Volume40→80，提示内容80并显示；离开后关闭。范围20/60下界拖过上界后Radix交换端点为60/95，始终满足10间隔，格式化提示更新60%/95%。这验证的是当前允许交叉并排序的契约，不声称端点身份固定。松手后data-dragging清除。禁用字段拖拽仍为30，提交结果volume80、interval[]60/95，仍不包含禁用值。

## ColorPicker 复用首轮

OpenByDefault浏览器确认色相与透明度轨道仍16px，色相保留光谱渐变、透明度保留渐变+棋盘，range背景透明。色相ArrowRight 0→1、HEX FF0000→FF0400；透明度ArrowLeft100→99同步百分比输入。无控制台错误。此为当前主题基本复用验证，不覆盖ColorPicker全模式与全部交互。
