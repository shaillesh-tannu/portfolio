# shailleshtannu.com

[![HTML Validation](https://github.com/shaillesh-tannu/portfolio/actions/workflows/html-validation.yml/badge.svg)](https://github.com/shaillesh-tannu/portfolio/actions/workflows/html-validation.yml)
[![Live](https://img.shields.io/badge/live-shailleshtannu.com-1652F0)](https://shailleshtannu.com)

Personal portfolio site for **Shaillesh Tannu** — Engineering Leader, Financial Infrastructure (Payments · Fintech · Crypto).

→ [**shailleshtannu.com**](https://shailleshtannu.com)

## About this site

A single-page static site that summarises 18+ years of engineering leadership across crypto ledgers, cross-border payments, reconciliation, and tax compliance — at NASDAQ-listed scale.

The site is intentionally lightweight: one HTML file, embedded CSS, vanilla JS. No frameworks, no build step, no JavaScript bundlers.

## Stack

| Layer | Choice | Why |
|---|---|---|
| **Markup** | HTML5 | Standards-compliant, validated on every PR |
| **Styling** | Inline CSS with custom properties | One file, zero build, easy to maintain |
| **Behaviour** | Vanilla JS | No framework needed for a static site |
| **Typography** | IBM Plex Sans + IBM Plex Serif | Clean, financial-industry-appropriate |
| **Hosting** | GitHub Pages | Free, fast, integrated with the repo |
| **CDN** | GitHub Pages global edge | Automatic HTTPS, fast worldwide |
| **DNS** | GoDaddy → GitHub Pages | Custom domain with HTTPS enforced |
| **CI** | GitHub Actions | HTML validation on every PR |

## Repo standards

This is a personal repo, but treated with professional hygiene:

- **Branch protection** — `main` is protected; all changes via PR
- **CI gating** — HTML validation must pass before merge
- **Linear history** — squash-and-merge only
- **Conventional commits** — `feat:`, `chore:`, `ci:`, etc.
- **Versioned changelog** — see [`CHANGELOG.md`](./CHANGELOG.md)
- **Security headers** — CSP, Referrer-Policy, link safety

## Local development

​```bash
git clone https://github.com/shaillesh-tannu/portfolio.git
cd portfolio
# Open index.html directly in a browser, or:
python3 -m http.server 8000
# Visit http://localhost:8000
​```

## Contributing

This is a personal site and not accepting external contributions. If you spot a bug or have a suggestion, feel free to [open an issue](https://github.com/shaillesh-tannu/portfolio/issues).

## License

Content (text, metrics, biographical details) is © Shaillesh Tannu. The site's structure and code are available under the MIT License if
