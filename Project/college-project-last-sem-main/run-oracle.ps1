# MediMart Oracle Database - Quick Start Script (PowerShell)
# This script will help you rebuild and run the application with Oracle

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   MediMart Oracle Setup - Quick Start" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "backend\pom.xml")) {
    Write-Host "ERROR: pom.xml not found in backend folder" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Checking for Maven..." -ForegroundColor Yellow

try {
    $mavenPath = & where.exe mvn 2>$null
    if ($LASTEXITCODE -eq 0 -and $mavenPath) {
        Write-Host "✓ Maven found at: $mavenPath" -ForegroundColor Green
        Write-Host ""
        
        Write-Host "Rebuilding project..." -ForegroundColor Cyan
        Set-Location backend
        
        Write-Host "Running: mvn clean package -DskipTests" -ForegroundColor Gray
        & mvn clean package -DskipTests
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Build failed!" -ForegroundColor Red
            Read-Host "Press Enter to exit"
            exit 1
        }
        
        Write-Host ""
        Write-Host "✓ Build successful!" -ForegroundColor Green
        Write-Host "Starting application with Oracle..." -ForegroundColor Cyan
        Write-Host ""
        
        $javaExe = "C:\Users\suraj\.vscode\extensions\redhat.java-1.54.0-win32-x64\jre\21.0.10-win32-x86_64\bin\java.exe"
        & $javaExe "-Dspring.profiles.active=oracle" -jar "target\medimart-backend-1.0.0.jar"
    }
    else {
        throw "Maven not found"
    }
}
catch {
    Write-Host "⚠ Maven not found in PATH" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You have options:" -ForegroundColor Cyan
    Write-Host "  1. Install Maven from https://maven.apache.org/download.cgi" -ForegroundColor Gray
    Write-Host "  2. Use VS Code's Java extension (recommended)" -ForegroundColor Gray
    Write-Host "  3. Use IntelliJ IDEA or Eclipse to rebuild" -ForegroundColor Gray
    Write-Host "  4. Run with H2 database for testing" -ForegroundColor Gray
    Write-Host ""
    Write-Host "For now, using option 4 (H2 in-memory database)..." -ForegroundColor Yellow
    Write-Host ""
    
    Set-Location backend
    $javaExe = "C:\Users\suraj\.vscode\extensions\redhat.java-1.54.0-win32-x64\jre\21.0.10-win32-x86_64\bin\java.exe"
    & $javaExe "-Dspring.profiles.active=working" -jar "target\medimart-backend-1.0.0.jar"
}

Write-Host ""
Read-Host "Press Enter to exit"
