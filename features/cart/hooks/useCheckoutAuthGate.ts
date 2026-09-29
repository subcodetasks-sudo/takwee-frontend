"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { useAuth } from "@/features/auth";

/**
 * Intercepts checkout navigation for guests and opens the sign-in warning dialog.
 * Authenticated visitors continue to checkout. A click during session load waits
 * until auth resolves, then opens the dialog only when the visitor is a guest.
 */
export function useCheckoutAuthGate() {
  const { isAuthenticated, isLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const pendingRef = useRef(false);

  const onCheckoutClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (isAuthenticated) return;
      event.preventDefault();
      if (isLoading) {
        pendingRef.current = true;
        return;
      }
      setOpen(true);
    },
    [isAuthenticated, isLoading],
  );

  useEffect(() => {
    if (!pendingRef.current || isLoading) return;
    pendingRef.current = false;
    if (!isAuthenticated) setOpen(true);
  }, [isAuthenticated, isLoading]);

  return { open, setOpen, onCheckoutClick };
}
