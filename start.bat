@echo off
cd /d "%~dp0"
call npm install
start "" http://localhost:3000
call npm run dev
pause
