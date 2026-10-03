# Mindful — meditation & mindfulness reminder app

An offline-capable web app (PWA) built from the First Steps guides. No account, no server: everything is stored on the phone. Source lives in `docs/` (plain HTML/JS, no build step).

## Install on Android
1. In the repo on GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `/docs` → Save.**
2. Open `https://cczerp.github.io/energy-reminder/` in Chrome on your phone.
3. Chrome menu → **Install app** (or *Add to Home screen*). It then opens full-screen and works with no internet.
4. Open **Settings** in the app → **Allow notifications**.

## What it does
- **Reminders** (Settings): each type is optional, with its own times-per-day and hours — Observation, Concentration, Meditation, Emotional control (all from the Mental Training guide), Mindfulness sayings, and a fixed-time Evening recall.
- **Mindfulness sayings**: the mental-habit notes, emotional-mastery techniques, supporting habits, and energy do's/don'ts, as short reminders.
- **Practice**: every other exercise — Energy & healing (all of Healing Through Psychic Energy), Counterbalance, Meditation of Love, the Psychic Centers path (locked until the earlier stage is ticked), the Chakra Alignment Walkthrough (stands alone, never leads into the attunement), and Projection — each with a guided mode: timers, breath counters, wake lock, vibration.
- **Log**: notes after exercises, the evening recall of your first morning activity (text, detail count, accuracy), and a Progress tab (streak, 14-day strip, recall chart with trend).
- **Reference**: chakras, life cycles.
- **Backup**: export / restore a JSON file.

## About reminders
Browsers can't ring a notification on a schedule while an app is fully closed. The app fires its notifications while it is open or running in the background. For alarms that ring regardless, **Settings → Export reminders (.ics)** creates the next 14 days of reminders as calendar events with alarms; open the file to add them to the phone's calendar.

Content lives in `docs/content.js` (exercises, sayings, reminder text).
