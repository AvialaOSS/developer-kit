import source from "../../source/theme-engine/ald.project.json";
import { parseProject, type TokenProject } from "./project";
import { avialaProjectCssOptions, projectCssVariables, type ProjectCssOptions } from "./project-css";
import type { BaseNumbersDensity } from "./base-numbers";

let profile: { project: TokenProject; options: ProjectCssOptions } | undefined;

// Keep the bundled ALD snapshot removable when only generic runtime APIs are used.
function getProfile() {
  if (profile) return profile;
  const project = parseProject(JSON.stringify(source));
  const options = avialaProjectCssOptions(project);
  return (profile = { project, options });
}

function hexColor(hex: string) {
  if (!/^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.test(hex))
    throw new Error(`Invalid generated palette color: ${hex}`);
  let digits = hex.slice(1);
  if (digits.length < 5)
    digits = [...digits].map((char) => char + char).join("");
  return {
    r: parseInt(digits.slice(0, 2), 16) / 255,
    g: parseInt(digits.slice(2, 4), 16) / 255,
    b: parseInt(digits.slice(4, 6), 16) / 255,
    a: digits.length === 8 ? parseInt(digits.slice(6, 8), 16) / 255 : 1,
  };
}

/** Repository ALD profile; generic project resolution stays source-independent. */
export function aldProjectVariables(
  mode: "light" | "dark" = "light",
  density: BaseNumbersDensity = "default",
  effects = true,
  palette: Record<string, string> = {}
): Record<string, string> {
  const { project, options } = getProfile();
  // Generated palette values replace foundation literals only. Semantic and
  // component references remain exactly as authored in the standard project.
  const themed: TokenProject = {
    ...project,
    tokens: project.tokens.map((token) => {
      const color = token.cssName ? palette[token.cssName] : undefined;
      if (
        !color ||
        token.layer !== "foundation" ||
        token.type !== "color" ||
        !token.cssName?.startsWith("--aviala-")
      )
        return token;
      return {
        ...token,
        valuesByMode: Object.fromEntries(
          Object.keys(token.valuesByMode).map((id) => [
            id,
            { kind: "literal" as const, value: hexColor(color) },
          ])
        ),
      };
    }),
  };
  return projectCssVariables(
    themed,
    {
      color: mode === "dark" ? "Dark" : "Light",
      density: density === "mobile-friendly" ? "Mobile Friendly" : "Default",
      effects: effects ? "ON" : "OFF",
    },
    options
  );
}
