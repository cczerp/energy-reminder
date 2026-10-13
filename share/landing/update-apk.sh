#!/bin/sh
# Fetches the newest MindCue build into this folder (so the landing page serves it). Run after each new build, or from cron.
cd "$(dirname "$0")" || exit 1
curl -fL -o mindcue.apk.tmp https://github.com/cczerp/MindCue/releases/latest/download/mindcue.apk && mv mindcue.apk.tmp mindcue.apk && echo "Updated: $(date)"
