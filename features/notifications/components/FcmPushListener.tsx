"use client";

import { useFcmPush } from "../hooks/useFcmPush";
import { useLiveNotificationSync } from "../hooks/useLiveNotificationSync";

/**
 * Mount once under QueryProvider.
 * - FCM: instant toast + refetch when a web push arrives
 * - Live sync: short visible-tab polling so badge / tracker update even without FCM
 */
export function FcmPushListener() {
  useFcmPush();
  useLiveNotificationSync();
  return null;
}
