import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Unified scroll management for chat containers.
 * - Tracks if user is near bottom and only auto-scrolls in that state
 * - Uses requestAnimationFrame to coalesce scroll updates
 * - Exposes a single containerRef and handlers
 */
export function useUnifiedScroll(threshold = 100) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const rafIdRef = useRef<number | null>(null);
  const prevScrollTopRef = useRef<number>(0);
  const userScrollLockRef = useRef<number>(0); // Timestamp when user manually scrolled
  const scrollLockTimeoutRef = useRef<number | null>(null);

  const isNearBottom = useCallback(() => {
    const el = containerRef.current;
    if (!el) return true;
    const { scrollTop, scrollHeight, clientHeight } = el;
    return scrollHeight - (scrollTop + clientHeight) < threshold;
  }, [threshold]);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const prev = prevScrollTopRef.current;
    const current = el.scrollTop;
    
    // Detect manual scroll (significant movement)
    const scrollDelta = Math.abs(current - prev);
    if (scrollDelta > 3) {
      // If user scrolls up manually, lock auto-scroll for 3 seconds
      if (current < prev - 5) {
        userScrollLockRef.current = Date.now();
        setIsAutoScrollEnabled(false);
        
        // Clear existing timeout
        if (scrollLockTimeoutRef.current) {
          clearTimeout(scrollLockTimeoutRef.current);
        }
        
        // Re-enable auto-scroll after 3 seconds of no manual scroll
        scrollLockTimeoutRef.current = window.setTimeout(() => {
          if (isNearBottom()) {
            setIsAutoScrollEnabled(true);
          }
        }, 3000);
      }
      // If user scrolls down and is near bottom, re-enable auto-scroll
      else if (current > prev && isNearBottom()) {
        const timeSinceManualScroll = Date.now() - userScrollLockRef.current;
        if (timeSinceManualScroll > 1000) { // 1 second grace period
          setIsAutoScrollEnabled(true);
        }
      }
    }

    prevScrollTopRef.current = current;
  }, [isNearBottom]);

  const scrollToBottom = useCallback((force = false, behavior: ScrollBehavior = 'smooth') => {
    const el = containerRef.current;
    if (!el) return;
    
    // Check if user manually scrolled recently - if so, don't auto-scroll unless forced
    const timeSinceManualScroll = Date.now() - userScrollLockRef.current;
    if (!force && timeSinceManualScroll < 3000) {
      return; // User scrolled manually within last 3 seconds, don't auto-scroll
    }
    
    if (!force && !isAutoScrollEnabled) return;

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    rafIdRef.current = requestAnimationFrame(() => {
      try {
        el.scrollTo({ top: el.scrollHeight, behavior });
        // Update our tracking
        prevScrollTopRef.current = el.scrollTop;
      } catch {
        // Fallback
        el.scrollTop = el.scrollHeight;
        prevScrollTopRef.current = el.scrollTop;
      }
    });
  }, [isAutoScrollEnabled]);

  // Initialize prev scrollTop and state on mount
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      prevScrollTopRef.current = el.scrollTop;
      // Set based on initial position
      setIsAutoScrollEnabled(isNearBottom());
    }
  }, [isNearBottom]);

  // Cleanup pending RAF and timeouts on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (scrollLockTimeoutRef.current) {
        clearTimeout(scrollLockTimeoutRef.current);
      }
    };
  }, []);

  return { containerRef, scrollToBottom, handleScroll, isAutoScrollEnabled, isNearBottom } as const;
}
