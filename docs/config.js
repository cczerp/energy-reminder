// Switched on only in the store (Play / App Store) builds. The free download from the landing page leaves both off.
export const PAYWALL = false; // locks the advanced teachings until a one-time purchase
export const ADS = false; // shows ads to people who have not bought the unlock

// Your real AdMob ad unit ids. (The AdMob app id is in android/app/src/main/res/values/strings.xml.)
export const ADMOB = {
  banner: 'ca-app-pub-3228808449104650/3059916711',
  rewarded: 'ca-app-pub-3228808449104650/3266221263',
  isTesting: true, // keep true here: the Play bundle build switches it to false automatically, so no test ads reach real users
};
