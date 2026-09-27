@echo off
REM MediMart Oracle Database - Quick Start Script
REM This script will help you rebuild and run the application with Oracle

setlocal enabledelayedexpansion

echo.
echo ========================================
echo    MediMart Oracle Setup - Quick Start
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "backend\pom.xml" (
    echo ERROR: pom.xml not found in backend folder
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

echo Checking for Maven...
where mvn >nul 2>&1
if errorlevel 1 (
    echo WARNING: Maven not found in PATH
    echo.
    echo You have 3 options:
    echo   1. Install Maven from https://maven.apache.org/download.cgi
    echo   2. Use VS Code's Java extension (recommended)
    echo   3. Use pre-built JAR with: java -jar backend\target\medimart-backend-1.0.0.jar
    echo.
    echo Using option 3 (H2 in-memory database for now)...
    echo.
    cd backend
    java -Dspring.profiles.active=working -jar target\medimart-backend-1.0.0.jar
) else (
    echo Maven found! Rebuilding project...
    echo.
    cd backend
    echo Running: mvn clean package -DskipTests
    call mvn clean package -DskipTests
    
    if errorlevel 1 (
        echo Build failed!
        pause
        exit /b 1
    )
    
    echo.
    echo Build successful! Starting application with Oracle...
    echo.
    java -Dspring.profiles.active=oracle -jar target\medimart-backend-1.0.0.jar
)

pause
