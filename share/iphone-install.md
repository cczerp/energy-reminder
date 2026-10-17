# Installing Timbre Tamer on an iPhone (free, from a Linux laptop)

Apple only lets an app run if it is "signed". With a free Apple ID that signature **lasts 7 days**, so the app has to be re-signed about once a week. Your notes and settings stay when you re-sign.

You need: the iPhone, its USB cable, the laptop, and a spare Apple ID. Turn on **Developer Mode** on the iPhone first (see step 3).

## Install (Linux)
1. On the laptop, get **iloader** (github.com/nab138/iloader, free, works on Linux). Download the Linux version and open it.
2. Download `mindcue.ipa` from the **latest-ios** release on the repository's Releases page.
3. On the iPhone: **Settings → Privacy & Security → Developer Mode → on**, then restart when it asks.
4. Plug the iPhone in and tap **Trust** when it asks.
5. In iloader, sign in with the spare Apple ID, pick the phone, and install the file `mindcue.ipa` (use its option to install an IPA file).
6. On the iPhone: **Settings → General → VPN & Device Management**, tap the Apple ID, tap **Trust**.
7. Open **Timbre Tamer** and allow notifications. For leave-home reminders, allow location, then **Always** when it asks.

## Keeping it going
- Every 7 days or so, plug in and repeat steps 5. Do this before it expires, so the app never stops opening.
- Easier long-term option: in iloader, install **SideStore** on the phone first. SideStore can then refresh Timbre Tamer by itself over Wi-Fi without the laptop. This is more setup, and I have not tested it.

## Other tools
If iloader gives trouble, the free script **Legacy iOS Kit** (github.com/LukeZGD/Legacy-iOS-Kit, "Sideload IPA") also runs on Linux. On a Mac or Windows PC, **Sideloadly** (sideloadly.io) does the same job.
