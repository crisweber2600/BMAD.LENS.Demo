@echo off
REM Install LENS Workbench - Non-Interactive Script for Windows
REM Usage: install-lens-work.bat [options]
REM
REM Examples:
REM   install-lens-work.bat                    REM Interactive
REM   install-lens-work.bat --auto             REM Non-interactive with defaults
REM   install-lens-work.bat --team "Dev Team"  REM Non-interactive, custom team name
REM   install-lens-work.bat --help             REM Show help

setlocal enabledelayedexpansion

REM Default values
set "INTERACTIVE=true"
set "DIRECTORY=."
set "USER_NAME=%USERNAME%"
if "!USER_NAME!"=="" set "USER_NAME=Development Team"
set "LANGUAGE=English"
set "OUTPUT_FOLDER=_bmad-output"
set "TOOLS=none"

REM Parse arguments
:parse_args
if "%1"=="" goto args_done
if "%1"=="--auto" (
  set "INTERACTIVE=false"
  shift
  goto parse_args
)
if "%1"=="--team" (
  set "USER_NAME=%2"
  set "INTERACTIVE=false"
  shift
  shift
  goto parse_args
)
if "%1"=="--directory" (
  set "DIRECTORY=%2"
  shift
  shift
  goto parse_args
)
if "%1"=="--language" (
  set "LANGUAGE=%2"
  shift
  shift
  goto parse_args
)
if "%1"=="--output" (
  set "OUTPUT_FOLDER=%2"
  shift
  shift
  goto parse_args
)
if "%1"=="--tools" (
  set "TOOLS=%2"
  shift
  shift
  goto parse_args
)
if "%1"=="--help" goto show_help
if "%1"=="-h" goto show_help
if "%1"=="/?" goto show_help

echo Unknown option: %1
echo Use --help for usage information
exit /b 1

:show_help
echo Install LENS Workbench ^(lens-work^) module for BMAD
echo.
echo Usage: install-lens-work.bat [options]
echo.
echo Options:
echo   --auto              Run non-interactive installation with defaults
echo   --team NAME         Team name for agent communication ^(implies --auto^)
echo   --directory PATH    Installation directory ^(default: current directory^)
echo   --language LANG     Communication language ^(default: English^)
echo   --output PATH       Output folder path ^(default: _bmad-output^)
echo   --tools TOOLS       Tool/IDE integration: none, claude-code, cursor, vscode
echo                       ^(default: none^)
echo   --help, -h, /?      Show this help message
echo.
echo Examples:
echo   REM Interactive mode ^(default^)
echo   install-lens-work.bat
echo.
echo   REM Non-interactive with defaults
echo   install-lens-work.bat --auto
echo.
echo   REM Non-interactive with team name
echo   install-lens-work.bat --team "Development Team"
echo.
echo   REM Custom directory
echo   install-lens-work.bat --directory C:\projects\myapp --auto
echo.
echo   REM With IDE integration
echo   install-lens-work.bat --auto --tools claude-code
echo.
exit /b 0

:args_done

REM Verify prerequisites
echo [94m🔍 Checking prerequisites...[0m

REM Check if directory exists
if not exist "%DIRECTORY%" (
  echo [91m❌ Directory not found: %DIRECTORY%[0m
  exit /b 1
)

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo [91m❌ Node.js not found. Please install Node.js v18+[0m
  exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set "NODE_VERSION=%%i"
echo [92m✅ Node.js %NODE_VERSION%[0m

REM Check for npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo [91m❌ npm not found. Please install npm v9+[0m
  exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set "NPM_VERSION=%%i"
echo [92m✅ npm %NPM_VERSION%[0m

REM Check for git
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo [91m❌ Git not found. Please install Git[0m
  exit /b 1
)

for /f "tokens=*" %%i in ('git --version') do set "GIT_VERSION=%%i"
echo [92m✅ %GIT_VERSION%[0m

REM Check for BMAD
cd /d "%DIRECTORY%"
if not exist "_bmad" (
  echo [33m⚠️  BMAD directory not found. This may be a fresh installation.[0m
)

echo [92m✅ Prerequisites verified[0m
echo.

REM Display installation plan
echo [94m📋 Installation Plan[0m
echo ────────────────────────────────────────
echo Directory:        [33m%DIRECTORY%[0m
echo Modules:          [33mbmm, lens-work[0m
echo Team Name:        [33m%USER_NAME%[0m
echo Tools:            [33m%TOOLS%[0m
echo Language:         [33m%LANGUAGE%[0m
echo Output Folder:    [33m%OUTPUT_FOLDER%[0m
if "%INTERACTIVE%"=="true" (
  echo Mode:             [33mInteractive[0m
) else (
  echo Mode:             [33mNon-Interactive[0m
)
echo ────────────────────────────────────────
echo.

REM Confirm installation (unless auto mode)
if "%INTERACTIVE%"=="true" (
  echo [94mReady to begin installation?[0m
  pause
)

echo.
echo [94m🚀 Starting LENS Workbench installation...[0m
echo.

REM Build and run installation command
setlocal
set "INSTALL_CMD=npx bmad-method install"
set "INSTALL_CMD=!INSTALL_CMD! --directory %DIRECTORY%"
set "INSTALL_CMD=!INSTALL_CMD! --modules bmm,lens-work"
set "INSTALL_CMD=!INSTALL_CMD! --tools %TOOLS%"
set "INSTALL_CMD=!INSTALL_CMD! --user-name "%USER_NAME%""
set "INSTALL_CMD=!INSTALL_CMD! --communication-language %LANGUAGE%"
set "INSTALL_CMD=!INSTALL_CMD! --document-output-language %LANGUAGE%"
set "INSTALL_CMD=!INSTALL_CMD! --output-folder %OUTPUT_FOLDER%"

if "%INTERACTIVE%"=="false" (
  set "INSTALL_CMD=!INSTALL_CMD! --yes"
)

!INSTALL_CMD!
set "INSTALL_EXIT=%ERRORLEVEL%"

if %INSTALL_EXIT% EQU 0 (
  echo.
  echo [92m✅ LENS Workbench installation completed!^[0m
  echo.
  echo [94m📝 Next Steps:[0m
  echo ────────────────────────────────────────
  echo 1. Verify installation:
  echo    [33mdir _bmad\lens-work\[0m
  echo.
  echo 2. Start using LENS ^(in VS Code Copilot Chat^):
  echo    [33m@compass help[0m
  echo.
  echo 3. Create your first initiative:
  echo    [33m#new-domain "Your Domain Name"[0m
  echo.
  echo 4. Run bootstrap:
  echo    [33mbootstrap[0m
  echo.
  echo For more info: [33mtype _bmad\lens-work\README.md[0m
  echo ────────────────────────────────────────
  endlocal
  exit /b 0
) else (
  echo.
  echo [91m❌ Installation failed with exit code %INSTALL_EXIT%[0m
  echo Run installation with --debug flag for more details:
  echo    [33mnpx bmad-method install --debug[0m
  endlocal
  exit /b %INSTALL_EXIT%
)
