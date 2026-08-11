# Aura E-commerce Auth Runner Script
# This script ensures Java is available, sets up the Maven Wrapper if missing, and boots the Spring Boot backend.

$ErrorActionPreference = "Stop"

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "         Aura E-Commerce Auth Runner         " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Verify Java Installation
Write-Host "[1/3] Checking Java installation..." -ForegroundColor Yellow
$javaCmd = Get-Command java -ErrorAction SilentlyContinue
if ($javaCmd) {
    Write-Host "Found Java at: $($javaCmd.Source)" -ForegroundColor Green
} else {
    Write-Error "Java is not installed or not in your system PATH. Please install Java 21+ before running."
    exit 1
}

# 2. Check and Setup Maven Wrapper
Write-Host "[2/3] Checking Maven Wrapper..." -ForegroundColor Yellow

$backendDir = Join-Path $PSScriptRoot "backend"
$mvnwCmd = Join-Path $backendDir "mvnw.cmd"
$wrapperJarDir = Join-Path $backendDir ".mvn\wrapper"
$wrapperJar = Join-Path $wrapperJarDir "maven-wrapper.jar"
$wrapperProps = Join-Path $wrapperJarDir "maven-wrapper.properties"

$needsWrapperSetup = $false
if (!(Test-Path $mvnwCmd) -or !(Test-Path $wrapperJar) -or !(Test-Path $wrapperProps)) {
    $needsWrapperSetup = $true
}

if ($needsWrapperSetup) {
    Write-Host "Maven Wrapper files are missing. Downloading official Maven Wrapper files..." -ForegroundColor Cyan
    
    # Create Wrapper directories if not exist
    if (!(Test-Path $wrapperJarDir)) {
        New-Item -ItemType Directory -Path $wrapperJarDir | Out-Null
    }

    # Download URL sources
    $mvnwCmdUrl = "https://raw.githubusercontent.com/apache/maven-wrapper/master/maven-wrapper-distribution/src/resources/mvnw.cmd"
    $mvnwUrl = "https://raw.githubusercontent.com/apache/maven-wrapper/master/maven-wrapper-distribution/src/resources/mvnw"
    $wrapperJarUrl = "https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"

    try {
        Write-Host "Downloading mvnw.cmd..." -ForegroundColor DarkYellow
        Invoke-WebRequest -Uri $mvnwCmdUrl -OutFile $mvnwCmd
        
        Write-Host "Downloading mvnw..." -ForegroundColor DarkYellow
        Invoke-WebRequest -Uri $mvnwUrl -OutFile (Join-Path $backendDir "mvnw")

        Write-Host "Downloading maven-wrapper.jar..." -ForegroundColor DarkYellow
        Invoke-WebRequest -Uri $wrapperJarUrl -OutFile $wrapperJar

        Write-Host "Writing maven-wrapper.properties..." -ForegroundColor DarkYellow
        $propertiesContent = @"
distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip
wrapperUrl=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar
"@
        Set-Content -Path $wrapperProps -Value $propertiesContent

        Write-Host "Maven Wrapper successfully configured!" -ForegroundColor Green
    } catch {
        Write-Error "Failed to download Maven Wrapper files: $($_.Exception.Message)"
        exit 1
    }
} else {
    Write-Host "Maven Wrapper is configured." -ForegroundColor Green
}

# 3. Start Backend Application
Write-Host "[3/3] Launching backend server..." -ForegroundColor Yellow
Write-Host "Executing: .\mvnw.cmd spring-boot:run in backend folder" -ForegroundColor Cyan
Write-Host "---------------------------------------------" -ForegroundColor DarkGray
Write-Host "NOTE: To connect the database, ensure MySQL is running"
Write-Host "and your credentials in 'backend/src/main/resources/application.properties' are correct."
Write-Host "---------------------------------------------" -ForegroundColor DarkGray

# Move to backend and run mvnw
Set-Location -Path $backendDir
& .\mvnw.cmd spring-boot:run
