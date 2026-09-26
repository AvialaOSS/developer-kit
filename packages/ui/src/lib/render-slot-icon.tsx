import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import type { AvialaIconProps } from "@aviala-design/icons";
import { cloneAvialaIconElement } from "./clone-aviala-icon";
import { iconSlotCssVarStyle } from "./icon-slot-sizing";
import { spiralDebugId } from "./spiral-debug";

export function renderSlotIcon(
  node: ReactNode,
  className: string,
  debugId?: string,
  componentSize?: string
): ReactNode {
  if (!node) return null;
  let content = cloneAvialaIconElement(node, {
    level: "text",
    biggerSize: true,
  });
  const iconProps = isValidElement(node)
    ? (node as ReactElement<AvialaIconProps>).props
    : undefined;
  const useComponentSize =
    componentSize !== undefined &&
    iconProps?.level === undefined &&
    iconProps?.biggerSize === undefined;
  if (
    useComponentSize &&
    isValidElement(content) &&
    typeof content.type !== "string"
  ) {
    content = cloneElement(content as ReactElement<AvialaIconProps>, {
      width: componentSize,
      height: componentSize,
    });
  }

  return (
    <span
      className={className}
      style={
        useComponentSize
          ? undefined
          : iconSlotCssVarStyle(node, "--input-slot-icon-size", "text", true)
      }
      {...(debugId ? spiralDebugId(debugId) : undefined)}
    >
      {content}
    </span>
  );
}
