/** Keep local inheritance when its container stays inside the active boundary. */
export function resolveOverlayContainer(
  fullscreen: HTMLElement | null,
  nested: HTMLElement | null,
  theme: HTMLElement | null,
): HTMLElement | undefined {
  const boundary = fullscreen
    ? nested && fullscreen.contains(nested) ? nested : fullscreen
    : nested;
  if (theme && (!boundary || boundary.contains(theme))) return theme;
  return boundary ?? undefined;
}
