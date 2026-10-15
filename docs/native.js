// Thin layer over the Capacitor plugins. In a plain browser everything here is a harmless no-op.
const cap = globalThis.Capacitor;
// Needs Capacitor's runtime (capacitor.js) for registerPlugin; without it we simply behave like the web version.
export const isNative = !!cap?.isNativePlatform?.() && typeof cap.registerPlugin === 'function';
const LN = isNative ? cap.registerPlugin('LocalNotifications') : null;
const BG = isNative ? cap.registerPlugin('BackgroundGeolocation') : null;
const FENCE = isNative ? cap.registerPlugin('LeaveFence') : null;
const AD = isNative ? cap.registerPlugin('AdMob') : null;
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
 ({ id: o.id, title: o.title, body: o.body, largeBody: o.body, largeIcon: 'ic_notif_large', schedule: { at: o.at, allowWhileIdle: true }, extra: { route: o.route, exId: o.exId }, ...(o.exId ? { actionTypeId: 'EX' } : {}) })),
  });
}

export async function fireNow(id, title, body, route, exId) {
  if (!LN) return;
  await LN.schedule({ notifications: [{ id, title, body, largeBody: body, largeIcon: 'ic_notif_large', schedule: { at: new Date(Date.now() + 1500), allowWhileIdle: true }, extra: { route, exId }, ...(exId ? { actionTypeId: 'EX' } : {}) }] });
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

// One-time "unlock the advanced teachings" purchase. The store billing is hooked up here when the app is published.
export async function buyUnlock() { throw new Error('not-ready'); }
export async function restoreUnlock() { throw new Error('not-ready'); }

/* ---------- ads (Play build only, and never for people who bought the unlock) ---------- */
let adReady = null;
export function initAds(cfg) {
  if (!AD) return Promise.resolve(false);
  if (!adReady) adReady = (async () => {
    try {
      const info = await AD.requestConsentInfo(); // the EU / UK consent form, when it is required
      if (info.isConsentFormAvailable && info.status === 'REQUIRED') await AD.showConsentForm();
      await AD.initialize({ initializeForTesting: !!cfg.isTesting });
      return true;
    } catch (e) { return false; }
  })();
  return adReady;
}
export async function showBanner(cfg, margin) {
  if (!(await initAds(cfg))) return;
  try { await AD.showBanner({ adId: cfg.banner, adSize: 'ADAPTIVE_BANNER', position: 'BOTTOM_CENTER', margin, isTesting: !!cfg.isTesting }); } catch (e) {}
}
export async function hideBanner() {
  if (!AD || !adReady) return;
  try { await AD.removeBanner(); } catch (e) {}
}
// Resolves when the person watched the ad to the end; rejects if it could not play or was closed early.
export async function rewardedAd(cfg) {
  if (!(await initAds(cfg))) throw new Error('ads-unavailable');
  await AD.prepareRewardVideoAd({ adId: cfg.rewarded, isTesting: !!cfg.isTesting });
  let earned = false;
  const a = await AD.addListener('onRewardedVideoAdReward', () => { earned = true; });
  try {
    await new Promise(async (resolve, reject) => {
      const b = await AD.addListener('onRewardedVideoAdDismissed', () => { b.remove(); resolve(); });
      try { await AD.showRewardVideoAd(); } catch (e) { b.remove(); reject(e); }
    });
  } finally { a.remove(); }
  if (!earned) throw new Error('closed-early');
  return true;
}
