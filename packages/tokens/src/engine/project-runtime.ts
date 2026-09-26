import { projectCssVariables, type ProjectCssOptions } from "./project-css";
import type { ModeSelection, TokenProject } from "./project";

interface StyleTarget {
  style: Pick<
    CSSStyleDeclaration,
    | "getPropertyValue"
    | "getPropertyPriority"
    | "setProperty"
    | "removeProperty"
  >;
}
type SavedProperty = { previous: string; priority: string; written: string };
const owned = new WeakMap<StyleTarget, Map<string, SavedProperty>>();

function release(
  target: StyleTarget,
  name: string,
  saved: SavedProperty
): void {
  // A subsequent user edit is not ours to remove or restore.
  if (
    target.style.getPropertyValue(name) !== saved.written ||
    target.style.getPropertyPriority(name) !== ""
  )
    return;
  if (saved.previous)
    target.style.setProperty(name, saved.previous, saved.priority);
  else target.style.removeProperty(name);
}

/** Apply the same complete declaration map as static CSS, including scoped aliases. */
export function applyProjectTheme(
  target: StyleTarget,
  project: TokenProject,
  selection: ModeSelection = {},
  options: ProjectCssOptions = {}
): void {
  // Compute and validate everything before changing the target.
  const variables = projectCssVariables(project, selection, options);
  applyThemeVariables(target, variables);
}

/** Shared ownership tracking for canonical and legacy entry points. */
export function applyThemeVariables(
  target: StyleTarget,
  variables: Record<string, string>
): void {
  const previous = owned.get(target) ?? new Map<string, SavedProperty>();
  const next = new Map<string, SavedProperty>();
  for (const [name, value] of Object.entries(variables)) {
    const saved = previous.get(name);
    const stillOwned =
      saved &&
      target.style.getPropertyValue(name) === saved.written &&
      target.style.getPropertyPriority(name) === "";
    const baseline = stillOwned
      ? saved
      : {
          previous: target.style.getPropertyValue(name),
          priority: target.style.getPropertyPriority(name),
          written: "",
        };
    target.style.setProperty(name, value);
    next.set(name, {
      ...baseline,
      written: target.style.getPropertyValue(name),
    });
  }
  for (const [name, saved] of previous)
    if (!next.has(name)) release(target, name, saved);
  owned.set(target, next);
}

export function removeProjectTheme(target: StyleTarget): void {
  const properties = owned.get(target);
  if (!properties) return;
  for (const [name, saved] of properties) release(target, name, saved);
  owned.delete(target);
}
