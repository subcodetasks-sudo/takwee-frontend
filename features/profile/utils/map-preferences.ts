import type { ApiPreferencesData, ProfilePreferencesData } from "../types";

export function mapPreferences(data: ApiPreferencesData): ProfilePreferencesData {
  return {
    notifications: {
      email: Boolean(data.notifications?.email),
      sms: Boolean(data.notifications?.sms),
      push: Boolean(data.notifications?.push),
    },
    ui: {
      theme: data.ui?.theme || "system",
      compactMode: Boolean(data.ui?.compact_mode),
    },
  };
}

export function mapPreferencesToApi(prefs: ProfilePreferencesData): ApiPreferencesData {
  return {
    notifications: {
      email: prefs.notifications.email,
      sms: prefs.notifications.sms,
      push: prefs.notifications.push,
    },
    ui: {
      theme: prefs.ui.theme,
      compact_mode: prefs.ui.compactMode,
    },
  };
}
