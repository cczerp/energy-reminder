#!/usr/bin/env bash
# Runs inside the Android emulator: installs the APK, launches it, taps the tab bar, and prints what the app logged and drew.
adb install -r mindful.apk
adb logcat -c
adb shell am start -n com.cczerp.mindful/.MainActivity
sleep 30

dump_ui() { adb shell uiautomator dump /sdcard/ui.xml > /dev/null 2>&1; adb shell cat /sdcard/ui.xml | sed 's/></>\n</g'; }

show() {
  echo "===== $1: errors from the web page ====="
  adb logcat -d | grep -E "Capacitor/Console|chromium.*(CONSOLE|Uncaught)|AndroidRuntime: FATAL|SIGSEGV" | grep -vE "Msg: (undefined|\[object Object\]|\{\"display\")" | tail -30
  echo "===== $1: text on screen ====="
  dump_ui | grep -oE '(text|content-desc)="[^"]+"' | sort -u | head -50
  adb exec-out screencap -p > "smoke-$2.png"
}

tap_text() {  # tap the centre of the element whose text is $1
  local b
  b=$(dump_ui | grep -E "text=\"$1\"" | grep -oE 'bounds="\[[0-9]+,[0-9]+\]\[[0-9]+,[0-9]+\]"' | tail -1 | grep -oE '[0-9]+')
  set -- $b
  [ -n "$1" ] && adb shell input tap $(( ($1 + $3) / 2 )) $(( ($2 + $4) / 2 )) || echo "could not find tab"
}

show "LAUNCH" 1-launch
tap_text "Practice"; sleep 3; show "PRACTICE TAB" 2-practice
tap_text "Settings"; sleep 3; show "SETTINGS TAB" 3-settings
