import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, Vibration } from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import { exById } from './content';
import { useStore, uid } from './store';
import { C, Card, H, T, Btn, Input, Rating } from './ui';

const pad = (n) => String(Math.floor(n / 60)) + ':' + String(n % 60).padStart(2, '0');

function useTick(running, onTick) {
  const cb = useRef(onTick);
  cb.current = onTick;
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => cb.current(), 1000);
    return () => clearInterval(id);
  }, [running]);
}

function TimerStep({ secs, onDone }) {
  const [left, setLeft] = useState(secs);
  const [run, setRun] = useState(false);
  useTick(run && left > 0, () => {
    setLeft((l) => {
      if (l <= 1) {
        Vibration.vibrate([0, 300, 150, 300]);
        setRun(false);
        onDone();
        return 0;
      }
      return l - 1;
    });
  });
  return (
    <View style={{ alignItems: 'center', marginVertical: 18 }}>
      <T style={{ fontSize: 56, fontWeight: '200', color: C.accent }}>{pad(left)}</T>
      <Btn title={left === 0 ? 'Done' : run ? 'Pause' : left === secs ? 'Start timer' : 'Resume'} kind="ghost" disabled={left === 0} onPress={() => setRun(!run)} />
    </View>
  );
}

function BreathStep({ breath, onDone }) {
  const { phases, reps } = breath;
  const [st, setSt] = useState({ rep: 1, ph: 0, left: phases[0][1] });
  const [run, setRun] = useState(false);
  const [fin, setFin] = useState(false);
  useTick(run && !fin, () => {
    setSt((x) => {
      if (x.left > 1) return { ...x, left: x.left - 1 };
      Vibration.vibrate(40);
      if (x.ph + 1 < phases.length) return { ...x, ph: x.ph + 1, left: phases[x.ph + 1][1] };
      if (x.rep < reps) return { rep: x.rep + 1, ph: 0, left: phases[0][1] };
      setFin(true);
      setRun(false);
      Vibration.vibrate([0, 300, 150, 300]);
      onDone();
      return x;
    });
  });
  return (
    <View style={{ alignItems: 'center', marginVertical: 18 }}>
      <T style={{ fontSize: 22, color: C.text }}>{fin ? 'Complete' : phases[st.ph][0]}</T>
      <T style={{ fontSize: 72, fontWeight: '200', color: C.accent }}>{fin ? '✓' : st.left}</T>
      <T dim>Round {Math.min(st.rep, reps)} of {reps}</T>
      {!fin && <Btn title={run ? 'Pause' : st.rep === 1 && st.ph === 0 && st.left === phases[0][1] ? 'Start' : 'Resume'} kind="ghost" onPress={() => setRun(!run)} />}
    </View>
  );
}

export default function Guide({ nav, exId, back }) {
  useKeepAwake();
  const { update } = useStore();
  const ex = exById[exId];
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  const [focus, setFocus] = useState(0);
  const [note, setNote] = useState('');
  const [stepDone, setStepDone] = useState(false);

  const raw = ex.steps[i];
  const step = typeof raw === 'string' ? { t: raw } : raw;
  const last = i === ex.steps.length - 1;
  const gated = (step.secs || step.breath) && !stepDone;

  const next = () => {
    setStepDone(false);
    if (last) setDone(true);
    else setI(i + 1);
  };

  const save = (withNote) => {
    update((s) => ({ ...s, sessions: [{ id: uid(), ts: Date.now(), ex: ex.id, focus: focus || null, note: withNote ? note.trim() : '' }, ...s.sessions] }));
    if (back) nav.pop();
    else if (ex.kind === 'recall') nav.replace('recallLog');
    else nav.pop(2);
  };

  if (done) {
    return (
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <H>{ex.title} — done</H>
        <Card>
          <T dim>How was your focus?</T>
          <Rating value={focus} onChange={setFocus} />
          <T dim style={{ marginTop: 12 }}>
            {ex.kind === 'review' ? 'Write the exact hour and everything you observed.' : 'Notes (optional)'}
          </T>
          <Input multiline value={note} onChangeText={setNote} placeholder="What did you notice?" />
        </Card>
        <Btn title={ex.kind === 'recall' ? 'Save and go to recall log' : 'Save to log'} onPress={() => save(true)} />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <T dim small>{ex.title} · step {i + 1} of {ex.steps.length}</T>
      {ex.caution && i === 0 ? (
        <Card style={{ borderColor: C.warn }}><T small style={{ color: C.warn }}>{ex.caution}</T></Card>
      ) : null}
      <Card style={{ marginTop: 10 }}>
        <T style={{ fontSize: 18, lineHeight: 26 }}>{step.t}</T>
      </Card>
      {step.breath ? <BreathStep key={i} breath={step.breath} onDone={() => setStepDone(true)} /> : null}
      {step.secs ? <TimerStep key={i} secs={step.secs} onDone={() => setStepDone(true)} /> : null}
      <Btn title={last ? 'Finish' : 'Next'} onPress={next} kind={gated ? 'ghost' : undefined} />
      {i > 0 && <Btn title="Back" kind="ghost" onPress={() => { setStepDone(false); setI(i - 1); }} />}
    </ScrollView>
  );
}
