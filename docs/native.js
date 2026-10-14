// Thin layer over the Capacitor plugins. In a plain browser everything here is a harmless no-op.
const cap = globalThis.Capacitor;
// Needs Capacitor's runtime (capacitor.js) for registerPlugin; without it we simply behave like the web version.
export const isNative = !!cap?.isNativePlatform?.() && typeof cap.registerPlugin === 'function';
const LN = isNative ? cap.registerPlugin('LocalNotifications') : null;
const BG = isNative ? cap.registerPlugin('BackgroundGeolocation') : null;
const FENCE = isNative ? cap.registerPlugin('LeaveFence') : null;
export const isIOS = isNative && cap.getPlatform?.() === 'ios';

// Notification buttons on exercise reminders.
LN?.registerActionTypes({ types: [{ id: 'EX', actions: [{ id: 'rules', title: 'See rules' }, { id: 'done', title: 'Completed' }] }] }).catch(() => {});

export async function ensurePerms() {
  if (!LN) return false;
  const p = await LN.requestPermissions();
  if (p.display !== 'granted') return false;
  try {
    const e = await LN.checkExactNotificationSetting();
    if (e.exact_alarm !== 'granted') await LN.changeExactNotificationSetting();
  } catch (err) {}
  return true;
}

export async function permState() {
  if (!LN) return 'unsupported';
  try { return (await LN.checkPermissions()).display; } catch (e) { return 'unsupported'; }
}

// Replace every pending alarm with `list` = [{ id, title, body, at: Date, route }]
export async function scheduleAll(list) {
  if (!LN) return;
  const pend = await LN.getPending();
  if (pend.notifications.length) await LN.cancel({ notifications: pend.notifications.map((n) => ({ id: n.id })) });
  if (!list.length) return;
  await LN.schedule({
    notifications: (isIOS ? list.slice(0, 60) : list).map((o) => // iPhones keep at most 64 scheduled reminders, so only the nearest ones are scheduled; opening the app refills them
 ({ id: o.id, title: o.title, body: o.body, largeBody: o.body, schedule: { at: o.at, allowWhileIdle: true }, extra: { route: o.route, exId: o.exId }, ...(o.exId ? { actionTypeId: 'EX' } : {}) })),
  });
}

export async function fireNow(id, title, body, route, exId) {
  if (!LN) return;
  await LN.schedule({ notifications: [{ id, title, body, largeBody: body, schedule: { at: new Date(Date.now() + 1500), allowWhileIdle: true }, extra: { route, exId }, ...(exId ? { actionTypeId: 'EX' } : {}) }] });
}

export function onTap(fn) {
  LN?.addListener('localNotificationActionPerformed', (ev) => fn(ev.notification?.extra?.route, ev.actionId, ev.notification?.extra?.exId));
}

/* ---------- location (leaving home) ---------- */
let watcher = null;
const dist = (a, b) => {
  const R = 6371000, rad = Math.PI / 180;
  const dLat = (b.latitude - a.latitude) * rad, dLon = (b.longitude - a.longitude) * rad;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.latitude * rad) * Math.cos(b.latitude * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
};

export async function currentPosition() {
  if (isIOS && FENCE) return FENCE.currentPosition();
  if (BG) {
    return new Promise(async (resolve, reject) => {
      let id;
      const done = async (fn, v) => { if (id) await BG.removeWatcher({ id }); fn(v); };
      id = await BG.addWatcher({ requestPermissions: true, stale: false, distanceFilter: 0 }, (loc, err) => {
        if (err) return done(reject, err);
        if (loc) done(resolve, { latitude: loc.latitude, longitude: loc.longitude });
      });
      setTimeout(() => done(reject, new Error('timeout')), 30000);
    });
  }
  return new Promise((res, rej) => navigator.geolocation.getCurrentPosition((p) => res(p.coords), rej, { enableHighAccuracy: true, timeout: 20000 }));
}

// Hands the phone's own geofencing the edge of home. The phone, not this app, watches for you leaving (almost no battery),
// and posts the reminders itself. home=null (or no items) switches it off.
export async function setFence(home, items, win) {
  if (!FENCE) return;
  try {
    await FENCE.set(home && items.length ? { lat: home.latitude, lng: home.longitude, radius: home.r, startH: win.s, endH: win.e, n: win.n, items } : {});
  } catch (e) { console.error('fence', e); }
}

// Opens the page of a "leaving home" notification that was tapped.
export function onRoute(fn) {
  if (!FENCE) return;
  FENCE.addListener('route', (ev) => ev?.route && fn(ev.route));
  const take = () => FENCE.takeRoute().then((r) => r?.route && fn(r.route)).catch(() => {});
  take(); document.addEventListener('visibilitychange', () => { if (!document.hidden) take(); });
}
