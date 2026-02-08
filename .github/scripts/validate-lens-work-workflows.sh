#!/bin/bash
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

set -euo pipefail

# Default paths to check
resolve_default_paths() {
    local repo_root="$1"
    local candidates=(
        "$repo_root/TargetProjects/LENS/BMAD.Lens/src/modules/lens-work/workflows"
        "$repo_root/_bmad/lens-work/workflows"
    )
    local paths=()
    for path in "${candidates[@]}"; do
        if [[ -d "$path" ]]; then
            paths+=("$path")
        fi
    done
    printf '%s\n' "${paths[@]}"
}

# Find all workflow.md files under the given root
find_workflows() {
    local root="$1"
    find "$root" -name "workflow.md" -type f | sort
}

# Check a single workflow file
check_workflow() {
    local path="$1"
    if [[ ! -f "$path" ]]; then
        echo "read_error: file not found"
        return 1
    fi

    local content
    content=$(cat "$path")

    local has_step0=0
    local has_git_checkout=0
    local has_git_fetch_or_pull=0
    local has_git_commit=0
    local has_git_push=0

    if echo "$content" | grep -qE '^###[[:space:]]*0\.[[:space:]]+'; then
        has_step0=1
    fi
    if echo "$content" | grep -q 'git checkout'; then
        has_git_checkout=1
    fi
    if echo "$content" | grep -q 'git fetch origin' || echo "$content" | grep -q 'git pull origin'; then
        has_git_fetch_or_pull=1
    fi
    if echo "$content" | grep -q 'git commit -m'; then
        has_git_commit=1
    fi
    if echo "$content" | grep -q 'git push'; then
        has_git_push=1
    fi

    local missing=()
    if [[ $has_step0 -eq 0 ]]; then
        missing+=("step0")
    fi
    if [[ $has_git_checkout -eq 0 ]]; then
        missing+=("git_checkout")
    fi
    if [[ $has_git_fetch_or_pull -eq 0 ]]; then
        missing+=("git_fetch_or_pull")
    fi
    if [[ $has_git_commit -eq 0 ]]; then
        missing+=("git_commit")
    fi
    if [[ $has_git_push -eq 0 ]]; then
        missing+=("git_push")
    fi

    if [[ ${#missing[@]} -eq 0 ]]; then
        return 0
    else
        echo "${missing[*]}"
        return 1
    fi
}

# Run checks on all workflows under the given paths
run() {
    local paths=("$@")
    local failures=0

    for root in "${paths[@]}"; do
        local workflows
        mapfile -t workflows < <(find_workflows "$root")
        if [[ ${#workflows[@]} -eq 0 ]]; then
            echo "No workflow.md files found under: $root"
            ((failures++))
            continue
        fi

        echo "Checking ${#workflows[@]} workflows under: $root"
        for workflow in "${workflows[@]}"; do
            if missing=$(check_workflow "$workflow"); then
                echo "  OK   $workflow"
            else
                ((failures++))
                echo "  FAIL $workflow -> missing: $missing"
            fi
        done
    done

    return $((failures > 0 ? 1 : 0))
}

# Main function
main() {
    local paths=()
    local repo_root="$(pwd)"

    while [[ $# -gt 0 ]]; do
        case $1 in
            --path)
                paths+=("$2")
                shift 2
                ;;
            --repo-root)
                repo_root="$2"
                shift 2
                ;;
            *)
                echo "Usage: $0 [--path <path>] [--repo-root <root>]"
                exit 1
                ;;
        esac
    done

    if [[ ${#paths[@]} -eq 0 ]]; then
        mapfile -t paths < <(resolve_default_paths "$repo_root")
    fi

    if [[ ${#paths[@]} -eq 0 ]]; then
        echo "No workflow paths found. Use --path to specify a workflow directory."
        exit 1
    fi

    run "${paths[@]}"
}

main "$@"