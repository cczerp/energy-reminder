import React from 'react';
import { ScrollView, View } from 'react-native';
import { CATS, EXERCISES, MILESTONES, exById, CHAKRAS, CHAKRA_INTRO, CYCLES } from './content';
import { useStore } from './store';
import { C, Card, H, T, Btn, Check } from './ui';

export const isLocked = (ex, ms) => (ex.needs || []).some((n) => !ms[n]);
const missing = (ex, ms) => (ex.needs || []).filter((n) => !ms[n]).map((n) => MILESTONES.find((m) => m.id === n).label);

export function PracticeHome({ nav }) {
  const { state, update } = useStore();
  const ms = state.milestones;
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <H>Psychic-centers path</H>
      <Card>
        <T dim small style={{ marginBottom: 4 }}>Sequence matters: Heart → Pituitary → Pineal → Throat → Attunement. Tick each when it applies; later exercises unlock.</T>
        {MILESTONES.map((m) => (
          <Check key={m.id} on={!!ms[m.id]} label={m.label} onPress={() => update((s) => ({ ...s, milestones: { ...s.milestones, [m.id]: !s.milestones[m.id] } }))} />
        ))}
      </Card>
      {Object.entries(CATS).map(([cat, label]) => (
        <View key={cat}>
          <H>{label}</H>
          {EXERCISES.filter((e) => e.cat === cat).map((e) => {
            const locked = isLocked(e, ms);
            return (
              <Card key={e.id} onPress={() => nav.push('exercise', { id: e.id })} style={locked && { opacity: 0.55 }}>
                <T style={{ fontWeight: '600' }}>{locked ? '🔒 ' : ''}{e.title}</T>
                <T dim small>{e.mins ? `${e.mins} min · ` : ''}{e.freq}</T>
              </Card>
            );
          })}
        </View>
      ))}
      <H>Reference</H>
      <Card onPress={() => nav.push('chakras')}><T style={{ fontWeight: '600' }}>Chakra reference</T><T dim small>Seven chakras, seed sounds, glands</T></Card>
      <Card onPress={() => nav.push('cycles')}><T style={{ fontWeight: '600' }}>Life cycles</T><T dim small>Favorable / unfavorable activities by period</T></Card>
    </ScrollView>
  );
}

export function Exercise({ nav, id }) {
  const { state } = useStore();
  const ex = exById[id];
  const miss = missing(ex, state.milestones);
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <H style={{ fontSize: 24 }}>{ex.title}</H>
      <T dim>{ex.summary}</T>
      <T dim small style={{ marginVertical: 8 }}>{ex.mins ? `${ex.mins} min · ` : ''}{ex.freq}</T>
      {miss.length > 0 && (
        <Card style={{ borderColor: C.warn }}>
          <T small style={{ color: C.warn }}>The guide says to start this only after:</T>
          {miss.map((m) => <T key={m} small style={{ color: C.warn }}>• {m}</T>)}
          <T small dim>Jumping ahead does no harm, but no good either.</T>
        </Card>
      )}
      {ex.caution ? <Card style={{ borderColor: C.warn }}><T small style={{ color: C.warn }}>{ex.caution}</T></Card> : null}
      <Btn title="Start guided" onPress={() => nav.push('guide', { id })} />
      <H>Steps</H>
      {ex.steps.map((st, i) => (
        <T key={i} style={{ marginBottom: 8 }}>{i + 1}. {typeof st === 'string' ? st : st.t}</T>
      ))}
    </ScrollView>
  );
}

export function Chakras() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <T dim style={{ marginBottom: 10 }}>{CHAKRA_INTRO}</T>
      {CHAKRAS.map((c) => (
        <Card key={c.n}>
          <T style={{ fontWeight: '700' }}>{c.n}. {c.name} — {c.sk}</T>
          <T small>Seed sound: {c.seed}</T>
          <T small>Location: {c.loc}</T>
          <T small>Blocked by: {c.block}</T>
          <T small>Gland: {c.gland}</T>
          <T small dim style={{ marginTop: 4 }}>{c.note}</T>
        </Card>
      ))}
    </ScrollView>
  );
}

export function Cycles() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <T dim style={{ marginBottom: 10 }}>{CYCLES.note}</T>
      {CYCLES.periods.map((p) => (
        <Card key={p.name}>
          <T style={{ fontWeight: '700', marginBottom: 4 }}>{p.name}</T>
          <T small dim>{p.intro}</T>
          {p.good.length > 0 && <T small style={{ color: C.good, marginTop: 8, fontWeight: '600' }}>Good for</T>}
          {p.good.map((g) => <T key={g} small>• {g}</T>)}
          {p.bad.length > 0 && <T small style={{ color: C.bad, marginTop: 8, fontWeight: '600' }}>Not good for</T>}
          {p.bad.map((g) => <T key={g} small>• {g}</T>)}
        </Card>
      ))}
    </ScrollView>
  );
}
