#!/usr/bin/env python3
"""Validate lens-work workflows enforce git discipline.

Checks that each workflow.md contains:
- A Step 0 heading
- git checkout (branch selection)
- git fetch or pull (sync with origin)
- git commit -m (targeted commit)
- git push (publish changes)

Exit code 0 if all checks pass; 1 otherwise.
"""

from __future__ import annotations

import argparse
import os
import re
import sys
from typing import List, Tuple


REQUIRED_CHECKS = (
    "step0",
    "git_checkout",
    "git_fetch_or_pull",
    "git_commit",
    "git_push",
)


def find_workflows(root: str) -> List[str]:
    workflows: List[str] = []
    for dirpath, _dirnames, filenames in os.walk(root):
        if "workflow.md" in filenames:
            workflows.append(os.path.join(dirpath, "workflow.md"))
    return sorted(workflows)


def check_workflow(path: str) -> Tuple[bool, List[str]]:
    try:
        with open(path, "r", encoding="utf-8") as handle:
            text = handle.read()
    except OSError as exc:
        return False, [f"read_error: {exc}"]

    has_step0 = bool(re.search(r"^###\s*0\.\s+", text, re.MULTILINE))
    has_git_checkout = "git checkout" in text
    has_git_fetch_or_pull = "git fetch origin" in text or "git pull origin" in text
    has_git_commit = "git commit -m" in text
    has_git_push = "git push" in text

    missing: List[str] = []
    if not has_step0:
        missing.append("step0")
    if not has_git_checkout:
        missing.append("git_checkout")
    if not has_git_fetch_or_pull:
        missing.append("git_fetch_or_pull")
    if not has_git_commit:
        missing.append("git_commit")
    if not has_git_push:
        missing.append("git_push")

    return len(missing) == 0, missing


def resolve_default_paths(repo_root: str) -> List[str]:
    candidates = [
        os.path.join(
            repo_root,
            "TargetProjects",
            "LENS",
            "BMAD.Lens",
            "src",
            "modules",
            "lens-work",
            "workflows",
        ),
        os.path.join(repo_root, "_bmad", "lens-work", "workflows"),
    ]
    return [path for path in candidates if os.path.isdir(path)]


def run(paths: List[str]) -> int:
    failures = 0
    for root in paths:
        workflows = find_workflows(root)
        if not workflows:
            print(f"No workflow.md files found under: {root}")
            failures += 1
            continue

        print(f"Checking {len(workflows)} workflows under: {root}")
        for workflow in workflows:
            ok, missing = check_workflow(workflow)
            if ok:
                print(f"  OK  {workflow}")
            else:
                failures += 1
                missing_str = ", ".join(missing)
                print(f"  FAIL {workflow} -> missing: {missing_str}")

    return 0 if failures == 0 else 1


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate lens-work workflow git discipline",
    )
    parser.add_argument(
        "--path",
        action="append",
        dest="paths",
        default=[],
        help="Workflow root path to scan (can repeat)",
    )
    parser.add_argument(
        "--repo-root",
        default=os.getcwd(),
        help="Repository root (defaults to current directory)",
    )
    args = parser.parse_args()

    paths = args.paths or resolve_default_paths(args.repo_root)
    if not paths:
        print("No workflow paths found. Use --path to specify a workflow directory.")
        return 1

    return run(paths)


if __name__ == "__main__":
    raise SystemExit(main())
