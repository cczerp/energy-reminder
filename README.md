# Mindful — meditation & mindfulness reminder app

An offline-capable web app (PWA) built from the First Steps guides. No account, no server: everything is stored on the phone. Source lives in `docs/` (plain HTML/JS, no build step).

## Install on Android (recommended: the native app)
1. On GitHub open **Releases → "Mindful (latest Android build)"** and download `mindful.apk` on your phone (built automatically by `.github/workflows/android.yml` on every push; first install asks to allow "install unknown apps" for your browser).
2. Open Mindful → **Settings → Allow notifications** (and allow exact alarms when asked).
3. For "when I leave home" reminders: Settings → set home, and give the app location access **"Allow all the time"**.

The native app is the same code as the web app, wrapped with Capacitor. It needs no internet permission at all and schedules real on-device alarms, so reminders ring when the app is closed.

## Install on Android (web version)
Settings → Pages → deploy `main` / `/docs`, open `https://cczerp.github.io/energy-reminder/` in Chrome → Install app. Notifications only fire while it is open.

## What it does
- **Reminders** (Settings): every exercise from the Mental Training guide has its own on/off and its own times-per-day — Observation, Concentration, Meditation, Emotional control. New-Room Recall, Stair Count and The Stranger's Face can fire at **random times** or **when you leave home**. Evening recall is once a night. Each reminder has **See rules** and **Completed** buttons, and Today keeps a daily tally per exercise (tap **+ Done** or finish a guided run). Mindfulness sayings have their own rate. Reminder hours are adjustable.
- **Mindfulness sayings**: the mental-habit notes, emotional-mastery techniques, supporting habits, and energy do's/don'ts, as short reminders.
- **Practice**: every other exercise — Energy & healing (all of Healing Through Psychic Energy), Counterbalance, Meditation of Love, the Psychic Centers path (locked until the earlier stage is ticked), the Chakra Alignment Walkthrough (stands alone, never leads into the attunement), and Projection — each with a guided mode: timers, breath counters, wake lock, vibration.
- **Log**: notes after exercises, the evening recall of your first morning activity (text, detail count, accuracy), and a Progress tab (streak, 14-day strip, recall chart with trend).
- **Reference**: chakras, life cycles.
- **Backup**: export / restore a JSON file.

## Building it yourself
`npm ci && npx cap sync android` then build `android/` with Android Studio or `./gradlew assembleDebug`. `docs/` is the single source of the app.

Content lives in `docs/content.js` (exercises, sayings, reminder text).
