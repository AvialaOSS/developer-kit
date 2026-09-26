# Switch 组件 Token 迁移

状态：15/19 项组件 Token 已接入，尚未完成整体迁移验收。

## 设计来源

只读核对 Basic Input 页23:28 的 Switch集合141:251全部8个变体。regular=34×22、pointer18；small=34×20、pointer16；padding均2、radius99。四态根opacity均1。选中禁用262:3787/3793背景为主题次级颜色、没有高光、pointer opacity1；未选中禁用262:3796/3790仅pointer opacity=.55。选中启用高光paint opacity=.2、stops0/.36。

## 消费与兼容

四种轨道背景、pointer背景、pointer-disabled透明度、高光两端共8项；regular/small的padding-x/y与radius共6项；pointer radius1项。轴向padding分别用于轨道与滑块定位，保留现有可打断的inset动画。移除旧默认值对新Token的遮蔽；旧switch颜色与padding显式覆盖优先。显式switch-disabled-opacity作用于滑块，不再让轨道一起叠乘透明度。依赖旧checked-bg的共享CSS保留legacy默认回退。

## 验证

ComponentTokens共18个开关覆盖两种尺寸、启用/两种禁用、新旧覆盖。浏览器基线轨道34×22/20、radius99、padding2；禁用选中背景255/198/182且pointer opacity1；禁用未选中背景214/213/212且pointer opacity.55；根均1。新覆盖padding3px 4px、轨道radius7/pointer4、禁用背景30/80/130与180/190/200、pointer240/230/220及opacity.8均生效；旧padding1、轨道颜色90/40/80和130/140/150、pointer210/220/230及opacity.6均生效。禁用高光none。Token构建与五工作区类型检查通过。

## 待完成和决策

补充验证：启用开关点击关闭、Space重新开启通过，浏览器无错误；class/CSS与生产TSX颜色检查未新增异常。

- 两个gap Token 对单一绝对定位pointer没有实际布局作用，不伪造消费。
- 两个icon-height Token 未绑定当前Figma pointer，不能凭名称当作pointer尺寸。需核实来源。
- 轨道宽高、pointer大小、动画常量尚无完整组件Token。
- hover/active仍是旧语义颜色，已通过Ask询问补齐Token、兼容例外或移除变色。
- pointer阴影为Figma固定0 1px 2px 1px/alpha.06，未绑定效果变量；已Ask确认补齐受ON/OFF控制的Token还是明确例外，未擅自改写。
- 连续切换动画、模式切换中的hover语义、嵌入消费者回归待验收。

## 模式、方向和表单回归

ProjectModes使用真实标准项目，12个开关覆盖regular/small、开关状态、禁用及旧覆盖。界面切换Light/Dark × Default/Mobile Friendly × ON/OFF全部8种组合：选中启用背景255/85/50→255/138/113，选中禁用稳定值255/198/182→136/60/52，关闭禁用背景214/213/212→113/114/114；pointer白→黑，关闭禁用透明度.55、旧覆盖.7保持。高光ON alpha.2、OFF为0；固定pointer阴影仍alpha.06，不记作效果开关完整通过，等待已有Ask决策。模式切换含颜色过渡，瞬时读取可能拿到过渡中间色。

当前轨道宽高仍来自既有尺寸常量，两种密度均34×22/20；这不代表缺失的尺寸Token已完成。RTL正常镜像：regular关闭left14/right2、开启left2/right14，small对应16/2；RTL实际点击后停在正确开启端。

FormIntegration实际验证：必选开关关闭时浏览器阻止提交并显示约束提示；开启后可提交，受控开关Space触发状态更新；提交数据恰好为required=accepted、controlled=enabled，不包含已开启但disabled的项。UI类型检查通过。基础交互与表单通过不替代连续动画、触屏或全消费者验收。
