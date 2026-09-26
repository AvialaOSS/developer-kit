# @aviala-design/spiral

## 3.1.0

### Minor Changes

- 4f3c16d: Expose Figma secondary, tertiary and tertiaryCustom button modes with legacy aliases. Migrate their state backgrounds, foregrounds and inner shadows to component tokens while preserving explicit overrides and legacy Tab fallbacks.
- 4f3c16d: Expose ButtonGroup with an optional caption text slot and component tokens, and share its implementation with Card actions.
- 4f3c16d: Add an optional Title-level heading to CardHead and CardBottom while preserving existing supporting text and explicit color overrides.
- 4f3c16d: Add optional leading and trailing ColorPicker trigger icons backed by component tokens, and consume the component placeholder opacity.
- 4f3c16d: Expose PopoverIcon for optional content icons with appearance-specific component token colors and dimensions.
- 4f3c16d: Add token-driven Rate and RateIcon components with keyboard interaction, half steps and form support. Correct Like empty, half and filled masks alongside their Figma variants.
- 4f3c16d: Add a composable SelectSearch field with search-row tokens and keyboard handling that preserves focus while filtering.

  Prevent implicit form submission while Enter is pressed in the search field.

- 4f3c16d: Add MultiSelect with removable Tag values, multiple form fields, keyboard navigation and existing Select component tokens.
- 4f3c16d: Expose optional leading and trailing TableHead icon slots with component-level dimensions, color and spacing tokens.
- 4f3c16d: Connect ThemeProvider to canonical token projects with independent color, density and effects modes, scoped targets, and reversible style application. Resolve the project API from source in the development plugin.
- 4f3c16d: Add optional seconds to TimePicker, TimePickerField and TimePickerWheels using existing seconds-column tokens. Preserve two-column defaults and existing values when seconds are hidden.
- 4f3c16d: Align default Tooltip typography with Figma Text and add optional leading/trailing icons using component geometry and color tokens. Explicit caption typography remains supported.

### Patch Changes

- 4f3c16d: Connect Alert surfaces, status icons, text and layout to component tokens; fix title color selection without a description and for small alerts. Consume shared Link tokens for secondary actions while preserving explicit legacy Alert color overrides.

  Keep long quick and footer actions readable within narrow alerts without clipping the dismiss control.

- 4f3c16d: Consume Anchor component tokens for group spacing, indentation, padding, rail width/colors, content radius, text color and inactive opacity.

  Fix AnchorItem asChild composition and expose the activated location through aria-current without overriding explicit consumer semantics.

  Add optional descriptions using the shared caption typography and consume independent description-color and text-gap tokens. Apply inactive opacity once to the whole text block.

- 4f3c16d: Use separate Avatar component colors for text and icon content, and component tokens for radius and icon size, retaining explicit legacy color overrides.

  Connect level widths and available alignment-container heights to component tokens, and honor inherited legacy avatar-size overrides.

  Preserve the Avatar image sizing and cropping class when consumers supply imgProps.className.

- 4f3c16d: Migrate Badge caption/text foregrounds and independent icon colors to component tokens. Preserve explicit legacy foreground overrides and expose a dedicated icon foreground hook.

  Separate line-height alignment padding from the painted surface. Consume background and geometry tokens, including per-level icon dimensions and documented variant-specific radii and spacing. Retain legacy CSS override hooks.

- 4f3c16d: Input 几何属性接入 BaseInput Token，保留共享旧尺寸覆盖及未迁移消费者默认行为。
  背景、文字、图标、焦点描边及阴影色独立消费组件 Token。
  默认图标尺寸及插槽高度消费组件 Token，显式图标档位保持优先。
  修复嵌套独立主题切换密度时文字行高继承外层旧值的问题。
- 4f3c16d: Separate Breadcrumb content layers and consume per-size layout, text, icon and separator tokens while retaining explicit legacy overrides.
- 4f3c16d: Consume Button component tokens for normal padding, gap, default and rounded radius across all four sizes while retaining explicit legacy spacing overrides. Forward size and icon-only attributes through asChild so composed elements receive the requested dimensions.

  Render Button surface and content layers inside asChild elements while retaining their attributes, and avoid treating custom link components as icons.

  Use separate component opacity tokens for text, icons, and loading indicators instead of multiplying content opacity by whole-button disabled opacity.

  Consume primary background state, text, and icon component colors. Retain explicit legacy overrides and keep the original defaults for other components that share the former Button variables.

  Drive primary shadow geometry, shadow colors, and gradient endpoints from component tokens, preserving Figma paint opacity and stop positions and honoring the independent effects axis.

  Migrate outlined and backgroundless Button variants to separate component background, text, icon, stroke-state, and stroke-width tokens while preserving explicit legacy overrides.

  Consume normal icon width and slot-height component tokens, retaining explicit icon sizing props and legacy size overrides.

  Migrate primary icon-only padding and icon container geometry to component tokens, preserving explicit legacy height overrides.

  Apply verified icon-only component geometry to both backgroundless variants and add independent theme-axis regression examples.

- 4f3c16d: Use the shared full-round radius for tiny allRound buttons, matching the corrected Figma variable binding.
- 4f3c16d: Generate component-level CSS tokens from the current ThemeBuilder/Figma variable graph and migrate ScrollPicker to consume them with legacy override compatibility.
- 4f3c16d: Use component tokens for Card outer layout, body layout and text, and the independent head/body/bottom surfaces. Preserve explicit legacy overrides.

  Use independent Card title, description, icon and divider tokens. Icon containers follow density while typography metrics remain shared.

  Separate heading and action layout tokens, including custom trailing content, while retaining explicit legacy layout overrides.

  Add optional CardBottom title, description and icon slots backed by bottom-specific tokens. Accept ReactNode titles on both CardHead and CardBottom.

  Use Button Group layout tokens inside Card actions and honor supplied actions in select variants with the Figma ordering.

- 4f3c16d: Consume Cascader input spacing tokens for both sizes while retaining explicit legacy spacing overrides.

  Consume input shape, icon geometry and appearance tokens, and draw the active border outside without changing layout height.

  Resolve the error ring and component shadow in the local theme so effects OFF removes the decorative shadow.

  Consume Cascader menu, column and group surface and spacing tokens.

  Consume group divider color and independent horizontal, top and bottom spacing tokens.

  Consume menu item padding, shape, title and selection colors while preserving explicit legacy overrides.

  Consume menu icon geometry, function colors and badge padding; resolve shared typography in the local theme.

  Resolve selected item shadows through the local effects axis and exclude presentation titles from initial keyboard focus.

  Add CascaderSearch with component spacing and radius tokens and keyboard entry into filtered column results.

- 4f3c16d: Consume Checkbox size and radius tokens, CheckboxInput gap and icon height, and independent horizontal/vertical group spacing. Preserve explicit legacy overrides and defaults for other consumers.

  Consume state-specific Checkbox colors, highlight endpoints, shadow colors and disabled mark opacity. Preserve hidden disabled overlays and legacy shared defaults for other controls.

  Consume per-state padding and CheckboxInput text/caption colors and disabled text opacity; keep fixed marks independent of symmetric padding as in Figma.

- 4f3c16d: Add the optional ColorPickButton trailing icon with component token dimensions and color.
- 4f3c16d: Connect ColorPicker panel surface and root layout to component tokens while preserving explicit legacy overrides.

  Separate picking-area and palette padding, consume action-row and indicator tokens, and align hue/alpha track dimensions with the shared big Slider.

  Use ColorPickButton surface, padding and preview tokens with an inset border; preserve legacy size overrides and expose swatch names and selection state to assistive technology.

  Normalize preset colors before comparing selection so hexadecimal letter casing does not lose the selected state.

  Connect panel color and opacity fields to shared BaseInput layout and color tokens, including focus styling, while retaining Typography metrics and legacy overrides.

  Connect regular/big trigger layout, radii, text and surface states to independent ColorPickerInput tokens.

  Use the dedicated ColorPickerInput preview radius token for the trigger swatch.

  Paint the palette gradient across its full bounds, matching Figma's fill and absolute indicator layout; inherit palette radius and keep pointer coordinates aligned with the painted area.

  Keep ColorPicker portals and nested format menus in the picker's local CSS scope so ancestor token overrides remain live. Allow contained local scopes inside modal and fullscreen boundaries, while rejecting scopes outside the active boundary.

- 4f3c16d: Select Alert, Feedback and ListItem text tokens by stable Typeface line role so omitted titles do not change description styling.
- 4f3c16d: Keep DatePicker time display and wheels aligned with the selected Date unless a separate time value is configured.
- 4f3c16d: Give each date/time wheel instance unique option IDs so identically labelled wheels do not share active-descendant targets. Omit the active descendant when the controlled selection is absent from the available values.

  Announce only the active option as selected in looping ScrollPicker and date/time wheels while preserving visual selection on repeated rows.

- 4f3c16d: Connect DatePicker day cells to DateButton spacing, corner, state color, today marker and outside-month opacity tokens, preserving explicit legacy overrides and shared Typography metrics.

  Connect DatePicker input geometry, icon slots, corner radii, surface/text colors and open-state border to independent input tokens without changing TimePicker or the pending disabled-opacity policy.

  Connect calendar header and weekday tokens, separate list and grid spacing, and resolve derived panel heights in the calendar theme scope while retaining explicit legacy height overrides.

  Use DatePickerSelectMenu surface tokens and DatePickerList action insets, preserve SegmentatorGroup footer styling, and resolve wheel fades against the local calendar background.

  Connect the year/month container surface and independent column insets and separators to component tokens, keeping highlight and clipped text aligned with the scrolling content.

  Separate wheel row stride from the visible option height so year/month content gaps, item dimensions and vertical insets can follow tokens. Preserve fractional row measurements and realign committed values when row or viewport dimensions change.

  Use ScrollPickerItem selected colors for year/month wheels and derive their fades from the local year/month surface; preserve explicit legacy color overrides and the time wheel's legacy default.

  Migrate TimePicker's panel and shared hour/minute wheels to TimePickerSelectMenu, TimePickerTimepick, column and ScrollPickerItem tokens. Resolve wheel viewport and fade dimensions locally while preserving explicit legacy overrides. Input and effect migration remain pending.

  Connect TimePicker input size variants, rounded geometry, icon slots, foreground, surfaces and active inset border to independent TimePickerInput tokens. Keep the existing disabled-opacity policy pending confirmation.

  Move the legacy global placeholder opacity default behind a compatibility fallback so DatePicker/TimePicker placeholder tokens can take effect without changing existing Input, Cascader or ColorPicker defaults.

  Restore the Figma-bound bottom inner shadow on ScrollPicker and date/time wheel highlights using the shared effect-mode alias, with an explicit scroll-picker-item-shadow override.

- 4f3c16d: Connect Drawer wrapper insets and backdrop, view layout and border, and section padding, backgrounds and separators to component tokens. Preserve explicit legacy overrides and distinguish standalone section padding from Drawer View padding.

  Separate header content and close-button slots, consume independent icon and text tokens, and remove the first-body-line font-weight override so body-only text retains shared Typography metrics.

  Add the default body slot and action slot containers, including their independent padding and gaps; consume shared button-group spacing inside the action area.

- 4f3c16d: Connect Feedback layout to component tokens while preserving explicit legacy overrides. Keep title colors independent from optional descriptions and allow ReactNode titles.

  Use variant-specific Feedback surface, border, text and status icon tokens, including separate primary wrong icon colors by size.

  Align default status glyphs with the filled Figma icons, including the information glyph for normal feedback, while retaining custom icon overrides.

  Let primary dismiss icons follow the shared foreground token and explicit legacy color overrides through the nested Link icon.

  Allow long Feedback actions to wrap within available width instead of pushing the dismiss control outside the visible area.

- 4f3c16d: Connect FormField and Fieldset spacing, padding, and text colors to Form component tokens. Preserve Typeface line roles when earlier content is absent.
- 4f3c16d: Add Icon line-height alignment modes and a reusable IconFrame. Use square typography line boxes and equal default padding for icon-only buttons across all modes, preserving explicit legacy overrides.
- 4f3c16d: Add InputGroupItem and consume component tokens for horizontal group spacing, item spacing and addon color. Align addon typography with the shared text level.
- 4f3c16d: Resolve shared input hover backgrounds at the consuming element so nested themes use their local component token. Preserve explicit legacy hover overrides and fallback defaults.
- 4f3c16d: Match disabled Input content and typography opacity layers to Figma. Align Select menu shadow geometry and route Select, Switch, and Slider shadows through component tokens and the effects axis.
- 4f3c16d: Consume Link component tokens for level-specific geometry, state colors, separate icon/text colors, and disabled content opacity. Preserve explicit legacy foreground overrides.

  Render the same visual layers for asChild links and prevent disabled children from retaining navigation or click behavior.

- 4f3c16d: Fix Link text noBackgroundCustom backgrounds to share Button's semantic references for default, hover, and active states, matching the corrected Figma tokens.
- 4f3c16d: Align ListItem divider colors and square corners, neutral Alert links, and Avatar component height tokens with the confirmed Figma design.
- 4f3c16d: Connect List container and nested title layout to component tokens while preserving explicit legacy overrides. Support ReactNode section titles.

  Connect ListItem root, leading icon region, content and trailing action spacing to their distinct component tokens.

  Add inheritable default/deep appearance with per-item overrides and consume component background, text and description tokens.

  Consume distinct content divider thickness and trailing divider dimensions without conflating their color semantics.

  Use shared IconPlace layout and color tokens for shaped leading icons, preserving explicit legacy size and color overrides.

  Connect plain leading icons to shared title icon metrics and color. Add the distinct ListItem title container for its gap and radius tokens.

  Align action trailing structure with ButtonGroup spacing, use the no-background secondary action, and consume shared chevron metrics and color.

  Prevent nested control activation from also invoking a non-link ListItem row's click callback.

- 4f3c16d: Loading 的尺寸、对齐高度和环形描边接入组件 Token，保留旧尺寸覆盖入口。
  渐变分别使用起止色 Token，新增双轴对齐，保留布尔对齐 API 与旧颜色覆盖。
- 4f3c16d: Resolve Select, Cascader, and navigation menu hover backgrounds in the local theme scope while preserving explicit legacy overrides. Keep selected and unselected row interaction backgrounds identical.
- 4f3c16d: Connect Modal surface radius and border, header spacing, and section backgrounds, padding and separators to their component tokens. Preserve explicit legacy overrides and add a project-theme verification story.

  Use independent heading and body text color tokens. Let shared Typography control font metrics instead of forcing the first rendered body line to semibold, including body-only content.

  Separate header content, headline, icon frame and close-button slot containers to preserve independent Figma spacing and icon sizing tokens.

  Separate action-area, button-group and button-slot spacing instead of conflating their tokens.

- 4f3c16d: Connect horizontal and vertical Navigation spacing, padding, background and divider tokens, plus vertical brand layout, while preserving explicit legacy overrides.

  Connect horizontal brand, item and action layouts and vertical item, child and action layouts to independent component spacing tokens, retaining legacy item padding overrides.

  Use component tokens for vertical child-group spacing and indicator color and corner radius, preserving explicit legacy spacing and color overrides.

  Consume newly authored Navigation selected-state tokens for tertiary surfaces, text, leading icons and inset effects. Resolve indicator dimensions through CSS layout, including independent horizontal height and explicit legacy overrides.

  Connect brand title spacing, padding, corner radius and text color to component tokens while preserving explicit legacy brand color overrides.

  Connect flyout surface, single-group insets and item geometry/default text to Select component tokens without adding wrappers to the public menu structure.

  Use menu-specific icon sizes/colors and default text color in Navigation flyouts. Fix Select text incorrectly consuming the icon color token; text now inherits the row's text/state color.

- 4f3c16d: NumberInput 几何、颜色、图标与步进区域接入独立组件 Token，保留共享旧覆盖。
- 4f3c16d: Distinguish actual window blur from captured element blur, and allow explicit keyboard or pointer dismissal after refocusing an overlay.
- 4f3c16d: Connect Pagehead layout and text colors to component tokens while preserving explicit legacy Pagehead overrides and shared typography metrics.
- 4f3c16d: Use Pagination component tokens for container, controls, jump and page-size spacing and label colors, retaining explicit legacy spacing overrides.

  Align page buttons with tiled Segmentator tokens while retaining pagination semantics and explicit legacy selected-page overrides.

  Constrain pagination controls to the available width so overflowing page numbers scroll inside their group while navigation buttons remain accessible.

- 4f3c16d: Match DatePicker and TimePicker disabled opacity to their Figma field and text layers without fading the background.
- 4f3c16d: Preserve browser wheel ownership for zoom, horizontal gestures, empty or single-option pickers, and finite column boundaries. Allow native scroll chaining for finite picker columns.

  Normalize pixel, line and page wheel deltas against the current column geometry before consuming selection steps.

- 4f3c16d: Align Popover's tooltip appearance with Tooltip component tokens, including theme colors, shadows, pointer measurement and available-width constraints. Preserve explicit legacy overrides.

  Use Popover-specific background, foreground, radius and shadow tokens for default and primary appearances. Match Figma's two shadow layers for default and single layer for primary.

  Separate surface and content-slot spacing tokens. Explicit legacy padding overrides apply to the slot; flush clears both layers and now also works for tooltip appearance.

  Match Figma's 14×5 Popover pointer curve with runtime token sizing and borderless defaults. Explicit legacy border colors remain as outlines without occupying layout space.

  Constrain default and primary panels to the available width and wrap long paths on narrow screens.

- 4f3c16d: Connect Progress colors, bar geometry, ring container dimensions and default/fail ring paths to component tokens while retaining explicit legacy CSS overrides and their stroke scaling. Hide the ring indicator at zero to avoid a rounded-cap dot.

  Keep bar tracks visible beside long labels by truncating the label with a full-text title, and constrain bars to their parent width.

- 4f3c16d: 局部标准项目主题为弹出层提供默认挂载容器，保留全屏和显式弹层容器优先级。Select菜单表面与默认菜单文字接入组件Token，修复局部暗色项目下菜单仍使用外层亮色变量的问题。
- 4f3c16d: Consume Radio geometry and state padding tokens, separate normal/card input geometry, and use dedicated group spacing for direct card inputs. Preserve explicit legacy size and gap overrides.

  Migrate Radio state colors and input typography/card borders. Match Figma disabled states and visible unselected inner circles, and remove the default extra outer shadow while retaining legacy overrides.

  Derive RadioInput disabled styling from the actual Radix item state so group-level disabling also updates card borders, text and icon opacity, cursor, and interaction backgrounds.

- 57796e4: 本次正式版保留以下限制：Card 可选 heading 已在 Web 实现，但 Figma 标题层因缺少 OPPO Sans 4.0 SemiBold 尚未补齐；Upload 图标保留现有方案，尚未完整组件 Token 化；Button destructive 为 Web 兼容行为，没有对应的 Figma 变体。ScrollPicker 的最新滚轮边界行为及部分 Figma 回写仍待真实交互验收，本次构建与自动化测试不替代该验收。
- 4f3c16d: Apply component opacity tokens to separate disabled field and text layers in Cascader, ColorPicker and NumberInput.
- 4f3c16d: Consume Scroll component tokens for native scrollbar geometry and color, preserving explicit legacy overrides. Allow WebKit scrollbar sizing to take effect without standard thin styling overriding it.
- 4f3c16d: Derive ScrollPicker row and selection geometry from typography and component padding tokens while retaining explicit legacy height overrides.
- 4f3c16d: Keep looped ScrollPicker option IDs unique and point the active descendant at the selected middle-section option.

  Omit the active descendant when the controlled value has no matching option, including empty columns.

- 4f3c16d: Align Nested Segmentator selected shadows to Figma geometry and route their component tokens through the independent effects axis, retaining explicit legacy overrides.
- 4f3c16d: Consume canonical component tokens for Segmentator group tracks in nested and tiled modes, retaining legacy override hooks.
- 4f3c16d: Select 输入框两档间距、内边距、圆角和图标尺寸消费独立组件 Token，保留显式旧尺寸覆盖和图标档位。

  默认、展开与禁用背景以及文字、图标、展开描边和阴影接入独立Token。

  菜单分组及分割线接入独立Token，主菜单与子菜单按分组处理留白。

  Consume menu item geometry tokens while preserving explicit legacy spacing overrides.

  Consume title/caption colors and additional function area geometry and divider tokens.

  Use menu item icon size tokens and align people form-control row padding with Figma.

  Consume the checked-row background token and size default trailing function icons from component tokens.

  Consume function icon colors and badge outer spacing; size custom function icons from component tokens unless an icon level is explicit.

- 4f3c16d: Align Select disabled text layers with component opacity tokens and read the placeholder marker from the Radix trigger.
- 4f3c16d: Use indicator-only selection for Select and Cascader menu rows, sharing default, hover and active styles with unselected rows.
- 4f3c16d: Resolve Select menu typography in its local theme and use caption metrics for title rows while preserving explicit overrides.
- 4f3c16d: Keep submenu item labels registered while flyouts are closed and preserve keyboard focus during delayed dismissal.
- 4f3c16d: 修复共享输入消费者在局部 ThemeProvider 下继承外层已解析字号、行高和插槽高度的问题；保留显式 input-font-size、input-line-height 和 input-icon-slot-height 覆盖。
- 4f3c16d: Consume Slider track thickness, independent thumb dimensions and track/thumb radius tokens for both orientations while preserving explicit legacy size overrides.

  Consume normal/disabled Slider colors, independent mark geometry and both component shadow layers.

  Consume progress endpoint radii and gap, respecting range, orientation, RTL and inverted axes.

  Exclude disabled Slider values from native form submission by disabling each hidden input.

- 4f3c16d: Migrate Steps state colors and layout to component tokens, preserve explicit legacy overrides, and align the waiting glyph with Figma.
- 4f3c16d: Consume Switch component state colors, highlight endpoints, pointer opacity, radii, and per-size x/y padding. Match Figma disabled tracks and pointer-only dimming while preserving explicit legacy override hooks and existing motion.
- 4f3c16d: Consume independent root spacing, padding and background tokens for Default, Tiled and Card tabs while preserving explicit legacy overrides. Restore Card accessory-slot bottom padding.

  Consume per-style TabItem layout tokens and dedicated selected Card content padding, gap, radii and background. Separate default accessory-slot padding from the item's indicator space.

  Resolve indicator dimensions from CSS component tokens, center the token width, and retain the explicit legacy inset sizing mode.

  Consume selected Card icon width, container height and independent icon/text colors while preserving explicit legacy icon sizing overrides.

- 4f3c16d: Connect Table's surface, insets and border geometry to component tokens. Use independent TableHead and TableCell backgrounds and border widths/colors while retaining explicit legacy overrides and existing shared-edge behavior.

  Connect header, title and description colors and ordinary icon geometry/color to the corresponding content tokens. Keep shared Typography metrics and explicit legacy overrides; preserve the shaped icon-place treatment pending its separate migration.

  Separate cell content, headline, leading and action slots so outer and inner spacing tokens do not apply twice. Keep direct custom children and existing control props while preserving explicit legacy content-padding overrides.

  Align shaped icon places with the Figma theme/light, non-rounded IconPlace variant and consume its surface, geometry and icon tokens instead of the previous primary circular treatment.

  Match the default people avatar to the Figma Display/Icon variant and add a consolidated content-variant story for layout inspection.

- 4f3c16d: Connect Tag surface, border, gap and level-specific text/icon colors to component tokens, retaining explicit legacy overrides.

  Use component tokens for icon width, container height and close-button vertical padding, preserving explicit legacy slot-height overrides.

  Separate Tag alignment padding from its inner surface padding. Render the Figma outside stroke without adding layout height; root refs and attributes remain on the outer element.

  Apply normal/disabled opacity tokens to text and icons only, preserving the surface, border and people avatar as specified by Figma. Legacy tag-disabled-opacity now overrides content opacity.

- 4f3c16d: Textarea 外框、内容间距、图标及默认/焦点/禁用颜色消费独立组件 Token，保留旧样式覆盖，字体指标继续使用共享 Typography。

  底部控制区消费独立 Controller Token，文字预留空间随控制区高度变化，保留实时计数与拖拽。

- 4f3c16d: Align disabled Textarea with Figma's nested content and typography opacity tokens. Keep the counter and resize controller outside the faded content layer.
- 4f3c16d: Use component tokens for Tooltip surface, text, pointer color, padding, radius and both shadow layers while preserving explicit legacy CSS overrides.

  Measure token-driven pointer dimensions through the forwarded SVG ref so runtime theme changes update placement. Keep surface and pointer color overrides independent.

  Constrain long Tooltip content to the placement's available width and wrap unbroken paths on narrow screens.

- 4f3c16d: Align ResponsiveTooltip and the Popover tooltip appearance with Tooltip's shared Text typography default while preserving explicit Caption selection.
- 4f3c16d: Separate the Upload container from its interactive surface and consume container spacing tokens without replacing inner button padding.

  Consume internal Button geometry and default colors, plus independent Upload primary and caption text tokens.

  Consume internal Button shadow geometry/colors and regular icon geometry so local density and effects modes apply.

- 4f3c16d: Connect Video's surface and Default/Light control-bar geometry to component tokens. Map seek-slider dimensions, colors and shadows to Video tokens without changing volume-slider behavior, and preserve explicit legacy overrides. Existing glass treatment and unresolved state/effect-mode differences remain pending.

  Use PopoverSlot tokens for settings and volume content spacing, preserving explicit video spacing overrides.

  Remove duplicated horizontal padding around the speed-menu group and use SelectMenuItem title spacing tokens.

  Align speed-menu text and selection-marker tokens with Figma. Use a checkmark-only default selection without inherited generic selection shadows, preserving explicit overrides and shared typography metrics.

- 4f3c16d: Use the Video controls text token for settings labels and volume percentage.
- 4f3c16d: Schedule idle settlement for programmatic ScrollPicker and time-wheel scrolls so subsequent user scrolling can update the value even when native scrollend is not delivered.

  Avoid pending programmatic state after a ScrollPicker operation that does not move the scroll position.

- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
- Updated dependencies [4f3c16d]
  - @aviala-design/tokens@2.7.0
  - @aviala-design/icons@2.5.0

## 3.0.2

### Patch Changes

- 4ca65db: Publish a slim `component-catalog.json` export for consumer agents (import paths and ThemeProvider hints alongside existing `props.json`).
- 2e8bade: Aggregate all component effects and the ALD theme into `@aviala-design/spiral/styles.css`, and precompile residual Tailwind utilities at package build so consumers only need one CSS import (no Tailwind toolchain).
- Updated dependencies [2e8bade]
  - @aviala-design/tokens@2.6.2

## 3.0.1

### Patch Changes

- 4c0c986: Point package `repository.url` metadata at `AvialaOSS/developer-kit` (npm names unchanged).
- Updated dependencies [4c0c986]
  - @aviala-design/tokens@2.6.1
  - @aviala-design/icons@2.4.1

## 3.0.0

### Major Changes

- 96c12fc: Move `Form` and `FormField` to the `@aviala-design/spiral/form` subpath entry.

  The main entry no longer references `react-hook-form`, so consumers without that
  peer installed can import from `@aviala-design/spiral` again. `react-hook-form`
  stays on `>=7.50` and is now marked optional — it is only required by `/form`.

  Migration: `import { Form, FormField } from "@aviala-design/spiral/form";`

### Minor Changes

- 33fd505: Stop rendering placeholder copy when content props are missing.

  - `Typeface`: no fallback `Text` lines when no content is provided
  - `CascaderOptionsMenu`: new optional `groupTitle`; the hardcoded `Title` group header is gone
  - `Select` / `Cascader` items: `showBadge` without `badge` renders no Badge; `showMoreFunction` without `moreAction` renders no trailing slot
  - `CardHead` / `CardBottom` / `ListItem`: `actionLabel` no longer defaults to `Text`; the primary action button is omitted when neither `actionLabel` nor `action` is provided
  - `TableCell`: no placeholder Badge for `content="badge"`, and the `people` avatar falls back to a `users_user` icon instead of the letter `A`

- 9b803f1: Replace `role="application"` panels with real widget semantics and fill in the missing keyboard models.

  - `DatePickerCalendar` / `TimePickerPanel`: `role="application"` is gone (`role="group"` instead), and the day grid gains `role="row"` wrappers so its existing gridcell + arrow / Home / End / PageUp / PageDown model is exposed correctly
  - `SegmentatorGroup`: a true radiogroup — roving tabindex (only the checked item is a tab stop), arrow keys move and select along the group's axis (RTL mirrored), Home / End jump to the ends
  - `VideoSpeed`: listbox roving tabindex plus Up / Down / Home / End and `aria-activedescendant`
  - `ListItem`: interactive rows without `href` are now focusable (`tabIndex`, `role="button"`, Enter / Space); nested controls keep their own activation and the `href` anchor branch is unchanged
  - `ScrollPickerColumn`: a non-looping column pinned to either end no longer calls `preventDefault` on wheel, so the page keeps scrolling
  - `CascaderItem`: Up / Down / Home / End move focus within a column, skipping titles and disabled rows
  - `SelectSubItem`: Up / Down / Home / End across menu rows (including mixed Radix items), expand key opens the sub-menu and moves focus into it, collapse key / Esc returns focus to the parent row

### Patch Changes

- 3c7f23a: Remove ghost BEM class outputs that had no matching CSS (Progress, Scroll, Breadcrumb, Modal, Tag, Slider, Avatar, Pagination ellipsis, Loading mode, ConfigProvider), emit the documented `aviala-link--caption` / `aviala-link--text` level classes on Link, and replace hardcoded colors with token variables. Adds `--loading-mask-reveal` so the Loading ring mask no longer needs an inline hex. No visual change.
- Updated dependencies [3c7f23a]
  - @aviala-design/tokens@2.6.0

## 2.9.0

### Minor Changes

- 91f2b00: Add `Drawer` overlay panel with left/right/top/bottom positions, matching Figma Components → Drawer. Tokens gain `drawer-effects.css` and BasicShadow-Level5 elevation.

  Skip Slider thumb/range position transitions until after first layout so remount and reload no longer animate from the unset position to the current value.

### Patch Changes

- Updated dependencies [91f2b00]
  - @aviala-design/tokens@2.5.5

## 2.8.1

### Patch Changes

- de1fac4: Polish Switch thumb motion with an interruptible fluid inset slide and smoother checked-track press tint.
- Updated dependencies [de1fac4]
  - @aviala-design/tokens@2.5.4

## 2.8.0

### Minor Changes

- ca0e535: Add `Video` player with Default/Light bars. Speed uses a Select-style popover; volume uses a vertical Slider popover. Control bars can auto-hide via `autoHideControls`. Transport controls use animated SVGs with `currentColor`.

### Patch Changes

- 63b8a8b: Render the Loading spinner as an SVG 2px stroke (Figma r15−r13) so the inner edge stays hard.
- ca0e535: Portal Select, Cascader, DatePicker, TimePicker, ColorPicker, Navigation, Popover, and Tooltip into the fullscreen element or Modal content so overlays stay visible and interactive.
- ca0e535: Fix Video Light bar centering/frosted material, restore Popover arrow outline fill, and keep Segmentator thumb aligned inside scaled overlays.
- Updated dependencies [ca0e535]
- Updated dependencies [63b8a8b]
- Updated dependencies [ca0e535]
- Updated dependencies [ca0e535]
  - @aviala-design/icons@2.4.0
  - @aviala-design/tokens@2.5.3

## 2.7.2

### Patch Changes

- e72725c: FormField error tips now sync invalid styling to nested input-series controls via context; explicit `error` on the control still wins.
- Updated dependencies [e72725c]
  - @aviala-design/icons@2.3.0

## 2.7.1

### Patch Changes

- 48eca2e: Backfill Chinese component changelogs for Checkbox, SegmentatorGroup, Progress, and Table 2.7.0 notes.

## 2.7.0

### Minor Changes

- 59d55c4: Align Progress bar/ring geometry and track colors to Figma 589:55818 (6/8px bars, lightBackground-1 track, type-colored ring tracks).
- 7f99e83: Align Table to Figma with sticky header, cell caption / icon-place / grabber layouts, and grid border tokens.

### Patch Changes

- be58b17: Center Checkbox indeterminate mark by absolutely positioning the indicator and hiding the check icon in the indeterminate state.
- 4be83f2: Add nested Segmentator track hover (`segmentator-bg-hover`) and soften Level4WithLine hairline to 18% opacity.
- Updated dependencies [be58b17]
- Updated dependencies [59d55c4]
- Updated dependencies [4be83f2]
- Updated dependencies [7f99e83]
  - @aviala-design/tokens@2.5.2

## 2.6.2

### Patch Changes

- 9d54c05: Align List item dividers to Figma `border/border-normal-2` (was `border-normal-1`).
- Updated dependencies [9d54c05]
  - @aviala-design/tokens@2.5.1

## 2.6.1

### Patch Changes

- e60b1fb: Fix component changelogs that shipped as `Unreleased` in 2.6.0: stamp now accepts legacy `## Unreleased` (without brackets) and those entries are labeled `2.6.0`.
- 11ea089: Align Segmentator nested unselected item radius with the sliding thumb (`segmentator-item-nested-radius`).
- 8feb56d: 再同步 NewAvialaDesignToken：中性色重调；`control` light/deep 更名为 `1/2/3`；统一 `BasicShadow-Level4WithLine`；按 Figma 交互矩阵对齐全库 Hover/Active/Focus（优先 Button/Input/Switch/Segmentator/List）。
- 6b67c5b: Improve picker wheels: multi-step mouse wheel, shortest-path loop wrapping, and selected chrome that scrolls with the active item.
- Updated dependencies [f3a62a1]
- Updated dependencies [11ea089]
- Updated dependencies [8feb56d]
  - @aviala-design/tokens@2.5.0

## 2.6.0

### Minor Changes

- ea23ed1: Button 新增 `outline` / `outlineCustom` 模式（对齐 Figma Outline / Outline-Custom）
- ea23ed1: Add ConfigProvider direction (LTR/RTL), logical CSS migration, and directional mirroring for navigation-heavy components.
- ea23ed1: Add Semi-style LocaleProvider (zh-CN default, en-US) for built-in component copy; props still override.
- ea23ed1: SegmentatorGroup adds Figma-aligned `direction` (`horizontal` | `vertical`).
- ea23ed1: 新增 `Tab` / `TabItem`（对齐 Figma Structure Navigation → Tab）

  - `style`：`default`（滑动下划线）/ `card`（页签 + 侧翼）/ `tiled`（填充）
  - `background`：`none` | `default`（Card 用灰底 `lightBackground-1`，避免与 active 白底同色）
  - `startSlot` / `endSlot`；`TabItem` 复用 `buttonVariants`（与 NavigationItem 一致）
  - Default 指示条：高 4px、顶圆角 `extra-small-2`、相对 item 左右各内缩 12px；item `padding-bottom` 为 `padding-small`
  - Card 未选中 item 水平 `padding-min`（2px）；active 为稿面 2×8 侧翼 + 白底顶圆角
  - 新增 `@aviala-design/tokens/tab-effects.css`

### Patch Changes

- a2e8eb3: ColorPicker hue/alpha rails now reuse the shared Slider.
- ea23ed1: ResponsiveTooltip on touch opens via long-press instead of tap (short tap still reaches the trigger action).
- Updated dependencies [ea23ed1]
- Updated dependencies [a2e8eb3]
- Updated dependencies [ea23ed1]
- Updated dependencies [ea23ed1]
- Updated dependencies [ea23ed1]
  - @aviala-design/tokens@2.4.0

## 2.5.0

### Minor Changes

- 7a634b3: Checkbox: add size="huge", fix Huge check stroke-dasharray scaling
- 7a634b3: Segmentator: horizontal scroll when items overflow; equalWidth no longer clips labels

### Patch Changes

- 7a634b3: Checkbox: 300ms interruptible check/uncheck transitions with surface crossfade
- 7a634b3: Navigation: snappier active-indicator / expand easing
- 7a634b3: Slider: restyle (thicker track, core thumb, shadow), thumb hover/press scale, jump animation, showValueTooltip, remount on type change
- 7a634b3: TooltipContent / ResponsiveTooltip / PopoverContent: typography `level` (`caption` | `text`)
- Updated dependencies [7a634b3]
- Updated dependencies [7a634b3]
- Updated dependencies [7a634b3]
- Updated dependencies [7a634b3]
- Updated dependencies [7a634b3]
  - @aviala-design/tokens@2.3.0

## 2.4.1

### Patch Changes

- 96614a2: Verify release action can open the version PR (no user-facing change).

## 2.4.0

### Minor Changes

- e6085de: ListItem: showTrailing (keep chevron), showTopDivider, href

### Patch Changes

- Updated dependencies [e6085de]
  - @aviala-design/tokens@2.2.1

## 2.3.1

### Patch Changes

- Updated dependencies [f0f9155]
  - @aviala-design/icons@2.2.0

## 2.3.0

### Minor Changes

- e611b87: Fix icon package externals and feedback mode

### Patch Changes

- Updated dependencies [e611b87]
  - @aviala-design/icons@2.1.0

## 2.2.0

### Minor Changes

- c9a451b: Add `appearance` variants to Popover: `tooltip` (shared inverted tooltip skin) and `primary` (brand primary surface, white text). ResponsiveTooltip now keeps the tooltip look on touch devices instead of showing a light popover panel. Form-control slot-icon rendering is consolidated into a shared helper (internal, no API change).

### Patch Changes

- Updated dependencies [c9a451b]
  - @aviala-design/tokens@2.2.0

## 2.1.0

### Minor Changes

- b91564c: Zero-build dev, direction-aware overlay animations, and hover / responsive tooltips.

  **Tokens**

  - Add `@aviala-design/tokens/vite-plugin` so Storybook and the playground serve
    token CSS/JS straight from source — no `turbo build` before dev, and edits to
    `packages/tokens/src/semantic/*.css` hot-reload. Extract the CSS-generation
    logic into `scripts/css-lib.mjs` and rewrite `scripts/build-css.mjs` to
    delegate to it. Remove stale emitted `.js`/`.d.ts` products from `src/`.
  - Make popover & tooltip enter/exit direction-aware: scale `0.96 → 1` + fade,
    growing from the invocation point via Radix's `--radix-*-content-transform-origin`.
    The arrow now follows the panel body on every side (rotation-invariant `50% 50%`
    origin, so it no longer desyncs on right/bottom/left during exit). Add a `flush`
    surface option (no padding) and align the arrow stroke token.

  **Spiral**

  - New `HoverPopover`: opens on hover/focus (desktop) with hover-intent + close
    delay, degrades to tap on touch. Reuses Popover's arrow/surface/animation.
  - New `ResponsiveTooltip`: Tooltip on desktop (hover + keyboard focus),
    automatically a Popover (tap) on touch — gives hover-only tooltips a mobile
    trigger. Shared `useCoarsePointer` hook backs both.
  - Fix Popover requiring two Escapes to close (removed a window-blur close
    suppression that swallowed the first close); keyboard open now moves focus into
    the content and returns it to the trigger on close.
  - Pagination ellipsis opens a page-jump Popover; `Button` gains a `compact`
    variant (`min-w-0`); Navigation vertical rail grows/shrinks on hover/press;
    Segmentator drag-preview rewritten to imperative DOM toggles (no per-item
    React re-render); Popover content supports `flush`.
  - Storybook + playground adopt the tokens vite-plugin and exact-match aliases.

### Patch Changes

- Updated dependencies [b91564c]
  - @aviala-design/tokens@2.1.0

## 2.0.0

### Major Changes

- 54f5b37: Fix Cascader menus rendering behind Modal (z-index/pointer-events), Modalclose focus and exit animation, Cascader touch column expansion, andDatePicker keyboard/layout polish. Typeface header gap uses --gap-none.Add build:release (tsup-only) and merge-mode icon codegen so CI/publishwork without Figma or a full raw/ tree. Export supports category/name filters.

### Patch Changes

- Updated dependencies [54f5b37]
  - @aviala-design/tokens@2.0.0
  - @aviala-design/icons@2.0.2

## 1.0.0

### Major Changes

- d4b53f6: Improve pickers and inputs with NumberInput, sticky wheels, and Segmentator polish.

### Patch Changes

- Updated dependencies [d4b53f6]
  - @aviala-design/tokens@1.0.0

## 0.2.0

### Minor Changes

- 38f4995: Add `NavigationItemMenu` and fix the horizontal navigation indicator animation.

  - New `NavigationItemMenu`, `NavigationItemMenuTrigger`, `NavigationItemMenuContent` and `NavigationItemMenuItem` collapse child items into a flyout menu with a Select-like `value` / `onValueChange` API. The menu is hidden by default and opens on hover (click and Enter also work), positioned to the right in vertical navigations and below in horizontal ones. Items accept left and right icons, and the selected item is highlighted without a check indicator.
  - Horizontal child groups now collapse along the inline axis by transitioning `width` between `0` and `max-content`, so sibling items shift smoothly instead of jumping.
  - The active indicator tweens frame by frame against a live re-measured target while a child group expands or collapses, replacing the previous logic that measured the destination before the layout had moved and made the indicator flash into place.

### Patch Changes

- Updated dependencies [38f4995]
  - @aviala-design/tokens@0.0.4

## 0.1.0

### Minor Changes

- 8a9b9a3: Ship component prop metadata as `@aviala-design/spiral/props.json` so the documentation site can render API tables without access to the monorepo source, and release the theme, DatePicker time, icon, and accessibility fixes that landed after 0.0.2.

### Patch Changes

- Updated dependencies [8a9b9a3]
  - @aviala-design/tokens@0.0.3
  - @aviala-design/icons@2.0.1

## 0.0.2

### Patch Changes

- cd304da: Initial Spiral 2 release.
- Updated dependencies [cd304da]
  - @aviala-design/tokens@0.0.2
  - @aviala-design/icons@2.0.0
