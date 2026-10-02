import React from 'react';
import { ScrollView } from 'react-native';
import { GAIN, DRAINS } from './content';
import { useStore, dayKey } from './store';
import { C, Card, H, T, Check } from './ui';

export default function Energy() {
  const { state, update } = useStore();
  const k = dayKey();
  const today = state.checks[k] || {};
  const toggle = (id) => update((s) => ({ ...s, checks: { ...s.checks, [k]: { ...(s.checks[k] || {}), [id]: !(s.checks[k] || {})[id] } } }));
  const n = GAIN.filter((g) => today[g.id]).length;
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <H>Building energy today · {n}/{GAIN.length}</H>
      <Card>{GAIN.map((g) => <Check key={g.id} on={!!today[g.id]} label={g.label} onPress={() => toggle(g.id)} />)}</Card>
      <H>What drains it</H>
      {DRAINS.map((d) => (
        <Card key={d.t}>
          <T style={{ fontWeight: '600', color: C.warn }}>{d.t}</T>
          <T small dim>{d.d}</T>
        </Card>
      ))}
      <T dim small>Compiled from what is in your guides so far. More to add when the dos-and-don'ts material arrives.</T>
    </ScrollView>
  );
}
