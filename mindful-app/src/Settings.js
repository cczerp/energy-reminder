import React, { useState } from 'react';
import { ScrollView, View, Share, Alert } from 'react-native';
import { SLOTS } from './content';
import { useStore, defaultState } from './store';
import { reschedule, testNotification } from './notify';
import { C, Card, H, T, Btn, Check, Stepper, Input, fmtTime } from './ui';

export default function Settings() {
  const { state, update } = useStore();
  const [paste, setPaste] = useState('');
  const [msg, setMsg] = useState('');

  const apply = async (fn) => {
    const next = fn(state);
    update(() => next);
    const ok = await reschedule(next);
    setMsg(ok ? 'Reminders updated.' : 'Notifications are not allowed — enable them in phone settings.');
  };
  const setSlot = (id, patch) => apply((s) => ({ ...s, slots: { ...s.slots, [id]: { ...s.slots[id], ...patch } } }));
  const setNudge = (patch) => apply((s) => ({ ...s, nudges: { ...s.nudges, ...patch } }));

  const exportData = () => Share.share({ message: JSON.stringify(state) });
  const importData = () => {
    try {
      const d = JSON.parse(paste);
      if (!d || !Array.isArray(d.sessions)) throw new Error();
      Alert.alert('Replace everything on this phone with the pasted backup?', '', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Replace', style: 'destructive', onPress: () => { const next = { ...defaultState(), ...d }; update(() => next); reschedule(next); setPaste(''); setMsg('Backup restored.'); } },
      ]);
    } catch (e) {
      setMsg('That does not look like a backup.');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
      <H>Daily reminders</H>
      {SLOTS.map((s) => {
        const c = state.slots[s.id];
        const mins = c.h * 60 + c.m;
        return (
          <Card key={s.id}>
            <Check on={c.on} label={s.label + (s.weekday ? ' · Sundays' : '')} onPress={() => setSlot(s.id, { on: !c.on })} />
            {c.on && (
              <View style={{ alignItems: 'flex-start', marginLeft: 36 }}>
                <Stepper value={mins} step={15} min={0} max={1425} fmt={(v) => fmtTime(Math.floor(v / 60), v % 60)} onChange={(v) => setSlot(s.id, { h: Math.floor(v / 60), m: v % 60 })} />
              </View>
            )}
          </Card>
        );
      })}
      <H>Mindful moments</H>
      <Card>
        <Check on={state.nudges.on} label="Mindfulness nudges through the day" onPress={() => setNudge({ on: !state.nudges.on })} />
        {state.nudges.on && (
          <View style={{ gap: 10, marginLeft: 36 }}>
            <View><T dim small>Per day</T><Stepper value={state.nudges.count} min={1} max={10} onChange={(v) => setNudge({ count: v })} /></View>
            <View><T dim small>From</T><Stepper value={state.nudges.start} min={0} max={22} fmt={(v) => fmtTime(v, 0)} onChange={(v) => setNudge({ start: Math.min(v, state.nudges.end - 1) })} /></View>
            <View><T dim small>Until</T><Stepper value={state.nudges.end} min={1} max={23} fmt={(v) => fmtTime(v, 0)} onChange={(v) => setNudge({ end: Math.max(v, state.nudges.start + 1) })} /></View>
          </View>
        )}
      </Card>
      <Btn kind="ghost" title="Send a test reminder (5 sec)" onPress={async () => setMsg((await testNotification()) ? 'Test coming in 5 seconds…' : 'Notifications are not allowed — enable them in phone settings.')} />
      {msg ? <T small style={{ color: C.good }}>{msg}</T> : null}

      <H>Backup</H>
      <T dim small>Everything is stored only on this phone. Export shares a text backup (save it to Notes, Drive, or email it to yourself).</T>
      <Btn title="Export backup" onPress={exportData} />
      <Input multiline value={paste} onChangeText={setPaste} placeholder="Paste a backup here to restore" />
      <Btn kind="ghost" title="Restore from pasted backup" onPress={importData} disabled={!paste.trim()} />
    </ScrollView>
  );
}
