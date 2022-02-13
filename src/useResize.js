import { useEffect } from "react";
import { useEffectOnMount } from "./useEffectOnMount";

/**
 * Execute a callback on mount and when window is resized or orientation change
 */
export function useResize(callback) {
  useEffect(() => {
    if (callback) {
      window.addEventListener("resize", callback);
      window.addEventListener("orientationchange", callback);
      return () => {
        window.removeEventListener("resize", callback);
        window.removeEventListener("orientationchange", callback);
      };
    }
  }, [callback]);
  useEffectOnMount(callback);
}
