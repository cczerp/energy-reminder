# Putting Timbre Tamer on Google Play — step by step

Do these in order. Anything marked **[me]** is something I do in the code; everything else is you in Play Console (play.google.com/console). Google changes these screens now and then, so if a label differs a little, follow the nearest one.

## 0. Before you start
- The upload key is already set up: the three GitHub secrets (`UPLOAD_KEYSTORE`, `UPLOAD_STORE_PASSWORD`, `UPLOAD_KEY_PASSWORD`). The build then makes **mindcue.aab**.
- Get the file: GitHub → Actions → the latest "Build Android app" run → **Artifacts → mindcue-aab** (download and unzip).
- The Play version has the advanced teachings **locked** automatically. The Unlock button does nothing until step 7 is done, so **do not publish publicly before step 7 is finished**.

## 1. Create the app
1. Play Console → **Create app**.
2. App name: **Timbre Tamer**. Default language: English (US). **App** (not game). **Free**.
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
Timbre Tamer helps you build a daily mindfulness and meditation practice, privately.

• Reminders when you want them: set times, spread through the day, or random. Pick how many.
• Daily goals that clear away when you finish them, with a small celebration when the whole day is done.
• A library of guided practices: meditation, observation and concentration exercises, emotional tools, bedtime practices, energy and healing, and more. Gentle timers and an optional buzz keep you on track.
• Climb the Scale and the Focus Wheel for working with how you feel.
• A private log: notes, evening recall, and a history of every day.
• No account. Your notes, logs and goals stay on your phone. The free version shows a few ads on the Practice and Info lists; one purchase removes them and unlocks the advanced teachings.

Timbre Tamer supports a practice. It is not medical care and does not replace a counselor or doctor.
```

**Graphics:** app icon (512×512) = `docs/icon-512.png`; feature graphic (1024×500) and 2–8 phone screenshots are needed. **[me]** I'll generate them if you ask (Today, Settings, a guided practice, the Days log).

## 3½. Privacy policy
Use the page already in this repository: `docs/privacy.html` (publish it on your landing page). Paste its **public web address** into **Policy → App content → Privacy policy**.

## 5. App content (Policy → App content) — answer these
- **Ads:** **Yes**, the app contains ads (AdMob). Turn on the **Advertising ID** declaration too (App content → Advertising ID → Yes, used for advertising).
- **App access:** All functionality is available without special access (once the lock is on, the advanced teachings need the one-time unlock; say that in the notes).
- **Target audience:** 18 and over. Not for children.
- **Content rating:** answer the questionnaire honestly: no violence, no user-generated content shared, no gambling. It should rate for everyone.
- **Data safety:** with ads on, answer **Yes, the app collects or shares data**, and then list what AdMob collects: **Device or other IDs** (advertising ID), and **App activity / Diagnostics** if the form shows them, each **shared with a third party (Google)** for **Advertising or marketing**; mark it as not optional for the free version. Your own notes, logs and goals are never collected. Location is used on the device only and never sent anywhere. Say data is encrypted in transit. Say users can request deletion (they can clear the app's data or uninstall). Check the AdMob policy page for the exact list, because Google updates it.
- **Health apps declaration:** if it asks, choose the option that matches wellness / stress management, not medical.
- **Government / financial / news:** No.

## 6. Permissions Google asks you to explain
- **Background location (leave-home reminders)** — the strictest one. Reason: "Timbre Tamer reminds you of a short practice when you leave your home. The user sets their home once. A system geofence detects leaving. The app does not track or store location history and nothing leaves the device." Google may ask for a **short screen recording**: record yourself setting home in Settings, walking out, and the reminder appearing. If this is refused, we remove that feature from the Play version.
- **Exact alarms** (reminders at exact times): reason: "Meditation reminders at times the user chooses."
- **Notifications:** normal.

## 6½. AdMob (ads) — do this before going public
1. Go to admob.google.com and sign in with the same Google account. Accept the terms.
2. **Apps → Add app.** Choose Android, say the app is **not yet published** (you can link it to Play later), name it Timbre Tamer. Copy the **App ID** (it looks like `ca-app-pub-1234567890123456~1234567890`).
3. In the app, make two ad units: **Banner** (name "Lists banner") and **Rewarded** (name "Unlock one practice"). Copy each **Ad unit ID** (`ca-app-pub-…/…`).
4. Under **Payments**, add your payment details and tax info so you can be paid.
5. **Done:** your real App ID and the two ad unit IDs are in the app. The Play bundle build turns test mode off by itself, so real users get real ads.
   **Protect your account:** never tap your own live ads. Before you test the Play build on your phone, add your phone as a **test device** in AdMob (Settings → Test devices), so your phone only gets test ads.
6. After the app is live on Play, in AdMob **Apps → Timbre Tamer → App settings → Link to Google Play**, so the ads are tied to your store listing.
7. Europe and the UK: in AdMob **Privacy & messaging**, create the consent message ("GDPR") and publish it. Without it, ads may not show there.

## 7. The one-time purchases (do this before going public)
Upload the bundle to a test track first: Play only lets you create the products once a build with billing is uploaded.
For each product: **Monetize → Products → In-app products → Create product**. Product ID cannot change later. One-time products, then **Activate**.

| Product ID | Name | Price |
|---|---|---|
| `advanced_unlock` | Everything (all advanced teachings, now and later) | $4.99 |
| `pkg_chakra` | Chakra treatment | $1.00 |
| `pkg_attention` | Attention | $1.00 |
| `pkg_assessment` | The CIA assessment of the Gateway Experience (GWE) | $4.99 |
| `pkg_centers` | Psychic centers | $1.00 |
| `pkg_journeys` | Inner journeys | $1.00 |
| `pkg_projection` | Projection | $1.00 |
| `pkg_laws` | Universal laws | $1.00 |
| `pkg_cycles` | Life cycles | $1.00 |

- `pkg_assessment` is sold on its own: it is not unlocked by `advanced_unlock` (Everything) or by owning other packages. Gateway experience is no longer a separate product (`pkg_gateway` is not used).
- Do's and Don'ts, Supporting habits and the Frequency Fast are free now (`pkg_dos` and `pkg_habits` are no longer used; leave them inactive). Owning any 8 packages unlocks the rest automatically (`UNLOCK_AT` in `docs/content.js`). Everything also covers packages added later.
- Any purchase removes ads. Ads are off in the Play bundle for now (see the workflow note); turn them on when you publish.
- You also need a **payments profile** (Monetize → Setup). Only you can do this.
- Test a real purchase with a license-testing Gmail (Setup → License testing) on the internal test.

## 8. Going public
Production → Create release → upload the same build (or newer) → Google reviews it (can take days). Fill any red items Play lists first.

## What I still need from you
- Your payments profile done.
- Whether to have me make the screenshots and feature graphic.
