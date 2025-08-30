import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * A hook that throttles rapid state updates. It accepts frequent updates but only
 * commits them to React state on a specified interval, preventing excessive re-renders.
 *
 * @param initialState The initial state value.
 * @param delay The throttle delay in milliseconds.
 * @returns A tuple: [throttledState, updateState, isStale]
 * - `throttledState`: The state value, updated only once per `delay`.
 * - `updateState`: A function to call with new state values as often as needed.
 * - `isStale`: A boolean indicating if the buffered value is newer than the throttledState.
 */
export function useThrottledState<T>(initialState: T, delay: number): [T, (newState: T | ((prevState: T) => T)) => void, boolean] {
  const [throttledState, setThrottledState] = useState<T>(initialState);
  const bufferRef = useRef<T>(initialState);
  const hasPendingUpdateRef = useRef<boolean>(false);
  const isStale = hasPendingUpdateRef.current && bufferRef.current !== throttledState;

  const updateState = useCallback((newState: T | ((prevState: T) => T)) => {
    if (typeof newState === 'function') {
      bufferRef.current = (newState as (prevState: T) => T)(bufferRef.current);
    } else {
      bufferRef.current = newState;
    }
    hasPendingUpdateRef.current = true;
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (hasPendingUpdateRef.current) {
        setThrottledState(bufferRef.current);
        hasPendingUpdateRef.current = false;
      }
    }, delay);

    return () => clearInterval(timerId);
  }, [delay]);

  // Final flush on unmount or if the delay changes
  useEffect(() => {
    return () => {
      if (hasPendingUpdateRef.current) {
        setThrottledState(bufferRef.current);
      }
    };
  }, []);

  return [throttledState, updateState, isStale];
}
