import { useEffect, useState, useRef } from "react";

/**
 * Execute an effect solely on component mount (and its cleanup function on unmount)
 * @param {function} effect the effect callback to execute
 */
export function useEffectOnMount(effect) {
  const [mounted, setMounted] = useState(false);
  const effectCleanUpRef = useRef(() => {});
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      effectCleanUpRef.current = effect && effect();
    }
  }, [effect, mounted]);
  useEffect(
    () => () => effectCleanUpRef.current && effectCleanUpRef.current(),
    []
  );
}
