import {
  applyBaseNumbersDensity,
  type BaseNumbersDensity,
} from "./base-numbers";
import type { ThemeVars } from "./generate-theme";
import { applyThemeVariables, removeProjectTheme } from "./project-runtime";

export type ApplyThemeOptions = {
  target?: HTMLElement;
  mode?: "light" | "dark";
  themeId?: string;
  density?: BaseNumbersDensity;
};

export type { BaseNumbersDensity } from "./base-numbers";

export function applyTheme(
  vars: ThemeVars,
  options: ApplyThemeOptions = {}
): void {
  const target =
    options.target ??
    (typeof document !== "undefined" ? document.documentElement : null);

  if (!target) return;

  const mode = options.mode ?? vars["--aviala-mode"] ?? "light";
  target.setAttribute("data-mode", mode);
  target.setAttribute("data-effects", vars["--aviala-effects"] ?? "on");

  const density =
    options.density ??
    (vars["--aviala-density"] as BaseNumbersDensity | undefined) ??
    "default";
  applyBaseNumbersDensity(target, density);

  const themeId = options.themeId ?? vars["--aviala-theme-id"];
  if (themeId) {
    target.setAttribute("data-theme", themeId);
  } else {
    // Leaving a static preset (e.g. ald) must drop data-theme so frozen
    // [data-theme="ald"] CSS no longer overrides dynamic inline vars.
    target.removeAttribute("data-theme");
  }

  applyThemeVariables(target, vars);
}

export function removeTheme(target?: HTMLElement): void {
  const scope =
    target ??
    (typeof document !== "undefined" ? document.documentElement : null);
  if (scope) removeProjectTheme(scope);
}
