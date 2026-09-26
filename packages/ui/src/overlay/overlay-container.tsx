import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { resolveOverlayContainer } from "./resolve-overlay-container";

const OverlayContainerContext = createContext<HTMLElement | null>(null);
const ThemeOverlayContainerContext = createContext<HTMLElement | null>(null);

/** Theme scopes remain local when contained by the active overlay boundary. */
export const ThemeOverlayContainerProvider =
  ThemeOverlayContainerContext.Provider;

export type OverlayContainerProviderProps = {
  container: HTMLElement | null;
  children: ReactNode;
};

/** Nest overlays (Popover / Select / Tooltip) inside a stacking context such as Modal. */
export function OverlayContainerProvider({
  container,
  children,
}: OverlayContainerProviderProps) {
  return (
    <OverlayContainerContext.Provider value={container}>
      {children}
    </OverlayContainerContext.Provider>
  );
}

function readFullscreenElement(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  const doc = document as Document & {
    webkitFullscreenElement?: Element | null;
  };
  const el = document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
  return el instanceof HTMLElement ? el : null;
}

/**
 * Portal target for floating layers.
 * Fullscreen and Modal define the boundary. A local theme inside that boundary
 * retains inheritance; unrelated theme containers cannot escape the boundary.
 */
export function useOverlayPortalContainer(): HTMLElement | undefined {
  const nested = useContext(OverlayContainerContext);
  const theme = useContext(ThemeOverlayContainerContext);
  const [fullscreen, setFullscreen] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const sync = () => setFullscreen(readFullscreenElement());
    sync();
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  return resolveOverlayContainer(fullscreen, nested, theme);
}
