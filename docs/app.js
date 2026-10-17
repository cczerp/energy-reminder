import { PACKAGES, EVERYTHING_ID, UNLOCK_AT, pkgFor, CATS, EXERCISES, MILESTONES, exById, CHAKRAS, CHAKRA_INTRO, CYCLES, REMIND_GROUPS, CAT_LABEL, REMIND_DEFAULTS, NUDGES, SAYING_SETS, PING, SCALE, SCALE_UP, ATTN_LESSON, WHY, CAT_TEACH } from './content.js';
import * as native from './native.js';
import { BUILD } from './build.js';
import { PAYWALL, ADS, ADMOB } from './config.js';

/* ---------------- storage ---------------- */
const KEY = 'mindful-v2';
const clone = (o) => JSON.parse(JSON.stringify(o)); // older phone web engines lack structuredClone
const fresh = () => ({ rem: clone(REMIND_DEFAULTS), milestones: {}, sessions: [], recalls: [], tally: {}, days: {}, owned: [], adPass: null, tourSeen: false, fast: { on: false, days: 3, start: '', done: {} }, learned: {}, sets: [], scale: [], wheels: [], loops: {} });
let S;
try { S = { ...fresh(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch (e) { S = fresh(); }
// Brings saved settings (including older versions' shapes) up to the current shape.
// Daily goal of a group: one per ticked exercise, or just 1 when "pick one at random" is on. Routine meditation counts its reminders.
const goalFor = (g, c) => (g.simple ? c.n : c.random ? 1 : Math.max(1, c.ex.length));
const mergeRem = (r = {}) => {
  const d = clone(REMIND_DEFAULTS); const day = { ...d.day, ...r.day };
  const evenMins = (n) => Array.from({ length: n }, (_, k) => Math.round((day.s * 60 + ((day.e - day.s) * 60 * (k + 0.5)) / n) / 15) * 15);
  const cat = {};
  for (const g of REMIND_GROUPS) {
    const o = (r.cat || {})[g.id] || {}; const base = d.cat[g.id]; const c = { ...base, ...o };
    c.timing = c.timing === 'time' ? 'set' : ['set', 'even', 'random'].includes(c.timing) ? c.timing : base.timing;
    c.ex = (c.ex || []).filter((x) => g.pool.includes(x) || g.leave.includes(x)); if (!c.ex.length) c.ex = base.ex.slice();
    g.leave.forEach((id) => { const was = (r.leaveItems || {})[id]; if (was && !c.ex.includes(id)) c.ex.push(id); if (was === false && !o.ex) c.ex = c.ex.filter((x) => x !== id); }); // older saves kept leave-home on/off separately
    c.n = Math.max(1, Math.min(4, parseInt(c.n, 10) || 1));
    c.goal = Math.max(1, Math.min(4, parseInt(o.goal, 10) || parseInt(o.n, 10) || 1)); // older saves used one number for both
    if (!Array.isArray(o.times) || !o.times.length) c.times = typeof o.h === 'number' ? [o.h * 60 + (o.m || 0)] : base.times.slice(); // older saves stored one h/m
    const pad = evenMins(c.n); while (c.times.length < c.n) c.times.push(pad[c.times.length]);
    if (g.id === 'bed' && !o.times && r.recall && typeof r.recall.h === 'number') c.times = [r.recall.h * 60 + (r.recall.m || 0)]; // evening recall moved into Bedtime
    if (g.id === 'bed' && o.on === undefined && r.recall && r.recall.on === false) c.on = false;
    if (g.simple) { c.ex = g.pool.slice(); c.goal = c.n; c.timing = 'even'; c.choose = true; } // routine meditation: you only choose how many reminders, then pick a meditation when one rings
    if (c.random === undefined) c.random = (parseInt(o.goal, 10) || 1) === 1 && c.ex.length > 1; // older saves: goal 1 with several ticked meant "one of them"
    c.random = !!c.random;
    if (c.random && !g.simple) { if (!c.exPrev) c.exPrev = c.ex.slice(); c.ex = [...g.pool, ...g.leave]; } // "1 at random" draws from all of them
    c.goal = goalFor(g, c);
    c.times = c.times.slice(0, c.n); c.choose = c.choose !== false; delete c.h; delete c.m;
    cat[g.id] = c;
  }
  const leaveItems = {}; REMIND_GROUPS.forEach((g) => g.leave.forEach((id) => { leaveItems[id] = cat[g.id].ex.includes(id); })); // leave-home exercises are simply ticked in their group
  return { ...d, ...r, cat, day, mind: { ...d.mind, ...r.mind }, leave: { ...d.leave, ...r.leave }, recall: { ...d.recall, ...r.recall }, leaveItems };
};
S.rem = mergeRem(S.rem);
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} changed(); };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const dayKey = (t = Date.now()) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const dayNum = (d = new Date()) => Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmtTime = (h, m = 0) => { h %= 24; return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`; };
const when = (t) => new Date(t).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

const practiceDays = () => new Set([...S.sessions, ...S.recalls].map((x) => dayKey(x.ts)).concat(Object.keys(S.tally || {})));
const tallyOf = (id, day = dayKey()) => (S.tally?.[day] || {})[id] || 0;
// Done button: counts it toward the goal and puts a dated entry in the Log.
function quickDone(id) { bump(id); S.sessions.unshift({ id: uid(), ts: Date.now(), ex: id, focus: null, note: '', quick: true }); save(); }
function bump(id) { const k = dayKey(); if (!S.tally) S.tally = {}; if (!S.tally[k]) S.tally[k] = {}; S.tally[k][id] = (S.tally[k][id] || 0) + 1; save(); }
function toast(t) {
  const el = document.createElement('div'); el.textContent = t;
  el.style.cssText = 'position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#6fcf97;color:#1e1833;padding:10px 18px;border-radius:20px;font-weight:700;z-index:9';
  document.body.appendChild(el); setTimeout(() => el.remove(), 2200 + t.length * 40);
}
function streak() {
  const days = practiceDays(); let n = 0; const d = new Date();
  if (!days.has(dayKey(d.getTime()))) d.setDate(d.getDate() - 1);
  while (days.has(dayKey(d.getTime()))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
// Remembers what today's plan was, so the day can be reviewed later even if settings change.
function snapPlan() {
  const k = dayKey(); const p = { cats: {}, recall: false };
  REMIND_GROUPS.forEach((g) => { if (S.rem.cat[g.id].on && ready(g)) p.cats[g.id] = S.rem.cat[g.id].goal; });
  if (!S.days) S.days = {};
  if (JSON.stringify(S.days[k]) !== JSON.stringify(p)) { S.days[k] = p; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
}
function dayStatus(k) {
  const p = S.days?.[k]; const done = []; const miss = [];
  if (p) {
    for (const gid of Object.keys(p.cats)) { const cnt = catCount(gid, k); (cnt >= p.cats[gid] ? done : miss).push(`${group(gid).label} · ${cnt} of ${p.cats[gid]}`); }
    if (p.recall) (S.recalls.some((r) => dayKey(r.ts) === k) ? done : miss).push('Evening recall');
  }
  const extra = Object.entries(S.tally?.[k] || {}).filter(([id, n]) => n && !REMIND_GROUPS.some((g) => g.pool.includes(id))).map(([id, n]) => `${exById[id]?.title || id} × ${n}`);
  return { done, miss, extra, total: done.length + miss.length, perfect: !!p && !miss.length && done.length > 0 };
}
const isLocked = (ex) => (ex.needs || []).some((n) => !S.milestones[n]);

/* ---------------- reminders ---------------- */
// Deterministic occurrences for a given day, shared by the native scheduler, the in-app scheduler and the calendar export.
function rng(seed) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  return () => { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
}
const group = (id) => REMIND_GROUPS.find((g) => g.id === id);
// completions today in a category's timed exercises (leave-home items keep their own tally)
const catCount = (gid, day = dayKey()) => {
  const g = group(gid), c = S.rem.cat[gid], all = [...g.pool, ...g.leave];
  if (g.simple) return all.reduce((n, id) => n + tallyOf(id, day), 0);
  if (c.random) return all.some((id) => tallyOf(id, day)) ? 1 : 0;
  return c.ex.filter((id) => tallyOf(id, day) > 0).length;
};
const catDone = (gid, day = dayKey()) => catCount(gid, day) >= S.rem.cat[gid].goal;
const nudgePool = () => NUDGES.concat(...SAYING_SETS.filter((x) => (S.sets || []).includes(x.id)).map((x) => x.sayings)); // plain sayings plus any lesson sets the person switched on
const setCard = (id) => { const x = SAYING_SETS.find((y) => y.id === id), on = (S.sets || []).includes(id); return card(`${check(on, '<b>Add these sayings to my reminders</b>', 'sayset:' + id, on ? 'On. They now come up in your mindfulness reminders.' : `${x.sayings.length} short sayings from this lesson. Press once you have read it.`)}`); };
const canLeave = () => native.isNative && !!S.rem.home;
const ownedPkgs = () => PACKAGES.filter((k) => S.owned.includes(k.pid)).length;
const hasAll = () => S.owned.includes(EVERYTHING_ID) || ownedPkgs() >= UNLOCK_AT; // the everything purchase, or enough packages (which earns the rest)
const adsOn = () => ADS && native.isNative && !S.owned.length; // ads only in the store build, and never after any purchase
const passed = (id) => !!S.adPass && S.adPass.day === dayKey() && S.adPass.ids.includes(id); // a meditation opened for today by watching an ad (never the Info pages)
const locked = (key) => { const k = pkgFor(key); return PAYWALL && !!k && !hasAll() && !S.owned.includes(k.pid) && !passed(key); }; // advanced teachings in a store build, until bought
const gated = (id) => { const e = exById[id]; return !!(e && e.gate && !(S.learned || {})[e.gate]); }; // attention practices wait until the lesson's switch is on
const off = (id) => locked(id) || gated(id);
const ready = (g) => !g.gate || !!(S.learned || {})[g.gate]; // a group with a gate stays out of Today and Settings until its Info switch is on
const schedEx = (gid) => S.rem.cat[gid].ex.filter((id) => group(gid).pool.includes(id) && !off(id)); // exercises that ring at scheduled times (not leave-home ones)
const choosing = (gid) => !S.rem.cat[gid].random && schedEx(gid).length > 1; // several to do: the reminder opens the list
const todayPick = (gid) => (schedEx(gid).length ? planned(gid) : S.rem.cat[gid].ex[0]);
// the exercise a reminder names when it is not asking you to choose (rotates through the ones you picked)
function planned(gid, date = new Date(), k = 0) { const list = schedEx(gid); return list[(dayNum(date) + k + REMIND_GROUPS.findIndex((g) => g.id === gid)) % list.length]; }
// minutes after midnight for n reminders on one day
function minutesFor(id, n, mode, date) {
  const { s, e } = S.rem.day; const lo = s * 60, hi = e * 60, span = hi - lo;
  if (mode === 'even') return Array.from({ length: n }, (_, k) => Math.round(lo + (span * (k + 0.5)) / n));
  const r = rng(`${dayKey(date.getTime())}|${id}`); const out = [];
  for (let tries = 0; out.length < n && tries < 80; tries++) {
    const m = Math.round(lo + r() * span);
    if (tries > 60 || out.every((x) => Math.abs(x - m) >= Math.min(60, span / (n + 1)))) out.push(m);
  }
  return out.sort((a, b) => a - b);
}
function occurrences(date) {
  const out = [];
  const isToday = dayKey(date.getTime()) === dayKey();
  for (const g of REMIND_GROUPS) {
    const c = S.rem.cat[g.id];
    if (!c.on || !schedEx(g.id).length || (isToday && catDone(g.id))) continue;
    const mins = c.timing === 'set' ? c.times.slice(0, c.n) : minutesFor(g.id, c.n, c.timing, date);
    mins.forEach((m, k) => {
      const base = { id: `${g.id}${k}`, cat: g.id, at: at(date, Math.floor(m / 60), m % 60), label: g.label };
      if (choosing(g.id)) {
        out.push({ ...base, title: `${g.label}: pick one`, body: schedEx(g.id).map((x) => exById[x].title).join(' · '), route: `#cat/${g.id}` });
      } else {
        const id = planned(g.id, date, k); const ex = exById[id];
        out.push({ ...base, title: `${g.label}: ${ex.title}`, body: PING[id] || ex.summary, route: `#ex/${id}`, exId: id });
      }
    });
  }
  const mi = S.rem.mind;
  if (mi.on) minutesFor('mind', mi.n, 'even', date).forEach((m, k) =>
    out.push({ id: `mind${k}`, at: at(date, Math.floor(m / 60), m % 60), label: 'Mindfulness', title: 'Mindful moment', body: nudgePool()[(dayNum(date) * 17 + k * 7) % nudgePool().length], route: '#today' }));
  // keep reminders from stacking: nudge anything within 10 minutes of the previous one
  out.sort((a, b) => a.at - b.at);
  for (let i = 1; i < out.length; i++) if (out[i].at - out[i - 1].at < 10 * 60000 && out[i].id !== 'recall') out[i].at = new Date(out[i - 1].at.getTime() + 10 * 60000);
  return out;
}
const at = (date, h, m) => { const d = new Date(date); d.setHours(h, m, 0, 0); return d; };

let syncT;
function changed() { clearTimeout(syncT); syncT = setTimeout(syncNative, 800); }
async function syncNative() {
  if (!native.isNative) return;
  try {
    if ((await native.permState()) !== 'granted') return;
    const list = []; const now = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(now); d.setDate(d.getDate() + i);
      occurrences(d).filter((o) => o.at > now).forEach((o, k) => list.push({ id: (dayNum(d) % 1000) * 1000 + k, title: o.title, body: o.body, at: o.at, route: o.route, exId: o.exId }));
    }
    await native.scheduleAll(list);
    const items = REMIND_GROUPS.filter((g) => S.rem.cat[g.id].on).flatMap((g) => [...g.leave, ...(g.both || [])].filter((id) => S.rem.cat[g.id].ex.includes(id)).map((id) =>
      ({ id, title: `${g.label}: ${exById[id].title}`, body: PING[id] || exById[id].summary, route: `#ex/${id}`, doneDay: tallyOf(id) > 0 ? dayKey() : '' })));
    await native.setFence(canLeave() ? S.rem.home : null, items, { s: 0, e: 24, n: S.rem.leave.n });
  } catch (e) { console.error('sync failed', e); }
}
// Fired when you step out of the home circle: remind each switched-on leave-home exercise (Stair Count, Stranger's Face), once a day each.
function onLeave() {
  const day = dayKey(); let st = {}; try { st = JSON.parse(localStorage.getItem('mindful-leave') || '{}'); } catch (e) {}
  if (st.day !== day) st = { day, cnt: {}, last: 0 };
  const h = new Date().getHours() + new Date().getMinutes() / 60;
  if (h < S.rem.leave.s || h > S.rem.leave.e || Date.now() - st.last < 20 * 60000) return;
  let k = 0;
  for (const g of REMIND_GROUPS) {
    if (!S.rem.cat[g.id].on) continue;
    for (const id of g.leave) {
      if (!S.rem.leaveItems[id] || (st.cnt[id] || 0) >= 1 || tallyOf(id) > 0) continue;
      st.cnt[id] = 1; st.last = Date.now();
      native.fireNow(900000 + Math.floor(Math.random() * 90000) + k++, `${g.label}: ${exById[id].title}`, PING[id] || exById[id].summary, `#ex/${id}`, id);
    }
  }
  try { localStorage.setItem('mindful-leave', JSON.stringify(st)); } catch (e) {}
}

const firedKey = 'mindful-fired';
function checkDue() {
  if (native.isNative) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  let fired = {}; try { fired = JSON.parse(localStorage.getItem(firedKey) || '{}'); } catch (e) {}
  const today = dayKey(); if (!fired[today]) fired = { [today]: [] };
  const now = Date.now();
  for (const o of occurrences(new Date())) {
    const age = now - o.at.getTime();
    if (age >= 0 && age < 30 * 60000 && !fired[today].includes(o.id)) { fired[today].push(o.id); notify(o.title, o.body); }
  }
  try { localStorage.setItem(firedKey, JSON.stringify(fired)); } catch (e) {}
}
function notify(title, body) {
  const opts = { body, icon: 'icon-192.png', badge: 'icon-192.png', tag: title + body };
  navigator.serviceWorker?.ready.then((r) => r.showNotification(title, opts)).catch(() => { try { new Notification(title, opts); } catch (e) {} });
}
setInterval(checkDue, 20000);
document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && checkDue());

function exportCalendar() {
  const pad = (n) => String(n).padStart(2, '0');
  const stamp = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const tx = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Timbre Tamer//EN', 'CALSCALE:GREGORIAN'];
  const now = new Date().toISOString().replace(/[-:]|\.\d+/g, '');
  for (let i = 0; i < 14; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    for (const o of occurrences(d)) {
      if (o.at < new Date()) continue;
      const end = new Date(o.at.getTime() + 5 * 60000);
      L.push('BEGIN:VEVENT', `UID:${dayKey(o.at.getTime())}-${o.id}@mindcue`, `DTSTAMP:${now}`, `DTSTART:${stamp(o.at)}`, `DTEND:${stamp(end)}`,
        `SUMMARY:${tx(o.title)}`, `DESCRIPTION:${tx(o.body)}`, 'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${tx(o.title)}`, 'TRIGGER:PT0S', 'END:VALARM', 'END:VEVENT');
    }
  }
  L.push('END:VCALENDAR');
  download('timbre-tamer-reminders.ics', 'text/calendar', L.join('\r\n'));
}
function download(name, type, text) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name; document.body.appendChild(a); a.click(); a.remove();
}

/* ---------------- ui helpers ---------------- */
const card = (inner, o = '') => `<div class="card ${o}">${inner}</div>`;
const link = (href, inner, o = '') => `<a class="card ${o}" href="${href}">${inner}</a>`;
let setOpen = {}; // which settings blocks are dropped down
const head = (on, label, sub, act, key) => `<div class="check ${on ? 'on' : ''}"><div class="box" data-act="${act}">${on ? '✓' : ''}</div><div style="flex:1" data-act="sopen:${key}"><div>${label}</div>${sub ? `<div class="dim sm">${sub}</div>` : ''}</div><div class="dim" style="padding:0 4px" data-act="sopen:${key}">${setOpen[key] ? '▴' : '▾'}</div></div>`;
const check = (on, label, act, sub = '') => `<div class="check ${on ? 'on' : ''}" data-act="${act}"><div class="box">${on ? '✓' : ''}</div><div><div>${label}</div>${sub ? `<div class="dim sm">${sub}</div>` : ''}</div></div>`;
const stepper = (name, val, fmt) => `<span class="stepper"><button data-act="dec:${name}">−</button><span>${fmt ? fmt(val) : val}</span><button data-act="inc:${name}">+</button></span>`;
const rating = (name, val) => `<div class="rating">${[1, 2, 3, 4, 5].map((n) => `<button data-act="rate:${name}:${n}" class="${val >= n ? 'on' : ''}">${n}</button>`).join('')}</div>`;
const back = (href = '#practice') => `<a class="back" href="${href}">‹ Back</a>`;

/* ---------------- screens ---------------- */

/* ---------------- frequency fast ---------------- */
const FAST_RULES = ['Fast from news, fear-based feeds, doom-scrolling, gossip, and complaint conversations. Spoken fear feeds the same thought-forms as watched fear.', 'When you feel the pull (the hand reaching for the phone, the mouth starting "did you hear about..."), pause and ask: "Is this mine? Do I choose to give my energy to this?"', 'Put the freed-up time into anything creative, even trivially. The fast is only complete when the energy has somewhere to go. An empty fast gets refilled by the same fear.'];
const fastDay = () => (S.fast.start ? Math.floor((new Date(dayKey() + 'T00:00') - new Date(S.fast.start + 'T00:00')) / 86400000) + 1 : 0);
const fastRunning = () => { const d = fastDay(); return d >= 1 && d <= S.fast.days; };
const fastRulesBox = () => `<div class="rulesbox"><div class="rtitle">The rules</div><ol>${FAST_RULES.map((r) => `<li>${esc(r)}</li>`).join('')}</ol></div>`;
function fastCard() {
  const f = S.fast; const d = fastDay();
  if (!f.start) return '';
  if (d > f.days) return card(`<div class="cheer"><div class="pop">🌿</div><div class="title">Frequency Fast complete</div><div class="meta">${f.days} day${f.days === 1 ? '' : 's'}. Notice what filled the space.</div><button class="btn" style="margin-top:10px" data-act="fastend">Done</button></div>`, 'accent');
  if (d < 1) return '';
  const t = f.done[dayKey()] || {};
  const row = (k, label) => `<div class="bul" data-act="fastck:${k}"><span class="bx ${t[k] ? 'on' : ''}">${t[k] ? '✓' : ''}</span><span>${label}</span></div>`;
  return card(`<div class="title">Frequency Fast</div><div class="meta">Day ${d} of ${f.days}${t.a && t.b ? ' · today is complete ✓' : ''}</div>
    ${row('a', 'Stayed off news, fear-feeds, doom-scrolling, gossip and complaining')}${row('b', 'Put the freed-up time into something creative')}
    <div class="meta" style="margin-top:6px">When you feel the pull: "Is this mine? Do I choose to give my energy to this?"</div>`);
}
function morningCards() {
  const yk = dayKey(Date.now() - 86400000); let out = ''; const on = S.rem.cat.bed.on ? S.rem.cat.bed.ex : [];
  if (on.includes('bed-sats') && tallyOf('bed-sats', yk) && !S.loops[yk]) out += card(`<div class="title" style="font-size:20px">Last night's loop</div><div class="meta">Rate it: was it fantasy, story, or memory?</div><div class="chips">${['fantasy', 'story', 'memory'].map((x) => `<button class="chip" data-act="loop:${x}:${yk}">${x[0].toUpperCase() + x.slice(1)}</button>`).join('')}</div>`);
  if (on.includes('bed-revision') && tallyOf('bed-revision', yk) && !S.loops[yk + 'r']) out += card(`<div class="title" style="font-size:20px">Yesterday, revised</div><div class="meta">One event from yesterday went differently in my world. Note any echoes today.</div><div class="row" style="margin-top:8px"><a class="btn ghost mini" href="#note">Quick note</a><button class="btn mini" data-act="loopr:${yk}">Got it</button></div>`);
  if (on.includes('bed-belief') && tallyOf('bed-belief', yk) && !S.loops[yk + 'b']) out += card(`<div class="title" style="font-size:20px">Last night's belief</div><div class="meta">You handed a belief back and chose a new one. Notice today whether the old one tries to return. Do not fight it, just notice.</div><div class="row" style="margin-top:8px"><a class="btn ghost mini" href="#note">Quick note</a><button class="btn mini" data-act="loopb:${yk}">Got it</button></div>`);
  return out;
}

/* ---------------- emotional scale ---------------- */
let sc = null;
function Scale() {
  const hist = S.scale.slice(0, 5).map((r) => `<div class="meta">${when(r.ts)} · ${r.start} → ${r.end}${r.start - r.end > 0 ? ` (up ${r.start - r.end})` : ''}</div>`).join('');
  if (!sc) return `${back('#practice')}<h1>Climbing the Scale</h1>
    <p class="dim">You can only climb one to three rungs at a time. Trying to jump to joy from the bottom just proves you are failing. Any upward step is success. Your emotion is guidance, not a verdict: it reads out the gap between you and what you want.</p>
    <p class="dim">Where are you right now, 1 to 22?</p>
    ${SCALE.map((r) => `<div class="bul scrung" data-act="scstart:${r.n}"><b class="pd">${r.n}</b><span>${esc(r.name)}</span></div>`).join('')}
    ${hist ? `<h2>Recent climbs</h2>${card(hist)}` : ''}
    ${setCard('scale')}`;
  const r = SCALE[sc.rung - 1]; const up = sc.rung > 1 ? SCALE[sc.rung - 2] : null;
  if (sc.done || !up) {
    const moved = sc.start - sc.rung;
    return `<h1>Rest here</h1>${card(`<div class="title" style="font-size:22px">${sc.rung}. ${esc(r.name)}</div><div class="meta">${moved > 0 ? `You climbed ${moved} rung${moved === 1 ? '' : 's'}. That is a win.` : 'You noticed where you are. That is the first step.'}</div>`)}
    <p>Note the number where you stopped: <b>${sc.rung}</b>. That is tomorrow's starting point, not today's failure.</p>
    <p class="dim">You cannot fall. You can only climb again, and the ladder is always right under you.</p>
    <button class="btn" data-act="scend">Save and finish</button>`;
  }
  return `<div class="dim sm">Started at ${sc.start}${sc.start > sc.rung ? ` · now at ${sc.rung}` : ''}</div>
    ${card(`<div class="meta">You are here</div><div class="title" style="font-size:22px">${sc.rung}. ${esc(r.name)}</div><div class="step" style="font-size:18px;margin-top:8px">${sc.rung === sc.start ? `I notice I am in ${esc(r.name.split(' · ')[0].toLowerCase())}. This feeling is not who I am. It is a signal: it is telling me something I want is here, and I am looking at its absence.` : 'Stay with it for a breath.'}</div>`)}
    <h2>Toward ${up.n}. ${esc(up.name)}</h2>
    ${card(`<div class="step" style="font-size:19px">${esc(SCALE_UP[sc.rung])}</div>`)}
    <button class="btn" data-act="scup">It eases a little. Climb to ${up.n}</button>
    <button class="btn ghost" data-act="screst">That is far enough. Rest here</button>
    <button class="btn ghost" data-act="scquit" style="border-color:var(--line);color:var(--dim)">Quit</button>`;
}

/* ---------------- focus wheel ---------------- */
const SPOKE_HINTS = ["I don't have to solve this today", 'I can take this one step at a time', 'Other people have been through this', 'I have handled hard things before', 'It has worked out before', 'There is more than one way through', 'Some of this is already better than before', 'I am learning something here', 'Good things can come from this', 'I am getting clearer about what I want', 'I can feel a little relief already', 'It is getting easier to believe this'];
let wh = null;
const newWheel = () => ({ id: uid(), desire: '', spokes: Array.from({ length: 12 }, () => ({ t: '', ok: false })) });
function Wheel() {
  if (!wh) wh = newWheel();
  const full = wh.spokes.every((x) => x.ok && x.t.trim());
  const cx = 160, cy = 160;
  const nodes = wh.spokes.map((x, i) => { const a = (i / 12) * 2 * Math.PI - Math.PI / 2; const px = cx + 112 * Math.cos(a), py = cy + 112 * Math.sin(a);
    return `<line x1="${cx}" y1="${cy}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}" stroke="${x.ok ? '#8294ff' : '#4b4175'}" stroke-width="3"/><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="19" fill="${x.ok ? '#8294ff' : '#2a2148'}" stroke="${x.t.trim() ? '#8294ff' : '#4b4175'}" stroke-width="2"/><text x="${px.toFixed(1)}" y="${(py + 5).toFixed(1)}" text-anchor="middle" font-size="14" font-weight="700" fill="${x.ok ? '#1e1833' : '#c9c2e4'}">${i + 1}</text>`; }).join('');
  const d = wh.desire.trim(); const words = d.split(/\s+/).filter(Boolean); const l1 = words.slice(0, 3).join(' '), l2 = words.slice(3, 6).join(' ') + (words.length > 6 ? '…' : '');
  const svg = `<svg viewBox="0 0 320 320" style="width:100%;max-width:340px;display:block;margin:0 auto"><g class="${full ? 'spin' : ''}" style="transform-origin:160px 160px">${nodes}</g><circle cx="${cx}" cy="${cy}" r="50" fill="#352b5a" stroke="#8294ff" stroke-width="3"/><text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="12" font-weight="700" fill="#efeaf8">${esc(l1 || 'Your desire')}</text><text x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="12" fill="#efeaf8">${esc(l2)}</text></svg>`;
  const done = wh.spokes.filter((x) => x.ok).length;
  return `${back('#practice')}<h1>Focus Wheel</h1>
    <p class="dim">Put what you want in the center. Then fill the 12 spokes with statements you genuinely believe, starting soft and moving closer. A spoke only lights up when it truly feels true. The wheel spins when all 12 do.</p>
    ${card(`<div class="meta">${done} of 12 spokes true</div>${svg}${full ? '<div class="center good" style="margin-top:8px"><b>The wheel is spinning.</b> Every spoke feels true.</div>' : ''}`)}
    <div class="dim sm">Center: what I want, or the belief I want to shift</div>
    <input type="text" data-wf="desire" value="${esc(wh.desire)}" placeholder="e.g. I feel secure about money">
    ${wh.spokes.map((x, i) => `<div class="dim sm" style="margin-top:8px">Spoke ${i + 1}</div><input type="text" data-wf="${i}" value="${esc(x.t)}" placeholder="${esc(SPOKE_HINTS[i])}">
      <div class="bul" data-act="wok:${i}"><span class="bx ${x.ok ? 'on' : ''}">${x.ok ? '✓' : ''}</span><span>This feels true to me</span></div>`).join('')}
    <button class="btn" style="margin-top:14px" data-act="wsave">Save this wheel</button>
    <button class="btn ghost" data-act="wnew">Start a new wheel</button>
    ${S.wheels.length ? `<h2>Saved wheels</h2>${S.wheels.map((w) => card(`<div class="row"><b data-act="wload:${w.id}" style="cursor:pointer">${esc(w.desire || 'Untitled')}</b><span class="meta" style="text-align:right">${w.spokes.filter((x) => x.ok).length}/12 · <span data-act="wdel:${w.id}" style="cursor:pointer;color:var(--bad)">delete</span></span></div>`)).join('')}` : ''}`;
}

let openCat = null;
const TAGS = { 'obs-recall': 'Observation' }; // purely a label
const tag = (id) => (TAGS[id] ? ` <span class="tag">${TAGS[id]}</span>` : '');
const miniBtns = (id) => `<a class="btn ghost mini" href="#ex/${id}">Rules</a><button class="btn mini" data-act="done:${id}">✓ Done</button>`;
const exRow = (id) => `<div class="exrow"><a href="#ex/${id}" class="exname">${esc(exById[id].title)}${tag(id)}</a><div class="minis">${miniBtns(id)}</div></div>`;
function Today() {
  snapPlan();
  const now = new Date();
  const nudge = nudgePool()[dayNum() % nudgePool().length];
  const n = streak();
  const next = {}; occurrences(now).forEach((o) => { if (o.cat && o.id !== 'recall' && o.at > now && !next[o.cat]) next[o.cat] = o.at; });
  const on = REMIND_GROUPS.filter((g) => S.rem.cat[g.id].on && ready(g));
  const pending = on.filter((g) => !catDone(g.id));
  const rows = pending.map((g) => {
    const c = S.rem.cat[g.id]; const cnt = catCount(g.id);
    const meta = `${cnt} of ${c.goal} today${next[g.id] ? ` · next reminder ${fmtTime(next[g.id].getHours(), next[g.id].getMinutes())}` : ''}`;
    const homeNote = native.isNative && !S.rem.home && [...g.leave, ...(g.both || [])].some((id) => c.ex.includes(id)) ? ' · <a href="#settings" style="color:var(--accent)">set your home in Settings</a>' : '';
    let side = '', body = '';
    if (g.simple) body = '<a class="btn" href="#cat/' + g.id + '" style="margin-top:10px">Choose a meditation</a>';
    else if (c.random) side = `<div class="minis">${miniBtns(todayPick(g.id))}</div>`;
    else body = c.ex.filter((id) => !tallyOf(id)).map(exRow).join('');
    return card(`<div class="hd"><div><div class="title">${g.label}</div><div class="meta">${meta}${homeNote}</div></div>${side}</div>${body}`);
  }).join('');
  const recallCard = '';
  const doneIds = [...new Set(REMIND_GROUPS.flatMap((g) => [...g.pool, ...g.leave]))].filter((id) => tallyOf(id));
  const doneCard = '';
  const all = on.length && !pending.length && !recallCard;
  const cheer = all ? card(`<div class="cheer"><div class="pop">🎉</div><b style="font-size:18px">Everything done today!</b><div class="dim sm" style="margin-top:4px">${n ? `${n}-day streak. ` : ''}You showed up for yourself. Rest easy.</div></div>`, 'accent') : '';
  return `<div class="dim">${now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
  <h1>${n ? `${n}-day streak` : 'Begin today'}</h1>
  <div class="row"><a class="btn" href="#guide/funk-reset">I'm in a funk</a>${S.rem.playlist ? '<button class="btn ghost" data-act="music">♪ Play my songs</button>' : ''}</div>
  ${card(`<div class="dim sm">Mindful moment</div><div style="font-size:17px;margin-top:4px">${esc(nudge)}</div>`, 'accent')}
  ${native.isNative && permState !== 'granted' ? card(`<b>Turn on reminders</b><div class="dim sm" style="margin:4px 0 8px">Timbre Tamer needs your OK to send notifications. That is how it reminds you.</div><button class="btn" data-act="perm">Allow notifications</button>${permState === 'denied' ? '<div class="warn sm">Blocked. Open your phone Settings → Apps → Timbre Tamer → Notifications and switch them on.</div>' : ''}`, 'accent') : ''}
  ${native.isNative && !S.rem.home && on.some((g) => [...g.leave, ...(g.both || [])].some((id) => S.rem.cat[g.id].ex.includes(id))) ? card(`<b>Set your home</b><div class="dim sm" style="margin:4px 0 8px">Stair Count and Stranger's Face remind you as you leave the house. Stand at home and tap the button. When your phone asks about location, choose <b>While using the app</b>, then open your phone's Settings → Apps → Timbre Tamer → Permissions → Location and pick <b>Allow all the time</b>.</div><button class="btn" data-act="sethome">Set my home here</button><div id="msg" class="warn sm"></div>`, 'accent') : ''}
  ${S.tourSeen ? '' : card(`<b>New here?</b><div class="dim sm" style="margin:4px 0 8px">A one-minute tour of what is on each page.</div><div class="row"><a class="btn mini" href="#tour">Take the tour</a><button class="btn ghost mini" data-act="tourhide">Not now</button></div>`, 'accent')}
  ${cheer}
  ${morningCards()}${fastCard()}
  ${rows || recallCard ? `<h2>Today's goals</h2>${rows}${recallCard}` : on.length ? '' : '<h2>Today\'s goals</h2><div class="dim">No reminders on. Turn some on in Settings.</div>'}
  ${doneCard}
  <div class="row" style="margin-top:8px"><a class="btn ghost" href="#note">Quick note</a></div>
  <div class="dim sm center" style="margin-top:18px">Timbre Tamer · build ${esc(BUILD)}</div>`;
}

function Day(k) {
  if (!/^\d{4}-\d\d-\d\d$/.test(k || '')) return back('#log') + '<p>Not found.</p>';
  const st = dayStatus(k); const [y, m, d] = k.split('-').map(Number);
  const notes = [...S.sessions.map((x) => ({ ...x, k: 's' })), ...S.recalls.map((x) => ({ ...x, k: 'r' }))].filter((x) => dayKey(x.ts) === k).sort((a, b) => a.ts - b.ts);
  const list = (a, mark) => a.map((t) => `<div style="margin-top:4px">${mark} ${esc(t)}</div>`).join('');
  return `${back('#log')}<div class="dim">${new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
  <h1>${st.perfect ? '★ ' : ''}${st.total ? `${st.done.length} of ${st.total} done` : 'Day review'}</h1>
  ${st.done.length || st.extra.length ? card(`<div class="dim sm">Completed</div>${list(st.done, '✓')}${list(st.extra, '✓')}`) : ''}
  ${st.miss.length ? card(`<div class="dim sm">Not completed</div>${list(st.miss, '○')}`) : ''}
  ${card(`<div class="dim sm">Notes</div>` + (notes.length ? notes.map((r) => `<div style="margin-top:8px"><div class="dim sm">${new Date(r.ts).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })} · ${r.k === 'r' ? `Evening recall · ${r.details} details` : r.ex ? esc(exById[r.ex]?.title) : 'Note'}</div>${r.note ? `<div style="white-space:pre-line">${esc(r.note)}</div>` : ''}</div>`).join('') : '<div class="dim" style="margin-top:4px">No notes this day.</div>'))}`;
}

function Days() {
  const ks = [...new Set([...Object.keys(S.days || {}), ...Object.keys(S.tally || {}), ...S.sessions.map((x) => dayKey(x.ts)), ...S.recalls.map((x) => dayKey(x.ts))])].sort().reverse();
  if (!ks.length) return '<p class="dim">Days will appear here as you use the app.</p>';
  return ks.map((k) => { const st = dayStatus(k); const [y, m, d] = k.split('-').map(Number);
    return `<a class="card" href="#day/${k}" style="display:flex;justify-content:space-between;color:inherit;text-decoration:none"><span>${new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span><span class="${st.perfect ? 'good' : 'dim'}">${st.perfect ? '★ ' : ''}${st.total ? `${st.done.length} of ${st.total}` : 'view'}</span></a>`; }).join('');
}

// Where a "pick one" reminder lands: the exercises you chose for that category.
function Choose(gid) {
  const g = group(gid); if (!g) return back('#today') + '<p>Not found.</p>';
  const c = S.rem.cat[gid];
  return `${back('#today')}<h1>${g.label}</h1><div class="dim">${catCount(gid)} of ${c.goal} today. Pick one:</div>` +
    schedEx(gid).map((id) => card(`<a href="#ex/${id}" style="color:inherit;text-decoration:none"><b>${esc(exById[id].title)}</b></a><div class="dim sm">${esc(exById[id].summary)}</div>
      <div class="row" style="margin-top:8px"><a class="btn ghost" href="#ex/${id}">Rules</a><a class="btn" href="#guide/${id}">Start</a><button class="btn ghost" data-act="done:${id}">✓ Done</button></div>`)).join('');
}

function Tour() {
  const sec = (t, inner) => card(`<div class="title" style="font-size:20px">${t}</div><div style="margin-top:6px;font-size:16px;line-height:1.5">${inner}</div>`);
  return `${back('#info')}<h1>A quick tour</h1>
  <p class="dim">What you will find on each page.</p>
  ${sec('Today', 'Your day at a glance, one bubble per goal. Tap <b>✓ Done</b> when you finish one (it goes into your Log with the time) or <b>Rules</b> to read it first. Finished goals disappear, and finishing them all earns a small celebration. The big <b>I\'m in a funk</b> button gives a short reset and plays your own songs.')}
  ${sec('Practice', 'The library of guided practices: meditation practice, meditation exercises, energy and healing, esoteric meditations, and the chakra meditations. Open one to read how it works, or press <b>Start guided</b> to be walked through one step at a time, with optional timers.')}
  ${sec('Info', 'Reading, not doing: the universal laws, the Do\'s and Don\'ts, supporting habits, life cycles, the chakra reference, and the credits.')}
  ${sec('Settings', 'Where you set it up your way. Choose which exercises count as goals for each area, how many reminders you want and when, the leave-home reminders, the funk playlist, the mindfulness sayings, and your backup. The small <b>Log</b> button in the top right corner opens your log.')}
  ${sec('Log', '<b>Entries</b> are your notes and recalls. <b>Days</b> is one button per day showing what you finished, what you did not, and your notes. <b>Progress</b> shows your streak and trends.')}
  ${sec('Private by design', 'Your notes, logs and goals stay on your phone. There is no account. The free Play Store version shows a few ads on the Practice and Info lists (a one-time purchase removes them and unlocks the advanced teachings); your own entries are never sent to anyone.')}`;
}
function Info() {
  const lk = (key) => (locked(key) ? '🔒 ' : '');
  const to = (key, route) => (locked(key) ? `#unlock/${key}` : route);
  const ids = TEACH.map((id) => exById[id]).map((e) => link(to(e.id, `#ex/${e.id}`), `<b>${lk(e.id)}${esc(e.title)}</b><div class="dim sm">${esc(e.summary)}</div>`)).join('');
  return `<h1>Info</h1>
  ${link('#tour', '<b>A quick tour</b><div class="dim sm">What is on each page</div>')}
  ${link('#why', '<b>Why these five</b><div class="dim sm">Observe, hold, settle, steady, rest: what everything here builds on</div>')}
  ${link(to('info:attn', '#attn'), `<b>${lk('info:attn')}Attention: narrow and wide</b><div class="dim sm">Learn the idea, then switch the practices on</div>`)}
  ${link(to('info:laws', '#laws'), `<b>${lk('info:laws')}Universal laws of manifestation</b><div class="dim sm">How a steady thought shapes your state</div>`)}
  ${ids}
  <h2>Teachings for the practices</h2>
  ${LEARN.map((c) => link(to('cat:' + c, `#learn/${c}`), `<b>${lk('cat:' + c)}${esc(CAT_TEACH[c].t)}</b><div class="dim sm">${esc(CAT_TEACH[c].one)}</div>`)).join('')}
  ${link(to('info:cycles', '#cycles'), `<b>${lk('info:cycles')}Life cycles</b><div class="dim sm">Favorable and unfavorable activities by period</div>`)}
  ${link(to('info:chakras', '#chakras'), `<b>${lk('info:chakras')}Chakra reference</b><div class="dim sm">Seven chakras, seed sounds, glands</div>`)}
  ${link(to('info:fast', '#fast'), `<b>${lk('info:fast')}Frequency Fast</b><div class="dim sm">A short challenge: fast from fear-based input</div>`)}
  ${link('#about', '<b>Credits</b><div class="dim sm">With gratitude</div>')}`;
}
let priceOf = {}; let unlockKey = '';
const TEACH = ['live-dos', 'energy-habits']; // reading pages kept as entries, shown in Info with no guided run
const homeOf = (key) => (String(key).startsWith('info:') || String(key).startsWith('cat:') || TEACH.includes(key) ? '#info' : '#practice');
// Ask Google Play what this account owns, so a refund relocks and a reinstall unlocks. If Play cannot be reached, keep what we knew.
async function syncUnlock() {
  if (!PAYWALL || !native.isNative) return;
  const o = await native.ownedIds();
  if (o !== null) { const mine = o.filter((id) => id === EVERYTHING_ID || PACKAGES.some((k) => k.pid === id)); if (mine.slice().sort().join() !== S.owned.slice().sort().join()) { S.owned = mine; save(); repaintKeep(); } }
  if (!Object.keys(priceOf).length) { priceOf = await native.prices([EVERYTHING_ID, ...PACKAGES.map((k) => k.pid)]); if (Object.keys(priceOf).length && location.hash.startsWith('#unlock')) repaintKeep(); }
}
function Unlock(key) {
  unlockKey = key; const k = pkgFor(key);
  const n = ownedPkgs();
  return `${back(homeOf(key))}<h1>${k ? esc(k.name) : 'Advanced teachings'}</h1>
  ${k ? card(`<div class="step" style="font-size:17px">${esc(k.desc)}</div>`, 'accent') : ''}
  ${k ? `<button class="btn" data-act="buy:${k.pid}">Unlock “${esc(k.name)}” · ${esc(priceOf[k.pid] || '$1.00')}</button>` : ''}
  <button class="btn ${k ? 'ghost' : ''}" data-act="buy:${EVERYTHING_ID}">Unlock everything · ${esc(priceOf[EVERYTHING_ID] || '$4.99')}</button>
  ${card(`<div class="sm"><b>Everything</b> opens every advanced teaching, including every one added later, for one price.<br><br>Prefer to go one at a time? Each package is ${esc(priceOf[k ? k.pid : PACKAGES[0].pid] || '$1.00')}. Own any <b>${UNLOCK_AT}</b> packages and the rest unlock free. You own <b>${n}</b> so far. Starting slow costs a little more than trusting it from the start, and either way you get the whole path.</div>`)}
  ${adsOn() && k && homeOf(key) === '#practice' ? `<button class="btn ghost" data-act="watchad:${key}">Watch a short ad to open this one for today</button>` : ''}
  <button class="btn ghost" data-act="restoreunlock">Restore purchases</button>
  <div id="msg" class="warn sm"></div>`;
}
const advOk = new Set(); let warnStep = 1;
function Practice() {
  const row = (e) => link(locked(e.id) ? `#unlock/${e.id}` : `#ex/${e.id}`, `<b>${locked(e.id) ? '🔒 ' : ''}${esc(e.title)}</b><div class="dim sm">${esc(e.freq)}</div>`);
  const ids = (list) => list.map((id) => exById[id]).filter(Boolean).map(row).join('');
  const cats = (cat, skip = []) => EXERCISES.filter((e) => e.cat === cat && !e.hidden && !skip.includes(e.id)).map(row).join('');
  const sub = (label, inner) => (inner ? `<h3>${label}</h3>${inner}` : '');
  const knowledge = TEACH; // shown on the Info page
  const medPractice = ['med-practice', 'med-cloud', 'med-sit', 'med-quiet', 'med-nowpoint', 'med-transform', 'med-iam', 'med-love'];
  return `<h1>Practice</h1>
  <h2>Meditation practice</h2>
  ${ids(medPractice)}
  <h2>Meditation exercises</h2>
  ${sub(CATS.observe, cats('observe'))}${sub(CATS.concentrate, cats('concentrate'))}
  ${sub(CATS.emotion, cats('emotion') + link('#scale', '<b>Climbing the Scale</b><div class="dim sm">Tell it what you feel. It walks you up, one rung at a time</div>') + link('#wheel', '<b>Focus Wheel</b><div class="dim sm">Build 12 believable statements toward what you want</div>'))}
  ${sub(CATS.bedtime, cats('bedtime'))}${sub(CATS.living, cats('living', knowledge))}${sub(CATS.balance, cats('balance'))}
  <h2>Energy &amp; healing meditations</h2>
  ${cats('energy', knowledge)}
  <h2>Attention</h2>
  ${(S.learned || {}).attn ? cats('attention') : link('#attn', `<b>${locked('info:attn') ? '🔒 ' : ''}Attention practices</b><div class="dim sm">Learn the idea first, then switch them on</div>`)}
  <h2>Esoteric meditations</h2>
  ${ids(['j-library', 'j-stair', 'j-guide', 'p-mental', 'p-etheric'])}
  <h2>Chakra meditations</h2>
  ${cats('chakra')}
  ${sub('Psychic centers', cats('centers'))}`;
}

// Two warnings, back to back, before the advanced practices open.
function Warn(id) {
  const ex = exById[id];
  if (warnStep === 1) return `${back('#practice')}<h1>${esc(ex.title)}</h1>
    ${card('<div class="title" style="font-size:20px">Advanced practice</div><div class="step" style="font-size:17px;margin-top:6px">This works directly with your energy centers. The guide builds up to it: Heart first, then Pituitary, then Pineal, then Throat, and only then the rest. Jumping ahead does no harm, but it does no good either.</div>', 'warnb')}
    <button class="btn" data-act="warn1">I understand. Continue</button>
    <a class="btn ghost" href="#practice">Go back</a>`;
  return `${back('#practice')}<h1>${esc(ex.title)}</h1>
    ${card('<div class="title" style="font-size:20px">One more warning</div><div class="step" style="font-size:17px;margin-top:6px">Do not do this when you are ill, exhausted, or have just eaten, and not after alcohol. Stop at once if you feel dizzy, uncomfortable, or unwell. This is a practice, not medical care.</div>', 'warnb')}
    <button class="btn" data-act="warn2:${id}">Yes, open it</button>
    <a class="btn ghost" href="#practice">Go back</a>`;
}

const LEARN = ['observe', 'concentrate', 'meditate', 'emotion', 'bedtime', 'energy', 'balance', 'living', 'chakra', 'centers', 'journey', 'project'];
function Exercise(id) {
  const ex = exById[id]; if (!ex) return back() + '<p>Not found.</p>';
  if (TEACH.includes(id)) return `${back('#info')}<h1>${esc(ex.title)}</h1><div class="dim">${esc(ex.summary)}</div>${ex.steps.map((t) => card(`<div class="sm" style="white-space:pre-line">${esc(typeof t === 'string' ? t : t.t)}</div>`)).join('')}`;
  const why = CAT_TEACH[ex.cat] ? `<a class="dim sm" href="${locked('cat:' + ex.cat) ? '#unlock/cat:' + ex.cat : '#learn/' + ex.cat}">Why this? ›</a>` : '';
  return `${back('#practice')}<h1>${esc(ex.title)}</h1><div class="dim">${esc(ex.summary)}</div>
  <div class="dim sm" style="margin:8px 0">${esc(ex.freq)} ${why}</div>
  ${ex.caution ? card(`<div class="warn sm">${esc(ex.caution)}</div>`, 'warnb') : ''}
  <a class="btn" href="#guide/${id}">Start guided</a>
  <button class="btn ghost" data-act="done:${id}">✓ Mark completed (${tallyOf(id)} today)</button>
  <h2>Steps</h2>${ex.steps.map((s, i) => `<p style="white-space:pre-line">${i + 1}. ${esc(typeof s === 'string' ? s : s.t)}</p>`).join('')}`;
}

function Chakras() {
  return `${back('#info')}<h1>Chakras</h1><p class="dim">${esc(CHAKRA_INTRO)}</p>` + CHAKRAS.map((c) => card(`<b>${c.n}. ${c.name} — ${esc(c.sk)}</b>
  <div class="sm">Seed sound: ${esc(c.seed)}</div><div class="sm">Location: ${esc(c.loc)}</div><div class="sm">Blocked by: ${esc(c.block)}</div><div class="sm">Gland: ${esc(c.gland)}</div><div class="dim sm" style="margin-top:4px">${esc(c.note)}</div>`)).join('');
}
function About() {
  return `${back('#info')}<h1>Credits</h1>
  <p>No one person created what is in this app. These practices are shared human knowledge, taught and agreed upon across many teachers, texts, and traditions over a very long time. This app is only a way to remember to use them.</p>
  <p>With gratitude to:</p>
  <ul>
    <li><b>Joe Dispenza</b> — chakra attention and coherence work</li>
    <li><b>Guru Pathik</b>, in <i>Avatar: The Last Airbender</i> — the chakra lesson</li>
    <li><b>Dolores Cannon</b> — the quiet-listening, inner-journey, energy, and everyday-living practices, written here in our own words from teachings associated with her work</li>
    <li><b>Barbara Marciniak</b>, <b>Neville Goddard</b>, <b>Bashar</b>, and <b>Esther and Abraham Hicks</b> — the whim, now-point, belief-audit, fast, breath, bedtime-loop, emotional-scale and manifestation practices, and the sayings inspired by them, in our own words</li>
    <li><b>Wisdom of the Mystic Masters</b> — the mental training, meditation, healing, projection, and cycles teachings</li>
    <li>The yogic, tantric, and Rosicrucian traditions all of the above draw on</li>
    <li>Every teacher, student, and practitioner who passed these on</li>
  </ul>
  <p class="dim sm">This app supports a practice. It is not medical care, and it does not replace a counselor or doctor.</p>`;
}
function Laws() {
  return `${back('#info')}<h1>Universal laws of manifestation</h1>
  ${card('<div class="title" style="font-size:20px">One pure thought</div><div class="step" style="font-size:17px;margin-top:6px">Hold a single thought with no contradiction. That is the whole rule.</div>')}
  ${card('<div class="step" style="font-size:17px"><b class="pd">17 seconds</b> of a pure thought starts the change.<br><b class="pd">34 seconds</b> multiplies it.<br><b class="pd">68 seconds</b> is the target: the vibration becomes self-sustaining.</div>')}
  ${card('<div class="step" style="font-size:17px">Appreciation works best. When a contradicting thought shows up, do not follow it. Come back to the pure one. The practice is the coming back.</div>')}
  <a class="btn" href="#guide/law-hold">Try the 17-second thought</a>
  ${setCard('laws')}`;
}
const taught = () => '<div class="dim sm" style="margin-top:14px">Taught from the teachers and traditions named in <a href="#about">Credits</a>.</div>';
function Why() {
  return `${back('#info')}<h1>Why these five</h1><p class="dim">${esc(WHY.intro)}</p>
  ${WHY.parts.map((p) => card(`<b>${esc(p.h)}</b><div class="sm" style="margin-top:4px">${esc(p.t)}</div>`)).join('')}
  ${card(`<div class="sm">${esc(WHY.close)}</div>`, 'accent')}
  <a class="btn" href="#practice">Go to Practice</a>${taught()}`;
}
function Learn(c) {
  const t = CAT_TEACH[c]; if (!t) return `${back('#info')}<p>Not found.</p>`;
  return `${back('#info')}<h1>${esc(t.t)}</h1><p class="dim">${esc(t.one)}</p>
  ${t.p.map((x) => card(`<div class="sm">${esc(x)}</div>`)).join('')}
  <a class="btn" href="#practice">Go to Practice</a>${taught()}`;
}
function Attn() {
  const on = !!(S.learned || {}).attn;
  return `${back('#info')}<h1>Attention: narrow and wide</h1><p class="dim">${esc(ATTN_LESSON.intro)}</p>
  ${ATTN_LESSON.parts.map((p) => card(`<b>${esc(p.h)}</b><div class="sm" style="margin-top:4px">${esc(p.t)}</div>`)).join('')}
  ${card(`${check(on, '<b class="ttl">I have learned this. Turn on the practices</b>', 'learnattn', on ? 'On. The ten practices are in Practice, and an Attention block with reminders is now in Settings.' : 'Off until you switch it on. Then ten attention practices appear in Practice, and an Attention block appears in Settings.')}
`, 'accent')}
  ${on ? EXERCISES.filter((e) => e.cat === 'attention').map((e) => link(`#ex/${e.id}`, `<b>${esc(e.title)}</b><div class="dim sm">${esc(e.freq)}</div>`)).join('') : ''}${taught()}`;
}
function Cycles() {
  return `${back('#info')}<h1>Life cycles</h1><p class="dim">${esc(CYCLES.note)}</p>` + CYCLES.periods.map((p) => card(`<b>${esc(p.name)}</b><div class="dim sm">${esc(p.intro)}</div>
  ${p.good.length ? `<div class="good sm" style="margin-top:8px"><b>Good for</b></div>` + p.good.map((g) => `<div class="sm">• ${esc(g)}</div>`).join('') : ''}
  ${p.bad.length ? `<div class="bad sm" style="margin-top:8px"><b>Not good for</b></div>` + p.bad.map((g) => `<div class="sm">• ${esc(g)}</div>`).join('') : ''}`)).join('');
}

/* ----- log ----- */
let logTab = 'entries';
function Log() {
  const rows = [...S.sessions.map((x) => ({ ...x, k: 's' })), ...S.recalls.map((x) => ({ ...x, k: 'r' }))].sort((a, b) => b.ts - a.ts);
  const tabs = `<div class="chips"><button class="chip ${logTab === 'entries' ? 'on' : ''}" data-act="logtab:entries">Entries</button><button class="chip ${logTab === 'days' ? 'on' : ''}" data-act="logtab:days">Days</button><button class="chip ${logTab === 'prog' ? 'on' : ''}" data-act="logtab:prog">Progress</button></div>`;
  if (logTab === 'days') return `<h1>Log</h1>${tabs}${Days()}`;
  if (logTab === 'prog') return `<h1>Log</h1>${tabs}${Progress()}`;
  return `<h1>Log</h1>${tabs}<div class="row"><a class="btn" href="#note">+ Note</a><a class="btn" href="#recall">+ Evening recall</a></div>
  ${rows.length ? rows.map((r) => `<div class="card" data-act="del:${r.k}:${r.id}"><div class="dim sm">${when(r.ts)} · ${r.k === 'r' ? `Evening recall · ${r.details} details${r.accuracy ? ` · accuracy ${r.accuracy}/5` : ''}` : `${r.ex ? esc(exById[r.ex]?.title) : 'Note'}${r.focus ? ` · focus ${r.focus}/5` : ''}`}</div>${r.note ? `<div style="white-space:pre-line;margin-top:4px">${esc(r.note)}</div>` : ''}</div>`).join('') + '<div class="dim sm">Tap an entry to delete it.</div>' : '<p class="dim">Nothing logged yet.</p>'}`;
}
function Progress() {
  const days = practiceDays();
  const last14 = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (13 - i)); return days.has(dayKey(d.getTime())); });
  const rec = [...S.recalls].sort((a, b) => a.ts - b.ts).slice(-14);
  const max = Math.max(1, ...rec.map((r) => r.details));
  const foc = S.sessions.filter((x) => x.focus);
  const avg = foc.length ? (foc.reduce((a, x) => a + x.focus, 0) / foc.length).toFixed(1) : '–';
  const half = Math.floor(rec.length / 2);
  const mean = (a) => (a.length ? a.reduce((x, r) => x + r.details, 0) / a.length : 0);
  const trend = rec.length >= 4 ? mean(rec.slice(half)) - mean(rec.slice(0, half)) : null;
  return card(`<div class="dim sm">Current streak</div><div style="font-size:32px;font-weight:300">${streak()} days</div><div class="strip">${last14.map((o) => `<i class="${o ? 'on' : ''}"></i>`).join('')}</div><div class="dim sm">Last 14 days</div>`)
    + card(`<div class="dim sm">Sessions logged · average focus</div><div style="font-size:24px;font-weight:300">${S.sessions.length} · ${avg}/5</div>`)
    + card(`<div class="dim sm">Evening recall — details remembered</div>${rec.length ? `<div class="bars">${rec.map((r) => `<i style="height:${Math.max(4, (r.details / max) * 100)}px"></i>`).join('')}</div>` : '<div class="dim">Log an evening recall to start the chart.</div>'}
      ${trend !== null ? `<div class="sm ${trend >= 0 ? 'good' : 'warn'}" style="margin-top:8px">${trend >= 0 ? '▲' : '▼'} ${Math.abs(trend).toFixed(1)} details vs. earlier entries</div>` : ''}`);
}

let form = {};
function NoteForm(exId) {
  if (form._k !== 'note') form = { _k: 'note', ex: exId || null, focus: 0, note: '' };
  return `${back('#log')}<h1>New note</h1><div class="dim sm">Exercise (optional)</div>
  <div class="chips" style="max-height:140px;overflow:auto">${EXERCISES.map((e) => `<button class="chip ${form.ex === e.id ? 'on' : ''}" data-act="pickex:${e.id}">${esc(e.title)}</button>`).join('')}</div>
  <div class="dim sm">Focus</div>${rating('focus', form.focus)}
  <textarea name="note" placeholder="What did you notice, feel, see?">${esc(form.note)}</textarea>
  <button class="btn" data-act="savenote" ${form.note.trim() || form.ex ? '' : 'disabled'}>Save</button>`;
}
function RecallForm() {
  if (form._k !== 'recall') form = { _k: 'recall', details: 0, accuracy: 0, note: '' };
  return `${back('#log')}<h1>Evening recall</h1>
  <p class="dim">Your first activity this morning (or after breakfast). Write it in order, with every detail: what you saw, heard, did, in what sequence.</p>
  <a class="btn ghost" href="#guide/obs-recall">Run the 3½-minute recall timer</a>
  <textarea name="note" placeholder="First I… then I… I saw… the light was…">${esc(form.note)}</textarea>
  <div class="dim sm">Details you recalled (count them)</div>${stepper('details', form.details)}
  <div class="dim sm" style="margin-top:12px">How sure are you it is accurate?</div>${rating('accuracy', form.accuracy)}
  <button class="btn" style="margin-top:14px" data-act="saverecall" ${form.note.trim() || form.details ? '' : 'disabled'}>Save recall</button>`;
}

/* ----- settings ----- */
let permState = native.isNative ? (localStorage.getItem('mindful-perm') === 'granted' ? 'granted' : 'default') : 'Notification' in window ? Notification.permission : 'unsupported'; // remembered so the card does not flash on every open

function FastLesson() {
  const f = S.fast; const d = fastDay(); const running = fastRunning();
  return `${back('#info')}<h1>Frequency Fast</h1><p class="dim">A short challenge: fast from fear-based input and give the freed-up energy somewhere to go. It stays off until you switch it on here.</p>` + fastRulesBox() + card(`${check(f.on, '<b class="ttl">Turn on the Frequency Fast</b>', 'fon', running ? `Running: day ${d} of ${f.days}` : 'Off until you start it. When it runs, two daily goals appear on Today.')}
    ${f.on ? `
    <div class="dim sm" style="margin-top:10px">How long</div>
    <div class="chips">${[1, 3, 5, 7].map((n) => `<button class="chip ${f.days === n ? 'on' : ''}" ${running ? 'disabled' : ''} data-act="fdays:${n}">${n} day${n === 1 ? '' : 's'}</button>`).join('')}</div>
    <div class="dim sm">Each day has two goals, shown in a bubble on Today while it runs.</div>
    ${running ? '<button class="btn ghost" data-act="fstop">Stop the fast</button>' : '<button class="btn" data-act="fstart">Start today</button>'}` : ''}`);
}
function Settings() {
  const R = S.rem;
  const fmtMin = (v) => fmtTime(Math.floor(v / 60), v % 60);
  const groups = REMIND_GROUPS.filter(ready).map((g) => {
    const c = R.cat[g.id];
    const nightly = '';
    if (g.simple) return card(`${head(c.on, `<b>${g.label}</b>`, 'Each reminder opens a list of meditations to choose from.', `con:${g.id}`, g.id)}${setOpen[g.id] ? `<div class="dim sm" style="margin-top:6px">Reminders per day</div>${stepper(`cn:${g.id}`, c.n)}` : ''}`);
    const bullets = [...g.pool, ...g.leave].filter((x) => !off(x)).map((x) => `<div class="bul ${c.random ? 'dis' : ''}" data-act="cex:${g.id}:${x}"><span class="bx ${c.ex.includes(x) ? 'on' : ''}">${c.ex.includes(x) ? '✓' : ''}</span><span>${esc(exById[x].title)}${tag(x)}${g.leave.includes(x) ? ' <span class="dim">(when you leave home)</span>' : (g.both || []).includes(x) ? ' <span class="dim">(also when you leave home)</span>' : ''}</span></div>`).join('');
    return card(`${head(c.on, `<b class="ttl">${g.label}</b>`, c.on ? `Goal: ${c.goal} a day · ${c.n} reminder${c.n === 1 ? '' : 's'} a day` : 'Off', `con:${g.id}`, g.id)}
      ${setOpen[g.id] ? `<div class="dim sm" style="margin-top:6px">Tick the exercises. Each ticked one is a daily goal. Or pick the random option below.</div>${bullets}
      ${[...g.pool, ...g.leave].length > 1 ? `<div class="bul" data-act="crand:${g.id}"><span class="bx ${c.random ? 'on' : ''}">${c.random ? '✓' : ''}</span><span><b>Just 1 as my goal, picked at random</b><span class="dim"> — from all of them</span></span></div>` : ''}
      <div class="dim sm" style="margin-top:8px">Reminders per day — they keep coming until the goal is met</div>${stepper(`cn:${g.id}`, c.n)}
      <div class="dim sm" style="margin-top:8px">Remind me</div>
      <div class="chips">
        <button class="chip ${c.timing === 'set' ? 'on' : ''}" data-act="ctime:${g.id}:set">At set times</button>
        <button class="chip ${c.timing === 'even' ? 'on' : ''}" data-act="ctime:${g.id}:even">Spread evenly</button>
        <button class="chip ${c.timing === 'random' ? 'on' : ''}" data-act="ctime:${g.id}:random">At random times</button></div>
      <div class="dim sm">${c.timing === 'set' ? 'You pick each time.' : c.timing === 'even' ? `Evenly across ${fmtTime(R.day.s)}–${fmtTime(R.day.e)}.` : `Random times between ${fmtTime(R.day.s)} and ${fmtTime(R.day.e)}.`}</div>
      ${c.timing === 'set' ? c.times.map((t, k) => `<div class="dim sm" style="margin-top:6px">Reminder ${k + 1}</div>${stepper(`ct:${g.id}:${k}`, t, fmtMin)}`).join('') : ''}
      ${nightly ? `<div style="margin-top:10px;border-top:1px solid var(--line);padding-top:6px">${nightly}</div>` : ''}` : ''}`);
  }).join('');
  const anyLeave = REMIND_GROUPS.some((g) => R.cat[g.id].on && [...g.leave, ...(g.both || [])].some((id) => R.cat[g.id].ex.includes(id)));
  const home = anyLeave ? card(`<b>Leaving home</b>
    <div class="dim sm">${!native.isNative ? 'Works in the Android app only. Until then these stay quiet.' : R.home ? `Home is set. Reminders fire when you move ${R.home.r} m away.` : 'Set your home first — until then these stay quiet.'}</div>
    <div class="dim sm" style="margin-top:6px">Amount of reminders while you're away</div>${stepper('leaven', R.leave.n)}
    ${native.isNative ? `<button class="btn ghost" data-act="sethome">${R.home ? 'Update' : 'Set'} home to my current location</button>
    ${R.home ? `<div class="dim sm">Distance to count as "left"</div>${stepper('homer', R.home.r, (v) => v + ' m')}` : ''}
    <div class="dim sm" style="margin-top:6px">Needs location set to "Allow all the time".</div>` : ''}`) : '';
  return `<div class="hd" style="flex-wrap:nowrap"><h1>Settings</h1><a class="sqbtn" href="#log" aria-label="Log">Log</a></div>
  <h2>Notifications</h2>
  ${permState === 'granted' ? '<div class="good sm">Notifications are on.</div>' : `<button class="btn" data-act="perm">Allow notifications</button>${permState === 'denied' ? '<div class="warn sm">Blocked — enable notifications for this app in your phone settings.</div>' : ''}`}
  ${native.isNative ? '' : '<div class="dim sm" style="margin:6px 0">This web version notifies while the app is open. The Android app rings on schedule even when closed.</div>'}
  <h2>Reminder hours</h2>
  <div class="dim sm">Used for evenly spread and random reminders, and mindfulness sayings.</div>
  ${card(`<div class="dim sm">From</div>${stepper('dayS', R.day.s, (v) => fmtTime(v))}<div class="dim sm" style="margin-top:6px">Until</div>${stepper('dayE', R.day.e, (v) => fmtTime(v))}`)}
  <h2>Daily goals</h2>
  ${groups}
  ${home}
  <h2>Funk playlist</h2>
  <div class="dim sm">Paste a Spotify (or any music) link and press Save. The funk button and "Play my songs" will open it. Downloaded playlists play without internet.</div>
  <input type="text" name="playlist" id="playlist" placeholder="https://open.spotify.com/playlist/…" value="${esc(R.playlist)}">
  <button class="btn" data-act="saveplaylist">Save playlist</button>
  ${R.playlist ? `<div class="good sm">Saved: <a href="${esc(R.playlist)}" style="color:var(--accent);word-break:break-all">${esc(R.playlist)}</a></div>` : ''}
  <h2>Mindfulness sayings</h2>
  <p class="dim sm">Personal growth, one short thought at a time. The sayings mix simple basics for body and mind (breath, water, movement, kindness, slowing down), tools for your emotions, and deeper reflections drawn from mystics and teachers. Many bring you back to the present moment, a skill worth building: even 30 seconds of being present, a few times a day, steadies you and sharpens your focus.</p>
  ${card(`${head(R.mind.on, '<b>Mindfulness sayings</b>', R.mind.on ? `${R.mind.n} a day` : 'Off', 'mindon', 'mind')}${setOpen.mind ? `<div class="dim sm" style="margin-top:6px">Per day</div>${stepper('mindn', R.mind.n)}` : ''}`)}
  <button class="btn ghost" data-act="test">Send a test notification</button>
  ${native.isNative ? '' : `<h2>Calendar reminders</h2>
  <div class="dim sm">Creates a calendar file with the next 14 days of reminders, each with an alarm.</div>
  <button class="btn" data-act="ics">Export reminders (.ics)</button>`}
  <h2>Backup</h2>
  <div class="dim sm">Everything is stored only on this phone.</div>
  <button class="btn" data-act="export">Export backup</button>
  <label class="btn ghost" style="cursor:pointer">Restore from backup file<input type="file" id="restore" accept=".json,application/json" hidden></label>
  <div id="msg" class="good sm"></div>
  <div class="dim sm center" style="margin-top:18px">Timbre Tamer · build ${esc(BUILD)}</div>`;
}

/* ----- guided runner ----- */
let G = null;
const pad = (n) => `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;
let ac;
function beep() { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); ac.resume?.(); const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = 880; g.gain.setValueAtTime(0.25, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.6); o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + 0.6); } catch (e) {} }
const vib = (p) => (navigator.vibrate ? navigator.vibrate(p) : beep()); // iPhones cannot vibrate from a web page, so they get a soft chime
if (native.isNative) document.addEventListener('visibilitychange', () => { if (!document.hidden) { changed(); syncUnlock(); } }); // refill the nearest reminders when the app opens
async function wake() { try { G.lock = await navigator.wakeLock?.request('screen'); } catch (e) {} }
function stopGuide() { if (G) { clearInterval(G.timer); clearInterval(G.xi); G.lock?.release?.().catch(() => {}); } G = null; document.body.classList.remove('guided'); }

function startGuide(id) {
  stopGuide();
  G = { ex: exById[id], i: 0, run: false, stepDone: false, done: false, focus: 0, note: '' };
  initStep(); wake();
}
function initStep() {
  clearInterval(G.timer); clearInterval(G.xi); G.xt = null; G.run = false; G.stepDone = false;
  const st = stepOf();
  G.left = st.secs || 0; G.elapsed = 0;
  G.pickSecs = null; if (st.pick) G.left = st.secs;
  if (st.breath) Object.assign(G, { rep: 1, ph: 0, left: st.breath.phases[0][1] });
}
const stepOf = () => { const r = G.ex.steps[G.i]; return typeof r === 'string' ? { t: r } : r; };

function tick() {
  const st = stepOf();
  if (st.open) { G.elapsed++; $('#tm').textContent = pad(G.elapsed); return; }
  if (st.secs) {
    G.left--; $('#tm').textContent = pad(G.left);
    if (st.buzz && G.left > 0 && ((G.pickSecs || st.secs) - G.left) % st.buzz === 0) vib([0, 250, 120, 250]); // keeps track of time with eyes closed
    if (G.left <= 0) { vib([0, 300, 150, 300]); G.run = false; G.stepDone = true; clearInterval(G.timer); paint(); }
    return;
  }
  if (st.breath) {
    const P = st.breath.phases;
    if (G.left > 1) G.left--;
    else {
      vib(40);
      if (G.ph + 1 < P.length) { G.ph++; G.left = P[G.ph][1]; }
      else if (G.rep < st.breath.reps) { G.rep++; G.ph = 0; G.left = P[0][1]; }
      else { vib([0, 300, 150, 300]); G.run = false; G.stepDone = true; clearInterval(G.timer); paint(); return; }
    }
    $('#ph').textContent = P[G.ph][0]; $('#tm').textContent = G.left; $('#rp').textContent = `Round ${G.rep} of ${st.breath.reps}`;
  }
}
function toggleRun() {
  G.run = !G.run; clearInterval(G.timer);
  if (G.run) G.timer = setInterval(tick, 1000);
  paint();
}
// The note saved from a guided practice: its own form fields when it has them, else the free note.
const guideNote = () => (G.ex.log ? G.ex.log.map((f, i) => ((G.f || [])[i] || '').trim() ? `${f.label}\n${G.f[i].trim()}` : '').filter(Boolean).join('\n\n') : G.note.trim());
function Guide() {
  if (!G) return back('#practice') + '<p>Nothing running.</p>';
  document.body.classList.add('guided');
  const ex = G.ex;
  if (G.done) return `<h1>${esc(ex.title)} — done</h1>
    ${card(`<div class="dim sm">How was your focus?</div>${rating('gfocus', G.focus)}${ex.log ? ex.log.map((f, i) => `<div class="dim sm" style="margin-top:12px">${esc(f.label)}</div><textarea data-gf="${i}" placeholder="${esc(f.ph || '')}">${esc((G.f || [])[i] || '')}</textarea>`).join('') : `<div class="dim sm" style="margin-top:12px">${ex.kind === 'review' ? 'Write the exact hour and everything you observed.' : 'Notes (optional)'}</div><textarea name="gnote" placeholder="What did you notice?">${esc(G.note)}</textarea>`}`)}
    <button class="btn" data-act="gsave">${ex.kind === 'recall' ? 'Save and go to recall log' : 'Save to log'}</button>
    <button class="btn ghost" data-act="gskip">Skip logging</button>`;
  const st = stepOf(); const last = G.i === ex.steps.length - 1;
  const gated = (st.secs || st.breath) && !G.stepDone;
  const label = G.run ? 'Pause' : (st.breath ? G.rep === 1 && G.ph === 0 && G.left === st.breath.phases[0][1] : G.left === st.secs && !G.elapsed) ? 'Start' : 'Resume';
  let widget = '';
  if (st.open) widget = `<div class="big" id="tm">${pad(G.elapsed)}</div><div class="center dim sm">Take as long as you need</div><button class="btn ghost" data-act="trun">${G.run ? 'Pause clock' : G.elapsed ? 'Resume clock' : 'Start clock'}</button>`;
  else if (st.secs) widget = `${st.pick && !G.run && !G.stepDone && G.left === (G.pickSecs || st.secs) ? `<div class="center dim sm">Timer length</div><div class="center">${stepper('padj', G.pickSecs || st.secs, (v) => pad(v))}</div>` : ''}<div class="big" id="tm">${pad(G.left)}</div>${G.stepDone ? '<div class="center good">Done</div>' : `<button class="btn ghost" data-act="trun">${label} timer</button>`}`;
  else if (st.breath) widget = `<div class="center" style="font-size:22px" id="ph">${G.stepDone ? 'Complete' : st.breath.phases[G.ph][0]}</div><div class="big" id="tm">${G.stepDone ? '✓' : G.left}</div><div class="center dim" id="rp">Round ${Math.min(G.rep, st.breath.reps)} of ${st.breath.reps}</div>${G.stepDone ? '' : `<button class="btn ghost" data-act="trun">${label}</button>`}`;
  if (!st.open && !st.secs && !st.breath && !st.music) widget = G.xt
    ? `<div class="center dim sm">Timer</div><div class="big" id="xtm">${pad(G.xt.left)}</div><button class="btn ghost" data-act="xstop">${G.xt.left > 0 ? 'Stop timer' : 'Clear'}</button>`
    : `<div class="center dim sm" style="margin-top:10px">Need a timer for this step?</div><div class="chips" style="justify-content:center">${[1, 5, 10].map((m) => `<button class="chip" data-act="xt:${m * 60}">⏱ ${m} min</button>`).join('')}</div>`;
  if (st.music) widget = `<button class="btn ghost" data-act="music">${S.rem.playlist ? '♪ Play my songs' : '♪ Add a playlist in Settings'}</button>`;
  return `<div class="dim sm">${esc(ex.title)} · step ${G.i + 1} of ${ex.steps.length}</div>
    ${ex.caution && G.i === 0 ? card(`<div class="warn sm">${esc(ex.caution)}</div>`, 'warnb') : ''}
    ${card(`<div class="step">${esc(st.t)}</div>`)}${widget}
    <button class="btn ${gated ? 'ghost' : ''}" data-act="gnext">${last ? 'Finish' : 'Next'}</button>
    ${G.i > 0 ? '<button class="btn ghost" data-act="gprev">Back</button>' : ''}
    <button class="btn ghost" data-act="gquit" style="border-color:var(--line);color:var(--dim)">Quit</button>`;
}

/* ---------------- router ---------------- */
const $ = (s) => document.querySelector(s);
function paint() {
  const [r, a] = location.hash.slice(1).split('/');
  const route = r || 'today';
  if (route !== 'guide') stopGuide();
  if (route !== 'scale') sc = null;
  if (route !== 'ex') warnStep = 1;
  let h;
  switch (route) {
    case 'today': h = Today(); break;
    case 'practice': h = Practice(); break;
    case 'info': h = Info(); break;
    case 'tour': S.tourSeen = true; save(); h = Tour(); break;
    case 'ex': h = locked(a) ? Unlock(a) : gated(a) ? Attn() : exById[a] && exById[a].advanced && !advOk.has(a) ? Warn(a) : Exercise(a); break;
    case 'unlock': h = Unlock(decodeURIComponent(a)); break;
    case 'guide': if (locked(a)) { h = Unlock(a); break; } if (gated(a)) { h = Attn(); break; } if (!G || G.ex.id !== a) { if (exById[a]) startGuide(a); } h = Guide(); break;
    case 'log': h = Log(); break;
    case 'note': h = NoteForm(a); break;
    case 'recall': h = RecallForm(); break;
    case 'chakras': h = locked('info:chakras') ? Unlock('info:chakras') : Chakras(); break;
    case 'cycles': h = locked('info:cycles') ? Unlock('info:cycles') : Cycles(); break;
    case 'about': h = About(); break;
    case 'cat': h = Choose(a); break;
    case 'scale': h = Scale(); break;
    case 'why': h = Why(); break;
    case 'learn': h = locked('cat:' + a) ? Unlock('cat:' + a) : Learn(a); break;
    case 'attn': h = locked('info:attn') ? Unlock('info:attn') : Attn(); break;
    case 'fast': h = locked('info:fast') ? Unlock('info:fast') : FastLesson(); break;
    case 'laws': h = locked('info:laws') ? Unlock('info:laws') : Laws(); break;
    case 'wheel': h = Wheel(); break;
    case 'day': h = Day(a); break;
    case 'settings': h = Settings(); break;
    default: h = Today();
  }
  if (!['note', 'recall'].includes(route)) form = {};
  $('#view').innerHTML = h;
  const tab = ['today', 'practice', 'info', 'settings'].includes(route) ? route : route === 'cat' ? 'today' : route === 'tour' || (route === 'unlock' && homeOf(decodeURIComponent(a)) === '#info') || route === 'laws' || route === 'fast' || route === 'chakras' || route === 'cycles' || route === 'about' || route === 'learn' || route === 'why' || route === 'attn' || (route === 'ex' && TEACH.includes(a)) ? 'info' : route === 'ex' || (route === 'unlock' && homeOf(decodeURIComponent(a)) === '#practice') || route === 'scale' || route === 'wheel' || route === 'guide' ? 'practice' : 'settings'; // Log, notes and day pages are reached from Settings
  document.querySelectorAll('#tabs a').forEach((el) => el.classList.toggle('on', el.dataset.tab === tab));
  const rs = $('#restore'); if (rs) rs.onchange = restore;
  if (adsOn() && ['practice', 'info'].includes(route)) { $('#view').insertAdjacentHTML('beforeend', '<div style="height:70px"></div>'); native.showBanner(ADMOB, 56); } else native.hideBanner(); // a banner only on the Practice and Info lists, never during practice
  window.scrollTo(0, 0);
}
function repaintKeep() { const y = window.scrollY; paint(); window.scrollTo(0, y); }
window.addEventListener('hashchange', paint);

/* ---------------- actions ---------------- */
const locDisclosure = () => new Promise((ok) => {
  if (S.locAgreed) return ok(true);
  const d = document.createElement('div');
  d.style.cssText = 'position:fixed;inset:0;z-index:99;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px';
  d.innerHTML = '<div class="card" style="max-width:420px;max-height:90vh;overflow:auto"><b>Location use</b><div class="sm" style="margin:8px 0">Timbre Tamer collects your location <b>in the background, even when the app is closed or not in use</b>, to know when you leave your home so it can send the reminders you chose. This is the only reason location is used.</div><div class="sm" style="margin:8px 0">Your location stays on this phone. It is never uploaded, shared or used for ads.</div><div class="sm dim" style="margin:8px 0">Next your phone will ask for permission. Choose <b>Allow all the time</b> so reminders work with the app closed.</div><button class="btn" id="la-y">Agree and continue</button> <button class="btn ghost" id="la-n">No thanks</button></div>';
  document.body.appendChild(d);
  const end = (v) => { d.remove(); if (v) { S.locAgreed = true; save(); } ok(v); };
  d.querySelector('#la-y').onclick = () => end(true);
  d.querySelector('#la-n').onclick = () => end(false);
});
const msg = (t) => { const m = $('#msg'); if (m) m.textContent = t; };
document.addEventListener('input', (e) => {
  const gf = e.target.dataset?.gf; if (gf !== undefined && G) { (G.f = G.f || [])[+gf] = e.target.value; return; }
  const wf = e.target.dataset?.wf; if (wf !== undefined && wh) { if (wf === 'desire') wh.desire = e.target.value; else wh.spokes[+wf].t = e.target.value; return; }
  const n = e.target.name; if (!n) return;
  if (n === 'note') form.note = e.target.value;
  if (n === 'gnote' && G) G.note = e.target.value;
  const b = $('[data-act="savenote"],[data-act="saverecall"]');
  if (b) b.disabled = !(form.note.trim() || form.details || form.ex);
});
document.addEventListener('change', (e) => { if (e.target.id === 'playlist') { S.rem.playlist = e.target.value.trim(); save(); } });
function openMusic() {
  if (!S.rem.playlist) { toast('Add a playlist link in Settings first'); location.hash = '#settings'; return; }
  window.location.href = S.rem.playlist;
}
document.addEventListener('click', async (e) => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const [act, a, b, c3] = el.dataset.act.split(':');
  switch (act) {
    case 'ms': S.milestones[a] = !S.milestones[a]; save(); repaintKeep(); break;
    case 'logtab': logTab = a; paint(); break;
    case 'del': if (confirm('Delete entry?')) { const k = a === 'r' ? 'recalls' : 'sessions'; const gone = S[k].find((x) => x.id === b); if (gone && gone.quick) { const t = S.tally?.[dayKey(gone.ts)]; if (t && t[gone.ex] > 0) { t[gone.ex]--; if (!t[gone.ex]) delete t[gone.ex]; } } S[k] = S[k].filter((x) => x.id !== b); save(); repaintKeep(); } break;
    case 'pickex': form.ex = form.ex === a ? null : a; repaintKeep(); break;
    case 'rate': if (a === 'gfocus') G.focus = +b; else form[a] = +b; repaintKeep(); break;
    case 'inc': case 'dec': { const d = act === 'inc' ? 1 : -1; stepTo(a, b, d, c3); break; }
    case 'savenote': S.sessions.unshift({ id: uid(), ts: Date.now(), ex: form.ex, focus: form.focus || null, note: form.note.trim() }); save(); location.hash = '#log'; break;
    case 'saverecall': bump('obs-recall'); S.recalls.unshift({ id: uid(), ts: Date.now(), details: form.details, accuracy: form.accuracy || null, note: form.note.trim() }); save(); location.hash = '#log'; break;
    case 'con': S.rem.cat[a].on = !S.rem.cat[a].on; save(); repaintKeep(); break;
    case 'crand': { const c = S.rem.cat[a], g = group(a); c.random = !c.random;
      if (c.random) { c.exPrev = c.ex.slice(); c.ex = [...g.pool, ...g.leave]; } else { c.ex = (c.exPrev && c.exPrev.length ? c.exPrev : c.ex).slice(); delete c.exPrev; }
      c.goal = goalFor(g, c); REMIND_GROUPS.forEach((x) => x.leave.forEach((id) => { S.rem.leaveItems[id] = S.rem.cat[x.id].ex.includes(id); })); save(); repaintKeep(); break; }
    case 'cex': { if (S.rem.cat[a].random) break; const l = S.rem.cat[a].ex; const i = l.indexOf(b); if (i >= 0 && l.length > 1) l.splice(i, 1); else if (i < 0) l.push(b); S.rem.cat[a].goal = goalFor(group(a), S.rem.cat[a]); REMIND_GROUPS.forEach((g) => g.leave.forEach((id) => { S.rem.leaveItems[id] = S.rem.cat[g.id].ex.includes(id); })); save(); repaintKeep(); break; }
    case 'ctime': S.rem.cat[a].timing = b; save(); repaintKeep(); break;
    case 'cch': S.rem.cat[a].choose = b === '1'; save(); repaintKeep(); break;
    case 'lv': S.rem.leaveItems[a] = !S.rem.leaveItems[a]; save(); repaintKeep(); break;
    case 'sopen': setOpen[a] = !setOpen[a]; repaintKeep(); break;
    case 'other': openCat = openCat === a ? null : a; repaintKeep(); break;
    case 'music': openMusic(); break;
    case 'sayset': S.sets = S.sets || []; S.sets = S.sets.includes(a) ? S.sets.filter((x) => x !== a) : S.sets.concat(a); save(); repaintKeep(); break;
    case 'mindon': S.rem.mind.on = !S.rem.mind.on; save(); repaintKeep(); break;
    case 'recallon': S.rem.recall.on = !S.rem.recall.on; save(); repaintKeep(); break;
    case 'sethome': {
      if (!(await locDisclosure())) { msg(''); break; }
      msg('Finding your location…');
      try { const p = await native.currentPosition(); S.rem.home = { latitude: p.latitude, longitude: p.longitude, r: S.rem.home?.r || 150 }; save(); repaintKeep(); msg('Home set.'); toast('Home set. Last step: phone Settings → Apps → Timbre Tamer → Permissions → Location → Allow all the time.'); }
      catch (err) { msg('Could not get your location. Allow location "all the time" for this app and try again.'); }
      break;
    }
    case 'perm': {
      if (native.isNative) { permState = (await native.ensurePerms()) ? 'granted' : 'denied'; try { localStorage.setItem('mindful-perm', permState === 'granted' ? 'granted' : ''); } catch (e) {} }
      else { permState = await Notification.requestPermission(); if (permState === 'granted') checkDue(); }
      changed(); repaintKeep(); break;
    }
    case 'test': {
      if (native.isNative) { if (!(await native.ensurePerms())) return msg('Notifications are blocked.'); await native.fireNow(999999, 'Mindful moment', nudgePool()[Math.floor(Math.random() * nudgePool().length)], '#today'); return msg('Coming in a moment.'); }
      if (!('Notification' in window)) return msg('This browser does not support notifications.');
      if (Notification.permission !== 'granted') await Notification.requestPermission();
      if (Notification.permission !== 'granted') return msg('Notifications are blocked.');
      notify('Mindful moment', nudgePool()[Math.floor(Math.random() * nudgePool().length)]); msg('Sent.'); break;
    }
    case 'ics': exportCalendar(); msg('Calendar file created — open it to add the reminders.'); break;
    case 'export': exportBackup(); break;
    case 'learnattn': S.learned = { ...(S.learned || {}), attn: !(S.learned || {}).attn }; save(); repaintKeep(); break;
    case 'fon': S.fast.on = !S.fast.on; if (!S.fast.on) S.fast.start = ''; save(); repaintKeep(); break;
    case 'fdays': S.fast.days = +a; save(); repaintKeep(); break;
    case 'fstart': S.fast.start = dayKey(); S.fast.done = {}; save(); repaintKeep(); toast('Frequency Fast started'); break;
    case 'fstop': S.fast.start = ''; save(); repaintKeep(); break;
    case 'fastend': S.fast.start = ''; save(); repaintKeep(); break;
    case 'fastck': { const k = dayKey(); const t = S.fast.done[k] || (S.fast.done[k] = {}); t[a] = !t[a]; save(); repaintKeep(); if (t.a && t.b) toast('Day complete ✓'); break; }
    case 'loop': S.loops[b] = a; save(); repaintKeep(); toast('Noted'); break;
    case 'loopr': S.loops[a + 'r'] = 1; save(); repaintKeep(); break;
    case 'loopb': S.loops[a + 'b'] = 1; save(); repaintKeep(); break;
    case 'scstart': sc = { start: +a, rung: +a, done: false }; paint(); break;
    case 'scup': sc.rung--; paint(); break;
    case 'screst': sc.done = true; paint(); break;
    case 'scquit': sc = null; paint(); break;
    case 'scend': S.scale.unshift({ ts: Date.now(), start: sc.start, end: sc.rung }); save(); sc = null; location.hash = '#practice'; break;
    case 'wok': wh.spokes[+a].ok = !wh.spokes[+a].ok; repaintKeep(); if (wh.spokes.every((x) => x.ok && x.t.trim())) toast('The wheel is spinning'); break;
    case 'wsave': { const i = S.wheels.findIndex((w) => w.id === wh.id); const copy = JSON.parse(JSON.stringify(wh)); if (i >= 0) S.wheels[i] = copy; else S.wheels.unshift(copy); save(); toast('Wheel saved'); repaintKeep(); break; }
    case 'wnew': wh = newWheel(); paint(); break;
    case 'wload': wh = JSON.parse(JSON.stringify(S.wheels.find((w) => w.id === a))); paint(); break;
    case 'wdel': if (confirm('Delete this wheel?')) { S.wheels = S.wheels.filter((w) => w.id !== a); if (wh && wh.id === a) wh = null; save(); repaintKeep(); } break;
    case 'tourhide': S.tourSeen = true; save(); repaintKeep(); break;
    case 'watchad': try { await native.rewardedAd(ADMOB); const t = S.adPass && S.adPass.day === dayKey() ? S.adPass : { day: dayKey(), ids: [] }; if (!t.ids.includes(a)) t.ids.push(a); S.adPass = t; save(); location.hash = `#ex/${a}`; } catch (err) { msg('The ad could not play right now. Check your connection and try again, or watch it to the end.'); } break;
    case 'buy': try { await native.buy(a); if (!S.owned.includes(a)) S.owned.push(a); save(); if (!adsOn()) native.hideBanner(); msg('Unlocked. Thank you!'); location.hash = homeOf(unlockKey); repaintKeep(); } catch (err) { const m = String((err && err.message) || err || '').toLowerCase(); msg(m.includes('pending') ? 'The purchase is still pending. It unlocks when Google Play confirms it.' : m.includes('cancel') ? 'Purchase cancelled.' : 'Google Play could not complete the purchase. Check your connection and try again.'); } break;
    case 'restoreunlock': try { const o = await native.restore(); S.owned = o.filter((id) => id === EVERYTHING_ID || PACKAGES.some((k) => k.pid === id)); save(); native.hideBanner(); location.hash = '#practice'; repaintKeep(); } catch (err) { msg('No purchase found on this Google account.'); } break;
    case 'warn1': warnStep = 2; paint(); break;
    case 'warn2': advOk.add(a); warnStep = 1; paint(); break;
    case 'saveplaylist': { const v = ($('#playlist')?.value || '').trim(); S.rem.playlist = v; save(); toast(v ? 'Playlist saved' : 'Playlist cleared'); repaintKeep(); break; }
    case 'trun': toggleRun(); break;
    case 'xt': clearInterval(G.xi); G.xt = { left: +a }; G.xi = setInterval(() => { G.xt.left--; const e = $('#xtm'); if (e) e.textContent = pad(Math.max(0, G.xt.left)); if (G.xt.left <= 0) { clearInterval(G.xi); vib([0, 300, 150, 300]); paint(); } }, 1000); paint(); break;
    case 'xstop': clearInterval(G.xi); G.xt = null; paint(); break;
    case 'pick': G.pickSecs = +a; G.left = +a; paint(); break;
    case 'undo': { const t = S.tally?.[dayKey()]; if (t && t[a] > 0) { t[a]--; if (!t[a]) delete t[a]; save(); } repaintKeep(); break; }
    case 'done': quickDone(a); openCat = null; toast(`✓ ${exById[a].title} — ${tallyOf(a)} today`); repaintKeep(); break;
    case 'gnext': if (G.ex.steps.length - 1 === G.i) { G.done = true; clearInterval(G.timer); paint(); } else { G.i++; initStep(); paint(); } break;
    case 'gprev': G.i--; initStep(); paint(); break;
    case 'gquit': location.hash = `#ex/${G.ex.id}`; break;
    case 'gsave': case 'gskip': {
      S.sessions.unshift({ id: uid(), ts: Date.now(), ex: G.ex.id, focus: act === 'gsave' ? G.focus || null : null, note: act === 'gsave' ? guideNote() : '' });
      bump(G.ex.id); const kind = G.ex.kind; stopGuide();
      location.hash = kind === 'recall' ? '#recall' : '#today'; break;
    }
  }
});
function stepTo(name, id, d, idx) {
  const R = S.rem; const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  if (name === 'details') form.details = clamp(form.details + d, 0, 200);
  else {
    if (name === 'rc') { const v = clamp(R.recall.h * 60 + R.recall.m + d * 15, 0, 1425); R.recall.h = Math.floor(v / 60); R.recall.m = v % 60; }
    if (name === 'ct') R.cat[id].times[+idx] = clamp(R.cat[id].times[+idx] + d * 15, 0, 1425);
    if (name === 'cg') R.cat[id].goal = clamp(R.cat[id].goal + d, 1, 4);
    if (name === 'cn') {
      const c = R.cat[id]; c.n = clamp(c.n + d, 1, 4); if (group(id).simple) c.goal = c.n;
      // changing the count re-spreads the set times evenly through your day; adjust them after
      c.times = Array.from({ length: c.n }, (_, k) => Math.round((R.day.s * 60 + ((R.day.e - R.day.s) * 60 * (k + 0.5)) / c.n) / 15) * 15);
    }
    if (name === 'mindn') R.mind.n = clamp(R.mind.n + d, 1, 12);
    if (name === 'dayS') R.day.s = clamp(R.day.s + d, 0, R.day.e - 1);
    if (name === 'dayE') R.day.e = clamp(R.day.e + d, R.day.s + 1, 23);
    if (name === 'padj') { const st = stepOf(); G.pickSecs = Math.max(60, Math.min(st.max || st.secs + 300, (G.pickSecs || st.secs) + d * 30)); G.left = G.pickSecs; repaintKeep(); return; }
    if (name === 'leaven') R.leave.n = clamp(R.leave.n + d, 1, 6);
    if (name === 'leaveS') R.leave.s = clamp(R.leave.s + d, 0, R.leave.e - 1);
    if (name === 'leaveE') R.leave.e = clamp(R.leave.e + d, R.leave.s + 1, 24);
    if (name === 'homer') R.home.r = clamp(R.home.r + d * 50, 50, 1000);
    save();
  }
  repaintKeep();
}
async function exportBackup() {
  const text = JSON.stringify(S, null, 1); const name = `timbre-tamer-backup-${dayKey()}.json`;
  try {
    const f = new File([text], name, { type: 'application/json' });
    if (navigator.canShare?.({ files: [f] })) { await navigator.share({ files: [f], title: 'Timbre Tamer backup' }); return msg('Backup shared.'); }
  } catch (e) { if (e.name === 'AbortError') return; }
  download(name, 'application/json', text); msg('Backup downloaded.');
}
async function restore(e) {
  const f = e.target.files[0]; if (!f) return;
  try {
    const d = JSON.parse(await f.text());
    if (!Array.isArray(d.sessions) || !Array.isArray(d.recalls)) throw new Error();
    if (!confirm('Replace everything on this phone with this backup?')) return;
    S = { ...fresh(), ...d }; S.rem = mergeRem(S.rem); save(); paint(); msg('Backup restored.');
  } catch (err) { msg('That does not look like a backup.'); }
}

/* ---------------- boot ---------------- */
if (!native.isNative && 'serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) navigator.serviceWorker.register('sw.js').catch(() => {});
native.onTap((route, action, exId) => {
  if (action === 'done' && exId) { quickDone(exId); toast(`✓ ${exById[exId].title} — ${tallyOf(exId)} today`); location.hash = '#today'; paint(); }
  else if (route) location.hash = route;
});
native.onRoute((route) => { location.hash = route; });
if (native.isNative) native.permState().then((p) => { permState = p; try { localStorage.setItem('mindful-perm', p === 'granted' ? 'granted' : ''); } catch (e) {} if (['', '#today', '#settings'].includes(location.hash)) repaintKeep(); changed(); });
// The phone's Back button does what the on-screen "‹ Back" does: one step back, then to Today, then it puts the app away.
native.onBack(() => {
  const no = document.getElementById('la-n'); if (no) { no.click(); return; } // the location disclosure
  const route = (location.hash.slice(1) || 'today').split('/')[0];
  if (G && route === 'guide') {
    if (G.done) return; // finish by saving or skipping, so a stray Back does not lose the entry
    const b = document.querySelector(G.i > 0 ? '[data-act="gprev"]' : '[data-act="gquit"]'); if (b) b.click(); return;
  }
  const link = document.querySelector('#view a.back'); if (link) { location.hash = link.getAttribute('href'); return; }
  if (route !== 'today') { location.hash = '#today'; return; }
  native.minimizeApp();
});
paint(); checkDue(); syncUnlock();
window.__mindfulBooted = true;
window.__mindful = { occurrences, onLeave, state: () => S }; // handy for diagnostics and tests
