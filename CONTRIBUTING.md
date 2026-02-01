# Contributing to Kalkux

Kalkux is open source under the AGPL-3.0 license. Contributions are welcome.

## How to contribute

### Reporting bugs

Open an issue using the **Bug Report** template. Include:
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS

### Suggesting features

Open an issue using the **Feature Request** template. Describe the use case, not just the solution.

### Submitting code

1. Fork the repo
2. Create a branch from `main`: `git checkout -b fix/description`
3. Make your changes
4. Test manually with a client store (see `examples/kilig/`)
5. Commit with a clear message: `fix: description of what was fixed`
6. Open a pull request against `main`

## Branch naming

- `fix/short-description` for bug fixes
- `feat/short-description` for new features
- `docs/short-description` for documentation
- `refactor/short-description` for refactoring

## Commit messages

Use conventional commits:

```
feat: add gallery lazy loading
fix: variant price not updating on selection
docs: add quick start guide
refactor: extract theme injection to separate function
```

## Code style

- Vanilla JavaScript only (no frameworks, no dependencies)
- 2 spaces for indentation
- Single quotes for strings
- No semicolons (match existing style in `kalkux.js`)
- Keep the engine under 1000 lines

## What we accept

- Bug fixes
- Performance improvements
- Accessibility improvements
- New section types for the engine
- Documentation improvements
- Examples of client stores

## What we don't accept

- Adding npm dependencies to the core engine
- Build steps or transpilation
- Framework-specific code in the engine
- Changes that break existing client stores

## Questions

Open a discussion or issue. We'll respond as soon as we can.
