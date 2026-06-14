# Changelog

All notable changes to this site will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] — 2026-06-03

### Changed
- **Azure accent system** — replaced the Coinbase-blue accent (`#1652F0`) with an Azure palette (`#1E9FD4`) sitewide. Consolidated scattered hardcoded `rgba(22,82,240,…)` values into a six-token CSS custom-property system: `--accent`, `--accent-hover`, `--accent-pressed`, `--accent-soft`, `--accent-glow`, `--accent-contrast`.
- **404 page** — "404" mark, accent text, and the "Back to…" button updated to Azure.
- **Contrast fix** — filled-accent elements ("Request Access" button, primary contact link, 404 button) now use near-black text (`--accent-contrast` / `#07111A`) instead of white, since lighter Azure fails contrast with white.
- README live badge color updated to Azure.

## [1.4.0] — 2026-05-21

### Added
- **Open Graph social preview image** (og-image-v2.png) — branded dark card for LinkedIn/Slack/Twitter shares
- `twitter:card` and `twitter:image` meta tags for X/Twitter large image cards
- **Google Analytics** (G-NWHDZBB875) with deferred loading for zero render-blocking impact
- Content Security Policy meta tag for GA script and connection sources
- **Branded "ST" favicon set** — ICO, PNG 16/32/192/512, Apple Touch Icon
- **Custom 404 page** matching dark fintech theme with branded messaging
- Google Search Console verification via HTML meta tag

### Changed
- `og:description` extended to 181 characters to meet LinkedIn 100-char minimum
- `og:title` extended to match page title ("Shaillesh Tannu — Engineering Leader | Financial Infrastructure")
- Accessibility: improved color contrast for small text (#4B8BF5 for WCAG AA compliance), added `aria-label` to mobile nav hamburger, added `focus-visible` outlines on all interactive elements
- Performance: Google Analytics deferred 1.5s post-load, Google Fonts loaded non-blocking via `media="print"` swap pattern
- Lighthouse CI upgraded to per-page `assertMatrix` — index.html and 404.html audited separately with page-appropriate thresholds
- Performance threshold restored to 0.9 after deferred GA optimization

### Removed
- Generic recruiter tagline from Documents section

## [1.3.0] — 2026-05-20

### Added
- **Lighthouse CI** on every PR — Performance, Accessibility, Best Practices, SEO scored via `treosh/lighthouse-ci-action@v12` with 3 median runs
- Lighthouse CI added as required status check in branch protection (alongside Validate HTML)
- **SEO: JSON-LD structured data** — `Person` schema with name, role, LinkedIn, Twitter, and domain expertise
- **SEO: `robots.txt`** allowing all crawlers with sitemap reference
- **SEO: `sitemap.xml`** submitted to Google Search Console
- **SEO: canonical URL** (`<link rel="canonical">`) to prevent duplicate content
- Google Search Console verification via HTML meta tag
- Site property verified and sitemap indexed by Google

### Changed
- Lighthouse assertions set to `error` with enforced floors: Performance 90, Accessibility 90, Best Practices 90, SEO 95

### Removed
- Generic recruiter tagline from Documents section ("Everything a recruiter or hiring manager needs — in one place.")
## [1.2.0] — 2026-05-11

### Added
- `README.md` with project description, stack rationale, repo standards, and live CI status badge
- Live site badge in README linking to shailleshtannu.com
- **Content Security Policy** via `<meta http-equiv>` tag with hash-pinned inline script (defense against XSS and supply-chain attacks)
- **Referrer-Policy** meta tag (`strict-origin-when-cross-origin`) to prevent URL leakage to external sites
- `rel="noopener noreferrer"` on all external `target="_blank"` links (defends against tab-nabbing and prevents referrer leakage)

### Changed
- Inline `onclick` handler on mobile nav button refactored to `addEventListener` (required for strict CSP compliance)
- HTML validation workflow now runs on every PR (was previously scoped to HTML-touching changes only — caused branch protection to deadlock on README/docs PRs)

### Security
- Site now passes a meaningful subset of common static-site security best practices: CSP with hash-pinned scripts, link safety attributes, referrer policy, and HTTPS enforcement (the last via GitHub Pages configuration)

## [1.1.0] — 2026-05-09

### Added
- Hero proof strip with 8 metrics covering engineering leadership, reconciliation, settlement compression, uptime, fund flow automation, IRS tax reporting, audit posture, and founder exit
- "How I Work" section — six leadership principles using a hook → re-hook writing pattern, covering business mindset, team trust, detail-orientation, frameworks-over-heroics, roadmap discipline, and calm delivery
- "Signature Wins" section — 3×3 grid of headline metrics with full context, all delivered in regulated environments or scaled to production
- Self-serve platform highlight, ~40% faster incident response, ~16% AWS optimisation in experience cards
- Gated "Request Access" CTA on Leadership Brief — mailto with pre-filled subject and structured body fields

### Changed
- Hero hook refined to: *"I build financial systems where every dollar must be accurate, auditable, and compliant."*
- Coinbase and Nium experience cards expanded to 6 highlights and 6 metric tags each
- Earlier-career roles now show concrete metrics
- Case Study 02 title refined to "Audit-Ready Systems at NASDAQ Scale"
- Resume link points direct to file (was: folder link)

### Removed
- 4-metric hero block (replaced by 8-cell proof strip)

## [1.0.0] — 2026-05-09

### Added
- Initial launch of shailleshtannu.com
- Dark fintech theme with Coinbase Blue (#1652F0) accent
- IBM Plex Sans + IBM Plex Serif typography
- Sections: Hero, About, Experience, Leadership Brief, Skills, Documents, Contact
- Resume linked from Google Drive
- Leadership Brief gated via mailto request
- GitHub Pages deployment with custom domain
- HTTPS enforced via GitHub Pages
