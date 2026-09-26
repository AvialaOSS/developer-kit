# @aviala-design/tokens

## 2.7.0

### Minor Changes

- 4f3c16d: Migrate Badge caption/text foregrounds and independent icon colors to component tokens. Preserve explicit legacy foreground overrides and expose a dedicated icon foreground hook.

  Separate line-height alignment padding from the painted surface. Consume background and geometry tokens, including per-level icon dimensions and documented variant-specific radii and spacing. Retain legacy CSS override hooks.

- 4f3c16d: Consume Button component tokens for normal padding, gap, default and rounded radius across all four sizes while retaining explicit legacy spacing overrides. Forward size and icon-only attributes through asChild so composed elements receive the requested dimensions.

  Render Button surface and content layers inside asChild elements while retaining their attributes, and avoid treating custom link components as icons.

  Use separate component opacity tokens for text, icons, and loading indicators instead of multiplying content opacity by whole-button disabled opacity.

  Consume primary background state, text, and icon component colors. Retain explicit legacy overrides and keep the original defaults for other components that share the former Button variables.

  Drive primary shadow geometry, shadow colors, and gradient endpoints from component tokens, preserving Figma paint opacity and stop positions and honoring the independent effects axis.

  Migrate outlined and backgroundless Button variants to separate component background, text, icon, stroke-state, and stroke-width tokens while preserving explicit legacy overrides.

  Consume normal icon width and slot-height component tokens, retaining explicit icon sizing props and legacy size overrides.

  Migrate primary icon-only padding and icon container geometry to component tokens, preserving explicit legacy height overrides.

  Apply verified icon-only component geometry to both backgroundless variants and add independent theme-axis regression examples.

- 4f3c16d: Consume Checkbox size and radius tokens, CheckboxInput gap and icon height, and independent horizontal/vertical group spacing. Preserve explicit legacy overrides and defaults for other consumers.

  Consume state-specific Checkbox colors, highlight endpoints, shadow colors and disabled mark opacity. Preserve hidden disabled overlays and legacy shared defaults for other controls.

  Consume per-state padding and CheckboxInput text/caption colors and disabled text opacity; keep fixed marks independent of symmetric padding as in Figma.

- 4f3c16d: Consume Link component tokens for level-specific geometry, state colors, separate icon/text colors, and disabled content opacity. Preserve explicit legacy foreground overrides.

  Render the same visual layers for asChild links and prevent disabled children from retaining navigation or click behavior.

- 4f3c16d: Add a portable project entry with typed tokens, graph validation, source identity mapping, independent mode resolution, and shared CSS declaration generation. Existing theme entry points remain available while the integration is migrated.

  新增 Figma 逐变量和模式的写入预检说明，保留附加透明度引用表达，列明受限项；未验证类型和单位转换阻止写入，预检不冒充同步成功。

  新增标准化回读比较，核对变量身份、路径、模式、单位及引用结构；缺失或残留对象、同值但引用被展开均不能标记验证通过。

  来源映射保留外部库及扩展集合的只读能力，导入缺少元数据时不会解除已有约束；回写预检可按目标文件映射阻止只读对象修改。

  支持导出 ThemeBuilder 快照与现有插件回写包，保留来源身份和引用，显式转换透明度单位并拒绝未支持的编码。

  支持按路径改名并保留历史 CSS 别名，区分自动名称与显式固定名；初始项目迁移保持全部模式的 CSS 输出一致。

  按 TestVar 真实格式支持自定义贝塞尔 EASING 的无损导入/导出，其他未映射缓动类型保持明确拒绝。

  根据 Figma Plugin API 的秒单位转换 TIMING 与标准毫秒 duration，往返保留引用，避免千倍时长误差。

  Validate imported project JSON before graph resolution, and provide scoped theme application that restores previous styles without removing unrelated custom properties. Include the CSS generator dependency in published packages.

  Generate static styles from the canonical project with all dependency tokens and independent modes. Keep legacy semantic definitions separate, and include the source CSS needed by the published Vite plugin.

  Use the same project for loadAldTheme and generateTheme. Dynamic palettes replace foundation colors while retaining authored references; density and effects can be selected independently.

  Add local immutable release snapshots, exact-base theme overlays, validated upgrade decisions and independent theme detachment to the portable project API. Hosting and persistence remain caller responsibilities.

  Track deleted token identities in drafts and offer explicit, type-checked adoption for recreated tokens. Unresolved draft references continue to block publication.

  Provide three-way project merging with explicit conflict choices and preserved compatibility metadata, plus source-binding updates for confirmed identity adoption.

  Add Node workspace storage with revision checks and atomic draft/baseline commits; conflicts do not write files.

- 4f3c16d: Consume Radio geometry and state padding tokens, separate normal/card input geometry, and use dedicated group spacing for direct card inputs. Preserve explicit legacy size and gap overrides.

  Migrate Radio state colors and input typography/card borders. Match Figma disabled states and visible unselected inner circles, and remove the default extra outer shadow while retaining legacy overrides.

  Derive RadioInput disabled styling from the actual Radix item state so group-level disabling also updates card borders, text and icon opacity, cursor, and interaction backgrounds.

- 4f3c16d: Consume canonical component tokens for Segmentator group tracks in nested and tiled modes, retaining legacy override hooks.
- 4f3c16d: Export avialaProjectCssOptions from the DOM-independent project entry so static themes, runtime ALD generation, and ThemeCat share the same opt-in typography rem conversion profile.
- 4f3c16d: Consume Switch component state colors, highlight endpoints, pointer opacity, radii, and per-size x/y padding. Match Figma disabled tracks and pointer-only dimming while preserving explicit legacy override hooks and existing motion.
- 4f3c16d: Add a portable ThemeBuilder snapshot import adapter with strict numeric units by default. Preserve editor identities, aliases and composed opacity through the shared snapshot importer, keeping embedded Figma identity separate from editor source mappings.

  Add a repository CLI to convert an editor project into a new standard candidate while preserving the complete editor project alongside it. The command requires matching project configuration and never overwrites an existing output.

### Patch Changes

- 4f3c16d: Connect Alert surfaces, status icons, text and layout to component tokens; fix title color selection without a description and for small alerts. Consume shared Link tokens for secondary actions while preserving explicit legacy Alert color overrides.

  Keep long quick and footer actions readable within narrow alerts without clipping the dismiss control.

- 4f3c16d: Consume Anchor component tokens for group spacing, indentation, padding, rail width/colors, content radius, text color and inactive opacity.

  Fix AnchorItem asChild composition and expose the activated location through aria-current without overriding explicit consumer semantics.

  Add optional descriptions using the shared caption typography and consume independent description-color and text-gap tokens. Apply inactive opacity once to the whole text block.

- 4f3c16d: Use separate Avatar component colors for text and icon content, and component tokens for radius and icon size, retaining explicit legacy color overrides.

  Connect level widths and available alignment-container heights to component tokens, and honor inherited legacy avatar-size overrides.

  Preserve the Avatar image sizing and cropping class when consumers supply imgProps.className.

- 4f3c16d: Input 几何属性接入 BaseInput Token，保留共享旧尺寸覆盖及未迁移消费者默认行为。
  背景、文字、图标、焦点描边及阴影色独立消费组件 Token。
  默认图标尺寸及插槽高度消费组件 Token，显式图标档位保持优先。
  修复嵌套独立主题切换密度时文字行高继承外层旧值的问题。
- 4f3c16d: Separate Breadcrumb content layers and consume per-size layout, text, icon and separator tokens while retaining explicit legacy overrides.
- 4f3c16d: Expose Figma secondary, tertiary and tertiaryCustom button modes with legacy aliases. Migrate their state backgrounds, foregrounds and inner shadows to component tokens while preserving explicit overrides and legacy Tab fallbacks.
- 4f3c16d: Expose ButtonGroup with an optional caption text slot and component tokens, and share its implementation with Card actions.
- 4f3c16d: Use the shared full-round radius for tiny allRound buttons, matching the corrected Figma variable binding.
- 4f3c16d: Generate component-level CSS tokens from the current ThemeBuilder/Figma variable graph and migrate ScrollPicker to consume them with legacy override compatibility.
- 4f3c16d: Use component tokens for Card outer layout, body layout and text, and the independent head/body/bottom surfaces. Preserve explicit legacy overrides.

  Use independent Card title, description, icon and divider tokens. Icon containers follow density while typography metrics remain shared.

  Separate heading and action layout tokens, including custom trailing content, while retaining explicit legacy layout overrides.

  Add optional CardBottom title, description and icon slots backed by bottom-specific tokens. Accept ReactNode titles on both CardHead and CardBottom.

  Use Button Group layout tokens inside Card actions and honor supplied actions in select variants with the Figma ordering.

- 4f3c16d: Add an optional Title-level heading to CardHead and CardBottom while preserving existing supporting text and explicit color overrides.
- 4f3c16d: Consume Cascader input spacing tokens for both sizes while retaining explicit legacy spacing overrides.

  Consume input shape, icon geometry and appearance tokens, and draw the active border outside without changing layout height.

  Resolve the error ring and component shadow in the local theme so effects OFF removes the decorative shadow.

  Consume Cascader menu, column and group surface and spacing tokens.

  Consume group divider color and independent horizontal, top and bottom spacing tokens.

  Consume menu item padding, shape, title and selection colors while preserving explicit legacy overrides.

  Consume menu icon geometry, function colors and badge padding; resolve shared typography in the local theme.

  Resolve selected item shadows through the local effects axis and exclude presentation titles from initial keyboard focus.

  Add CascaderSearch with component spacing and radius tokens and keyboard entry into filtered column results.

- 4f3c16d: Consume independent Cascader menu icon colors for normal, title and selected rows, preserving explicit legacy foreground overrides.
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

- 4f3c16d: Consume the ColorPickerInput disabled background token while retaining the explicit legacy background override.
- 4f3c16d: Add optional leading and trailing ColorPicker trigger icons backed by component tokens, and consume the component placeholder opacity.
- 4f3c16d: Complete the authoritative Theme Engine color collection from full ALD exports, preserving existing tokens and recording the original Figma identities of 12 missing colors.
- 4f3c16d: Select Alert, Feedback and ListItem text tokens by stable Typeface line role so omitted titles do not change description styling.
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

- 4f3c16d: Support source-ID numeric unit rules and optional strict unit requirements during snapshot import. Convert pixel literals to rem only with an explicit pixels-per-rem setting, preserve aliases, and reject incompatible units across reference chains. Existing imports retain legacy inference unless strict mode is enabled.

  Enable strict numeric units in the repository's standard import command using persisted source-ID rules from the current baseline.

  Persist collection roles by source ID so collection renames preserve mode axes, layers and CSS naming policies; new collections require explicit mappings.

  Retain unit rules for deleted source identities already present in saved bindings. Unknown rule IDs and same-name replacements without explicit units still fail validation.

- 4f3c16d: Connect Feedback layout to component tokens while preserving explicit legacy overrides. Keep title colors independent from optional descriptions and allow ReactNode titles.

  Use variant-specific Feedback surface, border, text and status icon tokens, including separate primary wrong icon colors by size.

  Align default status glyphs with the filled Figma icons, including the information glyph for normal feedback, while retaining custom icon overrides.

  Let primary dismiss icons follow the shared foreground token and explicit legacy color overrides through the nested Link icon.

  Allow long Feedback actions to wrap within available width instead of pushing the dismiss control outside the visible area.

- 4f3c16d: Connect FormField and Fieldset spacing, padding, and text colors to Form component tokens. Preserve Typeface line roles when earlier content is absent.
- 4f3c16d: Check standard-project, static CSS and bundled runtime consistency before packing tokens, rejecting stale runtime artifacts after project edits. Compare every exported CSS artifact with Vite-generated output and validate both ESM and CommonJS entries.
- 4f3c16d: Add Icon line-height alignment modes and a reusable IconFrame. Use square typography line boxes and equal default padding for icon-only buttons across all modes, preserving explicit legacy overrides.
- 4f3c16d: Reject theme upgrades between conflicting contents bearing the same project version. Preserve the existing theme and require a new release version.
- 4f3c16d: Add InputGroupItem and consume component tokens for horizontal group spacing, item spacing and addon color. Align addon typography with the shared text level.
- 4f3c16d: Route Input hover backgrounds through the BaseInput component token and theme-aware neutral tertiary semantics.
- 4f3c16d: Resolve shared input hover backgrounds at the consuming element so nested themes use their local component token. Preserve explicit legacy hover overrides and fallback defaults.
- 4f3c16d: Match disabled Input content and typography opacity layers to Figma. Align Select menu shadow geometry and route Select, Switch, and Slider shadows through component tokens and the effects axis.
- 4f3c16d: Defer bundled ALD project initialization until ALD theme generation is requested, allowing generic project runtime consumers to tree-shake the unused snapshot.
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
- 4f3c16d: Connect Pagehead layout and text colors to component tokens while preserving explicit legacy Pagehead overrides and shared typography metrics.
- 4f3c16d: Use Pagination component tokens for container, controls, jump and page-size spacing and label colors, retaining explicit legacy spacing overrides.

  Align page buttons with tiled Segmentator tokens while retaining pagination semantics and explicit legacy selected-page overrides.

  Constrain pagination controls to the available width so overflowing page numbers scroll inside their group while navigation buttons remain accessible.

- 4f3c16d: Match DatePicker and TimePicker disabled opacity to their Figma field and text layers without fading the background.
- 4f3c16d: Preserve browser wheel ownership for zoom, horizontal gestures, empty or single-option pickers, and finite column boundaries. Allow native scroll chaining for finite picker columns.

  Normalize pixel, line and page wheel deltas against the current column geometry before consuming selection steps.

- 4f3c16d: Expose PopoverIcon for optional content icons with appearance-specific component token colors and dimensions.
- 4f3c16d: Align Popover's tooltip appearance with Tooltip component tokens, including theme colors, shadows, pointer measurement and available-width constraints. Preserve explicit legacy overrides.

  Use Popover-specific background, foreground, radius and shadow tokens for default and primary appearances. Match Figma's two shadow layers for default and single layer for primary.

  Separate surface and content-slot spacing tokens. Explicit legacy padding overrides apply to the slot; flush clears both layers and now also works for tooltip appearance.

  Match Figma's 14×5 Popover pointer curve with runtime token sizing and borderless defaults. Explicit legacy border colors remain as outlines without occupying layout space.

  Constrain default and primary panels to the available width and wrap long paths on narrow screens.

- 4f3c16d: Connect Progress colors, bar geometry, ring container dimensions and default/fail ring paths to component tokens while retaining explicit legacy CSS overrides and their stroke scaling. Hide the ring indicator at zero to avoid a rounded-cap dot.

  Keep bar tracks visible beside long labels by truncating the label with a full-text title, and constrain bars to their parent width.

- 4f3c16d: Reject multiple active external objects mapped to the same Engine identity within a source when reading or committing a project store. Retired mappings remain valid for explicit identity succession, and rejected commits leave the saved draft unchanged.
- 4f3c16d: 局部标准项目主题为弹出层提供默认挂载容器，保留全屏和显式弹层容器优先级。Select菜单表面与默认菜单文字接入组件Token，修复局部暗色项目下菜单仍使用外层亮色变量的问题。
- 4f3c16d: Add token-driven Rate and RateIcon components with keyboard interaction, half steps and form support. Correct Like empty, half and filled masks alongside their Figma variants.
- 4f3c16d: Apply component opacity tokens to separate disabled field and text layers in Cascader, ColorPicker and NumberInput.
- 4f3c16d: Consume Scroll component tokens for native scrollbar geometry and color, preserving explicit legacy overrides. Allow WebKit scrollbar sizing to take effect without standard thin styling overriding it.
- 4f3c16d: Derive ScrollPicker row and selection geometry from typography and component padding tokens while retaining explicit legacy height overrides.
- 4f3c16d: Align Nested Segmentator selected shadows to Figma geometry and route their component tokens through the independent effects axis, retaining explicit legacy overrides.
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
- 4f3c16d: Add a composable SelectSearch field with search-row tokens and keyboard handling that preserves focus while filtering.

  Prevent implicit form submission while Enter is pressed in the search field.

- 4f3c16d: Add MultiSelect with removable Tag values, multiple form fields, keyboard navigation and existing Select component tokens.
- 4f3c16d: Use the title-specific SelectMenuItem icon color for title rows while preserving the legacy override.
- 4f3c16d: 修复共享输入消费者在局部 ThemeProvider 下继承外层已解析字号、行高和插槽高度的问题；保留显式 input-font-size、input-line-height 和 input-icon-slot-height 覆盖。
- 4f3c16d: Consume Slider track thickness, independent thumb dimensions and track/thumb radius tokens for both orientations while preserving explicit legacy size overrides.

  Consume normal/disabled Slider colors, independent mark geometry and both component shadow layers.

  Consume progress endpoint radii and gap, respecting range, orientation, RTL and inverted axes.

  Exclude disabled Slider values from native form submission by disabling each hidden input.

- 4f3c16d: Migrate Steps state colors and layout to component tokens, preserve explicit legacy overrides, and align the waiting glyph with Figma.
- 4f3c16d: Consume independent root spacing, padding and background tokens for Default, Tiled and Card tabs while preserving explicit legacy overrides. Restore Card accessory-slot bottom padding.

  Consume per-style TabItem layout tokens and dedicated selected Card content padding, gap, radii and background. Separate default accessory-slot padding from the item's indicator space.

  Resolve indicator dimensions from CSS component tokens, center the token width, and retain the explicit legacy inset sizing mode.

  Consume selected Card icon width, container height and independent icon/text colors while preserving explicit legacy icon sizing overrides.

- 4f3c16d: Connect Table's surface, insets and border geometry to component tokens. Use independent TableHead and TableCell backgrounds and border widths/colors while retaining explicit legacy overrides and existing shared-edge behavior.

  Connect header, title and description colors and ordinary icon geometry/color to the corresponding content tokens. Keep shared Typography metrics and explicit legacy overrides; preserve the shaped icon-place treatment pending its separate migration.

  Separate cell content, headline, leading and action slots so outer and inner spacing tokens do not apply twice. Keep direct custom children and existing control props while preserving explicit legacy content-padding overrides.

  Align shaped icon places with the Figma theme/light, non-rounded IconPlace variant and consume its surface, geometry and icon tokens instead of the previous primary circular treatment.

  Match the default people avatar to the Figma Display/Icon variant and add a consolidated content-variant story for layout inspection.

- 4f3c16d: Expose optional leading and trailing TableHead icon slots with component-level dimensions, color and spacing tokens.
- 4f3c16d: Connect Tag surface, border, gap and level-specific text/icon colors to component tokens, retaining explicit legacy overrides.

  Use component tokens for icon width, container height and close-button vertical padding, preserving explicit legacy slot-height overrides.

  Separate Tag alignment padding from its inner surface padding. Render the Figma outside stroke without adding layout height; root refs and attributes remain on the outer element.

  Apply normal/disabled opacity tokens to text and icons only, preserving the surface, border and people avatar as specified by Figma. Legacy tag-disabled-opacity now overrides content opacity.

- 4f3c16d: Textarea 外框、内容间距、图标及默认/焦点/禁用颜色消费独立组件 Token，保留旧样式覆盖，字体指标继续使用共享 Typography。

  底部控制区消费独立 Controller Token，文字预留空间随控制区高度变化，保留实时计数与拖拽。

- 4f3c16d: Align disabled Textarea with Figma's nested content and typography opacity tokens. Keep the counter and resize controller outside the faded content layer.
- 4f3c16d: Validate omitted mode axes using each collection's default, preventing projects with default-only reference cycles from passing publication checks.

  Include the token identity, path and selected mode in cycle diagnostics so editors can locate the invalid value directly.

- 4f3c16d: Preserve revision history when detaching a theme so projects with retired token identities remain valid and publishable.
- 4f3c16d: Expose a review-only merge draft for missing-reference identity repairs without treating invalid merges as successful.
- 4f3c16d: Serialize string tokens with CSS escapes so control characters retain their meaning in static stylesheets and runtime themes.
- 4f3c16d: Validate theme upgrade decision payloads before applying replacements or dropping overrides. Reject unknown fields and malformed maps or drop entries instead of silently treating them as empty decisions, preserving the original theme on failure.

  Reject incompatible type or unit changes to tokens retained by theme overrides, even when their IDs are unchanged. Require a compatible replacement or an explicit override removal instead of silently reinterpreting numeric values.

- 4f3c16d: Reject stale or invalid theme upgrade decisions instead of silently accepting unused replacements or unknown dropped overrides.
- 4f3c16d: Connect ThemeProvider to canonical token projects with independent color, density and effects modes, scoped targets, and reversible style application. Resolve the project API from source in the development plugin.
- 4f3c16d: Add optional seconds to TimePicker, TimePickerField and TimePickerWheels using existing seconds-column tokens. Preserve two-column defaults and existing values when seconds are hidden.
- 4f3c16d: Ship CommonJS entry points for tokens, portable projects, Node helpers and the Tailwind preset so Spiral's CommonJS entry can load its token dependency.
- 4f3c16d: Use component tokens for Tooltip surface, text, pointer color, padding, radius and both shadow layers while preserving explicit legacy CSS overrides.

  Measure token-driven pointer dimensions through the forwarded SVG ref so runtime theme changes update placement. Keep surface and pointer color overrides independent.

  Constrain long Tooltip content to the placement's available width and wrap unbroken paths on narrow screens.

- 4f3c16d: Align default Tooltip typography with Figma Text and add optional leading/trailing icons using component geometry and color tokens. Explicit caption typography remains supported.
- 4f3c16d: Separate the Upload container from its interactive surface and consume container spacing tokens without replacing inner button padding.

  Consume internal Button geometry and default colors, plus independent Upload primary and caption text tokens.

  Consume internal Button shadow geometry/colors and regular icon geometry so local density and effects modes apply.

- 4f3c16d: Connect Video's surface and Default/Light control-bar geometry to component tokens. Map seek-slider dimensions, colors and shadows to Video tokens without changing volume-slider behavior, and preserve explicit legacy overrides. Existing glass treatment and unresolved state/effect-mode differences remain pending.

  Use PopoverSlot tokens for settings and volume content spacing, preserving explicit video spacing overrides.

  Remove duplicated horizontal padding around the speed-menu group and use SelectMenuItem title spacing tokens.

  Align speed-menu text and selection-marker tokens with Figma. Use a checkmark-only default selection without inherited generic selection shadows, preserving explicit overrides and shared typography metrics.

- 4f3c16d: Use the Video controls text token for settings labels and volume percentage.

## 2.6.2

### Patch Changes

- 2e8bade: Aggregate all component effects and the ALD theme into `@aviala-design/spiral/styles.css`, and precompile residual Tailwind utilities at package build so consumers only need one CSS import (no Tailwind toolchain).

## 2.6.1

### Patch Changes

- 4c0c986: Point package `repository.url` metadata at `AvialaOSS/developer-kit` (npm names unchanged).

## 2.6.0

### Minor Changes

- 3c7f23a: Remove ghost BEM class outputs that had no matching CSS (Progress, Scroll, Breadcrumb, Modal, Tag, Slider, Avatar, Pagination ellipsis, Loading mode, ConfigProvider), emit the documented `aviala-link--caption` / `aviala-link--text` level classes on Link, and replace hardcoded colors with token variables. Adds `--loading-mask-reveal` so the Loading ring mask no longer needs an inline hex. No visual change.

## 2.5.5

### Patch Changes

- 91f2b00: Add `Drawer` overlay panel with left/right/top/bottom positions, matching Figma Components → Drawer. Tokens gain `drawer-effects.css` and BasicShadow-Level5 elevation.

  Skip Slider thumb/range position transitions until after first layout so remount and reload no longer animate from the unset position to the current value.

## 2.5.4

### Patch Changes

- de1fac4: Polish Switch thumb motion with an interruptible fluid inset slide and smoother checked-track press tint.

## 2.5.3

### Patch Changes

- 63b8a8b: Render the Loading spinner as an SVG 2px stroke (Figma r15−r13) so the inner edge stays hard.
- ca0e535: Add `Video` player with Default/Light bars. Speed uses a Select-style popover; volume uses a vertical Slider popover. Control bars can auto-hide via `autoHideControls`. Transport controls use animated SVGs with `currentColor`.
- ca0e535: Fix Video Light bar centering/frosted material, restore Popover arrow outline fill, and keep Segmentator thumb aligned inside scaled overlays.

## 2.5.2

### Patch Changes

- be58b17: Center Checkbox indeterminate mark by absolutely positioning the indicator and hiding the check icon in the indeterminate state.
- 59d55c4: Align Progress bar/ring geometry and track colors to Figma 589:55818 (6/8px bars, lightBackground-1 track, type-colored ring tracks).
- 4be83f2: Add nested Segmentator track hover (`segmentator-bg-hover`) and soften Level4WithLine hairline to 18% opacity.
- 7f99e83: Align Table to Figma with sticky header, cell caption / icon-place / grabber layouts, and grid border tokens.

## 2.5.1

### Patch Changes

- 9d54c05: Align List item dividers to Figma `border/border-normal-2` (was `border-normal-1`).

## 2.5.0

### Minor Changes

- f3a62a1: 同步新版 Aviala Design Colors / token-colors：更新中性与语义色阶；`border-normal-light|primary` 更名为 `border-normal-1|3`；`control` 并入 token-colors（`lightBackground-whiteOnly` → `Background-whiteOnly`）。
- 8feb56d: 再同步 NewAvialaDesignToken：中性色重调；`control` light/deep 更名为 `1/2/3`；统一 `BasicShadow-Level4WithLine`；按 Figma 交互矩阵对齐全库 Hover/Active/Focus（优先 Button/Input/Switch/Segmentator/List）。

### Patch Changes

- 11ea089: Align Segmentator nested unselected item radius with the sliding thumb (`segmentator-item-nested-radius`).

## 2.4.0

### Minor Changes

- ea23ed1: Button 新增 `outline` / `outlineCustom` 模式（对齐 Figma Outline / Outline-Custom）
- ea23ed1: Add ConfigProvider direction (LTR/RTL), logical CSS migration, and directional mirroring for navigation-heavy components.
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

## 2.3.0

### Minor Changes

- 7a634b3: Checkbox: add size="huge", fix Huge check stroke-dasharray scaling
- 7a634b3: Segmentator: horizontal scroll when items overflow; equalWidth no longer clips labels

### Patch Changes

- 7a634b3: Checkbox: 300ms interruptible check/uncheck transitions with surface crossfade
- 7a634b3: Navigation: snappier active-indicator / expand easing
- 7a634b3: Slider: restyle (thicker track, core thumb, shadow), thumb hover/press scale, jump animation, showValueTooltip, remount on type change

## 2.2.1

### Patch Changes

- e6085de: ListItem: showTrailing (keep chevron), showTopDivider, href

## 2.2.0

### Minor Changes

- c9a451b: Add `appearance` variants to Popover: `tooltip` (shared inverted tooltip skin) and `primary` (brand primary surface, white text). ResponsiveTooltip now keeps the tooltip look on touch devices instead of showing a light popover panel. Form-control slot-icon rendering is consolidated into a shared helper (internal, no API change).

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

## 2.0.0

### Major Changes

- 54f5b37: Fix Cascader menus rendering behind Modal (z-index/pointer-events), Modalclose focus and exit animation, Cascader touch column expansion, andDatePicker keyboard/layout polish. Typeface header gap uses --gap-none.Add build:release (tsup-only) and merge-mode icon codegen so CI/publishwork without Figma or a full raw/ tree. Export supports category/name filters.

## 1.0.0

### Major Changes

- d4b53f6: Improve pickers and inputs with NumberInput, sticky wheels, and Segmentator polish.

## 0.0.4

### Patch Changes

- 38f4995: Add `NavigationItemMenu` and fix the horizontal navigation indicator animation.

  - New `NavigationItemMenu`, `NavigationItemMenuTrigger`, `NavigationItemMenuContent` and `NavigationItemMenuItem` collapse child items into a flyout menu with a Select-like `value` / `onValueChange` API. The menu is hidden by default and opens on hover (click and Enter also work), positioned to the right in vertical navigations and below in horizontal ones. Items accept left and right icons, and the selected item is highlighted without a check indicator.
  - Horizontal child groups now collapse along the inline axis by transitioning `width` between `0` and `max-content`, so sibling items shift smoothly instead of jumping.
  - The active indicator tweens frame by frame against a live re-measured target while a child group expands or collapses, replacing the previous logic that measured the destination before the layout had moved and made the indicator flash into place.

## 0.0.3

### Patch Changes

- 8a9b9a3: Ship component prop metadata as `@aviala-design/spiral/props.json` so the documentation site can render API tables without access to the monorepo source, and release the theme, DatePicker time, icon, and accessibility fixes that landed after 0.0.2.

## 0.0.2

### Patch Changes

- cd304da: Initial Spiral 2 release.
