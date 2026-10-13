# Fetches the newest MindCue build into this folder (so the landing page serves it). Run after each new build, or schedule it.
Set-Location $PSScriptRoot
Invoke-WebRequest -Uri "https://github.com/cczerp/MindCue/releases/latest/download/mindcue.apk" -OutFile "mindcue.apk.tmp"
Move-Item -Force "mindcue.apk.tmp" "mindcue.apk"
Write-Host "Updated: $(Get-Date)"
