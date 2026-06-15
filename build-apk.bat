@echo off
title বিদ্যুৎ বিল - APK Builder
cls

echo ============================================
echo    বিদ্যুৎ বিল - APK Builder
echo    Biddut Bill - Android APK Generator
echo ============================================
echo.

:: Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java is not installed!
    echo.
    echo Please install Java JDK 17 from:
    echo https://adoptium.net/temurin/releases/?version=17
    echo.
    echo After installing Java, run this script again.
    echo.
    pause
    exit /b 1
)

echo [✓] Java detected
echo.

:: Set paths
set ANDROID_DIR=%~dp0android
set OUTPUT_DIR=%ANDROID_DIR%\app\build\outputs\apk\debug

echo [*] Step 1: Copying web files to assets...
xcopy /E /Y /I /Q "%~dp0index.html" "%ANDROID_DIR%\app\src\main\assets\"
xcopy /E /Y /I /Q "%~dp0css\*" "%ANDROID_DIR%\app\src\main\assets\css\"
xcopy /E /Y /I /Q "%~dp0js\*" "%ANDROID_DIR%\app\src\main\assets\js\"
xcopy /Y /Q "%~dp0favicon.svg" "%ANDROID_DIR%\app\src\main\assets\"
xcopy /Y /Q "%~dp0manifest.json" "%ANDROID_DIR%\app\src\main\assets\"
xcopy /Y /Q "%~dp0google-services.json" "%ANDROID_DIR%\app\"
xcopy /Y /Q "%~dp0google-services.json" "%ANDROID_DIR%\app\src\"

echo [✓] Files copied
echo.

echo [*] Step 2: Cleaning old build...
if exist "%ANDROID_DIR%\app\build" (
    rmdir /S /Q "%ANDROID_DIR%\app\build"
    echo [✓] Old build cleaned
)

echo.
echo [*] Step 3: Building APK (this may take 5-10 minutes first time)...
echo.

cd /d "%ANDROID_DIR%"
call gradlew assembleDebug

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build failed!
    echo Please check errors above.
    pause
    exit /b 1
)

echo.
echo [✓] Build successful!
echo.
echo Your APK is ready at:
echo %OUTPUT_DIR%\app-debug.apk
echo.
echo Copy this file to your phone and install it.
echo Remember to enable "Install from Unknown Sources" on your phone.
echo.

pause
