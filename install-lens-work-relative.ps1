$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
Set-Location -Path $PSScriptRoot

Write-Host "Installing BMAD with lens-work custom module..."
Write-Host "Project root: $PSScriptRoot"
Write-Host ""

# Get the current branch of BMAD.Lens
Write-Host "Detecting BMAD.Lens branch..."
$bmadLensPath = "./TargetProjects/BMAD/LENS/BMAD.Lens"
if (Test-Path $bmadLensPath) {
    Push-Location $bmadLensPath
    $bmadLensBranch = git branch --show-current
    Pop-Location
    Write-Host "BMAD.Lens is on branch: $bmadLensBranch"
} else {
    Write-Host "WARNING: BMAD.Lens not found, using default branch"
    $bmadLensBranch = "main"
}

# Ensure bmad.lens.demo is on the same branch
Write-Host ""
Write-Host "Syncing bmad.lens.demo branch..."
$demoPath = "./TargetProjects/BMAD/LENS/bmad.lens.demo"
if (Test-Path $demoPath) {
    Push-Location $demoPath
    $demoBranch = git branch --show-current
    if ($demoBranch -ne $bmadLensBranch) {
        Write-Host "Switching bmad.lens.demo from '$demoBranch' to '$bmadLensBranch'..."
        git fetch origin
        git checkout $bmadLensBranch 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Branch doesn't exist remotely, creating it..."
            git checkout -b $bmadLensBranch
        }
    } else {
        Write-Host "bmad.lens.demo already on '$bmadLensBranch'"
    }
    Pop-Location
}

Write-Host ""
Write-Host "Step 1: Syncing lens-work from source..."

$sourceDir = "./TargetProjects/BMAD/LENS/BMAD.Lens/src/modules/lens-work"
$customDir = "./_bmad/_config/custom/lens-work"
$finalDir = "./_bmad/lens-work"

if (Test-Path $sourceDir) {
    Write-Host "Source found"
    Copy-Item -Path "$sourceDir/*" -Destination $customDir -Recurse -Force
    Write-Host "Step 1 complete"
}
else {
    Write-Host "WARNING: Source not found"
}

Write-Host ""
Write-Host "Step 2: Running BMAD installer..."
$null = "yes`nyes`nyes" | npx --yes bmad-method install --debug 2>&1

Write-Host ""
Write-Host "Step 3: Deploying lens-work to final location..."
Copy-Item -Path "$customDir/*" -Destination $finalDir -Recurse -Force
Write-Host "Installation complete"



