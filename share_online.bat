@echo off
title Share PitchPulse Online
echo ========================================================
echo   Creating Instant Public HTTPS Link for PitchPulse...
echo ========================================================
echo.
echo Your local website on port 8080 is being shared online.
echo You will see a public https:// URL below.
echo Share that URL with anyone or open it on your phone!
echo.
echo (Press Ctrl+C to stop sharing)
echo.
npx localtunnel --port 8080
pause
