import { CATS, EXERCISES, MILESTONES, exById, CHAKRAS, CHAKRA_INTRO, CYCLES, REMIND_GROUPS, CAT_LABEL, REMIND_DEFAULTS, NUDGES, PING } from './content.js';
import * as native from './native.js';
import { BUILD } from './build.js';

/* ---------------- storage ---------------- */
const KEY = 'mindful-v2';
const clone = (o) => JSON.parse(JSON.stringify(o)); // older phone web engines lack structuredClone
const fresh = () => ({ rem: clone(REMIND_DEFAULTS), milestones: {}, sessions: [], recalls: [], tally: {} });
let S;
try { S = { ...fresh(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch (e) { S = fresh(); }
// Brings saved settings (including older versions' shapes) up to the current shape.
const mergeRem = (r = {}) => {
  const d = clone(REMIND_DEFAULTS); const day = { ...d.day, ...r.day };
  const evenMins = (n) => Array.from({ length: n }, (_, k) => Math.round((day.s * 60 + ((day.e - day.s) * 60 * (k + 0.5)) / n) / 15) * 15);
  const cat = {};
  for (const g of REMIND_GROUPS) {
    const o = (r.cat || {})[g.id] || {}; const base = d.cat[g.id]; const c = { ...base, ...o };
    c.timing = c.timing === 'time' ? 'set' : ['set', 'even', 'random'].includes(c.timing) ? c.timing : base.timing;
    c.ex = (c.ex || []).filter((x) => g.pool.includes(x)); if (!c.ex.length) c.ex = base.ex.slice();
    c.n = Math.max(1, Math.min(4, parseInt(c.n, 10) || 1));
    c.goal = Math.max(1, Math.min(4, parseInt(o.goal, 10) || parseInt(o.n, 10) || 1)); // older saves used one number for both
    if (!Array.isArray(o.times) || !o.times.length) c.times = typeof o.h === 'number' ? [o.h * 60 + (o.m || 0)] : base.times.slice(); // older saves stored one h/m
    const pad = evenMins(c.n); while (c.times.length < c.n) c.times.push(pad[c.times.length]);
    c.times = c.times.slice(0, c.n); c.choose = c.choose !== false; delete c.h; delete c.m;
    cat[g.id] = c;
  }
  return { ...d, ...r, cat, day, mind: { ...d.mind, ...r.mind }, leave: { ...d.leave, ...r.leave }, recall: { ...d.recall, ...r.recall }, leaveItems: { ...d.leaveItems, ...r.leaveItems } };
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
function bump(id) { const k = dayKey(); if (!S.tally) S.tally = {}; if (!S.tally[k]) S.tally[k] = {}; S.tally[k][id] = (S.tally[k][id] || 0) + 1; save(); }
function toast(t) {
  const el = document.createElement('div'); el.textContent = t;
  el.style.cssText = 'position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#6fcf97;color:#1e1833;padding:10px 18px;border-radius:20px;font-weight:700;z-index:9';
  document.body.appendChild(el); setTimeout(() => el.remove(), 2200);
}
function streak() {
  const days = practiceDays(); let n = 0; const d = new Date();
  if (!days.has(dayKey(d.getTime()))) d.setDate(d.getDate() - 1);
  while (days.has(dayKey(d.getTime()))) { n++; d.setDate(d.getDate() - 1); }
  return n;
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
const catCount = (gid, day = dayKey()) => group(gid).pool.reduce((a, id) => a + tallyOf(id, day), 0);
const catDone = (gid, day = dayKey()) => catCount(gid, day) >= S.rem.cat[gid].goal;
const canLeave = () => native.isNative && !!S.rem.home;
const choosing = (gid) => S.rem.cat[gid].choose && S.rem.cat[gid].ex.length > 1;
// the exercise a reminder names when it is not asking you to choose (rotates through the ones you picked)
function planned(gid, date = new Date(), k = 0) { const list = S.rem.cat[gid].ex; return list[(dayNum(date) + k + REMIND_GROUPS.findIndex((g) => g.id === gid)) % list.length]; }
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
  const rc = S.rem.recall;
  if (rc.on) out.push({ id: 'recall', cat: 'obs', at: at(date, rc.h, rc.m), label: 'Evening recall', title: 'Observation: Evening recall', body: 'Recall your first activity this morning in as much detail as you can, then log it.', route: '#recall' });
  for (const g of REMIND_GROUPS) {
    const c = S.rem.cat[g.id];
    if (!c.on || (isToday && catDone(g.id))) continue;
    const mins = c.timing === 'set' ? c.times.slice(0, c.n) : minutesFor(g.id, c.n, c.timing, date);
    mins.forEach((m, k) => {
      const base = { id: `${g.id}${k}`, cat: g.id, at: at(date, Math.floor(m / 60), m % 60), label: g.label };
      if (choosing(g.id)) {
        out.push({ ...base, title: `${g.label}: pick one`, body: c.ex.map((x) => exById[x].title).join(' · '), route: `#cat/${g.id}` });
      } else {
        const id = planned(g.id, date, k); const ex = exById[id];
        out.push({ ...base, title: `${g.label}: ${ex.title}`, body: PING[id] || ex.summary, route: `#ex/${id}`, exId: id });
      }
    });
  }
  const mi = S.rem.mind;
  if (mi.on) minutesFor('mind', mi.n, 'even', date).forEach((m, k) =>
    out.push({ id: `mind${k}`, at: at(date, Math.floor(m / 60), m % 60), label: 'Mindfulness', title: 'Mindful moment', body: NUDGES[(dayNum(date) * 17 + k * 7) % NUDGES.length], route: '#today' }));
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
    const leaving = REMIND_GROUPS.some((g) => S.rem.cat[g.id].on && g.leave.some((id) => S.rem.leaveItems[id]));
    await native.watchLeave(leaving && canLeave() ? S.rem.home : null, onLeave);
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
  const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Mindful//EN', 'CALSCALE:GREGORIAN'];
  const now = new Date().toISOString().replace(/[-:]|\.\d+/g, '');
  for (let i = 0; i < 14; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    for (const o of occurrences(d)) {
      if (o.at < new Date()) continue;
      const end = new Date(o.at.getTime() + 5 * 60000);
      L.push('BEGIN:VEVENT', `UID:${dayKey(o.at.getTime())}-${o.id}@mindful`, `DTSTAMP:${now}`, `DTSTART:${stamp(o.at)}`, `DTEND:${stamp(end)}`,
        `SUMMARY:${tx(o.title)}`, `DESCRIPTION:${tx(o.body)}`, 'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${tx(o.title)}`, 'TRIGGER:PT0S', 'END:VALARM', 'END:VEVENT');
    }
  }
  L.push('END:VCALENDAR');
  download('mindful-reminders.ics', 'text/calendar', L.join('\r\n'));
}
function download(name, type, text) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name; document.body.appendChild(a); a.click(); a.remove();
}

/* ---------------- ui helpers ---------------- */
const card = (inner, o = '') => `<div class="card ${o}">${inner}</div>`;
const link = (href, inner, o = '') => `<a class="card ${o}" href="${href}">${inner}</a>`;
const check = (on, label, act, sub = '') => `<div class="check ${on ? 'on' : ''}" data-act="${act}"><div class="box">${on ? '✓' : ''}</div><div><div>${label}</div>${sub ? `<div class="dim sm">${sub}</div>` : ''}</div></div>`;
const stepper = (name, val, fmt) => `<span class="stepper"><button data-act="dec:${name}">−</button><span>${fmt ? fmt(val) : val}</span><button data-act="inc:${name}">+</button></span>`;
const rating = (name, val) => `<div class="rating">${[1, 2, 3, 4, 5].map((n) => `<button data-act="rate:${name}:${n}" class="${val >= n ? 'on' : ''}">${n}</button>`).join('')}</div>`;
const back = (href = '#practice') => `<a class="back" href="${href}">‹ Back</a>`;

/* ---------------- screens ---------------- */
let openCat = null;
const exRow = (id) => {
  const t = tallyOf(id);
  return `<div class="row" style="align-items:flex-start;margin-top:8px"><div style="flex:3"><a href="#ex/${id}" style="color:inherit;text-decoration:none"><b>${t ? '✓ ' : ''}${esc(exById[id].title)}</b></a><div class="dim sm">${t} today</div></div>
    <div style="flex:2;display:flex;gap:6px"><a class="chip" href="#ex/${id}" style="text-decoration:none;text-align:center;flex:1">Rules</a><button class="chip on" data-act="done:${id}" style="flex:1">✓ Done</button></div></div>`;
};
function Today() {
  const now = new Date();
  const recalled = S.recalls.some((r) => dayKey(r.ts) === dayKey());
  const nudge = NUDGES[dayNum() % NUDGES.length];
  const n = streak();
  const next = {}; occurrences(now).forEach((o) => { if (o.cat && o.id !== 'recall' && o.at > now && !next[o.cat]) next[o.cat] = o.at; });
  const rows = REMIND_GROUPS.filter((g) => S.rem.cat[g.id].on).map((g) => {
    const c = S.rem.cat[g.id]; const cnt = catCount(g.id);
    const status = cnt >= c.goal ? `goal met · ${cnt} of ${c.goal}` : `${cnt} of ${c.goal} today${next[g.id] ? ` · next reminder ${fmtTime(next[g.id].getHours(), next[g.id].getMinutes())}` : ''}`;
    let body;
    if (choosing(g.id)) body = '<div class="dim sm" style="margin-top:6px">Pick one:</div>' + c.ex.map(exRow).join('');
    else {
      const id = planned(g.id);
      body = exRow(id) + (c.ex.length > 1 || g.pool.length > 1 ? `<button class="chip" data-act="other:${g.id}" style="margin-top:8px">I did a different one</button>` : '');
      if (openCat === g.id) body += `<div class="chips">${g.pool.map((x) => `<button class="chip" data-act="done:${x}">${esc(exById[x].title)}</button>`).join('')}</div>`;
    }
    const leave = g.leave.filter((id) => S.rem.leaveItems[id]).map((id) =>
      `<div class="dim sm" style="margin-top:12px">When you leave home${native.isNative && !S.rem.home ? ' · <a href="#settings" style="color:var(--accent)">set your home in Settings</a>' : ''}</div>${exRow(id)}`).join('');
    const recall = g.id === 'obs' && S.rem.recall.on
      ? `<div class="dim sm" style="margin-top:12px">Tonight · ${fmtTime(S.rem.recall.h, S.rem.recall.m)}</div><a href="#recall" style="color:inherit;text-decoration:none"><b>${recalled ? '✓ ' : ''}Evening recall</b></a><div class="dim sm">Recall your first morning activity and log it</div>` : '';
    const goalRow = `<div class="row" style="margin-top:10px;justify-content:space-between"><span class="dim sm" style="flex:2">Daily goal</span><span style="flex:3;text-align:right">${stepper(`cg:${g.id}`, c.goal)}</span></div>`;
    return card(`<div class="dim sm">${g.label} · ${status}</div>${body}${goalRow}${leave}${recall}`);
  }).join('');
  return `<div class="dim">${now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
  <h1>${n ? `${n}-day streak` : 'Begin today'}</h1>
  <div class="row"><a class="btn" href="#guide/funk-reset">I'm in a funk</a>${S.rem.playlist ? '<button class="btn ghost" data-act="music">♪ Play my songs</button>' : ''}</div>
  ${card(`<div class="dim sm">Mindful moment</div><div style="font-size:17px;margin-top:4px">${esc(nudge)}</div>`, 'accent')}
  ${native.isNative && permState !== 'granted' ? card(`<b>Turn on reminders</b><div class="dim sm" style="margin:4px 0 8px">Mindful needs your OK to send notifications. That is how it reminds you.</div><button class="btn" data-act="perm">Allow notifications</button>${permState === 'denied' ? '<div class="warn sm">Blocked. Open your phone Settings → Apps → Mindful → Notifications and switch them on.</div>' : ''}`, 'accent') : ''}
  <h2>Today's goals</h2>
  ${rows || '<div class="dim">No reminders on. Turn some on in Settings.</div>'}
  <div class="row" style="margin-top:8px"><a class="btn ghost" href="#note">Quick note</a></div>
  <div class="dim sm center" style="margin-top:18px">Mindful · build ${esc(BUILD)}</div>`;
}

// Where a "pick one" reminder lands: the exercises you chose for that category.
function Choose(gid) {
  const g = group(gid); if (!g) return back('#today') + '<p>Not found.</p>';
  const c = S.rem.cat[gid];
  return `${back('#today')}<h1>${g.label}</h1><div class="dim">${catCount(gid)} of ${c.goal} today. Pick one:</div>` +
    c.ex.map((id) => card(`<a href="#ex/${id}" style="color:inherit;text-decoration:none"><b>${esc(exById[id].title)}</b></a><div class="dim sm">${esc(exById[id].summary)}</div>
      <div class="row" style="margin-top:8px"><a class="btn ghost" href="#ex/${id}">Rules</a><a class="btn" href="#guide/${id}">Start</a><button class="btn ghost" data-act="done:${id}">✓ Done</button></div>`)).join('');
}

function Practice() {
  const ms = MILESTONES.map((m) => check(!!S.milestones[m.id], esc(m.label), `ms:${m.id}`)).join('');
  const groups = Object.entries(CATS).map(([cat, label]) => `<h2>${label}</h2>` + EXERCISES.filter((e) => e.cat === cat).map((e) =>
    link(`#ex/${e.id}`, `<b>${isLocked(e) ? '🔒 ' : ''}${esc(e.title)}</b><div class="dim sm">${e.mins ? e.mins + ' min · ' : ''}${esc(e.freq)}</div>`, isLocked(e) ? 'locked' : '')
  ).join('') + (cat === 'chakra' ? link('#chakras', '<b>Chakra reference</b><div class="dim sm">Seven chakras, seed sounds, glands</div>') : '')).join('');
  return `<h1>Practice</h1>
  <h2>Psychic-centers path</h2>
  ${card(`<div class="dim sm">Sequence matters: Heart → Pituitary → Pineal → Throat → Attunement. Tick each when it applies.</div>${ms}`)}
  ${groups}
  <h2>Reference</h2>
  ${link('#cycles', '<b>Life cycles</b><div class="dim sm">Favorable and unfavorable activities by period</div>')}
  ${link('#about', '<b>Credits</b><div class="dim sm">With gratitude</div>')}`;
}

function Exercise(id) {
  const ex = exById[id]; if (!ex) return back() + '<p>Not found.</p>';
  const miss = (ex.needs || []).filter((n) => !S.milestones[n]).map((n) => MILESTONES.find((m) => m.id === n).label);
  return `${back()}<h1>${esc(ex.title)}</h1><div class="dim">${esc(ex.summary)}</div>
  <div class="dim sm" style="margin:8px 0">${ex.mins ? ex.mins + ' min · ' : ''}${esc(ex.freq)}</div>
  ${miss.length ? card(`<div class="warn sm">The guide says to start this only after:</div>${miss.map((m) => `<div class="warn sm">• ${esc(m)}</div>`).join('')}<div class="dim sm">Jumping ahead does no harm, but no good either.</div>`, 'warnb') : ''}
  ${ex.caution ? card(`<div class="warn sm">${esc(ex.caution)}</div>`, 'warnb') : ''}
  <a class="btn" href="#guide/${id}">Start guided</a>
  <button class="btn ghost" data-act="done:${id}">✓ Mark completed (${tallyOf(id)} today)</button>
  <h2>Steps</h2>${ex.steps.map((s, i) => `<p style="white-space:pre-line">${i + 1}. ${esc(typeof s === 'string' ? s : s.t)}</p>`).join('')}`;
}

function Chakras() {
  return `${back()}<h1>Chakras</h1><p class="dim">${esc(CHAKRA_INTRO)}</p>` + CHAKRAS.map((c) => card(`<b>${c.n}. ${c.name} — ${esc(c.sk)}</b>
  <div class="sm">Seed sound: ${esc(c.seed)}</div><div class="sm">Location: ${esc(c.loc)}</div><div class="sm">Blocked by: ${esc(c.block)}</div><div class="sm">Gland: ${esc(c.gland)}</div><div class="dim sm" style="margin-top:4px">${esc(c.note)}</div>`)).join('');
}
function About() {
  return `${back('#practice')}<h1>Credits</h1>
  <p>No one person created what is in this app. These practices are shared human knowledge, taught and agreed upon across many teachers, texts, and traditions over a very long time. This app is only a way to remember to use them.</p>
  <p>With gratitude to:</p>
  <ul>
    <li><b>Joe Dispenza</b> — chakra attention and coherence work</li>
    <li><b>Guru Pathik</b>, in <i>Avatar: The Last Airbender</i> — the chakra lesson</li>
    <li><b>Wisdom of the Mystic Masters</b> — the mental training, meditation, healing, projection, and cycles teachings</li>
    <li>The yogic, tantric, and Rosicrucian traditions all of the above draw on</li>
    <li>Every teacher, student, and practitioner who passed these on</li>
  </ul>
  <p class="dim sm">This app supports a practice. It is not medical care, and it does not replace a counselor or doctor.</p>`;
}
function Cycles() {
  return `${back()}<h1>Life cycles</h1><p class="dim">${esc(CYCLES.note)}</p>` + CYCLES.periods.map((p) => card(`<b>${esc(p.name)}</b><div class="dim sm">${esc(p.intro)}</div>
  ${p.good.length ? `<div class="good sm" style="margin-top:8px"><b>Good for</b></div>` + p.good.map((g) => `<div class="sm">• ${esc(g)}</div>`).join('') : ''}
  ${p.bad.length ? `<div class="bad sm" style="margin-top:8px"><b>Not good for</b></div>` + p.bad.map((g) => `<div class="sm">• ${esc(g)}</div>`).join('') : ''}`)).join('');
}

/* ----- log ----- */
let logTab = 'entries';
function Log() {
  const rows = [...S.sessions.map((x) => ({ ...x, k: 's' })), ...S.recalls.map((x) => ({ ...x, k: 'r' }))].sort((a, b) => b.ts - a.ts);
  const tabs = `<div class="chips"><button class="chip ${logTab === 'entries' ? 'on' : ''}" data-act="logtab:entries">Entries</button><button class="chip ${logTab === 'prog' ? 'on' : ''}" data-act="logtab:prog">Progress</button></div>`;
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
let permState = native.isNative ? 'default' : 'Notification' in window ? Notification.permission : 'unsupported';
native.permState().then((p) => { if (native.isNative) { permState = p; } });
function Settings() {
  const R = S.rem;
  const fmtMin = (v) => fmtTime(Math.floor(v / 60), v % 60);
  const groups = REMIND_GROUPS.map((g) => {
    const c = R.cat[g.id];
    const leaveRows = g.leave.map((id) => check(!!R.leaveItems[id], `<b>${esc(exById[id].title)}</b> — remind me when I leave home`, `lv:${id}`, id === 'obs-stairs' ? 'Only rings as you head out. Count the steps you take.' : 'Only rings as you head out.')).join('');
    const nightly = g.id === 'obs' ? `${check(R.recall.on, '<b>Evening Recall</b> — nightly, at its own time', 'recallon', 'Recall your first morning activity. Separate from the reminders above.')}${R.recall.on ? `<div style="margin:0 0 6px 36px">${stepper('rc', R.recall.h * 60 + R.recall.m, fmtMin)}</div>` : ''}` : '';
    return card(`${check(c.on, `<b>${g.label}</b>`, `con:${g.id}`, `Goal: ${c.goal} a day · ${c.n} reminder${c.n === 1 ? '' : 's'} a day`)}
      ${c.on ? `<div class="dim sm" style="margin-top:6px">Exercises</div>
      <div class="chips">${g.pool.map((x) => `<button class="chip ${c.ex.includes(x) ? 'on' : ''}" data-act="cex:${g.id}:${x}">${esc(exById[x].title)}</button>`).join('')}</div>
      <div class="dim sm">Daily goal — how many times you want to do it</div>${stepper(`cg:${g.id}`, c.goal)}
      <div class="dim sm" style="margin-top:8px">Reminders per day — they keep coming until the goal is met</div>${stepper(`cn:${g.id}`, c.n)}
      <div class="dim sm" style="margin-top:8px">Remind me</div>
      <div class="chips">
        <button class="chip ${c.timing === 'set' ? 'on' : ''}" data-act="ctime:${g.id}:set">At set times</button>
        <button class="chip ${c.timing === 'even' ? 'on' : ''}" data-act="ctime:${g.id}:even">Spread evenly</button>
        <button class="chip ${c.timing === 'random' ? 'on' : ''}" data-act="ctime:${g.id}:random">At random times</button></div>
      <div class="dim sm">${c.timing === 'set' ? 'You pick each time.' : c.timing === 'even' ? `Evenly across ${fmtTime(R.day.s)}–${fmtTime(R.day.e)}.` : `Random times between ${fmtTime(R.day.s)} and ${fmtTime(R.day.e)}.`}</div>
      ${c.timing === 'set' ? c.times.map((t, k) => `<div class="dim sm" style="margin-top:6px">Reminder ${k + 1}</div>${stepper(`ct:${g.id}:${k}`, t, fmtMin)}`).join('') : ''}
      ${c.ex.length > 1 ? `<div class="dim sm" style="margin-top:10px">When a reminder rings</div><div class="chips">
        <button class="chip ${c.choose ? 'on' : ''}" data-act="cch:${g.id}:1">Let me choose</button>
        <button class="chip ${!c.choose ? 'on' : ''}" data-act="cch:${g.id}:0">Pick one for me</button></div>` : ''}
      ${leaveRows || nightly ? `<div class="dim sm" style="margin-top:12px;border-top:1px solid var(--line);padding-top:8px">Also in ${g.label}</div>${nightly}${leaveRows}` : ''}` : ''}`);
  }).join('');
  const anyLeave = REMIND_GROUPS.some((g) => R.cat[g.id].on && g.leave.some((id) => R.leaveItems[id]));
  const home = anyLeave ? card(`<b>Leaving home</b>
    <div class="dim sm">${!native.isNative ? 'Works in the Android app only. Until then these stay quiet.' : R.home ? `Home is set. Reminders fire when you move ${R.home.r} m away.` : 'Set your home first — until then these stay quiet.'}</div>
    <div class="dim sm" style="margin-top:6px">Leave-home reminders allowed from</div>${stepper('leaveS', R.leave.s, (v) => fmtTime(v))}
    <div class="dim sm" style="margin-top:6px">Until</div>${stepper('leaveE', R.leave.e, (v) => fmtTime(v))}
    ${native.isNative ? `<button class="btn ghost" data-act="sethome">${R.home ? 'Update' : 'Set'} home to my current location</button>
    ${R.home ? `<div class="dim sm">Distance to count as "left"</div>${stepper('homer', R.home.r, (v) => v + ' m')}` : ''}
    <div class="dim sm" style="margin-top:6px">Needs location set to "Allow all the time". A small notification shows while it watches. It uses some battery.</div>` : ''}`) : '';
  return `<h1>Settings</h1>
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
  <div class="dim sm">Paste a Spotify (or any music) link. The funk button and "Play my songs" will open it. Downloaded playlists play without internet.</div>
  <input type="text" name="playlist" id="playlist" placeholder="https://open.spotify.com/playlist/…" value="${esc(R.playlist)}">
  <h2>Mindfulness sayings</h2>
  ${card(`${check(R.mind.on, '<b>Mindfulness sayings</b>', 'mindon', 'Habits, emotional techniques, gentle prompts')}${R.mind.on ? `<div class="dim sm" style="margin-top:6px">Per day</div>${stepper('mindn', R.mind.n)}` : ''}`)}
  <button class="btn ghost" data-act="test">Send a test notification</button>
  ${native.isNative ? '' : `<h2>Calendar reminders</h2>
  <div class="dim sm">Creates a calendar file with the next 14 days of reminders, each with an alarm.</div>
  <button class="btn" data-act="ics">Export reminders (.ics)</button>`}
  <h2>Backup</h2>
  <div class="dim sm">Everything is stored only on this phone.</div>
  <button class="btn" data-act="export">Export backup</button>
  <label class="btn ghost" style="cursor:pointer">Restore from backup file<input type="file" id="restore" accept=".json,application/json" hidden></label>
  <div id="msg" class="good sm"></div>
  <div class="dim sm center" style="margin-top:18px">Mindful · build ${esc(BUILD)}</div>`;
}

/* ----- guided runner ----- */
let G = null;
const pad = (n) => `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;
const vib = (p) => navigator.vibrate?.(p);
async function wake() { try { G.lock = await navigator.wakeLock?.request('screen'); } catch (e) {} }
function stopGuide() { if (G) { clearInterval(G.timer); G.lock?.release?.().catch(() => {}); } G = null; document.body.classList.remove('guided'); }

function startGuide(id) {
  stopGuide();
  G = { ex: exById[id], i: 0, run: false, stepDone: false, done: false, focus: 0, note: '' };
  initStep(); wake();
}
function initStep() {
  clearInterval(G.timer); G.run = false; G.stepDone = false;
  const st = stepOf();
  G.left = st.secs || 0; G.elapsed = 0;
  if (st.pick) G.left = G.pickSecs || st.pick[0];
  if (st.breath) Object.assign(G, { rep: 1, ph: 0, left: st.breath.phases[0][1] });
}
const stepOf = () => { const r = G.ex.steps[G.i]; return typeof r === 'string' ? { t: r } : r; };

function tick() {
  const st = stepOf();
  if (st.open) { G.elapsed++; $('#tm').textContent = pad(G.elapsed); return; }
  if (st.secs) {
    G.left--; $('#tm').textContent = pad(G.left);
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
function Guide() {
  if (!G) return back('#practice') + '<p>Nothing running.</p>';
  document.body.classList.add('guided');
  const ex = G.ex;
  if (G.done) return `<h1>${esc(ex.title)} — done</h1>
    ${card(`<div class="dim sm">How was your focus?</div>${rating('gfocus', G.focus)}<div class="dim sm" style="margin-top:12px">${ex.kind === 'review' ? 'Write the exact hour and everything you observed.' : 'Notes (optional)'}</div><textarea name="gnote" placeholder="What did you notice?">${esc(G.note)}</textarea>`)}
    <button class="btn" data-act="gsave">${ex.kind === 'recall' ? 'Save and go to recall log' : 'Save to log'}</button>
    <button class="btn ghost" data-act="gskip">Skip logging</button>`;
  const st = stepOf(); const last = G.i === ex.steps.length - 1;
  const gated = (st.secs || st.breath) && !G.stepDone;
  const label = G.run ? 'Pause' : (st.breath ? G.rep === 1 && G.ph === 0 && G.left === st.breath.phases[0][1] : G.left === st.secs && !G.elapsed) ? 'Start' : 'Resume';
  let widget = '';
  if (st.open) widget = `<div class="big" id="tm">${pad(G.elapsed)}</div><div class="center dim sm">Take as long as you need</div><button class="btn ghost" data-act="trun">${G.run ? 'Pause clock' : G.elapsed ? 'Resume clock' : 'Start clock'}</button>`;
  else if (st.secs) widget = `${st.pick && !G.run && !G.stepDone && G.left === (G.pickSecs || st.pick[0]) ? `<div class="chips" style="justify-content:center">${st.pick.map((v) => `<button class="chip ${(G.pickSecs || st.pick[0]) === v ? 'on' : ''}" data-act="pick:${v}">${v / 60} min</button>`).join('')}</div>` : ''}<div class="big" id="tm">${pad(G.left)}</div>${G.stepDone ? '<div class="center good">Done</div>' : `<button class="btn ghost" data-act="trun">${label} timer</button>`}`;
  else if (st.breath) widget = `<div class="center" style="font-size:22px" id="ph">${G.stepDone ? 'Complete' : st.breath.phases[G.ph][0]}</div><div class="big" id="tm">${G.stepDone ? '✓' : G.left}</div><div class="center dim" id="rp">Round ${Math.min(G.rep, st.breath.reps)} of ${st.breath.reps}</div>${G.stepDone ? '' : `<button class="btn ghost" data-act="trun">${label}</button>`}`;
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
  let h;
  switch (route) {
    case 'today': h = Today(); break;
    case 'practice': h = Practice(); break;
    case 'ex': h = Exercise(a); break;
    case 'guide': if (!G || G.ex.id !== a) { if (exById[a]) startGuide(a); } h = Guide(); break;
    case 'log': h = Log(); break;
    case 'note': h = NoteForm(a); break;
    case 'recall': h = RecallForm(); break;
    case 'chakras': h = Chakras(); break;
    case 'cycles': h = Cycles(); break;
    case 'about': h = About(); break;
    case 'cat': h = Choose(a); break;
    case 'settings': h = Settings(); break;
    default: h = Today();
  }
  if (!['note', 'recall'].includes(route)) form = {};
  $('#view').innerHTML = h;
  const tab = ['today', 'practice', 'log', 'settings'].includes(route) ? route : route === 'cat' ? 'today' : route === 'ex' || route === 'chakras' || route === 'cycles' || route === 'about' || route === 'guide' ? 'practice' : 'log';
  document.querySelectorAll('#tabs a').forEach((el) => el.classList.toggle('on', el.dataset.tab === tab));
  const rs = $('#restore'); if (rs) rs.onchange = restore;
  window.scrollTo(0, 0);
}
function repaintKeep() { const y = window.scrollY; paint(); window.scrollTo(0, y); }
window.addEventListener('hashchange', paint);

/* ---------------- actions ---------------- */
const msg = (t) => { const m = $('#msg'); if (m) m.textContent = t; };
document.addEventListener('input', (e) => {
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
    case 'del': if (confirm('Delete entry?')) { const k = a === 'r' ? 'recalls' : 'sessions'; S[k] = S[k].filter((x) => x.id !== b); save(); repaintKeep(); } break;
    case 'pickex': form.ex = form.ex === a ? null : a; repaintKeep(); break;
    case 'rate': if (a === 'gfocus') G.focus = +b; else form[a] = +b; repaintKeep(); break;
    case 'inc': case 'dec': { const d = act === 'inc' ? 1 : -1; stepTo(a, b, d, c3); break; }
    case 'savenote': S.sessions.unshift({ id: uid(), ts: Date.now(), ex: form.ex, focus: form.focus || null, note: form.note.trim() }); save(); location.hash = '#log'; break;
    case 'saverecall': S.recalls.unshift({ id: uid(), ts: Date.now(), details: form.details, accuracy: form.accuracy || null, note: form.note.trim() }); save(); location.hash = '#log'; break;
    case 'con': S.rem.cat[a].on = !S.rem.cat[a].on; save(); repaintKeep(); break;
    case 'cex': { const l = S.rem.cat[a].ex; const i = l.indexOf(b); if (i >= 0 && l.length > 1) l.splice(i, 1); else if (i < 0) l.push(b); save(); repaintKeep(); break; }
    case 'ctime': S.rem.cat[a].timing = b; save(); repaintKeep(); break;
    case 'cch': S.rem.cat[a].choose = b === '1'; save(); repaintKeep(); break;
    case 'lv': S.rem.leaveItems[a] = !S.rem.leaveItems[a]; save(); repaintKeep(); break;
    case 'other': openCat = openCat === a ? null : a; repaintKeep(); break;
    case 'music': openMusic(); break;
    case 'mindon': S.rem.mind.on = !S.rem.mind.on; save(); repaintKeep(); break;
    case 'recallon': S.rem.recall.on = !S.rem.recall.on; save(); repaintKeep(); break;
    case 'sethome': {
      msg('Finding your location…');
      try { const p = await native.currentPosition(); S.rem.home = { latitude: p.latitude, longitude: p.longitude, r: S.rem.home?.r || 150 }; save(); repaintKeep(); msg('Home set.'); }
      catch (err) { msg('Could not get your location. Allow location "all the time" for this app and try again.'); }
      break;
    }
    case 'perm': {
      if (native.isNative) permState = (await native.ensurePerms()) ? 'granted' : 'denied';
      else { permState = await Notification.requestPermission(); if (permState === 'granted') checkDue(); }
      changed(); repaintKeep(); break;
    }
    case 'test': {
      if (native.isNative) { if (!(await native.ensurePerms())) return msg('Notifications are blocked.'); await native.fireNow(999999, 'Mindful moment', NUDGES[Math.floor(Math.random() * NUDGES.length)], '#today'); return msg('Coming in a moment.'); }
      if (!('Notification' in window)) return msg('This browser does not support notifications.');
      if (Notification.permission !== 'granted') await Notification.requestPermission();
      if (Notification.permission !== 'granted') return msg('Notifications are blocked.');
      notify('Mindful moment', NUDGES[Math.floor(Math.random() * NUDGES.length)]); msg('Sent.'); break;
    }
    case 'ics': exportCalendar(); msg('Calendar file created — open it to add the reminders.'); break;
    case 'export': exportBackup(); break;
    case 'trun': toggleRun(); break;
    case 'pick': G.pickSecs = +a; G.left = +a; paint(); break;
    case 'done': bump(a); openCat = null; toast(`✓ ${exById[a].title} — ${tallyOf(a)} today`); repaintKeep(); break;
    case 'gnext': if (G.ex.steps.length - 1 === G.i) { G.done = true; clearInterval(G.timer); paint(); } else { G.i++; initStep(); paint(); } break;
    case 'gprev': G.i--; initStep(); paint(); break;
    case 'gquit': location.hash = `#ex/${G.ex.id}`; break;
    case 'gsave': case 'gskip': {
      S.sessions.unshift({ id: uid(), ts: Date.now(), ex: G.ex.id, focus: act === 'gsave' ? G.focus || null : null, note: act === 'gsave' ? G.note.trim() : '' });
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
      const c = R.cat[id]; c.n = clamp(c.n + d, 1, 4);
      // changing the count re-spreads the set times evenly through your day; adjust them after
      c.times = Array.from({ length: c.n }, (_, k) => Math.round((R.day.s * 60 + ((R.day.e - R.day.s) * 60 * (k + 0.5)) / c.n) / 15) * 15);
    }
    if (name === 'mindn') R.mind.n = clamp(R.mind.n + d, 1, 12);
    if (name === 'dayS') R.day.s = clamp(R.day.s + d, 0, R.day.e - 1);
    if (name === 'dayE') R.day.e = clamp(R.day.e + d, R.day.s + 1, 23);
    if (name === 'leaveS') R.leave.s = clamp(R.leave.s + d, 0, R.leave.e - 1);
    if (name === 'leaveE') R.leave.e = clamp(R.leave.e + d, R.leave.s + 1, 24);
    if (name === 'homer') R.home.r = clamp(R.home.r + d * 50, 50, 1000);
    save();
  }
  repaintKeep();
}
async function exportBackup() {
  const text = JSON.stringify(S, null, 1); const name = `mindful-backup-${dayKey()}.json`;
  try {
    const f = new File([text], name, { type: 'application/json' });
    if (navigator.canShare?.({ files: [f] })) { await navigator.share({ files: [f], title: 'Mindful backup' }); return msg('Backup shared.'); }
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
  if (action === 'done' && exId) { bump(exId); toast(`✓ ${exById[exId].title} — ${tallyOf(exId)} today`); location.hash = '#today'; paint(); }
  else if (route) location.hash = route;
});
if (native.isNative) native.permState().then((p) => { permState = p; changed(); });
paint(); checkDue();
window.__mindfulBooted = true;
window.__mindful = { occurrences, onLeave, state: () => S }; // handy for diagnostics and tests
