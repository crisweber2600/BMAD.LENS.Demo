# Validate lens-work workflows enforce git discipline.
#
# Checks that each workflow.md contains:
# - A Step 0 heading
# - git checkout (branch selection)
# - git fetch or pull (sync with origin)
# - git commit -m (targeted commit)
# - git push (publish changes)
#
# Exit code 0 if all checks pass; 1 otherwise.

param(
    [string[]]$Path,
    [string]$RepoRoot = (Get-Location).Path
)

# Default paths to check
function Resolve-DefaultPaths {
    param([string]$RepoRoot)

    $candidates = @(
        Join-Path $RepoRoot "TargetProjects/LENS/BMAD.Lens/src/modules/lens-work/workflows"
        Join-Path $RepoRoot "_bmad/lens-work/workflows"
    )

    $paths = @()
    foreach ($path in $candidates) {
        if (Test-Path $path -PathType Container) {
            $paths += $path
        }
    }
    return $paths
}

# Find all workflow.md files under the given root
function Find-Workflows {
    param([string]$Root)

    Get-ChildItem -Path $Root -Recurse -Filter "workflow.md" -File | Sort-Object FullName
}

# Check a single workflow file
function Test-Workflow {
    param([string]$Path)

    if (-not (Test-Path $Path -PathType Leaf)) {
        return $false, @("read_error: file not found")
    }

    $content = Get-Content $Path -Raw

    $hasStep0 = $content -match '(?m)^###\s*0\.\s'
    $hasGitCheckout = $content -match 'git checkout'
    $hasGitFetchOrPull = $content -match 'git fetch origin' -or $content -match 'git pull origin'
    $hasGitCommit = $content -match 'git commit -m'
    $hasGitPush = $content -match 'git push'

    $missing = @()
    if (-not $hasStep0) { $missing += "step0" }
    if (-not $hasGitCheckout) { $missing += "git_checkout" }
    if (-not $hasGitFetchOrPull) { $missing += "git_fetch_or_pull" }
    if (-not $hasGitCommit) { $missing += "git_commit" }
    if (-not $hasGitPush) { $missing += "git_push" }

    return ($missing.Count -eq 0), $missing
}

# Run checks on all workflows under the given paths
function Invoke-Run {
    param([string[]]$Paths)

    $failures = 0

    foreach ($root in $Paths) {
        $workflows = Find-Workflows -Root $root
        if ($workflows.Count -eq 0) {
            Write-Host "No workflow.md files found under: $root"
            $failures++
            continue
        }

        Write-Host "Checking $($workflows.Count) workflows under: $root"
        foreach ($workflow in $workflows) {
            $ok, $missing = Test-Workflow -Path $workflow.FullName
            if ($ok) {
                Write-Host "  OK   $($workflow.FullName)"
            } else {
                $failures++
                $missingStr = $missing -join ", "
                Write-Host "  FAIL $($workflow.FullName) -> missing: $missingStr"
            }
        }
    }

    if ($failures -eq 0) { 0 } else { 1 }
}

# Main logic
$paths = if ($Path) { $Path } else { Resolve-DefaultPaths -RepoRoot $RepoRoot }

if ($paths.Count -eq 0) {
    Write-Host "No workflow paths found. Use -Path to specify a workflow directory."
    exit 1
}

$exitCode = Invoke-Run -Paths $paths
exit $exitCode