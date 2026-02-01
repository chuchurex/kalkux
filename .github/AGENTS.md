# Agent Workflow Guide

Instructions for AI agents (Claude Code, Copilot, etc.) working on this repo.

## Commit rules

- All commits must be authored by the repo owner. Never add `Co-Authored-By` headers.
- Never include links to AI sessions (claude.ai, copilot, etc.) in commit messages.
- Follow conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.
- First line: what changed (max 72 chars). Body: why it changed.

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
   gh pr create --title "feat: short description" --body "Description of changes"
   ```

5. PRs are merged to `main`. One feature per PR.

## Commit message format

```
feat: add gallery lazy loading

Implement intersection observer for gallery images to reduce
initial page load time. Images load when scrolled into viewport.
```

Good:
- `feat: add variant search to product modal`
- `fix: price not updating when selecting variant`
- `docs: add deployment guide for Cloudflare Pages`
- `refactor: extract theme injection into separate function`

Bad:
- `update files`
- `fix bug`
- `WIP`

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
