---
name: code-review-request
description: Ask an AI agent to review a code diff for correctness, style, and security
category: review
tags: code-review diff security style
license: MIT
---

# Code Review Request

Please review the following code diff carefully and return structured feedback.

## Context

- **Language**: {{language}}
- **Framework**: {{framework}}
- **PR title**: {{pr_title}}

## Diff

```diff
{{diff}}
```

## Review instructions

Evaluate the diff across these dimensions and return findings in each section.
Only include sections where you found issues. For each issue, cite the affected
file and line number.

1. **Correctness** — logic bugs, off-by-one errors, edge cases, incorrect use of
   APIs. Does the code do what the PR description claims?
2. **Security** — injection, XSS, deserialization, secret leakage, improper
   auth/authz. Flag anything that would fail a security audit.
3. **Error handling** — silent failures, swallowed exceptions, missing retries,
   unhandled promise rejections.
4. **Performance** — N+1 queries, unbounded loops, inefficient data structures,
   unnecessary allocations.
5. **Style** — naming, indentation, line length, formatting inconsistencies
   with the existing codebase.
6. **Tests** — missing test coverage for new branches or edge cases.

## Output format

Return a markdown report with one `##` heading per dimension that has findings.
Each finding must include: the file, the line range, the issue, and a
concrete recommended fix. Do not include dimensions with no findings.

End with a one-line verdict: `APPROVE`, `REQUEST_CHANGES`, or `COMMENT`.
