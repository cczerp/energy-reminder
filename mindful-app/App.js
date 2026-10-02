import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Pressable, BackHandler, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StoreProvider, useStore } from './src/store';
import { reschedule } from './src/notify';
import { exById } from './src/content';
import { C } from './src/ui';
import Today from './src/Today';
import { PracticeHome, Exercise, Chakras, Cycles } from './src/Practice';
import Guide from './src/Guide';
import { LogHome, NoteNew, RecallLog } from './src/Log';
import Energy from './src/Energy';
import Settings from './src/Settings';

const TABS = [
  ['today', 'Today'], ['practice', 'Practice'], ['log', 'Log'], ['energy', 'Energy'], ['settings', 'Settings'],
];

function Shell() {
  const { state } = useStore();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('today');
  const [stack, setStack] = useState([]); // pushed screens over the tab

  const nav = {
    push: (name, params = {}) => setStack((s) => [...s, { name, ...params }]),
    pop: (n = 1) => setStack((s) => s.slice(0, Math.max(0, s.length - n))),
    replace: (name, params = {}) => setStack((s) => [...s.slice(0, -1), { name, ...params }]),
  };

  useEffect(() => {
    reschedule(state); // refresh nudge wording and make sure triggers exist
  }, []); // eslint-disable-line

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length) { setStack((s) => s.slice(0, -1)); return true; }
      if (tab !== 'today') { setTab('today'); return true; }
      return false;
    });
    return () => sub.remove();
  }, [stack, tab]);

  const top = stack[stack.length - 1];
  const TITLES = { exercise: top && exById[top.id]?.title, guide: 'Guided', noteNew: 'Note', recallLog: 'Recall', chakras: 'Chakras', cycles: 'Life cycles' };

  let body;
  if (top) {
    body = {
      exercise: <Exercise nav={nav} id={top.id} />,
      guide: <Guide key={stack.length} nav={nav} exId={top.id} back={top.back} />,
      noteNew: <NoteNew nav={nav} exId={top.id} />,
      recallLog: <RecallLog nav={nav} />,
      chakras: <Chakras />,
      cycles: <Cycles />,
    }[top.name];
  } else {
    body = {
      today: <Today nav={nav} />,
      practice: <PracticeHome nav={nav} />,
      log: <LogHome nav={nav} />,
      energy: <Energy />,
      settings: <Settings />,
    }[tab];
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top }}>
      <StatusBar style="light" />
      {top ? (
        <Pressable onPress={() => nav.pop()} style={st.back}>
          <Text style={{ color: C.accent, fontSize: 16 }}>‹ Back</Text>
          <Text style={{ color: C.dim, marginLeft: 12 }} numberOfLines={1}>{TITLES[top.name]}</Text>
        </Pressable>
      ) : null}
      <View style={{ flex: 1 }}>{body}</View>
      {!top && (
        <View style={[st.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
          {TABS.map(([id, label]) => (
            <Pressable key={id} onPress={() => setTab(id)} style={{ flex: 1, alignItems: 'center', paddingVertical: 8 }}>
              <Text style={{ color: tab === id ? C.accent : C.dim, fontSize: 12, fontWeight: tab === id ? '700' : '400' }}>{label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <Shell />
      </StoreProvider>
    </SafeAreaProvider>
  );
}

const st = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.line },
  bar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: C.line, backgroundColor: C.card },
});
