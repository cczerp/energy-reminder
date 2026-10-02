# Mindful — meditation & energy reminder app

Offline phone app built from the First Steps guides. No internet, no account: everything is stored on the phone.

**What it does**
- **Reminders** (Settings): daily practice slots (morning energy, concentration, meditation, evening recall, bedtime, weekly Heart Center) plus 1–10 random mindfulness nudges per day inside hours you choose. Scheduled on the device itself.
- **Practice**: every exercise from the guides with steps, cautions, and a **guided mode** (timers for the 1-minute holds, breath counters like in 5 / hold 5 / out 10 × 10, keeps the screen awake, vibrates at transitions). Psychic-center exercises stay marked 🔒 until you tick the prerequisite milestones (Heart → Pituitary → Pineal → Throat → Attunement).
- **Log**: notes after any exercise (focus rating + free text), the **evening recall** of your first morning activity (free text + detail count + accuracy), and a **Progress** tab: streak, 14-day practice strip, recall-details chart with trend.
- **Energy**: daily checklist of energy-building habits and a list of what drains energy.
- **Reference**: chakras and life cycles.
- **Backup**: export all data as text via the share sheet; restore by pasting.

**Run it**
```
cd mindful-app
npm install
npx expo start        # scan the QR with Expo Go to try it on a phone
```
**Install it as a real app (Android)**: `npx eas-cli build -p android --profile preview` produces an APK you can sideload (needs a free Expo account for the cloud build).
Scheduled reminders work in the installed app; Expo Go on Android can't deliver them reliably.

Content lives in `src/content.js` — edit exercises, nudges, and reminder text there.
