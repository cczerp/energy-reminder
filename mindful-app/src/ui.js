import React from 'react';
import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';

export const C = {
  bg: '#12141c', card: '#1c2030', line: '#2a3045', text: '#e8eaf2', dim: '#9aa1b8',
  accent: '#8b9cf7', good: '#6fcf97', warn: '#f2c94c', bad: '#eb7a7a',
};

export const Card = ({ children, style, onPress }) =>
  onPress ? (
    <Pressable onPress={onPress} style={({ pressed }) => [s.card, style, pressed && { opacity: 0.7 }]}>{children}</Pressable>
  ) : (
    <View style={[s.card, style]}>{children}</View>
  );

export const H = ({ children, style }) => <Text style={[s.h, style]}>{children}</Text>;
export const T = ({ children, dim, small, style, ...p }) => (
  <Text style={[s.t, dim && { color: C.dim }, small && { fontSize: 13 }, style]} {...p}>{children}</Text>
);

export const Btn = ({ title, onPress, kind, style, disabled }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={({ pressed }) => [s.btn, kind === 'ghost' && s.btnGhost, disabled && { opacity: 0.4 }, pressed && { opacity: 0.7 }, style]}
  >
    <Text style={[s.btnT, kind === 'ghost' && { color: C.accent }]}>{title}</Text>
  </Pressable>
);

export const Chip = ({ label, on, onPress }) => (
  <Pressable onPress={onPress} style={[s.chip, on && { backgroundColor: C.accent, borderColor: C.accent }]}>
    <Text style={{ color: on ? C.bg : C.text, fontSize: 13 }}>{label}</Text>
  </Pressable>
);

export const Check = ({ on, label, onPress, sub }) => (
  <Pressable onPress={onPress} style={s.row}>
    <View style={[s.box, on && { backgroundColor: C.good, borderColor: C.good }]}>{on ? <Text style={{ color: C.bg, fontWeight: '700' }}>✓</Text> : null}</View>
    <View style={{ flex: 1 }}>
      <T>{label}</T>
      {sub ? <T dim small>{sub}</T> : null}
    </View>
  </Pressable>
);

export const Stepper = ({ value, onChange, min = 0, max = 99, step = 1, fmt }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Pressable onPress={() => onChange(Math.max(min, value - step))} style={s.step}><Text style={s.stepT}>−</Text></Pressable>
    <Text style={[s.t, { minWidth: 56, textAlign: 'center' }]}>{fmt ? fmt(value) : value}</Text>
    <Pressable onPress={() => onChange(Math.min(max, value + step))} style={s.step}><Text style={s.stepT}>+</Text></Pressable>
  </View>
);

export const Input = (p) => <TextInput placeholderTextColor={C.dim} {...p} style={[s.input, p.multiline && { minHeight: 110, textAlignVertical: 'top' }, p.style]} />;

export const Rating = ({ value, onChange, max = 5 }) => (
  <View style={{ flexDirection: 'row', gap: 8 }}>
    {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
      <Pressable key={n} onPress={() => onChange(n)} style={[s.dot, value >= n && { backgroundColor: C.accent, borderColor: C.accent }]}>
        <Text style={{ color: value >= n ? C.bg : C.dim }}>{n}</Text>
      </Pressable>
    ))}
  </View>
);

export const fmtTime = (h, m) => {
  const ap = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ap}`;
};

const s = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: C.line },
  h: { color: C.text, fontSize: 20, fontWeight: '700', marginBottom: 8, marginTop: 6 },
  t: { color: C.text, fontSize: 15, lineHeight: 21 },
  btn: { backgroundColor: C.accent, borderRadius: 12, paddingVertical: 13, paddingHorizontal: 18, alignItems: 'center', marginVertical: 4 },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: C.accent },
  btnT: { color: C.bg, fontWeight: '700', fontSize: 15 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: C.line, marginRight: 8, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 12 },
  box: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: C.dim, alignItems: 'center', justifyContent: 'center' },
  step: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.line, alignItems: 'center', justifyContent: 'center' },
  stepT: { color: C.text, fontSize: 20 },
  input: { backgroundColor: C.bg, color: C.text, borderRadius: 10, borderWidth: 1, borderColor: C.line, padding: 12, fontSize: 15, marginVertical: 6 },
  dot: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
});
