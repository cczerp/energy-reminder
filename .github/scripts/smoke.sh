#!/usr/bin/env bash
# Runs inside the Android emulator: installs the APK, launches it, and prints what the app logged and drew.
adb install -r mindful.apk
adb logcat -c
adb shell am start -n com.cczerp.mindful/.MainActivity
sleep 30

show() {
  echo "===== $1: web console / crash log ====="
  adb logcat -d | grep -E "chromium|Capacitor|AndroidRuntime|FATAL|SIGSEGV" | tail -60
  echo "===== $1: text on screen ====="
  adb shell uiautomator dump /sdcard/ui.xml > /dev/null 2>&1
  adb shell cat /sdcard/ui.xml | sed 's/></>\n</g' | grep -oE '(text|content-desc)="[^"]+"' | sort -u | head -60
  adb exec-out screencap -p > "smoke-$2.png"
}

show "LAUNCH" 1-launch

SIZE=$(adb shell wm size | grep -oE '[0-9]+x[0-9]+' | tail -1)
W=${SIZE%x*}; H=${SIZE#*x}
Y=$((H - 120))
echo "screen ${W}x${H}; tapping the tab bar at y=$Y"
adb shell input tap $((W * 3 / 8)) $Y   # Practice
sleep 3
show "AFTER TAPPING PRACTICE" 2-practice
adb shell input tap $((W * 7 / 8)) $Y   # Settings
sleep 3
show "AFTER TAPPING SETTINGS" 3-settings
