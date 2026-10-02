import * as N from 'expo-notifications';
import { Platform } from 'react-native';
import { SLOTS, NUDGES } from './content';

N.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
});

const CHANNEL = 'reminders';

export async function ensurePermission() {
  if (Platform.OS === 'android') {
    await N.setNotificationChannelAsync(CHANNEL, { name: 'Reminders', importance: N.AndroidImportance.DEFAULT });
  }
  const cur = await N.getPermissionsAsync();
  if (cur.granted) return true;
  const req = await N.requestPermissionsAsync();
  return req.granted;
}

const shuffle = (a) => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

// Repeating on-device triggers: no internet, keep firing even if the app is never opened again.
// Mindfulness nudge text is reshuffled every time the app opens or settings change.
export async function reschedule(state) {
  try {
    if (!(await ensurePermission())) return false;
    await N.cancelAllScheduledNotificationsAsync();
    const T = N.SchedulableTriggerInputTypes;
    const ch = Platform.OS === 'android' ? { channelId: CHANNEL } : {};

    for (const s of SLOTS) {
      const cfg = state.slots[s.id];
      if (!cfg || !cfg.on) continue;
      const trigger = s.weekday
        ? { type: T.WEEKLY, weekday: s.weekday, hour: cfg.h, minute: cfg.m, ...ch }
        : { type: T.DAILY, hour: cfg.h, minute: cfg.m, ...ch };
      await N.scheduleNotificationAsync({ content: { title: s.title, body: s.body }, trigger });
    }

    const n = state.nudges;
    if (n.on && n.count > 0 && n.end > n.start) {
      const texts = shuffle(NUDGES);
      for (let k = 0; k < n.count; k++) {
        const t = n.start + ((n.end - n.start) * (k + 0.5)) / n.count;
        const hour = Math.floor(t);
        const minute = Math.round((t - hour) * 60) % 60;
        await N.scheduleNotificationAsync({
          content: { title: 'Mindful moment', body: texts[k % texts.length] },
          trigger: { type: T.DAILY, hour, minute, ...ch },
        });
      }
    }
    return true;
  } catch (e) {
    return false;
  }
}

export async function testNotification() {
  if (!(await ensurePermission())) return false;
  const ch = Platform.OS === 'android' ? { channelId: CHANNEL } : {};
  await N.scheduleNotificationAsync({
    content: { title: 'Mindful moment', body: NUDGES[Math.floor(Math.random() * NUDGES.length)] },
    trigger: { type: N.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 5, ...ch },
  });
  return true;
}
