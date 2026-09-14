let lastRealtimeToastAt = 0;

const TOAST_COOLDOWN_MS = 2500;

/** Prevents duplicate toasts when FCM + live unread sync fire together. */
export function shouldShowRealtimeToast(now = Date.now()): boolean {
  if (now - lastRealtimeToastAt < TOAST_COOLDOWN_MS) {
    return false;
  }
  lastRealtimeToastAt = now;
  return true;
}
