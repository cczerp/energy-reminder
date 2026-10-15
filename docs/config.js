// Switched on only in the store (Play / App Store) builds. The free download from the landing page leaves both off.
export const PAYWALL = false; // locks the advanced teachings until a one-time purchase
export const ADS = false; // shows ads to people who have not bought the unlock

// Google's TEST ad unit ids. Replace them with your own AdMob ids before publishing (see share/play-store-steps.md).
export const ADMOB = {
  banner: 'ca-app-pub-3940256099942544/9214589741',
  rewarded: 'ca-app-pub-3940256099942544/5224354917',
  isTesting: true, // set to false once the real ids are in
};
