# Kalkux

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Version](https://img.shields.io/badge/version-0.1.0--alpha-orange)]()

E-commerce engine. Static sites, no server, no build step. One script, three JSONs, deploy.

## What is Kalkux

Kalkux is an e-commerce engine that replaces WordPress + WooCommerce. It works with static HTML: a single JS file renders an entire store from 3 JSON files (config, theme, products). Deploy on any static hosting.

Built for developers and AI agents that need to create stores fast.

**Zero dependencies. No framework. No build step. No server.**

## Quick Start

1. Copy `engine/js/kalkux.js` and `engine/css/kalkux.css` to your project
2. Create your data files: `data/config.json`, `data/theme.json`, `data/products.json`
3. Add one script tag to your HTML:

```html
<script src="js/kalkux.js" data-kx-store="my-store"></script>
```

4. Deploy to any static hosting (Cloudflare Pages, Vercel, Netlify, GitHub Pages)

See `examples/kilig/` for a complete working store.

## CDN

Use jsDelivr to load the engine directly from this repo — no need to copy files:

```html
<!-- Latest from main -->
<script src="https://cdn.jsdelivr.net/gh/chuchurex/kalkux@main/engine/js/kalkux.js"></script>
<link  href="https://cdn.jsdelivr.net/gh/chuchurex/kalkux@main/engine/css/kalkux.css" rel="stylesheet">

<!-- Pinned to a release tag (recommended for production) -->
<script src="https://cdn.jsdelivr.net/gh/chuchurex/kalkux@v0.1.0-alpha/engine/js/kalkux.js"></script>
<link  href="https://cdn.jsdelivr.net/gh/chuchurex/kalkux@v0.1.0-alpha/engine/css/kalkux.css" rel="stylesheet">
```

`@main` always serves the latest commit. Pin to a tag like `@v0.1.0-alpha` for stability.

## Architecture

```
kalkux.com (this repo - platform)
├── engine/
│   ├── js/kalkux.js        # Engine (~600 lines, vanilla JS)
│   └── css/kalkux.css       # Base styles (CSS custom properties)
├── examples/
│   └── kilig/               # First client: Kilig Coffee
└── README.md

client-site (separate repo per client)
├── index.html               # HTML shell (~50 lines)
├── js/kalkux.js             # Engine (local copy or CDN)
├── css/style.css            # Styles (can extend kalkux.css)
└── data/
    ├── config.json          # Store, navigation, sections, contact
    ├── theme.json           # Colors, fonts, spacing
    └── products.json        # Products, variants, prices
```

## How it works

The engine is a JS object that:

1. **Reads data**: detects local mode (JSON files) or API mode (remote fetch)
2. **Applies theme**: injects CSS custom properties from theme.json
3. **Renders**: header, hero, about, products, gallery, contact, footer
4. **Handles variants**: modal with dynamic selectors, per-variant pricing
5. **Connects Snipcart**: injects API key and custom fields for checkout

### Data source

```html
<!-- Local mode (current) -->
<script src="js/kalkux.js" data-kx-store="my-store"></script>

<!-- API mode (future) -->
<script src="https://cdn.kalkux.com/v1/kalkux.js"
        data-kx-api="https://api.kalkux.com/v1"
        data-kx-store="my-store"></script>
```

### Conventions

| Concept | Prefix | Example |
|---------|--------|---------|
| Data attributes | `data-kx-` | `data-kx-store`, `data-kx-api` |
| HTML ids | `kx-` | `kx-header`, `kx-footer` |
| CSS loaded class | `kx-loaded` | `body.kx-loaded` |
| JS global | `Kalkux` | `Kalkux.init()` |

## Products

**Simple** (no variants): fixed price, direct buy button.

**With variants**: modal with selectors. Price can be fixed or per-variant (e.g. price changes by weight).

```json
{
  "variantTypes": [
    { "id": "size", "label": "Size", "options": [{"value": "s", "label": "S"}] },
    { "id": "color", "label": "Color", "options": [{"value": "black", "label": "Black"}] }
  ],
  "products": [
    { "id": "tshirt", "variants": ["size", "color"], "pricing": {"type": "fixed", "price": 19900} }
  ]
}
```

Works for any product type: coffee (weight/grind), clothing (size/color), electronics (capacity/color), etc.

## Theme

Styles are injected as CSS custom properties on load:

```json
{
  "colors": { "primary": "#2C1810", "secondary": "#8B5A2B", "accent": "#D4A574" },
  "spacing": { "xs": "0.5rem", "sm": "1rem", "md": "2rem", "lg": "4rem", "xl": "6rem" },
  "radius": { "sm": "4px", "md": "8px", "lg": "16px" },
  "shadows": { "sm": "0 2px 4px rgba(0,0,0,0.1)" }
}
```

## Live Stores

| Store | Store ID | Repo | URL |
|-------|----------|------|-----|
| Kilig Coffee | `kilig` | [chuchurex/kilig](https://github.com/chuchurex/kilig) | kilig.chuchurex.cl |

## Stack

- HTML + CSS + vanilla JavaScript (zero dependencies)
- Snipcart (cart + checkout)
- Cloudflare Pages (static hosting, $0)
- No framework, no build step, no server

## Roadmap

### Phase 1 - Engine (current)
- [x] JS engine with JSON-driven rendering
- [x] Generic variant system
- [x] Theme injection via CSS custom properties
- [x] Data source abstraction (local/API)
- [x] CDN to serve kalkux.js (jsDelivr)

### Phase 2 - Backend
- [ ] REST API (FastAPI) for stores/config/products
- [ ] Admin dashboard (Sanity CMS)
- [ ] Authentication and user accounts
- [ ] Database for stores

### Phase 3 - SaaS
- [ ] Free account registration
- [ ] Free tier (low volume)
- [ ] Paid tier (high volume)
- [ ] CLI: `npx create-kalkux-store`

### Phase 4 - Mobile
- [ ] Mobile app (Expo/React Native)
- [ ] Push notifications (Firebase)
- [ ] Order tracking

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

Kalkux is licensed under the [GNU Affero General Public License v3.0](LICENSE).

This means you can freely use, modify, and distribute Kalkux. If you run a modified version as a network service (SaaS), you must make your source code available under the same license.

## Links

- Platform: https://github.com/chuchurex/kalkux
- First client: https://github.com/chuchurex/kilig
