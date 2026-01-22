/**
 * useEvent hook for stable event callbacks
 */
import { useCallback, useLayoutEffect, useRef } from 'react';

/**
 * Returns a stable callback that always refers to the latest version
 * of the passed callback without causing re-renders
 */
export function useEvent(callback) {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback((...args) => {
    return callbackRef.current?.(...args);
  }, []);
}

/**
 * useLatest - always returns the latest value
 */
export function useLatest(value) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

/**
 * useEffectOnce - runs effect only on mount
 */
export function useEffectOnce(effect) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(effect, []);
}

/**
 * useUpdateEffect - runs effect only on updates, not on mount
 */
export function useUpdateEffect(effect, deps) {
  const isFirstMount = useRef(true);

  useLayoutEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * useUnmount - runs callback on unmount
 */
export function useUnmount(callback) {
  const callbackRef = useLatest(callback);

  useLayoutEffect(() => {
    return () => callbackRef.current?.();
  }, [callbackRef]);
}

/**
 * useSafeState - state that doesn't update after unmount
 */
export function useSafeState(initialValue) {
  const isMountedRef = useRef(true);
  const [state, setState] = useState(initialValue);

  useLayoutEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const setSafeState = useCallback((value) => {
    if (isMountedRef.current) {
      setState(value);
    }
  }, []);

  return [state, setSafeState];
}

import { useState, useEffect } from 'react';

/**
 * useRenderCount - tracks number of renders (dev only)
 */
export function useRenderCount() {
  const countRef = useRef(0);
  countRef.current += 1;
  return countRef.current;
}

/**
 * useWhyDidYouUpdate - debug hook to see what props changed
 */
export function useWhyDidYouUpdate(name, props) {
  const previousProps = useRef({});

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changesObj = {};

      allKeys.forEach((key) => {
        if (previousProps.current[key] !== props[key]) {
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changesObj).length) {
        console.log('[why-did-you-update]', name, changesObj);
      }
    }

    previousProps.current = props;
  });
}

/**
 * useMemoCompare - useMemo with custom comparison
 */
export function useMemoCompare(value, compare) {
  const previousRef = useRef();
  const previous = previousRef.current;

  const isEqual = compare(previous, value);

  useEffect(() => {
    if (!isEqual) {
      previousRef.current = value;
    }
  });

  return isEqual ? previous : value;
}

export default useEvent;
