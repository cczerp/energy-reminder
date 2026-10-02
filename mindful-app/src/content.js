// All guide content, converted from the First Steps guides.
// A step is a string, or { t, secs } (timed), or { t, breath: { phases:[[label,secs]...], reps } }.

export const CATS = {
  energy: 'Energy & healing',
  balance: 'Counterbalance',
  observe: 'Observation',
  concentrate: 'Concentration',
  meditate: 'Meditation',
  emotion: 'Emotional control',
  centers: 'Psychic centers',
  project: 'Projection',
};

// Progression gates from the Psychic Development guide: Heart -> Pituitary -> Pineal -> Throat -> Attunement.
export const MILESTONES = [
  { id: 'heart', label: 'Heart center is showing signs of activity' },
  { id: 'pituitary', label: 'Pituitary work is showing results (sharper observation, faster thinking, better memory)' },
  { id: 'pineal', label: 'Pineal series practiced for several weeks' },
  { id: 'throat', label: 'Throat + pineal practiced together; the centers are responding' },
];

const BODY = 'Sit in a straight-back chair, feet touching but not crossed, hands resting in your lap, back straight, head erect, breathe naturally, eyes closed. Quiet spot, free of interruption.';

export const EXERCISES = [
  // ---------- Energy & healing ----------
  {
    id: 'energy-breath', cat: 'energy', title: 'Energy-Building Breath', mins: 3,
    freq: 'At least once a day; up to 4–5× is fine',
    summary: 'Pull in a surge of energy and store it. Noticeable stimulation in 15–20 min; the lift lasts several hours.',
    steps: [
      'Sit erect (not tense) or stand with weight balanced on both feet.',
      { t: 'Jaw clenched firmly, both hands in fists, rest of body relaxed. Think of each breath as pulling in a surge of energy and storing it.', breath: { phases: [['Breathe in', 3], ['Hold', 5], ['Exhale slowly', 10]], reps: 10 } },
    ],
  },
  {
    id: 'child-sun', cat: 'energy', title: '"Child of the Sun"', mins: 1,
    freq: 'After the energy breath, or on its own',
    summary: 'Immediate refreshment; the bigger payoff (more work, less fatigue) shows up hours later.',
    steps: [
      'Sit erect, relaxed, feet touching, hands clasped in lap.',
      'Visualize the sun — a great white flaming orb of energy.',
      'Mentally lift your consciousness "in spirit" to the sun, enter its aura, go to its body. No fear — you belong there. Let its energy flow through and invigorate every part of you.',
      { t: 'Stay in the sun.', secs: 60 },
      'Return to your body, rise, resume your day.',
    ],
  },
  {
    id: 'white-light', cat: 'energy', title: 'Self-Healing — White Light', mins: 5,
    freq: 'As soon as trouble starts, before you are too impaired to visualize',
    summary: 'For accident, disease, muscular pain, or nervous disorder.',
    caution: 'If pain is too severe to visualize clearly, get another healer to treat you instead.',
    steps: [
      'Sit in a comfortable chair, head erect, spine straight, feet apart, hands unclasped in lap.',
      'Visualize yourself surrounded by a bright white cloud — scintillating, like sunlight on new snow.',
      'See that white light concentrating into the painful or affected area.',
      'Heart or lungs: concentrate the light at the 5th–7th thoracic vertebrae (between/slightly below the shoulder blades). Nervous disorder (not mental illness): concentrate it at the 5th cervical vertebra.',
      { t: 'Hold the light on the area.', secs: 180 },
    ],
  },
  {
    id: 'light-wash', cat: 'energy', title: 'Light-Wash Healing', mins: 5,
    freq: 'As needed',
    summary: 'Wash healing energy over the body; can help you pinpoint problem areas. (Other source, not the book.)',
    steps: [
      'Picture a place you genuinely enjoy being. Take your time choosing it.',
      "Don't try to make the image vivid — your mind already holds the emotional memory. Use the thought of the place to induce the actual feeling you get there. Lock onto that joyful emotion.",
      'Imagine a ball of light glowing above you. Do not rush — build a genuinely vivid image of the light.',
      'Let the light slowly enter your head and work its way down to your feet — as slow as a freshly washed car creeping through a drying tunnel.',
    ],
  },
  {
    id: 'heal-others', cat: 'energy', title: 'Healing Others', mins: 15,
    freq: 'When asked',
    summary: 'Prime yourself, calm the patient, accumulate energy, then use the contact or radiation method.',
    caution: 'Be in reasonably good health, with purity of motive. Never diagnose out loud. Never touch a patient unless they specifically ask for contact treatment — then light fingertip contact only, no rubbing or massage. Wash hands before and after.',
    steps: [
      { t: 'Prime yourself: bring first two fingers + thumb of each hand together (each hand separate). Visualize psychic energy pouring into you and accumulating at your heart, held there by will.', breath: { phases: [['Breathe in', 3], ['Hold', 7], ['Release slowly', 5]], reps: 3 } },
      'Calm the patient: have them relax and picture a quiet, unrippled forest pool mirroring white clouds in a blue sky. Narrate what you are doing as you go.',
      'Accumulate energy again: breath/visualization, energy pooling at your heart.',
      'Contact method: touch index + middle finger + thumb together on the left side of the patient\'s spine between the shoulder blades (heart center). Release energy through — an open valve to an unlimited supply. Hold a clear visualization 30–40 sec; if it clouds, remove your hand, wait ~5 min, repeat from the breathing step.',
      'Radiation method: same, but no touch — stand where you can see the patient and visually direct the energy to the spot. Works at a distance too.',
      'Rhythm: 3 treatments per session, sessions every 2–3 hrs → results in ~12 hrs, often a cure in 24. Unknown ailment: direct energy to the heart center (back, left of spine, between shoulder blades).',
      'Quick headache relief (3–4 min): tips of first two right-hand fingers on the patient\'s left temple, index + middle of the left hand lightly on the right temple. Energy flows in through the right hand, out through the left.',
    ],
  },

  // ---------- Counterbalance ----------
  {
    id: 'counter-neg', cat: 'balance', title: 'Counterbalance — Negative', mins: 10,
    freq: 'Chronic conditions: repeat, at least 2 hrs apart',
    summary: "Use when you're out of balance toward the negative.",
    steps: [
      'Straight-backed chair, quiet spot, undisturbed ~10 minutes. Feet apart, flat on the floor (not touching).',
      'Hands rest loosely in lap or on knees, not touching each other. On each hand: index + middle finger + thumb touching (a small triangle).',
      { t: 'Relax. Deep breath, hold for 7, release easily. Rest briefly and repeat — 7 times total.', breath: { phases: [['Deep breath in', 3], ['Hold', 7], ['Release easily', 3], ['Rest', 5]], reps: 7 } },
      'Change position, put it out of your mind.',
    ],
  },
  {
    id: 'counter-pos', cat: 'balance', title: 'Counterbalance — Over-Positive', mins: 10,
    freq: 'Early cold/infection: 3 treatments, an hour or two apart',
    summary: 'The version that helps early colds; usually clears hostile germs in 6–8 hrs.',
    steps: [
      'Sit comfortably, feet touching each other, flat on the floor. Quiet spot, ~10 minutes.',
      'Hands touching: thumb-to-thumb, each fingertip to its matching fingertip, held at chest level. Eyes closed.',
      { t: 'Deep breath in, exhale slowly, hold the breath OUT for 5. Breathe normally 5–6 breaths. Repeat 5 times.', breath: { phases: [['Deep breath in', 3], ['Exhale slowly', 4], ['Hold breath OUT', 5], ['Breathe normally', 15]], reps: 5 } },
      'Stop, breathe normally, forget about it.',
    ],
  },

  // ---------- Observation ----------
  {
    id: 'obs-room', cat: 'observe', title: 'New-Room Recall', mins: 1,
    freq: 'Every time you enter a new room or space',
    summary: 'Give it 2–3 weeks before it fully clicks.',
    steps: ['Entering a new room or place: close your eyes for a second and name as many objects as you can recall.'],
  },
  {
    id: 'obs-stairs', cat: 'observe', title: 'Stair Count', mins: 1,
    freq: 'Every flight of stairs',
    summary: 'Give it 2–3 weeks before it fully clicks.',
    steps: ['After going up or down stairs: recall how many steps there were.'],
  },
  {
    id: 'obs-recall', cat: 'observe', title: 'Evening Recall — Your Morning', mins: 4, kind: 'recall',
    freq: 'Once, in the evening. Pick a different 3-min window each day',
    summary: 'Recall what you did first thing that morning (or after breakfast) — what you saw, what you did.',
    steps: [
      'Pick a different 3-minute window from this morning than yesterday (first thing up, or just after breakfast).',
      { t: 'Close your eyes and recall as much as you can: what you saw, what you did, in order. Count the details.', secs: 210 },
      'Now write it down in the Recall log — the detail count is how you track progress.',
    ],
  },

  // ---------- Concentration ----------
  {
    id: 'conc-multiply', cat: 'concentrate', title: 'Mental Multiplication', mins: 5,
    freq: 'Once a day, different numbers each time',
    summary: 'Multiply two 2-digit numbers in your head until sure of the answer; then two 3-digit numbers.',
    steps: ['Multiply two 2-digit numbers in your head (e.g. 26 × 39) until sure of the answer.', 'Then two 3-digit numbers (e.g. 413 × 765).'],
  },
  {
    id: 'conc-poem', cat: 'concentrate', title: 'Memorize Four Lines', mins: 5,
    freq: 'Once a day',
    summary: 'Memorize 4 lines of any poem.',
    steps: ['Memorize 4 lines of any poem. Recite them from memory.'],
  },
  {
    id: 'conc-stranger', cat: 'concentrate', title: 'The Stranger\'s Face', mins: 2,
    freq: 'As opportunities arise — the advanced one, builds toward attunement',
    summary: 'Passing a stranger, hold their face in your mind\'s eye.',
    steps: ["Passing a stranger: look closely at their face a moment, look away, hold that face in your mind's eye for 1+ minute, study its expression."],
  },

  // ---------- Meditation ----------
  {
    id: 'med-color', cat: 'meditate', title: 'Meditation 1 — Color', mins: 3,
    freq: 'Daily', summary: 'Blue, pink, white — one minute each, one sitting.',
    steps: [
      BODY,
      { t: 'Picture one shade of blue, filling the whole room around you.', secs: 60 },
      { t: 'Switch to pink.', secs: 60 },
      { t: 'Switch to pure white (fresh-snow bright).', secs: 60 },
      'Rise, deep breath, relax.',
    ],
  },
  {
    id: 'med-sound', cat: 'meditate', title: 'Meditation 2 — Sound', mins: 3,
    freq: 'Daily', summary: 'Violin, horn/sax, piano — one minute each, one sitting.',
    steps: [
      BODY,
      { t: 'Hear a violin playing something familiar. If other instruments swell in, filter back to just the violin.', secs: 60 },
      { t: 'Hear a horn or saxophone (one or the other).', secs: 60 },
      { t: 'Hear a piano playing something familiar — hardest: chords, not single notes.', secs: 60 },
      'Rise, deep breath, relax.',
    ],
  },
  {
    id: 'med-cloud', cat: 'meditate', title: 'Meditation 3 — The Pink Cloud', mins: 1,
    freq: 'Daily, separate sitting', summary: 'Wrapped in a pink cloud for one minute.',
    steps: [
      BODY,
      { t: 'See yourself wrapped in a pink cloud extending 6–10 inches out from you in every direction (front, back, sides, above, below). Hold the full image.', secs: 60 },
      'Dismiss it, rise, deep breath, relax.',
    ],
  },
  {
    id: 'med-love', cat: 'meditate', title: 'Meditation of Love', mins: 15,
    freq: 'Repeat for many days before results show',
    summary: 'Send a pink cloud of good will to a person, group, or entity. Modest effort, no more than 15 minutes.',
    caution: "Don't desire or foresee a specific result — no planning the outcome. Leave the manifestation to the intelligence of the soul force behind the energy.",
    steps: [
      'Create a feeling of love, warmth, and good will in your breast, near your heart. Visualize it as a glowing pink aura emanating from the heart, completely surrounding your body.',
      'Visualize clearly the person, group, or entity you wish to help.',
      'By an act of will, send a portion of your aura, as a pink cloud, to the object of your love. Feel love for them and see the cloud encapsule them in a pink aura of protection.',
      'Immediately dismiss all thought of it and regard it as "mission accomplished."',
    ],
  },

  // ---------- Emotional control ----------
  {
    id: 'emo-matches', cat: 'emotion', title: 'Matchbox Drill', mins: 10,
    freq: 'Once or more daily until mastered', summary: 'Patience and calm under a fiddly task.',
    steps: ['Dump a box of kitchen matches on the table, mix thoroughly, and put them all back in the box with every tip facing the same direction.'],
  },
  {
    id: 'emo-tv', cat: 'emotion', title: 'TV / Radio Attention Drill', mins: 10,
    freq: 'Once or more daily until mastered', summary: 'Train what you attend to.',
    steps: [
      'Sit with the TV on at normal volume and do not look at the picture at all.',
      'Once mastered, also try to tune out understanding the audio.',
      'No TV? Radio: warm up by tuning OUT everything except the radio, then narrow to just one instrument (violin/clarinet) through a 3-minute stretch.',
    ],
  },
  {
    id: 'emo-slow', cat: 'emotion', title: 'Deliberate Slowing-Down', mins: 0,
    freq: 'A full month, all day', summary: 'Let others go first — with a genuine smile.',
    steps: ['For a full month: let others go first — walking, driving (yield right of way, drive under the limit), entering/leaving rooms, planes, trains. Do it all with a genuine smile and a cheerful attitude.'],
  },
  {
    id: 'emo-redirect', cat: 'emotion', title: 'Redirect, Don\'t Suppress', mins: 0,
    freq: 'Whenever an urge shows up', summary: 'Suppression always ends in an explosion.',
    steps: [
      'Do not block or negate a desire — redirect it. Craving rich dessert? Take fruit instead of nothing at all.',
      'Every emotion has a higher and lower counterpart (love of self → love of others → love of all that lives; fear → trust and confidence). Examine the emotion as it comes up and shift it toward the higher form.',
    ],
  },
  {
    id: 'emo-fear', cat: 'emotion', title: 'Fear Self-Talk', mins: 1,
    freq: 'When fear arises', summary: 'Use your mind, not your will.',
    steps: ['Say to yourself: "What is there to fear? I am secure. This is not a new situation. I have faced it — or one like it — more than once without dire consequences. So why fear?"', 'Use the mind, not the will: forcing a feeling down is suppression, with the risk of an explosive outbreak later.'],
  },
  {
    id: 'emo-borrowed', cat: 'emotion', title: 'Whose Emotion Is This?', mins: 1,
    freq: 'Whenever a feeling arrives out of nowhere', summary: 'Tell your own emotions from everyone else\'s.',
    steps: [
      'Much of what you feel is picked up from people around you. The closer two bodies are, the stronger the transfer; distance weakens it.',
      'Recognize a feeling as coming from outside you. Then step out of it — like stepping out of a shower, a cloak, or a room. Fully or partially, your call.',
      'Only release emotions you want to release. A borrowed emotion that feels pleasant, you may keep. Restraint and judgment — not cold, just not carried along on someone else\'s wave.',
    ],
  },

  // ---------- Psychic centers ----------
  {
    id: 'c-heart', cat: 'centers', title: '1. Heart Center', mins: 15,
    freq: 'Once a week, never more than twice a week at first',
    summary: 'The first and most important exercise. Start here and give it sustained effort.',
    caution: 'Not a Hatha Yoga exercise — no compression of breath in the solar plexus or heart area. Breathing stays normal but deep.',
    steps: [
      'Sit erect in a straight-backed chair in a dimly lit room. Shut out sound; prevent interruption.',
      'Close your eyes and turn your attention inward toward your heart.',
      "In imagination, enter your heart. You're on a plain before a hill; on top is a temple — the temple of the heart. Hold this.",
      'Climb the hill, mount the steps, enter the center doorway. Observe the temple — well kept and swept, or covered with dust?',
      'Walk into the dim interior toward the central adytum. A flickering light grows brighter as you approach, swelling and receding rhythmically in a bowl-like depression.',
      'Gaze on the flame. Send it your energies. See it grow bright and strong, reaching up to touch the ceiling forty feet above. Breathe deeply and realize your heart center is coming alive.',
      { t: 'Open your eyes and sit in quiet meditation before rising.', secs: 300 },
    ],
  },
  {
    id: 'c-pituitary', cat: 'centers', title: '2. Pituitary (Lower Head Center)', mins: 8, needs: ['heart'],
    freq: 'Can run alongside continued heart work',
    summary: 'First noticeable effect: sharper observation, faster thinking, better memory.',
    steps: [
      'Mantram: sit erect. Sound RA-MA seven times, pause, seven times, pause, nine times. Inhale quick and deep; carry the sound on the prolonged exhalation. Spine erect, muscular "corset" taut.',
      'Color + mantram: visualize a bright yellow slightly tinged with green — like sunlight through leaves — while sounding RA-RA-RA, MA-MA-MA. RA-A-A — MA-A-A.',
      'Energy flow: visualize the same sunlight-yellow, directing it to the pituitary (front of the head, between your eyes). Silently intone three times: RA-A-A, MA-A-A.',
    ],
  },
  {
    id: 'c-pineal', cat: 'centers', title: '3. Pineal (Higher Head Center)', mins: 6, needs: ['heart', 'pituitary'],
    freq: 'Twice a day (morning and before bed) for several weeks',
    summary: 'Audible / silent / audible AUM with a violet-pink haze around the gland.',
    steps: [
      'Sit erect. Focus on the pineal gland — center of the head at ear level, just behind and slightly below the pituitary. Visualize violet shading toward pink, enveloping it in a haze.',
      'Sound AUM seven times, audibly, in full voice (soft but audible is fine). End each in a sustained hum; locate the vibration in the pineal gland.',
      'Pause. Repeat AUM seven times — silently. The silent series is actually more effective, so give it real attention.',
      'Pause. Repeat AUM seven times, audibly.',
      'Feel the hum massage the gland until it responds with a similar vibration, as if glowing violet-pink.',
    ],
  },
  {
    id: 'c-throat', cat: 'centers', title: '4. Throat Center', mins: 5, needs: ['heart', 'pituitary', 'pineal'],
    freq: 'Once a day, starting ~2 weeks after beginning the pineal exercise; then do the two together',
    summary: 'Orange light at the thyroid with the chant THO-THO-RAMA-THO.',
    steps: [
      'Sit erect. The throat center is just forward of the spine, behind the Adam\'s apple (thyroid).',
      'Visualize the thyroid surrounded by bright orange light.',
      'Intone in full voice: THO-THO-RAMA-THO. THO on F-sharp above middle C, RAMA on A-natural above middle C. Repeat the full chant five times.',
    ],
  },
  {
    id: 'c-attune', cat: 'centers', title: '5. Combined Attunement', mins: 10, needs: ['heart', 'pituitary', 'pineal', 'throat'],
    freq: 'Only once the individual centers show results',
    summary: 'Heart → Throat → Head. Powerful; build up to it gradually.',
    caution: 'Do not attempt before at least partial development of the individual centers. No harm in jumping ahead, but no good either.',
    steps: [
      'Part One — Heart, then higher head. Head erect, back straight. Focus on the heart center bathed in a pink cloud.',
      { t: 'Inhale 7 · hold 10 (move attention to the higher head center, taking the pink cloud) · exhale 7 · hold out 10 (cloud expands to embrace your whole body).', breath: { phases: [['Inhale', 7], ['Hold in', 10], ['Exhale', 7], ['Hold out', 10]], reps: 1 } },
      'Part Two — Throat. Focus on the throat center bathed in blue light, like clear blue sky.',
      { t: 'Inhale 7 · count 10 as the blue cloud envelops the higher head center · exhale 7 · hold out 10 as the blue cloud enlarges to your whole body.', breath: { phases: [['Inhale', 7], ['Hold in', 10], ['Exhale', 7], ['Hold out', 10]], reps: 1 } },
      'Part Three — Pituitary + pineal. Focus in the lower head center; see a brilliant white light surround the pituitary as you inhale.',
      { t: 'Hold 10: white cloud embraces pituitary and pineal, aligning them. Exhale 7, keeping the head center in the light. Hold out 10: the light expands around your whole body, 2–3 feet out.', breath: { phases: [['Inhale', 7], ['Hold in', 10], ['Exhale', 7], ['Hold out', 10]], reps: 1 } },
      'Sound AUM three times, then arise and put all thought of the exercise out of your mind immediately.',
    ],
  },
  {
    id: 'c-chakra', cat: 'centers', title: 'Chakra Alignment (Dispenza)', mins: 20,
    freq: 'In theta/alpha states', summary: 'Attention in each chakra\'s area, bottom to top, until it feels coherent.',
    steps: [
      'Focus on the outer body and the space around the body. Let the sense organs become aware of the space around them.',
      'Narrow the focus outward, then move inward — feel the outer body, then the breath. Take all thoughts and let them go, returning to focus.',
      'Precision is not required: get your attention into the general area of the chakra. Attention is the mechanism.',
      'Start at the root. Hold attention there until it feels settled, aligned, coherent with the rest of the body. Then move up: sacral, solar plexus, heart, throat, third eye, crown. Each one takes less effort than the last.',
      'Focus on the vastness of the quantum realm. Hold the feeling of wholeness.',
    ],
  },

  // ---------- Projection ----------
  {
    id: 'p-mental', cat: 'project', title: 'Mental Projection', mins: 15, kind: 'review',
    freq: 'Max 15 min/session; after ~20 sessions up to 30 min',
    summary: 'Your mind travels to a familiar place while awareness stays anchored. Stay a spectator, never drift into dream.',
    caution: 'Not when exhausted, right after eating, or when blood is drawn from the head. Slipping into memory/dream makes you an actor, not an observer — if it happens, try again with a different place.',
    steps: [
      'Prepare: bathe (shower is better), including mouth and teeth. Light garment. Quiet place. Comfortable chair with head support, or lie flat (armchair is better — lying makes sleep easy).',
      { t: 'Seven deep breaths, rhythmic: in 4, hold 11, out 7. Even and unhurried.', breath: { phases: [['Inhale', 4], ['Hold', 11], ['Exhale', 7]], reps: 7 } },
      'Close your eyes and visualize a place you know well in detail — shut out your real surroundings and build every detail: colors, lighting, arrangement, sounds, smells. See yourself there.',
      'Look around: furniture, any people and how they are dressed, what is said. Stay awake — do not slide into dream.',
      { t: 'Observe.', secs: 600 },
      'Bring your attention back to your body. Open your eyes — then write down the exact hour and everything you observed. Try, then test; try again.',
    ],
  },
  {
    id: 'p-etheric', cat: 'project', title: 'Etheric Projection', mins: 20, kind: 'review',
    freq: 'Serious experiment, not a game',
    summary: 'Resonance of OM lifted toward the ceiling while lying down.',
    caution: 'Good health required — not with any illness, even a head cold. No alcohol for 48 hours. Not exhausted or after eating. Cannot be used to spy or for any unworthy motive; lower emotions (jealousy, suspicion) snap you back. Set a worthwhile, non-selfish objective.',
    steps: [
      'Prepare: calm and serene. Bathe, holding the thought that fears and worries wash away. Clean garment; lie on a bed.',
      'Support habits: live peacefully day to day; meditate at least 15 min a day, raising your vibratory level; sincere silent intention to purify your nature.',
      'Close your eyes and raise consciousness to a point at the top of your head. Awareness of bed, coverlet, sounds, odors, air currents fades; concentrate at or above the crown.',
      'Intone softly and rhythmically "OM" seven times on D natural above middle C.',
      'Repeat the intonation silently seven times. You should become aware of a resonance inside your head.',
      'Concentrate on the core of the resonance and let it lift slowly toward the ceiling — the resonance ascends, not your body.',
      "Open your eyes. Don't be alarmed to find yourself above the bed. Don't feel shock seeing your body. Having shown you can, return immediately — by wishing to, or visualizing lying back into your body.",
    ],
  },
];

export const exById = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));

// Reminder slots (daily unless weekday is set). `pool` = exercise ids rotated by day on the Today screen.
export const SLOTS = [
  { id: 'wake', label: 'Morning energy', h: 7, m: 30, pool: ['energy-breath', 'child-sun'], title: 'Morning energy', body: 'Do the Energy-Building Breath. Then notice your first activity today — tonight you will recall it.' },
  { id: 'conc', label: 'Concentration', h: 12, m: 30, pool: ['conc-multiply', 'conc-poem', 'conc-stranger'], title: 'Concentration', body: 'Time for today\'s concentration exercise.' },
  { id: 'med', label: 'Meditation', h: 16, m: 0, pool: ['med-color', 'med-sound', 'med-cloud'], title: 'Meditation', body: 'Three minutes. Find a quiet chair.' },
  { id: 'recall', label: 'Evening recall', h: 20, m: 30, pool: ['obs-recall'], title: 'Evening recall', body: 'Recall your first activity this morning in as much detail as you can, then log it.' },
  { id: 'bed', label: 'Bedtime', h: 22, m: 0, pool: ['med-love', 'emo-borrowed'], title: 'Before bed', body: 'Close the day: send some love outward, and let go of any emotion that was not yours.' },
  { id: 'heart', label: 'Heart Center (weekly)', h: 18, m: 0, weekday: 1, pool: ['c-heart'], title: 'Heart Center', body: 'Your weekly Heart Center exercise. Dim room, 15 minutes.' },
];

export const NUDGES = [
  'Feel your feet on the floor. Where is your attention right now?',
  'Take one deep breath. Let your shoulders drop.',
  'Whose emotion is this — yours, or picked up from someone nearby?',
  'Slow down. Let someone go first, and smile about it.',
  'Check your posture: back straight, head erect, jaw loose.',
  'Close your eyes for a second. Name everything in the room you can recall.',
  'Notice the next thing you do automatically. Do it deliberately.',
  'Is your thinking orderly right now? Push out any negative thought as soon as you notice it.',
  'Send a quiet blessing to the next person you see.',
  'Feeling a craving? Redirect it, do not fight it.',
  'What is the quality of your breath at this moment — shallow or deep?',
  'Listen: pick out one single sound and follow it for ten seconds.',
  'Look at the next stranger\'s face. Look away, and hold it in your mind for a minute.',
  'Fear check: what is there to fear? You have faced this before.',
  'Notice something you usually miss about this place.',
  'Put the phone down for one minute. Just be here.',
  'Notice your first activity today — you will recall it tonight.',
  'Is this the higher or lower counterpart of what you are feeling?',
  'Rest your attention on your heart for three breaths.',
  'Unclench your jaw and hands. Notice what they were doing.',
  'Whatever you are doing, do it with your full attention for one minute.',
  'Notice the space around your body. How far does it feel like it extends?',
  'Count the steps next time you take the stairs.',
  'A thought is pulling you away. Return to what you are doing.',
  'Quiet the mind, not the feeling: observe it without being carried along.',
  'Drink some water. Notice it.',
  'Are you rushing? There is nothing here to rush for.',
  'Soften your eyes. Take in the whole view at once.',
];

export const GAIN = [
  { id: 'g-breath', label: 'Energy-Building Breath' },
  { id: 'g-sun', label: 'Child of the Sun' },
  { id: 'g-diet', label: 'Ate and drank what actually agrees with YOU (not habit or custom)' },
  { id: 'g-move', label: 'Mild exercise to keep the blood circulating' },
  { id: 'g-bath', label: 'Bathed / cleanliness' },
  { id: 'g-med', label: 'Meditated (15+ min is the baseline in the Projection guide)' },
  { id: 'g-redirect', label: 'Redirected an urge instead of suppressing it' },
  { id: 'g-think', label: 'Kept thinking orderly and positive; sent a blessing outward' },
];

export const DRAINS = [
  { t: 'Suppressing desire or emotion', d: 'Suppression always ends in an explosion. Redirect it instead.' },
  { t: 'Lower emotions', d: 'Jealousy, suspicion and fear lower your vibratory state — in projection they break it instantly.' },
  { t: "Absorbing other people's emotions", d: 'Closer bodies transfer more. Ask "whose emotion is this?" and step out of it.' },
  { t: 'Chaotic or distorted thinking', d: 'Think in an orderly, logical, precise way. Watch prejudice and its consequences.' },
  { t: 'Using the will to force a feeling down', d: 'Use the mind (self-talk), not the will.' },
  { t: 'Practicing exhausted, right after eating, or ill', d: 'Blood needs to be in the brain; illness and imbalance spoil the work.' },
  { t: 'Alcohol before projection', d: 'None for at least 48 hours before an etheric projection attempt.' },
  { t: 'Frivolous or selfish motives', d: 'Your subconscious will not permit success. Set a worthwhile objective.' },
  { t: 'Rushing the center sequence', d: 'Heart before throat or head; pituitary before pineal. Jumping ahead does no good.' },
];

export const CHAKRAS = [
  { n: 1, name: 'Earth', sk: 'Muladhara (Root)', seed: 'LAM', loc: 'Base of the spine', block: 'Fear', gland: 'Adrenal glands', note: 'Reproductive/root center — activating, creative energy; comfort, food, feeling safe.' },
  { n: 2, name: 'Water', sk: 'Svadhisthana (Sacral)', seed: 'VAM', loc: 'Sacrum / lower abdomen', block: 'Guilt', gland: 'Gonads', note: 'Consumption, metabolism, homeostasis. If you feel unsafe, energy moves up and out rather than settling here.' },
  { n: 3, name: 'Fire', sk: 'Manipura (Solar Plexus)', seed: 'RAM', loc: 'Stomach / solar plexus', block: 'Shame', gland: 'Pancreas', note: 'The center you overcome with willpower — energy moves up through here rather than staying stuck.' },
  { n: 4, name: 'Air', sk: 'Anahata (Heart)', seed: 'YAM', loc: 'Center of chest', block: 'Grief', gland: 'Thymus', note: 'Where you express your greatest love or truth.' },
  { n: 5, name: 'Sound', sk: 'Vishuddha (Throat)', seed: 'HAM', loc: 'Throat', block: 'Lies', gland: 'Thyroid', note: 'Where you express your greatest understanding.' },
  { n: 6, name: 'Light', sk: 'Ajna (Third Eye)', seed: 'OM (sometimes SHAM)', loc: 'Forehead, between the brows', block: 'Illusion', gland: 'Pineal', note: 'Once energy is moved here it naturally continues upward on its own.' },
  { n: 7, name: 'Thought', sk: 'Sahasrara (Crown)', seed: 'Silence (sometimes OM)', loc: 'Top of the head', block: 'Earthly attachment', gland: 'Pituitary', note: 'If you are worthy enough to receive, this is where energy transcends into gratitude.' },
];

export const CHAKRA_INTRO = 'Chakras ("wheels") are energy transformers: raw life energy takes on the quality of whichever chakra converts it. In the average person the solar plexus is most open, which is why most people are emotionally focused — and why emotional control comes first. Sources: Guru Pathik (Avatar), Joe Dispenza, and the First Steps book; they all draw on the same older tradition.';

export const CYCLES = {
  note: 'Work in progress — only the end of the Second Period and the Third Period have come through. Dates are filled in personally.',
  periods: [
    {
      name: 'End of Second Period (partial)',
      intro: 'A very good period for businesses catering to transients — hotels, restaurants, car rentals.',
      good: [],
      bad: ['Planning a change of business or starting a new career', 'Making any permanent change', 'Entering long-lasting contracts or arrangements', 'Borrowing or lending money', 'Starting construction on a building', 'Entering a project requiring substantial investment', 'Speculating in the stock market or gambling'],
    },
    {
      name: 'Third Period',
      intro: 'Calls for discrimination and good judgment. Usually a great inflow of energy — the best time to improve health, build a business, or do anything requiring real energy. Catch: you will be tempted by projects with no real chance, or that take so long you abandon them.',
      good: ['Overcoming obstacles that have blocked progress', 'A strong second effort on problems abandoned for lack of energy', 'Things requiring great energy — iron and steel, electrical machinery, cutlery, sharp instruments, fire', 'Opposing competitors or dealing with people who have been obstacles', 'Women appealing to men for favors, preferment, or aid (especially good)', 'Selling — if it can be put across in one forceful interview, this is the best period'],
      bad: ['Men or women trying to deal with women', 'Arguments and strife in general — the outcome is apt to be bad'],
    },
  ],
};
