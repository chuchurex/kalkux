# Agent Workflow Guide

Instructions for AI agents (Claude Code, Copilot, etc.) working on this repo.

## Commit rules

- All commits must be authored by the repo owner. Never add `Co-Authored-By` headers.
- Never include links to AI sessions (claude.ai, copilot, etc.) in commit messages.
- No conventional commit prefixes. No `feat:`, `fix:`, `docs:`, etc.
- English imperative verb + what changed (max 72 chars). Body (optional): why.
- Start with a verb: `Add`, `Fix`, `Replace`, `Update`, `Remove`, `Use`, `Clear`.

## Branch + PR workflow

Never commit directly to `main`. Always:

1. Create a branch from `main`:
   ```
   git checkout -b feat/short-description
   ```

2. Branch naming:
   - `feat/description` — new features
   - `fix/description` — bug fixes
   - `docs/description` — documentation
   - `refactor/description` — code refactoring
   - `chore/description` — tooling, CI, config

3. Make commits on the branch. One logical change per commit.

4. Push and create a PR:
   ```
   git push -u origin feat/short-description
   gh pr create --title "Add short description" --body "Description of changes"
   ```

5. PRs are merged to `main`. One feature per PR.

## Commit message format

```
Add gallery lazy loading

Implement intersection observer for gallery images to reduce
initial page load time. Images load when scrolled into viewport.
```

Good:
- `Add variant search to product modal`
- `Fix price not updating when selecting variant`
- `Add deployment guide for Cloudflare Pages`
- `Replace inline styles with CSS custom properties`
- `Use jsDelivr CDN for engine distribution`
- `Remove unused helper function from engine`

Bad:
- `update files`
- `fix bug`
- `WIP`
- `feat: add something` (no prefixes)

## Code rules

- Vanilla JavaScript only. No npm dependencies for the engine.
- No build step. No transpilation.
- 2 spaces indentation.
- Keep engine under 1000 lines.
- CSS via custom properties (theme.json injection).

## Project structure

```
engine/
├── js/kalkux.js     # Core engine (do not split into modules)
└── css/kalkux.css   # Base styles

examples/
└── kilig/           # Reference client implementation

.github/
├── workflows/       # CI (lint on PRs)
├── ISSUE_TEMPLATE/  # Bug report + feature request
└── AGENTS.md        # This file
```

## Testing changes

There is no automated test suite yet. Test manually:

1. Copy modified engine files to a client repo (e.g. kilig)
2. Serve locally and verify all sections render
3. Test variant selection and pricing
4. Test mobile responsiveness
5. Verify Snipcart integration

## Issues as backlog

Each planned feature should be a GitHub Issue before work begins.
Reference the issue in the PR: `Fixes #12` or `Closes #12`.
