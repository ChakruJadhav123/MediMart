@echo off
setlocal
set MAVEN_PROJECTBASEDIR=%~dp0

REM Maven Wrapper - downloads Maven distribution if needed.
REM This wrapper assumes you have internet access to repo.maven.apache.org.

set MVNW_REPO_URL=https://repo.maven.apache.org/maven2
set WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar
set WRAPPER_PROPERTIES=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties

if not exist "%WRAPPER_JAR%" (
  echo Missing maven-wrapper.jar.
  echo Please add mvnw wrapper jar to backend/.mvn/wrapper/.
  exit /b 1
)

java -jar "%WRAPPER_JAR%" %* 
endlocal

