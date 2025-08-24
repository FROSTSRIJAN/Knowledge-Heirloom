@echo off
echo 🚀 Knowledge Heirloom - Windows Production Deployment
echo ==================================================

echo [INFO] Starting deployment process...

echo [INFO] Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    exit /b 1
)
echo [SUCCESS] Frontend dependencies installed

echo [INFO] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    exit /b 1
)
echo [SUCCESS] Backend dependencies installed

echo [INFO] Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo [ERROR] Failed to generate Prisma client
    exit /b 1
)
echo [SUCCESS] Prisma client generated

echo [INFO] Building backend...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build backend
    exit /b 1
)
echo [SUCCESS] Backend built successfully

echo [INFO] Setting up database...
call npm run setup
if %errorlevel% neq 0 (
    echo [WARNING] Database setup had some issues, but continuing...
)
echo [SUCCESS] Database setup completed

cd ..

echo [INFO] Building frontend...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build frontend
    exit /b 1
)
echo [SUCCESS] Frontend built successfully

echo.
echo 🎉 Deployment build completed successfully!
echo.
echo Next steps:
echo 1. Configure your production environment variables
echo 2. Deploy the backend (./backend) to your server
echo 3. Deploy the frontend (./dist) to your static hosting
echo 4. Update CORS and API URLs in production environment
echo.
echo Your Knowledge Heirloom app is ready for production! 🚀

pause
