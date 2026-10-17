# Timbre Tamer back burner

Things parked on purpose. Nothing here is lost; it just is not in the app yet. Add to the top, move to done when handled.

## Sources owed for restored claims (parked 2026-10-17)

The user has these sources and will pull them up later. Until then the claims stay in the teachings as written. Each needs a citation (Credits line, or a Sources block like the one on "Energy and the body's fields").

| # | Claim | Where |
|---|---|---|
| 1 | Deliberate noticing improves memory for detail | Observation teaching |
| 2 | Regular meditation linked to calmer stress responses and steadier attention | Meditation teaching; Why these five |
| 3 | Naming a feeling tends to soften it | Emotional control teaching |
| 4 | Sleep consolidates memory and resets mood | Bedtime teaching; Why these five |
| 5 | Hypnosis research describes narrowed, absorbed focus as central to induction | Attention lesson |
| 6 | Sleep, exercise and rest set the ceiling for how well you can direct and hold attention | Attention lesson |
| 7 | Breath and visualization practices bring calm, focus and renewed energy | Energy & healing teaching |
| 8 | Reframing, which counterbalance resembles, has good support for improving mood | Counterbalance teaching |
| 9 | Focused body attention with a sound or rhythm settles the nervous system | Chakra alignment teaching |
| 10 | Guided imagery is a well-studied relaxation tool | Inner journeys teaching |

Rule from the user: ask whether they have a source for any claim that hits a safety flag; if they do not have it at hand it will not take much to obtain. No disclaimers in the teachings; spiritual material is credited as "taught from" the teachers in Credits.

Also still to credit: older health claims in practice text (colds and germs, Self-Healing conditions, Headache Relief).

## Source notes

- The declassified McDonnell Gateway assessment copy (CIA-RDP96-00788R001700210016-5) jumps from paragraph 34 to 37; paragraphs 35 and 36 are not in the file we were given. Get a complete copy if they matter.
- Teachings built from it: Meditation, hypnosis and biofeedback; Sound, brainwaves and Hemi-Sync (both free, under Meditation); The Gateway model and its tools (under Inner journeys, locked with that package); out-of-body cards added to Projection.

## Parked sayings / content

- **Media and fear saying (parked 2026-10-17, was in the app as "Is what you are watching or reading feeding fear? Change the channel.")**
  Needs rewording, not dropping. The idea: energy follows thought. Watching news, stories or reels that let your mind go to dark places feeds your own fear and draws more of it. Media repeatedly instills fear and suggests "this is just the world we live in" (a pattern of many small incidents before something big). Not watching negative news will lower negativity in your life.
  Draft directions: "Energy follows thought. What you keep watching, you keep feeling. Pick one thing you watch that feeds fear and skip it today." Keep it short, plain, no politics in the notification.

## Content ideas

- Chakra guide has an unidentified 8th entry labeled "Kah" from the original notes. Find the source reference before adding.
- Proposed new sayings drawn from the guides: see `share/sayings-proposed.md` (awaiting approval).

## App / release

- Before the final public release: release the free `beta` build to testers first, then the public paywall/ads build.
- Tester count: 3 so far (hoping for 5); Play needs 12 opted in for 14 days before production.
- Device-test on the phone: notifications nesting under one summary (tap to expand), phone Back button behaving like the in-app Back.
- Real Play purchase test with a license-tester account (products created 2026-10-16/17: `advanced_unlock` $4.99, eight `pkg_*` at $0.99 each).
- Ad build (test mode) in review on the spare-device track; then decide `live` vs `off`; Ads and Advertising ID declarations must match the final build.
- Possibly remove the tap action on the notification summary if it feels wrong.
- Update tour/privacy text if the final build shows no ads.
- Saying 20 now reads: feel the ground, name 5 things.

## Structure idea: teaching-linked sayings (2026-10-17, wanting more evidence before changing structure)

Some sayings belong to a specific teaching or lesson. Tuck them inside that lesson, with a button that switches those sayings on once the person has read or learned that teaching; after that they join the normal reminder pool. Reason: context makes them land, and pondering a short cryptic line is itself good exercise for working through complex thoughts. Candidates: the Neville-style "assume the state / live in the end" sayings, the scale sayings, the excitement/Bashar ones. Not built. Needs a lesson-level "read it" flag and a per-saying lesson tag.

Note from the user: sayings that need a little pondering are fine on purpose (e.g. the "Don't ask the universe, assume the state" Bashar quote pairs with "confidence is stronger than hope" and they can connect the dots over repeated reminders).

## Teaching-linked sayings: BUILT (2026-10-17, not pushed yet)
`SAYING_SETS` in docs/content.js (sets: laws, scale). Each set stays out of the pool until the person presses "Add these sayings to my reminders" at the end of the lesson (`setCard(id)` in app.js) or switches it on in Settings > "Sayings from lessons". State: `S.sets`. A new teaching (e.g. the focus/spatial-awareness exercise category) adds a set and calls setCard(id) on its page. Moved so far: wish-fulfilled + still-assuming (laws), the two scale sayings (scale). share/sayings.md is now out of date; regenerate before the next numbered review.
