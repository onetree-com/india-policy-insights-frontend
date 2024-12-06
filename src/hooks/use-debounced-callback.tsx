import { useCallback, useRef } from "react";

export function useDebouncedCallback(
  callback: (...args: any) => void,
  wait: number
) {
  const timeout = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: any) => {
      const later = () => {
        clearTimeout(timeout.current);
        callback(...args);
      };

      clearTimeout(timeout.current);
      timeout.current = setTimeout(later, wait);
    },
    [callback, wait]
  );
}
