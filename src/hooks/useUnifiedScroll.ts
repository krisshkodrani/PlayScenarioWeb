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

    // Only check if user is manually scrolling (not programmatic)
    if (Math.abs(current - prev) > 5) {
      // If user scrolls upward significantly, disable auto-scroll immediately
      if (current < prev - 10) {
        if (isAutoScrollEnabled) setIsAutoScrollEnabled(false);
      } else {
        // Scrolling down: enable only when truly near bottom
        const near = isNearBottom();
        if (near && !isAutoScrollEnabled) setIsAutoScrollEnabled(true);
      }
    }

    prevScrollTopRef.current = current;
  }, [isAutoScrollEnabled, isNearBottom]);

  const scrollToBottom = useCallback((force = false, behavior: ScrollBehavior = 'smooth') => {
    const el = containerRef.current;
    if (!el) return;
    if (!force && !isAutoScrollEnabled) return;

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    rafIdRef.current = requestAnimationFrame(() => {
      try {
        el.scrollTo({ top: el.scrollHeight, behavior });
      } catch {
        // Fallback
        el.scrollTop = el.scrollHeight;
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

  // Cleanup pending RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return { containerRef, scrollToBottom, handleScroll, isAutoScrollEnabled, isNearBottom } as const;
}
