import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { SLOTS, exById, NUDGES } from './content';
import { useStore, dayKey, streak } from './store';
import { isLocked } from './Practice';
import { C, Card, H, T, Btn, fmtTime } from './ui';

const dayIndex = () => Math.floor(Date.now() / 86400000);

export default function Today({ nav }) {
  const { state } = useStore();
  const today = dayKey();
  const doneToday = new Set(state.sessions.filter((s) => dayKey(s.ts) === today).map((s) => s.ex));
  const recalled = state.recalls.some((r) => dayKey(r.ts) === today);
  const nudge = useMemo(() => NUDGES[dayIndex() % NUDGES.length], []);
  const n = streak(state);

  const plan = SLOTS.filter((s) => !s.weekday || new Date().getDay() + 1 === s.weekday)
    .filter((s) => state.slots[s.id].on)
    .map((s) => {
      const pool = s.pool.filter((id) => !isLocked(exById[id], state.milestones));
      const ex = exById[pool[dayIndex() % pool.length] || s.pool[0]];
      const cfg = state.slots[s.id];
      return { s, ex, cfg, done: ex.kind === 'recall' ? recalled || doneToday.has(ex.id) : doneToday.has(ex.id) };
    })
    .sort((a, b) => a.cfg.h * 60 + a.cfg.m - (b.cfg.h * 60 + b.cfg.m));

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <T dim>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</T>
      <H style={{ fontSize: 28 }}>{n > 0 ? `${n}-day streak` : 'Begin today'}</H>
      <Card style={{ borderColor: C.accent }}>
        <T dim small>Mindful moment</T>
        <T style={{ fontSize: 17, marginTop: 4 }}>{nudge}</T>
      </Card>
      <H>Today's plan</H>
      {plan.map(({ s, ex, cfg, done }) => (
        <Card key={s.id} onPress={() => nav.push('exercise', { id: ex.id })}>
          <T dim small>{fmtTime(cfg.h, cfg.m)} · {s.label}</T>
          <T style={{ fontWeight: '600' }}>{done ? '✓ ' : ''}{ex.title}</T>
        </Card>
      ))}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
        <Btn style={{ flex: 1 }} kind="ghost" title="Quick note" onPress={() => nav.push('noteNew')} />
        <Btn style={{ flex: 1 }} kind="ghost" title="Evening recall" onPress={() => nav.push('recallLog')} />
      </View>
    </ScrollView>
  );
}
