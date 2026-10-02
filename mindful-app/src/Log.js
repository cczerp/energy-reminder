import React, { useState } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { EXERCISES, exById } from './content';
import { useStore, uid, dayKey, streak } from './store';
import { C, Card, H, T, Btn, Chip, Input, Rating, Stepper } from './ui';

const when = (ts) => new Date(ts).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

export function LogHome({ nav }) {
  const { state, update } = useStore();
  const [tab, setTab] = useState('notes');
  const rows = [
    ...state.sessions.map((x) => ({ ...x, kind: 's' })),
    ...state.recalls.map((x) => ({ ...x, kind: 'r' })),
  ].sort((a, b) => b.ts - a.ts);

  const del = (r) =>
    Alert.alert('Delete entry?', '', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => update((s) => (r.kind === 's' ? { ...s, sessions: s.sessions.filter((x) => x.id !== r.id) } : { ...s, recalls: s.recalls.filter((x) => x.id !== r.id) })) },
    ]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={{ flexDirection: 'row' }}>
        <Chip label="Entries" on={tab === 'notes'} onPress={() => setTab('notes')} />
        <Chip label="Progress" on={tab === 'prog'} onPress={() => setTab('prog')} />
      </View>
      {tab === 'notes' ? (
        <>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Btn style={{ flex: 1 }} title="+ Note" onPress={() => nav.push('noteNew')} />
            <Btn style={{ flex: 1 }} title="+ Evening recall" onPress={() => nav.push('recallLog')} />
          </View>
          {rows.length === 0 && <T dim style={{ marginTop: 16 }}>Nothing logged yet.</T>}
          {rows.map((r) => (
            <Card key={r.id} onPress={() => del(r)}>
              <T dim small>
                {when(r.ts)} · {r.kind === 'r' ? `Evening recall · ${r.details} details${r.accuracy ? ` · accuracy ${r.accuracy}/5` : ''}` : `${r.ex ? exById[r.ex]?.title : 'Note'}${r.focus ? ` · focus ${r.focus}/5` : ''}`}
              </T>
              {r.note ? <T style={{ marginTop: 4 }}>{r.note}</T> : null}
            </Card>
          ))}
          {rows.length > 0 && <T dim small>Tap an entry to delete it.</T>}
        </>
      ) : (
        <Progress state={state} />
      )}
    </ScrollView>
  );
}

function Progress({ state }) {
  const days = new Set([...state.sessions, ...state.recalls].map((x) => dayKey(x.ts)));
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return { k: dayKey(d.getTime()), on: days.has(dayKey(d.getTime())) };
  });
  const rec = [...state.recalls].sort((a, b) => a.ts - b.ts).slice(-14);
  const max = Math.max(1, ...rec.map((r) => r.details));
  const foc = state.sessions.filter((x) => x.focus);
  const avg = foc.length ? (foc.reduce((a, x) => a + x.focus, 0) / foc.length).toFixed(1) : '–';
  const half = Math.floor(rec.length / 2);
  const avgOf = (a) => (a.length ? a.reduce((x, r) => x + r.details, 0) / a.length : 0);
  const trend = rec.length >= 4 ? avgOf(rec.slice(half)) - avgOf(rec.slice(0, half)) : null;

  return (
    <>
      <Card>
        <T dim small>Current streak</T>
        <T style={{ fontSize: 32, fontWeight: '300' }}>{streak(state)} days</T>
        <View style={{ flexDirection: 'row', gap: 4, marginTop: 8 }}>
          {last14.map((d) => <View key={d.k} style={{ flex: 1, height: 14, borderRadius: 4, backgroundColor: d.on ? C.good : C.line }} />)}
        </View>
        <T dim small style={{ marginTop: 4 }}>Last 14 days</T>
      </Card>
      <Card>
        <T dim small>Sessions logged · average focus</T>
        <T style={{ fontSize: 24, fontWeight: '300' }}>{state.sessions.length} · {avg}/5</T>
      </Card>
      <Card>
        <T dim small>Evening recall — details remembered</T>
        {rec.length === 0 ? <T dim style={{ marginTop: 6 }}>Log an evening recall to start the chart.</T> : (
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 110, gap: 4, marginTop: 10 }}>
            {rec.map((r) => <View key={r.id} style={{ flex: 1, height: Math.max(4, (r.details / max) * 100), backgroundColor: C.accent, borderRadius: 3 }} />)}
          </View>
        )}
        {trend !== null && <T small style={{ marginTop: 8, color: trend >= 0 ? C.good : C.warn }}>{trend >= 0 ? '▲' : '▼'} {Math.abs(trend).toFixed(1)} details vs. earlier entries</T>}
      </Card>
    </>
  );
}

export function NoteNew({ nav, exId }) {
  const { update } = useStore();
  const [ex, setEx] = useState(exId || null);
  const [focus, setFocus] = useState(0);
  const [note, setNote] = useState('');
  const save = () => {
    update((s) => ({ ...s, sessions: [{ id: uid(), ts: Date.now(), ex, focus: focus || null, note: note.trim() }, ...s.sessions] }));
    nav.pop();
  };
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
      <H>New note</H>
      <T dim small>Exercise (optional)</T>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
        {EXERCISES.map((e) => <Chip key={e.id} label={e.title} on={ex === e.id} onPress={() => setEx(ex === e.id ? null : e.id)} />)}
      </ScrollView>
      <T dim small>Focus</T>
      <Rating value={focus} onChange={setFocus} />
      <Input multiline autoFocus value={note} onChangeText={setNote} placeholder="What did you notice, feel, see?" />
      <Btn title="Save" onPress={save} disabled={!note.trim() && !ex} />
    </ScrollView>
  );
}

export function RecallLog({ nav }) {
  const { update } = useStore();
  const [details, setDetails] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [note, setNote] = useState('');
  const save = () => {
    update((s) => ({ ...s, recalls: [{ id: uid(), ts: Date.now(), details, accuracy: accuracy || null, note: note.trim() }, ...s.recalls] }));
    nav.pop();
  };
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
      <H>Evening recall</H>
      <T dim>Your first activity this morning (or after breakfast). Write it in order, with every detail: what you saw, heard, did, in what sequence.</T>
      <Btn kind="ghost" title="Run the 3½-minute recall timer" onPress={() => nav.push('guide', { id: 'obs-recall', back: true })} />
      <Input multiline value={note} onChangeText={setNote} placeholder="First I… then I… I saw… the light was…" />
      <T dim small style={{ marginTop: 8 }}>Details you recalled (count them)</T>
      <Stepper value={details} onChange={setDetails} max={200} />
      <T dim small style={{ marginTop: 12 }}>How sure are you it is accurate?</T>
      <Rating value={accuracy} onChange={setAccuracy} />
      <Btn title="Save recall" onPress={save} disabled={!note.trim() && !details} style={{ marginTop: 14 }} />
    </ScrollView>
  );
}
