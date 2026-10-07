# Mindful — meditation & mindfulness reminder app

An offline-capable web app (PWA) built from a set of meditation and energy-work guides. No account, no server: everything is stored on the phone. Source lives in `docs/` (plain HTML/JS, no build step).

## Install on Android (the native app)
Direct download (works for anyone, no GitHub account): https://github.com/cczerp/energy-reminder/releases/latest/download/mindful.apk

**Sharing it with someone non-technical:** give them `share/Mindful-install-guide.pdf` (one page with a QR code and big-button steps; the HTML source is `share/install-guide.html`). The steps cover the Play Protect screen, where you must tap **More details → Install anyway** (not "Got it").

Every build replaces the release on the [Releases page](https://github.com/cczerp/energy-reminder/releases) with a new "Mindful build N". The app shows its build number at the bottom of the Today screen and Android shows version 1.0.N under Settings → Apps → Mindful. Builds are signed with a fixed key (`android/debug.keystore`), so each one installs over the last.

Android phones only. The same code runs as a web app, but notifications only fire reliably in the native app.

## Install on Android (web version)
Settings → Pages → deploy `main` / `/docs`, open `https://cczerp.github.io/energy-reminder/` in Chrome → Install app. Notifications only fire while it is open.

## What it does
- **Daily goals** (Settings): Observation, Concentration, Meditation and Emotional control each have **one goal a day**. You choose which exercises rotate in and when to be reminded — at a set time, at a random time, or (Observation, Concentration) when you leave home. Any exercise in the category completes the goal, and **Completed** silences that category's later reminders for the day. Each reminder has **See rules** and **Completed** buttons. Evening recall is once a night; mindfulness sayings default to 5 a day.
- **Funk button**: one tap on the home screen runs a short reset (breath, 5-4-3 senses, "whose emotion is this?", redirect, fear check) and ends with a button that opens your own playlist (paste a Spotify link in Settings).
- **Mindfulness sayings**: the mental-habit notes, emotional-mastery techniques, supporting habits, and energy do's/don'ts, as short reminders.
- **Practice**: every other exercise — Energy & healing (all of Healing Through Psychic Energy), Counterbalance, Meditation of Love, the Psychic Centers path (locked until the earlier stage is ticked), the Chakra Alignment Walkthrough (stands alone, never leads into the attunement), and Projection — each with a guided mode: timers, breath counters, wake lock, vibration.
- **Log**: notes after exercises, the evening recall of your first morning activity (text, detail count, accuracy), and a Progress tab (streak, 14-day strip, recall chart with trend).
- **Reference**: chakras, life cycles.
- **Backup**: export / restore a JSON file.

## Building it yourself
`npm ci && npx cap sync android` then build `android/` with Android Studio or `./gradlew assembleDebug`. `docs/` is the single source of the app.

Content lives in `docs/content.js` (exercises, sayings, reminder text).
