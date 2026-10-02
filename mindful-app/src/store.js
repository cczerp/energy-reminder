import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SLOTS } from './content';

const KEY = 'mindful-state-v1';

export const defaultState = () => ({
  slots: Object.fromEntries(SLOTS.map((s) => [s.id, { on: true, h: s.h, m: s.m }])),
  nudges: { on: true, count: 4, start: 9, end: 20 },
  milestones: {},
  sessions: [], // { id, ts, ex, focus, note }
  recalls: [], //  { id, ts, details, accuracy, note }
  checks: {}, //   { 'YYYY-MM-DD': { gainId: true } }
});

export const dayKey = (ts = Date.now()) => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const merge = (saved) => {
  const d = defaultState();
  return { ...d, ...saved, slots: { ...d.slots, ...(saved.slots || {}) }, nudges: { ...d.nudges, ...(saved.nudges || {}) } };
};

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

export function StoreProvider({ children }) {
  const [state, setState] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    (async () => {
      let s = defaultState();
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) s = merge(JSON.parse(raw));
      } catch (e) {}
      ref.current = s;
      setState(s);
    })();
  }, []);

  const update = useCallback((fn) => {
    const next = fn(ref.current);
    ref.current = next;
    setState(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  if (!state) return null;
  return <Ctx.Provider value={{ state, update }}>{children}</Ctx.Provider>;
}

// Days (YYYY-MM-DD) with any practice, and current streak.
export function practiceDays(state) {
  const set = new Set();
  state.sessions.forEach((s) => set.add(dayKey(s.ts)));
  state.recalls.forEach((r) => set.add(dayKey(r.ts)));
  return set;
}
export function streak(state) {
  const days = practiceDays(state);
  let n = 0;
  const d = new Date();
  if (!days.has(dayKey(d.getTime()))) d.setDate(d.getDate() - 1); // today not done yet doesn't break the streak
  while (days.has(dayKey(d.getTime()))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
