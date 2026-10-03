import { CATS, EXERCISES, MILESTONES, exById, CHAKRAS, CHAKRA_INTRO, CYCLES, REMIND, REMIND_DEFAULTS, NUDGES, PING } from './content.js';

/* ---------------- storage ---------------- */
const KEY = 'mindful-v2';
const fresh = () => ({ rem: structuredClone(REMIND_DEFAULTS), milestones: {}, sessions: [], recalls: [] });
let S;
try { S = { ...fresh(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch (e) { S = fresh(); }
S.rem = { ...structuredClone(REMIND_DEFAULTS), ...S.rem };
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const dayKey = (t = Date.now()) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const dayNum = (d = new Date()) => Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmtTime = (h, m = 0) => `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
const when = (t) => new Date(t).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

const practiceDays = () => new Set([...S.sessions, ...S.recalls].map((x) => dayKey(x.ts)));
function streak() {
  const days = practiceDays(); let n = 0; const d = new Date();
  if (!days.has(dayKey(d.getTime()))) d.setDate(d.getDate() - 1);
  while (days.has(dayKey(d.getTime()))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
const isLocked = (ex) => (ex.needs || []).some((n) => !S.milestones[n]);

/* ---------------- reminders ---------------- */
// Deterministic occurrences for a given day, shared by the in-app scheduler and the calendar export.
function occurrences(date) {
  const out = []; const dn = dayNum(date);
  for (const [id, r] of Object.entries(S.rem)) {
    if (!r.on) continue;
    if (id === 'recall') {
      out.push({ id: 'recall', at: at(date, r.h, r.m), label: 'Evening recall', title: 'Evening recall', body: 'Recall your first activity this morning in as much detail as you can, then log it.', route: '#recall' });
      continue;
    }
    for (let k = 0; k < r.n; k++) {
      const t = r.s + ((r.e - r.s) * (k + 0.5)) / r.n; const h = Math.floor(t); const m = Math.round((t - h) * 60) % 60;
      const def = REMIND[id];
      if (def.pool.length) {
        const ex = exById[def.pool[(dn + k) % def.pool.length]];
        out.push({ id: `${id}${k}`, at: at(date, h, m), label: def.label, title: `${def.label}: ${ex.title}`, body: PING[ex.id] || ex.summary, route: `#ex/${ex.id}`, exId: ex.id });
      } else {
        out.push({ id: `${id}${k}`, at: at(date, h, m), label: def.label, title: 'Mindful moment', body: NUDGES[(dn * 17 + k * 7) % NUDGES.length], route: '#today' });
      }
    }
  }
  return out.sort((a, b) => a.at - b.at);
}
const at = (date, h, m) => { const d = new Date(date); d.setHours(h, m, 0, 0); return d; };

const firedKey = 'mindful-fired';
function checkDue() {
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
function Today() {
  const done = new Set(S.sessions.filter((s) => dayKey(s.ts) === dayKey()).map((s) => s.ex));
  const recalled = S.recalls.some((r) => dayKey(r.ts) === dayKey());
  const now = new Date();
  const occ = occurrences(now);
  const nudge = NUDGES[dayNum() % NUDGES.length];
  const n = streak();
  return `<div class="dim">${now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
  <h1>${n ? `${n}-day streak` : 'Begin today'}</h1>
  ${card(`<div class="dim sm">Mindful moment</div><div style="font-size:17px;margin-top:4px">${esc(nudge)}</div>`, 'accent')}
  <h2>Today's reminders</h2>
  ${occ.filter((o) => o.label !== 'Mindfulness').map((o) => {
    const d = o.exId ? done.has(o.exId) : o.id === 'recall' && recalled;
    return link(o.route, `<div class="dim sm">${fmtTime(o.at.getHours(), o.at.getMinutes())} · ${o.label}</div><div style="${o.at < now && !d ? 'opacity:.6' : ''}"><b>${d ? '✓ ' : ''}${esc(o.exId ? exById[o.exId].title : o.title)}</b></div><div class="dim sm">${esc(o.body)}</div>`);
  }).join('') || '<div class="dim">No reminders on. Turn some on in Settings.</div>'}
  <div class="row"><a class="btn ghost" href="#note">Quick note</a><a class="btn ghost" href="#recall">Evening recall</a></div>`;
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
  ${link('#cycles', '<b>Life cycles</b><div class="dim sm">Favorable and unfavorable activities by period</div>')}`;
}

function Exercise(id) {
  const ex = exById[id]; if (!ex) return back() + '<p>Not found.</p>';
  const miss = (ex.needs || []).filter((n) => !S.milestones[n]).map((n) => MILESTONES.find((m) => m.id === n).label);
  return `${back()}<h1>${esc(ex.title)}</h1><div class="dim">${esc(ex.summary)}</div>
  <div class="dim sm" style="margin:8px 0">${ex.mins ? ex.mins + ' min · ' : ''}${esc(ex.freq)}</div>
  ${miss.length ? card(`<div class="warn sm">The guide says to start this only after:</div>${miss.map((m) => `<div class="warn sm">• ${esc(m)}</div>`).join('')}<div class="dim sm">Jumping ahead does no harm, but no good either.</div>`, 'warnb') : ''}
  ${ex.caution ? card(`<div class="warn sm">${esc(ex.caution)}</div>`, 'warnb') : ''}
  <a class="btn" href="#guide/${id}">Start guided</a>
  <h2>Steps</h2>${ex.steps.map((s, i) => `<p style="white-space:pre-line">${i + 1}. ${esc(typeof s === 'string' ? s : s.t)}</p>`).join('')}`;
}

function Chakras() {
  return `${back()}<h1>Chakras</h1><p class="dim">${esc(CHAKRA_INTRO)}</p>` + CHAKRAS.map((c) => card(`<b>${c.n}. ${c.name} — ${esc(c.sk)}</b>
  <div class="sm">Seed sound: ${esc(c.seed)}</div><div class="sm">Location: ${esc(c.loc)}</div><div class="sm">Blocked by: ${esc(c.block)}</div><div class="sm">Gland: ${esc(c.gland)}</div><div class="dim sm" style="margin-top:4px">${esc(c.note)}</div>`)).join('');
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
function Settings() {
  const perm = 'Notification' in window ? Notification.permission : 'unsupported';
  const rows = Object.entries(REMIND).map(([id, def]) => {
    const r = S.rem[id];
    return card(`${check(r.on, `<b>${def.label}</b>`, `rem:${id}`, def.pool.length ? 'Prompts from the Mental Training guide' : 'Sayings, habits, and gentle reminders')}
      ${r.on ? `<div class="dim sm" style="margin-top:6px">Times per day</div>${stepper(`n:${id}`, r.n)}
      <div class="dim sm">From</div>${stepper(`s:${id}`, r.s, (v) => fmtTime(v))}
      <div class="dim sm">Until</div>${stepper(`e:${id}`, r.e, (v) => fmtTime(v))}` : ''}`);
  }).join('');
  const rc = S.rem.recall;
  return `<h1>Settings</h1>
  <h2>Reminders</h2>
  ${perm === 'granted' ? '<div class="good sm">Notifications are on.</div>' : `<button class="btn" data-act="perm">Allow notifications</button>${perm === 'denied' ? '<div class="warn sm">Blocked — enable notifications for this site in Chrome settings.</div>' : ''}`}
  <div class="dim sm" style="margin:6px 0">Notifications fire while the app is open or running in the background. For reminders that ring even when the app is closed, export them to your calendar below.</div>
  ${rows}
  ${card(`${check(rc.on, '<b>Evening recall</b>', 'rem:recall', 'Recall your first morning activity')}${rc.on ? `<div style="margin-top:6px">${stepper('rc', rc.h * 60 + rc.m, (v) => fmtTime(Math.floor(v / 60), v % 60))}</div>` : ''}`)}
  <button class="btn ghost" data-act="test">Send a test notification</button>
  <h2>Calendar reminders</h2>
  <div class="dim sm">Creates a calendar file with the next 14 days of your reminders, each with an alarm. Open it to add them to your phone's calendar — they then ring even if the app is closed. Redo it every two weeks or after changing settings.</div>
  <button class="btn" data-act="ics">Export reminders (.ics)</button>
  <h2>Backup</h2>
  <div class="dim sm">Everything is stored only on this phone.</div>
  <button class="btn" data-act="export">Export backup</button>
  <label class="btn ghost" style="cursor:pointer">Restore from backup file<input type="file" id="restore" accept=".json,application/json" hidden></label>
  <div id="msg" class="good sm"></div>`;
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
  else if (st.secs) widget = `<div class="big" id="tm">${pad(G.left)}</div>${G.stepDone ? '<div class="center good">Done</div>' : `<button class="btn ghost" data-act="trun">${label} timer</button>`}`;
  else if (st.breath) widget = `<div class="center" style="font-size:22px" id="ph">${G.stepDone ? 'Complete' : st.breath.phases[G.ph][0]}</div><div class="big" id="tm">${G.stepDone ? '✓' : G.left}</div><div class="center dim" id="rp">Round ${Math.min(G.rep, st.breath.reps)} of ${st.breath.reps}</div>${G.stepDone ? '' : `<button class="btn ghost" data-act="trun">${label}</button>`}`;
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
    case 'settings': h = Settings(); break;
    default: h = Today();
  }
  if (!['note', 'recall'].includes(route)) form = {};
  $('#view').innerHTML = h;
  const tab = ['today', 'practice', 'log', 'settings'].includes(route) ? route : route === 'ex' || route === 'chakras' || route === 'cycles' || route === 'guide' ? 'practice' : 'log';
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
document.addEventListener('click', async (e) => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const [act, a, b] = el.dataset.act.split(':');
  switch (act) {
    case 'ms': S.milestones[a] = !S.milestones[a]; save(); repaintKeep(); break;
    case 'logtab': logTab = a; paint(); break;
    case 'del': if (confirm('Delete entry?')) { const k = a === 'r' ? 'recalls' : 'sessions'; S[k] = S[k].filter((x) => x.id !== b); save(); repaintKeep(); } break;
    case 'pickex': form.ex = form.ex === a ? null : a; repaintKeep(); break;
    case 'rate': if (a === 'gfocus') G.focus = +b; else form[a] = +b; repaintKeep(); break;
    case 'inc': case 'dec': { const d = act === 'inc' ? 1 : -1; stepTo(a, b, d); break; }
    case 'savenote': S.sessions.unshift({ id: uid(), ts: Date.now(), ex: form.ex, focus: form.focus || null, note: form.note.trim() }); save(); location.hash = '#log'; break;
    case 'saverecall': S.recalls.unshift({ id: uid(), ts: Date.now(), details: form.details, accuracy: form.accuracy || null, note: form.note.trim() }); save(); location.hash = '#log'; break;
    case 'rem': S.rem[a].on = !S.rem[a].on; save(); repaintKeep(); break;
    case 'perm': { const p = await Notification.requestPermission(); if (p === 'granted') checkDue(); repaintKeep(); break; }
    case 'test': {
      if (!('Notification' in window)) return msg('This browser does not support notifications.');
      if (Notification.permission !== 'granted') await Notification.requestPermission();
      if (Notification.permission !== 'granted') return msg('Notifications are blocked.');
      notify('Mindful moment', NUDGES[Math.floor(Math.random() * NUDGES.length)]); msg('Sent.'); break;
    }
    case 'ics': exportCalendar(); msg('Calendar file created — open it to add the reminders.'); break;
    case 'export': exportBackup(); break;
    case 'trun': toggleRun(); break;
    case 'gnext': if (G.ex.steps.length - 1 === G.i) { G.done = true; clearInterval(G.timer); paint(); } else { G.i++; initStep(); paint(); } break;
    case 'gprev': G.i--; initStep(); paint(); break;
    case 'gquit': location.hash = `#ex/${G.ex.id}`; break;
    case 'gsave': case 'gskip': {
      S.sessions.unshift({ id: uid(), ts: Date.now(), ex: G.ex.id, focus: act === 'gsave' ? G.focus || null : null, note: act === 'gsave' ? G.note.trim() : '' });
      save(); const kind = G.ex.kind; stopGuide();
      location.hash = kind === 'recall' ? '#recall' : '#today'; break;
    }
  }
});
function stepTo(name, id, d) {
  if (name === 'details') form.details = Math.max(0, Math.min(200, form.details + d));
  else if (name === 'rc') { const v = Math.max(0, Math.min(1425, S.rem.recall.h * 60 + S.rem.recall.m + d * 15)); S.rem.recall.h = Math.floor(v / 60); S.rem.recall.m = v % 60; save(); }
  else {
    const field = name, r = S.rem[id]; // name is n/s/e, id is the reminder id
    if (field === 'n') r.n = Math.max(1, Math.min(12, r.n + d));
    if (field === 's') r.s = Math.max(0, Math.min(r.e - 1, r.s + d));
    if (field === 'e') r.e = Math.min(23, Math.max(r.s + 1, r.e + d));
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
    S = { ...fresh(), ...d }; S.rem = { ...structuredClone(REMIND_DEFAULTS), ...S.rem }; save(); paint(); msg('Backup restored.');
  } catch (err) { msg('That does not look like a backup.'); }
}

/* ---------------- boot ---------------- */
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) navigator.serviceWorker.register('sw.js').catch(() => {});
paint(); checkDue();
