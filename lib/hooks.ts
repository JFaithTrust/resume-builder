import { useEffect, useRef, useCallback } from "react";

/**
 * Custom hook that debounces state updates to reduce frequent operations
 * like localStorage writes or API calls
 */
export function useDebounce<T>(
  value: T,
  callback: (value: T) => void,
  delay: number = 500
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      callback(value);
    }, delay);

    // Cleanup: clear timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, callback, delay]);
}
