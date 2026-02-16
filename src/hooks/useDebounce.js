import { useState, useEffect } from 'react';
import { DEBOUNCE_DELAY } from '../config/constants';

/**
 * Custom hook to debounce a value
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default from constants)
 * @returns {any} Debounced value
 */
export function useDebounce(value, delay = DEBOUNCE_DELAY) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
