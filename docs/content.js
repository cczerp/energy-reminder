// All exercise and reminder content.
// A step is a string, or { t, secs } (timed), { t, open:true } (count-up, move on when ready),
// or { t, breath: { phases:[[label,secs]...], reps } }.

export const CATS = {
  energy: 'Energy & healing',
  balance: 'Counterbalance',
  observe: 'Observation',
  concentrate: 'Concentration',
  meditate: 'Meditation',
  emotion: 'Emotional control',
  journey: 'Inner journeys',
  living: 'Living practices',
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
    summary: 'Wash healing energy over the body; it can also help you pinpoint problem areas.',
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
    id: 'obs-room', cat: 'observe', title: 'New-Room Recall', mins: 0,
    freq: 'Whenever you step into a different room or space — even at home, where things move and change',
    summary: 'Name what you recall in depth and accuracy, until you cannot think of any more. Give it 2–3 weeks before it fully clicks.',
    steps: [
      'Walk into a different room or space (even in your own home — things are always moving and changing). Look around for a moment.',
      { t: 'Close your eyes and name every object you can recall: where it is, its color, its size, what is near it. Ramble on in as much depth and accuracy as you can, until you cannot think of any more. Speed does not matter.', open: true },
      'Open your eyes and check: what did you miss, and what did you get wrong?',
    ],
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
    // The id stays 'emo-matches' (it began as the Matchbox Drill) so saved settings and tallies carry over.
    id: 'emo-matches', cat: 'emotion', title: 'Patience Drill', mins: 10,
    freq: 'Once or more daily until mastered',
    summary: 'Put a jumble in order, slowly and calmly, one piece at a time. Patience and a steady mind under a fiddly task — and a more orderly space.',
    steps: [
      `Choose your jumble.

SMALL PILES (you can scramble them again and repeat):
• A deck of cards: shuffle, then put it in order by suit and number.
• Coins: mix a handful, sort into piles, and stack each pile with every head facing the same way.
• Buttons, screws, or beads: sort by type into small dishes.
• The original: dump a box of matches, mix them well, and put them all back with every head pointing the same way. Handle matches carefully and away from any flame. Toothpicks or bobby pins work too.
• Untangle a necklace, earbud cord, or string of lights. Pulling harder only tightens it, so ease it out.
• Pair up a pile of mismatched socks.

SPACES TO PUT IN ORDER (bigger jobs, good for a clean, livable home; do them in pieces):
• Pantry or canned goods: group by type, labels facing out.
• Spice rack: alphabetical, or by how you use them.
• Bookshelf: by author, subject, or size.
• Movies, music, or games: alphabetical.
• A junk drawer, a closet shelf, or a toolbox.`,
      'Set it up. For a small pile, dump it out and mix it thoroughly. For a space, start with one shelf or one section and take everything out of just that part.',
      { t: 'Put it in order slowly. Handle one item at a time, with a calm face. When you feel the urge to hurry, or irritation, or boredom, notice it, take a breath, and carry on gently. That is the exercise. Take as long as you need.', open: true },
      'Finish where you can. A big space can be done in pieces, and you can come back to it later. There is no need to feel bad about leaving it half done. Look at what you put in order, and notice how it feels to see it clear.',
    ],
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

export const CHAKRA_INTRO = 'Chakras ("wheels") are energy transformers: raw life energy takes on the quality of whichever chakra converts it. In the average person the solar plexus is most open, which is why most people are emotionally focused — and why emotional control comes first. These ideas come from a long, shared tradition.';

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

// Chakra alignment walkthrough. Deliberately ends on its own — it never chains into the Combined Attunement.
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


// Practices drawn from Dolores Cannon's teachings, rewritten in this app's own words.
EXERCISES.push(
  {
    id: 'med-quiet', cat: 'meditate', title: 'Quiet Listening', mins: 10,
    freq: 'Daily if you can, 10–15 minutes',
    summary: 'Be alone in quiet and go within. You are not trying to do anything, only to listen.',
    steps: [
      'Find somewhere quiet where you will not be interrupted. Silence the phone. Sit or lie comfortably and close your eyes.',
      'Let your attention turn inward. When thoughts come, do not argue with them or analyze them. Let them pass, and go back to listening.',
      { t: 'Simply listen. Intuition, pictures, feelings, or a quiet knowing may come, or nothing at all. Both are fine. Pick your length, then start.', pick: [600, 900], secs: 600 },
      'Come back slowly. Take a deep breath. If anything came up, you can note it in your log.',
    ],
  },
  {
    id: 'energy-direct', cat: 'energy', title: 'Call the Energy In', mins: 8,
    freq: 'Whenever the body needs it', summary: 'Focus on a part of the body, call energy to it, and let it flow wherever it is needed. Intention and belief direct it.',
    caution: 'This supports healing and does not replace medical care. See a doctor for anything that worries you or lasts.',
    steps: [
      'Lie down or sit comfortably and let your body settle. Breathe slowly and deeply.',
      'Bring your attention to the area that needs help. Rest your hands there if you like.',
      'Call the energy in: picture warm light gathering around you and flowing toward that area. Believe it is happening.',
      { t: 'Let it flow wherever it is needed. The body knows what to repair, so do not direct the details. Keep your attention gently on the area.', pick: [300, 480, 720], secs: 480 },
      'Thank your body. Take a deep breath and come back.',
    ],
  },
  {
    id: 'j-stair', cat: 'journey', title: 'The Staircase Journey', mins: 30,
    freq: 'When you have 30 quiet minutes',
    summary: 'Relax deeply, go down a staircase, and let a scene appear. Then ask what you want to know. The only rule is: allow it.',
    caution: 'Do this lying down somewhere safe and never while driving. If anything upsets you, open your eyes, breathe, and stop. You are always in control.',
    steps: [
      'Lie down, close your eyes, and let your breathing slow. Do not worry about doing it right.',
      { t: 'Relax from the top of your head to your toes. Tell each part to let go: face, jaw, neck, shoulders, arms, chest, belly, hips, legs, feet. Take your time. Pick your length.', pick: [120, 240, 360], secs: 240 },
      'Picture the top of a staircase. Count down from 10 to 1, one step per number, and feel yourself going deeper and more relaxed with every step.',
      'At the bottom, step into "the most appropriate time and place" for you right now. It may be a scene, a memory, a feeling, or only a color. Whatever it is, accept it.',
      { t: 'Allow it. Do not analyze, judge, or fix what comes. Just notice what you see, hear, and feel, and let it unfold. Pick your length.', pick: [300, 600, 900], secs: 600 },
      'When you are ready, ask a question you want answered, or ask for what you need to know. Answers may come as pictures, feelings, or a sudden knowing. Wait quietly.',
      'Thank whatever you met. Climb the staircase, counting from 1 to 10. At 10, take a deep breath and open your eyes. Write down what you remember before it fades.',
    ],
  },
  {
    id: 'j-library', cat: 'journey', title: 'The Library — Book of Your Life', mins: 20,
    freq: 'When you want memories, knowledge, or guidance', summary: 'Walk into a vast library, find the book of your life, and read what you are shown.',
    caution: 'Lie down somewhere safe. If anything upsets you, open your eyes and stop.',
    steps: [
      'Lie down, close your eyes, breathe slowly, and relax your body from head to toe. A few minutes is enough.',
      'Picture a path leading to a door. Walk to it and open it.',
      'Step into a vast library. Look around: the shelves, the light, the quiet.',
      'Find the book of your life. It may call to you. Take it down and open it.',
      { t: 'Read, or let the pages show you. Allow whatever comes: memories, pictures, words, a feeling of knowing. Do not judge it. Pick your length.', pick: [300, 600], secs: 300 },
      'Ask the book a question, and turn to the page that answers it.',
      'Close the book, return it, thank the library, and walk back out the door. Take a deep breath, open your eyes, and write down what you were shown.',
    ],
  },
  {
    id: 'j-guide', cat: 'journey', title: 'Meet Your Guide or Higher Self', mins: 20,
    freq: 'When you want direct guidance', summary: 'In deep relaxation, meet your guide or Higher Self in a beautiful place and ask questions.',
    caution: 'Lie down somewhere safe. If anything upsets you, open your eyes and stop.',
    steps: [
      'Lie down, close your eyes, breathe slowly, and relax from head to toe.',
      'Picture a beautiful, peaceful place: a garden, a meadow, a shore. Feel the air, hear the sounds, take your time arriving.',
      'Ask to meet your guide or your Higher Self. Wait. They may appear as a person, a light, or only a presence.',
      { t: 'Ask your questions, one at a time, and wait after each. Answers may come as pictures, feelings, or knowing. Accept them without judging. Pick your length.', pick: [300, 600], secs: 300 },
      'Thank them, and ask how to reach them again. Then walk back out of the place, take a deep breath, and open your eyes. Write down what you were told.',
    ],
  },
  {
    id: 'live-vibe', cat: 'living', title: 'Raise Your Vibration', mins: 3,
    freq: 'Every day, a few times', summary: 'Vibration rises through what you think, feel, and do. Love and gratitude raise it. Fear lowers it.',
    steps: [
      'Think of three things you are grateful for. Feel each one, not only name it.',
      'Is there a fear running in the background? Name it, and then choose not to stay in it.',
      'Do one thing now that comes from love or kindness: a message, a thank-you, a small favor.',
      'Picture yourself filling with light, then the room, then the whole world. Hold it for a few breaths.',
    ],
  },
  {
    id: 'live-speech', cat: 'living', title: 'Say It as True — "I Am"', mins: 0,
    freq: 'All day, as practice', summary: 'Your words shape what you attract. Drop "I want", which announces lack. Say it as already true.',
    steps: [
      'For today, listen to your own speech. Each time you hear yourself say "I want…", pause.',
      'Say it again in the present tense as if it is already so: "I am…", "I have…". For example, "I am healthy" instead of "I want to be healthy".',
      'Keep it truthful and kind. This is not for denying a real problem you need to deal with.',
      'Also notice what you say about yourself in passing. Do not say things you would not want to be true.',
    ],
  },
  {
    id: 'live-body', cat: 'living', title: 'Listen to Your Body', mins: 3,
    freq: 'A few times a day', summary: 'Cravings, aches, and aversions are messages. Learn to listen rather than override.',
    caution: 'Pain that is new, severe, or lasting needs a doctor. Listening to your body does not replace medical care.',
    steps: [
      'Pause and scan from head to feet. Where is there tension, ache, heaviness, or ease?',
      'What does the body crave right now? Water, food, rest, movement, fresh air, quiet? What does it turn away from?',
      'Ask the part that speaks up: "What do you need?" Wait for a feeling or an idea.',
      'Do one small thing it asked for. Notice how it responds.',
    ],
  },
  {
    id: 'live-now', cat: 'living', title: 'Here and Now — Letting Go', mins: 3,
    freq: 'Whenever you are stuck in the past or future', summary: 'Release what is behind you, stop rehearsing what is ahead, and be fully here. This is where your energy works.',
    steps: [
      'Take three slow breaths. With each out-breath, let your shoulders fall.',
      'Name one thing from the past you keep replaying. Say: "That is done. I let it go."',
      'Name one thing in the future you keep worrying about. Say: "I will deal with it when it is here."',
      'Notice what you can see, hear, and feel right now. Give this moment your full attention for a minute.',
    ],
  },
  {
    id: 'live-clean', cat: 'living', title: 'Clean Body, Clean Mind', mins: 0,
    freq: 'Daily habits', summary: 'A clean body holds energy better, and so does a clean mind.',
    caution: 'Check with a doctor before fasting or big diet changes, especially if you have a medical condition or take medicine.',
    steps: [
      'Drink pure water through the day.',
      'Choose vegetables and fruit, and notice how your body responds to what you eat.',
      'Go easy on alcohol, drugs, sugar, and heavily processed food.',
      'Cleanse or rest from food only when your body is clearly asking for it, and safely.',
      'Clean the inputs too: toxic media, fear-driven news, and endless drama. Choose what you let in.',
    ],
  },
  {
    id: 'live-dos', cat: 'living', title: "Do's and Don'ts for Life", mins: 0,
    freq: 'Read now and then', summary: 'Twenty reminders to live by, drawn from the teachings above.',
    steps: [
      'DO\n1. Meditate daily and seek quiet. Go within and listen.\n2. Watch your thoughts and words. Speak what you want as present tense, "I am", not "I want".\n3. Release fear. It is the biggest block.\n4. Eat high-vibration food: vegetables, fruit, pure water.\n5. Follow your passion. It is what you came to do.\n6. Practice love, compassion, and non-judgment, especially toward yourself.\n7. Trust your intuition and your body.\n8. Surround yourself with uplifting people and media, and get out in nature often.\n9. Let go of the past and live now.\n10. Be of service. Help others wake up by being an example.',
      "DON'T\n1. Don't soak in fear-based news or negativity.\n2. Don't speak lack. Skip \"I want\".\n3. Don't let the critical mind override what you sense.\n4. Don't judge or condemn others. Different paths, same destination.\n5. Don't dwell on drama, grudges, or the past.\n6. Don't poison the body: excess alcohol, drugs, sugar, processed food.\n7. Don't hand your choices to anyone, not gurus, governments, or doctors. Take their advice, then decide for yourself, and keep seeing your doctor.\n8. Don't resist change. Flow with it.\n9. Don't ignore your body or its messages.\n10. Don't take \"I don't belong here\" as the truth. You came here on purpose. If that feeling is heavy or you think of ending your life, reach out now: in the US call or text 988.",
    ],
  },
);

export const exById = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));

// ---------- Reminders ----------
// Every exercise below has its own on/off and times-per-day. The three "out in the world" exercises
// (SPOT) can also fire at random times or when you leave home.
export const REMIND_GROUPS = [
  // pool = exercises a timed reminder can ask for; leave = optional exercises that only fire when you leave home; ids = everything in the category
  { id: 'obs', cat: 'observe', label: 'Observation', pool: ['obs-room'], leave: ['obs-stairs'], ids: ['obs-room', 'obs-stairs'] },
  { id: 'conc', cat: 'concentrate', label: 'Concentration', pool: ['conc-multiply', 'conc-poem'], leave: ['conc-stranger'], ids: ['conc-multiply', 'conc-poem', 'conc-stranger'] },
  { id: 'med', cat: 'meditate', label: 'Routine meditation', simple: true, pool: ['med-sit', 'med-quiet', 'med-love', 'energy-direct', 'j-stair', 'j-library', 'j-guide'], leave: [], ids: ['med-sit', 'med-quiet', 'med-love', 'energy-direct', 'j-stair', 'j-library', 'j-guide'] },
  { id: 'medp', cat: 'meditate', label: 'Meditation practice', pool: ['med-color', 'med-sound', 'med-cloud'], leave: [], ids: ['med-color', 'med-sound', 'med-cloud'] },
  { id: 'emo', cat: 'emotion', label: 'Emotional control', pool: ['emo-matches', 'emo-tv', 'emo-slow'], leave: [], ids: ['emo-matches', 'emo-tv', 'emo-slow'] },
];
export const CAT_LABEL = Object.fromEntries(REMIND_GROUPS.flatMap((g) => g.ids.map((id) => [id, g.label])));
// goal = how many times you want to do it each day. n = reminders per day (they keep coming until the goal is met). timing: 'set' (times you pick) | 'even' (spread through the day) | 'random'.
// choose: when a reminder rings and several exercises are selected, let you pick (otherwise it picks one for you).
export const REMIND_DEFAULTS = {
  day: { s: 7, e: 22 }, // hours random/even reminders and sayings may appear
  leave: { s: 6, e: 24, n: 2 }, // hours "when I leave home" reminders may appear
  cat: {
    obs: { on: true, ex: ['obs-room', 'obs-stairs'], goal: 1, n: 1, timing: 'random', times: [720], choose: true },
    conc: { on: true, ex: ['conc-multiply', 'conc-poem', 'conc-stranger'], goal: 1, n: 1, timing: 'even', times: [780], choose: true },
    med: { on: true, ex: ['med-sit', 'med-quiet', 'med-love', 'energy-direct', 'j-stair', 'j-library', 'j-guide'], goal: 1, n: 1, timing: 'even', times: [480], choose: true },
    medp: { on: true, ex: ['med-color', 'med-sound', 'med-cloud'], goal: 1, n: 1, timing: 'even', times: [1020], choose: true },
    emo: { on: true, ex: ['emo-matches', 'emo-tv'], goal: 1, n: 1, timing: 'random', times: [900], choose: true },
  },
  leaveItems: { 'obs-stairs': true, 'conc-stranger': true }, // fire only when you leave home
  mind: { on: true, n: 5 },
  recall: { on: true, h: 20, m: 30 }, // evening recall (part of Observation): once a night at its own time
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
  'Allow it. Do not analyze or judge what comes up. Just let it be there.',
  'Ten or fifteen minutes of quiet today. Go within and simply listen.',
  'Fear lowers your frequency and love raises it. Which one are you feeding?',
  'Say it as already true: "I am…", not "I want…".',
  'Catch one "I want" today and turn it into "I am".',
  'Your body is talking: a craving, an ache, an aversion. Listen instead of overriding it.',
  'Let the past go and stop rehearsing the future. This moment is where you act.',
  'Pure water, fruit, vegetables. What does your body actually ask for today?',
  'Is what you are watching or reading feeding fear? Change the channel.',
  'Judgment, especially of yourself, poisons the well. Put it down for one minute.',
  'Different paths, same destination. Let someone else walk theirs.',
  'Get outside. A few minutes in nature resets the day.',
  'Your intuition has answers. Ask, then be quiet and listen.',
  'Do what lights you up. It is part of what you came here to do.',
  'Help someone today, or simply be an example. That wakes others up.',
  'Watch your words today. Choose what you say.',
  'You chose to be here, on purpose.',
  'Take advice from anyone, then decide for yourself.',
  'Picture light filling you, the room, and the whole world, for one breath.',
  'A thought is pulling you away. Return to what you are doing.',
  'Are you rushing? There is nothing here to rush for.',
  'Soften your eyes. Take in the whole view at once.',
];

// Short text for reminder notifications.
export const PING = {
  'med-quiet': 'Quiet time: 10–15 minutes alone in silence. Go within and simply listen.',
  'med-sit': 'Sit for 5–10 minutes and meditate in whatever way you choose. Your daily baseline.',
  'obs-room': 'Walk into a different room. Close your eyes and name everything you recall — depth and accuracy, until you run out.',
  'obs-stairs': 'Next time you take any steps, count them, then recall the number.',
  'conc-multiply': 'Multiply two 2-digit numbers in your head. Then two 3-digit ones.',
  'conc-poem': 'Memorize 4 lines of a poem and recite them.',
  'conc-stranger': 'Next stranger you pass: study the face, look away, hold it in your mind for a minute.',
  'med-color': 'Three minutes: blue, pink, white — one minute each.',
  'med-sound': 'Three minutes: violin, horn or sax, piano — one minute each.',
  'med-cloud': 'One minute wrapped in a pink cloud.',
  'emo-matches': 'Patience drill: pick a jumble (cards, coins, a shelf) and put it in order slowly and calmly.',
  'emo-tv': 'Attention drill: TV on, picture off. Tune out the picture.',
  'emo-slow': 'Slowing-down practice: let others go first, with a genuine smile.',
};
