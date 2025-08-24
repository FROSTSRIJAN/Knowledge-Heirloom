@echo off
REM 🚀 Knowledge Heirloom - Pre-Demo Verification Script (Windows)

echo 🎯 KNOWLEDGE HEIRLOOM - HACKATHON DEPLOYMENT VERIFICATION
echo ========================================================

echo 🔍 CHECKING PREREQUISITES...
echo -----------------------------

REM Check for Node.js
where node >nul 2>nul
if %errorlevel% == 0 (
    echo ✅ Node.js is installed
    node --version
) else (
    echo ❌ Node.js is NOT installed
)

REM Check for npm
where npm >nul 2>nul
if %errorlevel% == 0 (
    echo ✅ npm is installed
) else (
    echo ❌ npm is NOT installed
)

REM Check for bun
where bun >nul 2>nul
if %errorlevel% == 0 (
    echo ✅ bun is installed
) else (
    echo ⚠️ bun is not installed (npm will be used)
)

echo.
echo 📁 CHECKING FILES...
echo --------------------

if exist "package.json" (echo ✅ package.json exists) else (echo ❌ package.json missing)
if exist "src\App.tsx" (echo ✅ src\App.tsx exists) else (echo ❌ src\App.tsx missing)
if exist "backend\server.js" (echo ✅ backend\server.js exists) else (echo ❌ backend\server.js missing)
if exist "backend\package.json" (echo ✅ backend\package.json exists) else (echo ❌ backend\package.json missing)
if exist ".env.local" (echo ✅ .env.local exists) else (echo ❌ .env.local missing)
if exist "backend\.env" (echo ✅ backend\.env exists) else (echo ❌ backend\.env missing)
if exist "HACKATHON_README.md" (echo ✅ HACKATHON_README.md exists) else (echo ❌ HACKATHON_README.md missing)
if exist "DEMO_SCRIPT.md" (echo ✅ DEMO_SCRIPT.md exists) else (echo ❌ DEMO_SCRIPT.md missing)

echo.
echo 🔧 QUICK SETUP...
echo -----------------

echo 📦 Installing frontend dependencies...
call npm install

echo 📦 Installing backend dependencies...
cd backend
call npm install

echo 🗄️ Setting up database...
call npx prisma generate
call npx prisma db push
cd ..

echo.
echo 🚀 STARTING SERVICES...
echo -----------------------

echo 🖥️ Starting backend server on port 8081...
cd backend
start /b npm run dev
cd ..

echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo 🌐 Starting frontend server on port 8080...
start /b npm run dev

echo ⏳ Waiting for frontend to start...
timeout /t 5 /nobreak >nul

echo.
echo 🎯 DEMO READY CHECKLIST:
echo ========================
echo ✅ Frontend: http://localhost:8080
echo ✅ Backend:  http://localhost:8081
echo.
echo 👤 DEMO ACCOUNTS:
echo   📧 junior@knowledgeheirloom.com ^| 🔑 password123
echo   📧 admin@knowledgeheirloom.com  ^| 🔑 admin123
echo   📧 senior@knowledgeheirloom.com ^| 🔑 password123
echo.
echo 📖 DEMO SCRIPT: See DEMO_SCRIPT.md for full presentation guide
echo.
echo 🏆 KNOWLEDGE HEIRLOOM IS READY FOR HACKATHON VICTORY! 🏆
echo.
echo Both servers are now running. Open your browser to:
echo 🌐 http://localhost:8080
echo.
echo Press any key to stop all services...
pause >nul

REM Kill background processes
taskkill /f /im node.exe 2>nul

echo Services stopped. Good luck with your demo! 🚀
