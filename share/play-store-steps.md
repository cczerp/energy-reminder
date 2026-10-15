# Putting MindCue on Google Play — step by step

Do these in order. Anything marked **[me]** is something I do in the code; everything else is you in Play Console (play.google.com/console). Google changes these screens now and then, so if a label differs a little, follow the nearest one.

## 0. Before you start
- The upload key is already set up: the three GitHub secrets (`UPLOAD_KEYSTORE`, `UPLOAD_STORE_PASSWORD`, `UPLOAD_KEY_PASSWORD`). The build then makes **mindcue.aab**.
- Get the file: GitHub → Actions → the latest "Build Android app" run → **Artifacts → mindcue-aab** (download and unzip).
- The Play version has the advanced teachings **locked** automatically. The Unlock button does nothing until step 7 is done, so **do not publish publicly before step 7 is finished**.

## 1. Create the app
1. Play Console → **Create app**.
2. App name: **MindCue**. Default language: English (US). **App** (not game). **Free**.
3. Tick the declarations (developer program policies, US export laws).

## 2. Upload the build
1. Left menu → **Testing → Internal testing → Create new release**.
2. Choose **Google-managed signing** (Play App Signing) when it offers it.
3. Upload **mindcue.aab**. If it asks about the package name, it is `com.cczerp.mindcue`. It cannot be changed later.
4. Release name: leave the suggested one. Notes: "First test build". **Save**, then **Review release**, then **Start rollout to internal testing**.

## 3. Testers
- **Internal testing → Testers**: make an email list and add the Gmail addresses (up to 100). Copy the **opt-in link** and send it. They install from the Play Store, no warnings.
- If your developer account is a personal one created after Nov 2023, Google may require a **closed test with 12 testers for 14 days** before you can go public (it shows in Play Console under "Production"). Internal testing does not count toward that.

## 4. Store listing (Grow → Store presence → Main store listing)
Paste these:

**Short description (80 characters):**
`Gentle reminders and a private log for your mindfulness practice.`

**Full description:**
```
MindCue helps you build a daily mindfulness and meditation practice, privately.

• Reminders when you want them: set times, spread through the day, or random. Pick how many.
• Daily goals that clear away when you finish them, with a small celebration when the whole day is done.
• A library of guided practices: meditation, observation and concentration exercises, emotional tools, bedtime practices, energy and healing, and more. Gentle timers and an optional buzz keep you on track.
• Climb the Scale and the Focus Wheel for working with how you feel.
• A private log: notes, evening recall, and a history of every day.
• Works fully offline. No account. No ads. No tracking. Everything stays on your phone.

MindCue supports a practice. It is not medical care and does not replace a counselor or doctor.
```

**Graphics:** app icon (512×512) = `docs/icon-512.png`; feature graphic (1024×500) and 2–8 phone screenshots are needed. **[me]** I'll generate them if you ask (Today, Settings, a guided practice, the Days log).

## 3½. Privacy policy
Use the page already in this repository: `docs/privacy.html` (publish it on your landing page). Paste its **public web address** into **Policy → App content → Privacy policy**.

## 5. App content (Policy → App content) — answer these
- **Ads:** No.
- **App access:** All functionality is available without special access (once the lock is on, the advanced teachings need the one-time unlock; say that in the notes).
- **Target audience:** 18 and over. Not for children.
- **Content rating:** answer the questionnaire honestly: no violence, no user-generated content shared, no gambling. It should rate for everyone.
- **Data safety:** **Does your app collect or share any user data? No.** Then **Is all of the user data encrypted in transit? n/a**, and **Do you provide a way to delete data? Users can delete data by clearing it in-app or uninstalling.** Location is used on the device only and never sent anywhere, so it is not "collected" in Google's sense, but if the form asks about location, say it is processed on-device only.
- **Health apps declaration:** if it asks, choose the option that matches wellness / stress management, not medical.
- **Government / financial / news:** No.

## 6. Permissions Google asks you to explain
- **Background location (leave-home reminders)** — the strictest one. Reason: "MindCue reminds you of a short practice when you leave your home. The user sets their home once. A system geofence detects leaving. The app does not track or store location history and nothing leaves the device." Google may ask for a **short screen recording**: record yourself setting home in Settings, walking out, and the reminder appearing. If this is refused, we remove that feature from the Play version.
- **Exact alarms** (reminders at exact times): reason: "Meditation reminders at times the user chooses."
- **Notifications:** normal.

## 7. The one-time unlock (do this before going public)
1. **Monetize → Products → In-app products → Create product.**
2. **Product ID:** `advanced_unlock` (cannot change later). Name: "Advanced teachings". Description: "One-time purchase that unlocks the Psychic centers, chakra meditations, inner journeys and projections."
3. **Price:** pick your one-time price. It is a **one-time** product (not a subscription). **Activate** it.
4. You also need a **payments profile** (Monetize → Setup) if you haven't made one. It asks for your tax and bank details. Only you can do this.
5. **[me]** Tell me the product ID and I will connect the Unlock and Restore buttons to Google Play Billing. I can't test a real purchase from here, so we test it with a license-testing Gmail (Setup → License testing) on the internal test.

## 8. Going public
Production → Create release → upload the same build (or newer) → Google reviews it (can take days). Fill any red items Play lists first.

## What I still need from you
- The one-time price, and when you create the product, its ID.
- Your payments profile done.
- Whether to have me make the screenshots and feature graphic.
