// All guide content, converted from the First Steps guides.
// A step is a string, or { t, secs } (timed), { t, open:true } (count-up, move on when ready),
// or { t, breath: { phases:[[label,secs]...], reps } }.

export const CATS = {
  energy: 'Energy & healing',
  balance: 'Counterbalance',
  observe: 'Observation',
  concentrate: 'Concentration',
  meditate: 'Meditation',
  emotion: 'Emotional control',
  centers: 'Psychic centers',
  chakra: 'Chakra alignment',
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
    ],
  },

  {
    id: 'heal-headache', cat: 'energy', title: 'Quick Headache Relief', mins: 4,
    freq: 'When asked', summary: 'Energy in through the right hand, out through the left (3–4 min).',
    caution: 'Wash hands before and after. Light fingertip contact only.',
    steps: [
      "Tips of the first two right-hand fingers on the patient's left temple; index + middle of the left hand lightly on the right temple.",
      { t: 'Visualize energy flowing in through the right hand and out through the left.', secs: 180 },
    ],
  },
  {
    id: 'energy-habits', cat: 'energy', title: 'Supporting Habits', mins: 0,
    freq: 'Daily', summary: 'The everyday habits that keep the energy reserve up.',
    steps: [
      "Watch diet and drink for what actually agrees with YOU, not what's habit or custom.",
      'Daily mild exercise to keep the blood circulating.',
      'Daily bathing / cleanliness.',
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
    id: 'med-sit', cat: 'meditate', title: 'Daily Sit — your choice', mins: 5,
    freq: 'At least once a day, 5–10 minutes',
    summary: 'Your baseline: sit and meditate in any way you like, even if only for 5 minutes.',
    steps: [
      'Find a quiet spot. Sit in a straight-back chair, back straight, head erect, eyes closed — or sit however is comfortable for you.',
      { t: 'Meditate in whatever way you choose: breath, a mantra, stillness, or one of the practices. Pick your length, then start.', pick: [300, 600], secs: 300 },
      'Rise, deep breath, relax.',
    ],
  },
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
    id: 'funk-reset', cat: 'emotion', title: 'Funk Reset (about 1 minute)', mins: 1,
    freq: 'Any time you are stuck in a negative loop',
    summary: 'A quick sequence of tools to step out of a funk. Pick what works and drop the rest.',
    steps: [
      { t: 'Slow your body first. Breathe in 4, hold 2, out 6.', breath: { phases: [['Breathe in', 4], ['Hold', 2], ['Out slowly', 6]], reps: 4 } },
      'Look around. Name 5 things you can see, 4 you can hear, 3 you can feel. Go slowly.',
      'Is this feeling yours, or picked up from someone or something nearby? If it is borrowed, step out of it like stepping out of a room.',
      'Redirect, do not fight it. Choose one small thing to do right now: stand up, drink water, step outside, walk into another room.',
      'Fear check: What is there to fear? I am secure. I have faced this before. Use your mind, not your will.',
      { t: 'Put on one of your songs and let it do its work.', music: true },
    ],
  },
  {
    id: 'emo-slow', cat: 'emotion', title: 'Deliberate Slowing-Down', mins: 0,
    freq: 'A full month, all day', summary: 'Let others go first — with a genuine smile.',
    steps: ['For a full month: let others go first — walking, driving (yield right of way, drive under the limit), entering/leaving rooms, planes, trains. Do it all with a genuine smile and a cheerful attitude.'],
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

// Chakra alignment walkthrough (Dispenza method). Deliberately ends on its own — it never chains into the Combined Attunement.
EXERCISES.push({
  id: 'c-chakra', cat: 'chakra', title: 'Chakra Alignment Walkthrough', mins: 20,
  freq: 'In a calm theta/alpha state', summary: "Attention in each chakra's area, root to crown, until it feels coherent. Works on its own; it is not part of the attunement.",
  steps: [
    'Focus on the outer body and the space around the body. Let the sense organs become aware of the space around them.',
    'Narrow the focus outward, then move inward — feel the outer body, then the breath. Take all thoughts and let them go, returning to focus.',
    'Precision is not required: get your attention into the general area of each chakra. Attention is the mechanism. Hold it there until that center feels settled, aligned, coherent with the rest of your body — then move up.',
    ...CHAKRAS.map((c) => ({
      t: `${c.n}. ${c.name} — ${c.sk}\nLocation: ${c.loc}.  Seed sound: ${c.seed}.\nBring your attention into this area and hold it until it feels coherent with the rest of your body.${c.n > 1 ? ' Each one takes less effort than the last.' : ''}`,
      open: true,
    })),
    'Focus on the vastness of the quantum realm. Hold the feeling of wholeness. Then let it go — you are finished.',
  ],
});

export const exById = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));

// ---------- Reminders ----------
// Every exercise below has its own on/off and times-per-day. The three "out in the world" exercises
// (SPOT) can also fire at random times or when you leave home.
export const REMIND_GROUPS = [
  { id: 'obs', cat: 'observe', label: 'Observation', ids: ['obs-room', 'obs-stairs'] },
  { id: 'conc', cat: 'concentrate', label: 'Concentration', ids: ['conc-multiply', 'conc-poem', 'conc-stranger'] },
  { id: 'med', cat: 'meditate', label: 'Meditation', ids: ['med-sit', 'med-color', 'med-sound', 'med-cloud'] },
  { id: 'emo', cat: 'emotion', label: 'Emotional control', ids: ['emo-matches', 'emo-tv', 'emo-slow'] },
];
export const LEAVE_OK = ['obs', 'conc']; // categories that may fire "when I leave home"
export const CAT_LABEL = Object.fromEntries(REMIND_GROUPS.flatMap((g) => g.ids.map((id) => [id, g.label])));
// One goal per category per day. Any exercise in the category completes it, and completing it silences that category's later reminders.
export const REMIND_DEFAULTS = {
  day: { s: 7, e: 22 }, // hours random reminders and sayings may appear
  leave: { s: 6, e: 24 }, // hours "when I leave home" reminders may appear
  cat: {
    obs: { on: true, ex: ['obs-room', 'obs-stairs'], timing: 'random', h: 12, m: 0 },
    conc: { on: true, ex: ['conc-multiply', 'conc-poem', 'conc-stranger'], timing: 'leave', h: 13, m: 0 },
    med: { on: true, ex: ['med-sit', 'med-color', 'med-sound', 'med-cloud'], timing: 'time', h: 8, m: 0 },
    emo: { on: true, ex: ['emo-matches', 'emo-tv'], timing: 'random', h: 15, m: 0 },
  },
  mind: { on: true, n: 5 },
  recall: { on: true, h: 20, m: 30 }, // evening recall: once a day, at night
  home: null, // { latitude, longitude, r } for "when I leave home"
  playlist: '', // link to the funk playlist
};

// Mindfulness sayings: habit notes, emotional-mastery techniques, supporting habits, and energy do's/don'ts.
export const NUDGES = [
  // mental habit notes
  'Think in an orderly, logical, precise way. Push out a negative thought as soon as you notice it.',
  'Watch for distorted thinking and prejudice. Notice what it does to you.',
  'Adopt a positive attitude. Send a quiet blessing outward — your own projects grow through it.',
  // emotional mastery
  'Feeling a craving? Do not fight it — redirect it. Take the better thing instead of nothing.',
  'Every emotion has a higher and a lower side. Which one is this? Shift toward the higher.',
  'Fear: what is there to fear? You are secure. You have faced this before. Use your mind, not your will.',
  'Whose emotion is this — yours, or picked up from someone nearby?',
  'A borrowed feeling: step out of it, like stepping out of a room. Keep it only if you want it.',
  'Do not just block a feeling down. Suppression ends in an explosion; redirection does not.',
  'Closer bodies share more emotion. Give yourself some distance if you need it.',
  // supporting habits and do/don't
  'Eat and drink what actually agrees with YOU, not what is habit or custom.',
  'A little mild exercise keeps the blood circulating. Stand up and move.',
  'Clean and refreshed: a bath or shower washes away worries too.',
  'Jealousy, suspicion, fear: lower emotions lower your energy. Notice, and let them go.',
  'Do not rush the sequence of your practice. Heart before throat or head.',
  'Take a breath in, hold, and let it go slowly. Store a little energy.',
  'Picture the sun for a moment. Let its energy flow through you.',
  'Is your motive worthwhile and unselfish? Check it before you begin anything important.',
  // everyday mindfulness
  'Put on one of your songs. Let it do its work.',
  'Feel your feet on the floor. Where is your attention right now?',
  'Take one deep breath. Let your shoulders drop.',
  'Slow down. Let someone go first, and smile about it.',
  'Check your posture: back straight, head erect, jaw loose.',
  'Notice the next thing you do automatically. Do it deliberately.',
  'What is the quality of your breath right now — shallow or deep?',
  'Listen: pick out one single sound and follow it for ten seconds.',
  'Notice something you usually miss about this place.',
  'Put the phone down for one minute. Just be here.',
  'Notice your first activity today — tonight you will recall it.',
  'Rest your attention on your heart for three breaths.',
  'Unclench your jaw and hands. Notice what they were doing.',
  'Whatever you are doing, give it your full attention for one minute.',
  'Notice the space around your body. How far does it feel like it extends?',
  'A thought is pulling you away. Return to what you are doing.',
  'Are you rushing? There is nothing here to rush for.',
  'Soften your eyes. Take in the whole view at once.',
];

// Short text for reminder notifications.
export const PING = {
  'med-sit': 'Sit for 5–10 minutes and meditate in whatever way you choose. Your daily baseline.',
  'obs-room': 'Walk into another room. Close your eyes for a second and name every object you can recall.',
  'obs-stairs': 'Next time you take any steps, count them, then recall the number.',
  'conc-multiply': 'Multiply two 2-digit numbers in your head. Then two 3-digit ones.',
  'conc-poem': 'Memorize 4 lines of a poem and recite them.',
  'conc-stranger': 'Next stranger you pass: study the face, look away, hold it in your mind for a minute.',
  'med-color': 'Three minutes: blue, pink, white — one minute each.',
  'med-sound': 'Three minutes: violin, horn or sax, piano — one minute each.',
  'med-cloud': 'One minute wrapped in a pink cloud.',
  'emo-matches': 'Matchbox drill: mix the matches, then box them all tips the same way.',
  'emo-tv': 'Attention drill: TV on, picture off. Tune out the picture.',
  'emo-slow': 'Slowing-down practice: let others go first, with a genuine smile.',
};
