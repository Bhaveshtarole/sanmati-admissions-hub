import { useState, useEffect } from "react";

/**
 * Delays updating a value until the specified delay has passed
 * since the last time the value changed. Useful for search inputs
 * to avoid making an API call on every keystroke.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
