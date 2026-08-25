# Product Requirements Document
## Techily Fly — Website Redesign (techilyfly.com)

| | |
|---|---|
| **Version** | 1.0 (Draft) |
| **Date** | August 25, 2026 |
| **Prepared for** | Techily Fly |
| **Reference implementation** | idearise.co (Idea Rise Technologies) — layout, structure, and content pattern donor |
| **Status** | Draft — ready for build, pending the content confirmations listed in §11 |

---
Contact Details:

Email: 
support@techilyfly.com
TechilyFly@gmail.com

Phone / WhatsApp:
+91 8825164657

Address:
Techily Fly By AbdurRahman Ibn Ghufran,
Ward No. 07, Lahsaniya, Khoripakar, Dewapur,
Pachpakari, Patahi, Dhaka, Motihari,
East Champaran, Bihar, India – 845427
---------------------
Our Clients:
Ethsltd
https://ethsltd.com/

AndamanAnchorage
https://andamananchorage.com/

Aethron Global
https://aethronglobal.com/

Pizza-House.uk
https://pizza-house.uk/

Rosely Dot In
https://rosely.in

Asr Foundation
https://asrfoundation.org/

---
Reviews get from:
https://www.trustpilot.com/review/techilyfly.com
and also ask client to review us.
----
## 1. Overview & Purpose

This PRD specifies a full redesign and rebuild of **techilyfly.com**. The brief is deliberately narrow and specific:

1. **Content and layout:** reuse the structure, section order, copy patterns, and page composition of idearise.co almost verbatim — same sections, same information density, same interaction patterns.
2. **Visual identity:** replace idearise.co's blue/purple palette and default typography with Techily Fly's mandated design tokens — **TF Graphite, Signal Coral, Cloud Surface**, set in **Manrope** and **Geist Mono** — and rebuild every gradient in the source site using this new palette instead of the old blue-to-purple ones.
3. **Stack:** rebuild entirely on Cloudflare's free-tier products (Pages/Workers, D1, Turnstile, Email Service, Web Analytics) with a static-first generator — Astro is the working recommendation.
4. **Performance:** the site must load fast even on constrained/slow mobile networks. This is a hard requirement, not an aspiration, and it directly conflicts with parts of the reference implementation (see §10 and §13) — those conflicts are called out explicitly below rather than silently dropped.

A small naming note worth keeping in mind while building: "Fly" is already the operative word in the brand name. A slow site undercuts the name. Performance isn't just an NFR here — it's the one part of the brief that's load-bearing for the brand itself.

---

## 2. Background & Design Reference

The reference file is idearise.co, a services-agency marketing site (single long-scroll home page + `case-studies.html`, `privacy-policy.html`, `terms-of-use.html`) built with Tailwind (via the runtime Play CDN), vanilla JS, GSAP, and three.js for ambient 3D backgrounds.

**Confirmed:** techilyfly.com is a live, existing domain — Techily Fly is an operating web design/development and digital-marketing business (founder-led, India-based) with its own social presence (LinkedIn, Facebook, YouTube) and its own genuine customer reviews on Trustpilot. This matters for two sections of this document:

- §12 (Technical Architecture) treats this as a **migration**, not a green-field launch — DNS and existing `@techilyfly.com` mailboxes need to survive the cutover.
- §11 (Content Governance) is written the way it is *because* Techily Fly already has real reviews and a real track record of its own — the site doesn't need to borrow anyone else's.

---

## 3. Goals & Success Metrics

| Goal | Metric |
|---|---|
| Visual rebrand lands cleanly | 100% of idearise.co's blue/purple/slate color usage replaced with TF tokens; zero non-brand hues shipped |
| Fast on real-world mobile networks | Lighthouse Mobile Performance ≥ 90; LCP ≤ 2.5s on throttled Slow 4G (target 1.8s) — see §13 for full budget |
| Zero recurring hosting cost at current traffic | $0/month infrastructure spend, fully inside Cloudflare free tiers (§12) |
| Structural parity with reference site | Every section in idearise.co has a 1:1 equivalent on techilyfly.com (§8) |
| No false trust claims shipped | Testimonials, client list, and stats are Techily Fly's own by launch (§11) |
| Accessible by default | WCAG 2.1 AA on color contrast, focus states, motion (§13) |

---

## 4. Target Audience

Same buyer profile as the reference site's implied audience: SMB/mid-market founders and operations leads evaluating an outsourced dev/automation partner, largely on mobile or low-to-mid-tier laptops, often on inconsistent connectivity (this is explicitly why §13's performance budget is strict, not decorative).

---

## 5. Scope

**In scope**
- Home page (all sections listed in §8)
- Global nav, footer, contact form
- Design system implementation (tokens, gradients, type)
- Astro + Cloudflare build, deploy, and contact-form backend

**Structurally in scope, content out of scope for this document** (source content wasn't provided, so only the shell is specified)
- `case-studies.html` equivalent — needs its own case-study content
- `privacy-policy.html` / `terms-of-use.html` equivalents — need legal copy (recommend counsel review, not AI-drafted)

**Out of scope**
- CMS/blog
- Multi-language support
- Any content that isn't genuinely Techily Fly's (see §11)

---

## 6. Brand & Design System

### 6.1 Core identity

> Serious technology. Intelligent systems. Human energy.

### 6.2 Mandatory tokens

| Brand token | Hex | Primary use |
|---|---|---|
| TF Graphite | `#212121` | Primary text, dark section backgrounds, headline base |
| Signal Coral | `#FF7759` | Accent, CTAs, links, highlight states, energy/motion cues |
| Cloud Surface | `#FAFAFA` | Light backgrounds, cards-on-dark, text on Coral/Graphite |

No other hue enters the palette. Everything below is a **tint or shade of these three tokens**, not a new color — kept minimal on purpose, in the same spirit as the "intentionally narrow" system described in the brief.

### 6.3 Derived utility scale (for states the 3 flat tokens can't cover alone)

```css
:root {
  /* Brand tokens — mandatory, do not alter */
  --tf-graphite:      #212121;
  --tf-coral:          #FF7759;
  --tf-cloud:          #FAFAFA;

  /* Derived neutrals — Graphite → Cloud ramp, for text hierarchy & borders */
  --tf-graphite-80:    #454545;
  --tf-graphite-60:    #6B6B6B;
  --tf-graphite-40:    #9A9A9A;
  --tf-graphite-20:    #C9C9C9;
  --tf-graphite-10:    #E4E4E4;   /* hairline borders */

  /* Derived coral states — for hover / active / subtle fills */
  --tf-coral-light:    #FF9680;   /* hover glow, lighter accents */
  --tf-coral-dark:     #E85C3F;   /* pressed/active state */
  --tf-coral-10:       rgba(255, 119, 89, 0.10); /* tinted badge backgrounds */
  --tf-coral-35:       rgba(255, 119, 89, 0.35); /* glow/shadow opacity */

  /* Surface */
  --tf-white:          #FFFFFF;
}
```

### 6.4 Gradient system (replaces every blue/purple gradient in the reference site)

The reference site leans on gradients in four places: headline text-fill, glass-card hover glow, dark section backgrounds, and the hero/particle color field. Each gets a direct token-derived replacement:

```css
:root {
  /* Headline text-fill gradient — replaces "from-white via-blue-200 to-blue-400" */
  --gradient-heading: linear-gradient(90deg, var(--tf-cloud) 0%, var(--tf-coral-light) 55%, var(--tf-coral) 100%);

  /* CTA / hover glow — replaces the blue box-shadow glow on .hover-3d */
  --gradient-signal: linear-gradient(135deg, var(--tf-coral) 0%, var(--tf-coral-light) 100%);

  /* Dark section depth — replaces "via-slate-900 to-purple-900/20" */
  --gradient-depth: linear-gradient(180deg, #000000 0%, var(--tf-graphite) 100%);

  /* Ambient radial glow behind hero/CTA content — replaces the blue radial glow */
  --gradient-glow: radial-gradient(circle, var(--tf-coral-35) 0%, rgba(255,119,89,0) 70%);
}
```

Apply 1:1: every Tailwind utility in the source using `blue-400/500/600`, `purple-500/900`, `slate-900`, `indigo-500`, `teal-500`, etc. maps to one of the four gradients or the flat tokens above — no exceptions, no "just this once" extra hue (e.g. the six testimonial-avatar gradients and thirteen client-badge gradients in the source each use a different color pair; on Techily Fly all of them collapse to variations of Graphite/Coral/Cloud so the "intentionally narrow" rule actually holds).

### 6.5 Typography

| Role | Typeface | Applied to |
|---|---|---|
| Brand, headings, UI, body | **Manrope** | Nav links, H1–H4, body copy, testimonial quotes, buttons, form fields, footer |
| Technical / code / machine-data layer | **Geist Mono** | Stat numbers (300+ / 40+ / 30%), the small tech-detail line under each capability card, matrix-rain glyphs, footer copyright/meta line |

Self-host both via `@fontsource/manrope` and `@fontsource/geist-mono` (npm, bundled at build time) rather than a Google Fonts `<link>` — this removes an external DNS lookup + render-blocking request, which matters directly for §13. Preload only the two weights used above the fold (Manrope 500/700); lazy the rest.

No other font family is introduced anywhere in the build, including in generated OG images or PDFs, without a design-system revision.

---

## 7. Information Architecture

```
techilyfly.com/
├── /                      → Home (all sections below, single scroll)
├── /case-studies          → Case studies listing (shell only — content TBD)
├── /privacy-policy        → Legal (content TBD)
└── /terms-of-use          → Legal (content TBD)
```

Nav (desktop + mobile, identical to source): **Home · Services · Process · Testimonials · Clients · Case Studies · Contact** — all in-page anchors except Case Studies, which is a route.

---

## 8. Page & Section Specifications

Each section below states: what it is, what changes (visual only), and what stays untouched (structure + copy). Full copy is consolidated in **Appendix A**.

### 8.1 Navbar
Fixed nav, glass-blur on scroll (`.scrolled` state already in source JS — keep). Logo swaps to Techily Fly's mark. Link color: Graphite text → Coral on hover (was gray → blue-400). Mobile hamburger + slide-down menu behavior unchanged.

### 8.2 Hero
- H1 (currently H3 in source markup — recommend correcting to a true H1 for SEO/accessibility while rebuilding): "We are your **[typewriter]**" — typewriter cycles the same 5 phrases as source (see Appendix A).
- Subhead, two CTAs ("Start Now →" to booking link, "Case Studies" to `/case-studies`), and the 3-stat row (300+ / 40+ / 30%) — **stat values are placeholders**, flagged in §11.
- Background: matrix-rain canvas + hero 3D particle/shape field + ambient radial glow, all recolored to `--gradient-glow` / Coral-on-Graphite instead of blue.

### 8.3 Capabilities ("What We Do")
Six service cards in a 3-column grid (2-col tablet, 1-col mobile), each with icon tile, title, one-line description, and a Geist Mono detail line. Content is generic service description (not a factual claim about a third party), so it carries over as-is — see Appendix A for the full six.

### 8.4 Process ("How We Work")
Desktop: horizontal 4-step timeline (Understand → Design → Build → Support) on a gradient line. Mobile: 5 cards (Strategy → Design → Build → **Deploy** → Support).

**Recommendation:** the source is inconsistent between breakpoints — desktop silently drops the "Deploy" step. Standardize on the fuller 5-step version (Understand/Strategy → Design → Build → Deploy → Support) at every breakpoint rather than replicating the gap; flagged as a deliberate deviation from strict 1:1 copying because a dropped step at one breakpoint reads as a bug, not a decision. If exact fidelity to the source is preferred instead, keep the 4-step desktop version — either is a one-line change in the component.

### 8.5 Testimonials ("What Our Clients Say")
Six cards: gradient-initial avatar, quote, name, role/company, country. **Layout and card structure carry over exactly.** The six specific people/companies from idearise.co do not — see §11. Ship this section with clearly-marked placeholder content until real quotes are supplied.

### 8.6 Clients ("Trusted by Industry Leaders")
Infinite horizontal marquee of gradient badge cards. **Layout carries over exactly** (badge shape, scroll speed/direction, gradient-per-card treatment recolored to the Coral/Graphite system). The thirteen specific company names from idearise.co do not — see §11.

### 8.7 CTA ("Your Concerns, Our Solutions")
Headline + subhead + body + two buttons (booking link, mailto). Copy carries over as-is (generic). Both links need Techily Fly's own booking URL and email — see §11.

### 8.8 Footer
Company blurb, contact line, social icons, contact form (Name/Email/Message → Send), bottom bar with copyright + legal links. Structure and field set carry over exactly; the actual email/location/social URLs are Techily Fly's own — see §11.

---

## 9. Component Inventory

Reusable pieces to build once, not per-section:

`Navbar` · `MobileMenu` · `TypewriterText` · `StatCard` · `CapabilityCard` · `ProcessStep` · `TestimonialCard` · `ClientBadge` (+ `Marquee` wrapper) · `GradientHeading` · `GlassCard` (the `.glass-dark` / `hover-3d` treatment, recolored) · `ContactForm` · `Footer`

---

## 10. Interaction, Motion & 3D — Spec + Technical Audit

The source's motion language (matrix rain, three.js particle/DNA/stream backgrounds, GSAP hover glow, typewriter, scroll-reveal, button ripple) is part of "same design" and should be kept. Three things found in the reference implementation are worth fixing, not copying, while rebuilding:

| Finding | Why it matters | Fix |
|---|---|---|
| `initCTA3D()` starts with `return;` — dead code, and its target `#ctaCanvas` div doesn't exist in the markup | Ships unused JS for a feature that never runs | Drop entirely; not needed in the rebuild |
| The "process" 3D flowing-data-stream canvas (`#processCanvas`) is nested inside the **Hero** section's markup, not inside `#process` | The effect visually renders behind the hero, not behind the process timeline — looks like a copy-paste slip | Move the canvas container into the actual Process section on rebuild |
| The `visibilitychange` listener only toggles a CSS `animationPlayState` class | This does nothing for the three.js `requestAnimationFrame` loops or the matrix-rain `setInterval` — neither is a CSS animation, so **all three keep running (and draining battery/CPU) when the tab is hidden** | Use the Page Visibility API to actually cancel the rAF loops and clear the interval on hide, and resume on show |

**Performance-driven changes to the motion system** (ties directly to §13):
- Bundle three.js and GSAP via npm, not CDN `<script>` tags; import only the modules used (no `OrbitControls` — nothing in the source uses camera controls).
- Lazy-init each 3D scene via `IntersectionObserver` — only construct the renderer for a section once it's actually about to enter the viewport, and `dispose()` its geometry/materials/renderer when it scrolls back out.
- Tier particle/mesh counts down on `navigator.hardwareConcurrency`-low devices and on narrow viewports.
- Respect `prefers-reduced-motion`: skip WebGL entirely, fall back to a static `--gradient-depth` background.
- Respect `navigator.connection.saveData` / `effectiveType` (`slow-2g`/`2g`/`3g`): same fallback as reduced-motion — this is the direct mechanism for "fast even on slow networks" rather than just a nice-to-have.

---

## 11. Content Governance — Confirm Before Launch

Everything in §8 is structural and safe to carry over 1:1. The items below are **specific factual claims** in the reference site (named people, named companies, a location, a track record, contact endpoints) that belong to Idea Rise Technologies, not to Techily Fly. Since Techily Fly is a real, distinct, already-operating business — with its own genuine reviews and social presence — the right move is to source this content from Techily Fly itself rather than carry Idea Rise's claims across. Ship these sections with placeholders until confirmed:

- **Testimonials (6 cards)** — replace with Techily Fly's own client quotes. (Worth knowing: there's already at least one genuine public review referencing techilyfly.com that could be a starting point, subject to getting the reviewer's permission to feature it.)
- **Client logo marquee (13 names)** — replace with companies Techily Fly has actually worked with, or omit the section until there's a real list to show.
- **Hero stats (300+ projects / 40+ countries / 30% cost saving)** — these are Idea Rise's numbers; swap for Techily Fly's actual figures, or reframe the section around metrics Techily Fly can stand behind today.
- **Contact email, office location, Calendly link, LinkedIn URL** — the source hard-codes Idea Rise's real inbox and a named individual's real booking calendar; Techily Fly needs its own throughout (its existing `support@` / `business@` address pattern is a reasonable starting point).
- **Footer legal name & copyright line** — swap entity name, and update the year to 2026.
- **Service positioning** — the source's six capability cards describe a custom-software/AI-ML dev shop; confirm this still matches how Techily Fly wants to position itself, since its public presence currently reads closer to web design/digital marketing. If the positioning has shifted, the six cards need a copy pass (layout stays identical either way).
- **Case Studies / Privacy Policy / Terms of Use pages** — not included in the source file, so only the route shells are specified here; content needs to be authored (legal pages ideally reviewed by counsel rather than templated).

None of this blocks development — the build can proceed against the placeholders in Appendix A and swap in confirmed content before the site goes live.

---

## 12. Technical Architecture

### 12.1 Stack summary

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro**, default `output: 'static'` | Islands architecture ships zero JS by default — only the interactive bits (mobile menu, typewriter, form, 3D scenes) hydrate. No SSR adapter needed since this is a static marketing site, which also sidesteps Astro's Cloudflare *adapter* being Workers-only now — a plain static build has no adapter dependency at all. |
| Styling | **Tailwind CSS**, compiled at build time (official Astro integration) | Keeps the utility-class authoring style the source already uses, but removes the runtime Play CDN (`cdn.tailwindcss.com`) the source currently loads in `<head>` — that CDN script is explicitly not meant for production and is a direct tax on load time; it must not ship. Theme extended with the tokens in §6.3. |
| Hosting | **Cloudflare Pages** (free) | Git-connected, auto-builds on push, unlimited bandwidth/requests for static assets, global CDN. (Cloudflare's newer projects are increasingly steered toward Workers-with-static-assets as the long-term unified platform — worth a quick check against Cloudflare's current onboarding flow at build time — but Pages remains fully supported for a static Astro output today and is the simpler path for a marketing site.) |
| Dynamic endpoint | **Cloudflare Pages Function** (`/functions/api/contact.ts`) | Runs on the Workers free tier automatically; the only part of the site that isn't pure static HTML. |
| Form storage | **Cloudflare D1** (free) | Structured, queryable submission log. |
| Spam protection | **Cloudflare Turnstile** (free, unlimited) | Invisible/managed challenge on the contact form. |
| Email notification | **Cloudflare Email Service** (Workers `send_email` binding) | Native, first-party — sends the notification straight from the Pages Function without a third-party email API. Confirm current sending limits against Cloudflare's Email Service docs at build time, since this binding is newer and limits move. |
| Images | **Astro's built-in image pipeline** (`astro:assets`), assets in-repo or on **Cloudflare R2** (free 10GB) | *Not* Cloudflare Images — that product has no free tier. Astro optimizes to WebP/AVIF with responsive `srcset` at build time, which is free and sufficient for a marketing site. |
| Fonts | Self-hosted via `@fontsource/manrope` + `@fontsource/geist-mono` | No Google Fonts round-trip (see §6.5). |
| Analytics | **Cloudflare Web Analytics** (free) | Cookieless, sub-1KB beacon — far lighter than GA4, and stays inside the "completely free on Cloudflare" constraint. |
| DNS / SSL | **Cloudflare DNS** + Universal SSL (free) | Also unlocks Brotli, HTTP/3, and edge caching automatically. |

### 12.2 Suggested project structure

```
techily-fly/
├── src/
│   ├── components/
│   │   ├── Navbar.astro          ProcessSteps.astro
│   │   ├── Hero.astro            TestimonialCard.astro
│   │   ├── TypewriterText.astro  ClientMarquee.astro
│   │   ├── StatCard.astro        CTASection.astro
│   │   ├── CapabilityCard.astro  ContactForm.astro
│   │   └── Footer.astro
│   ├── layouts/BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── case-studies.astro
│   │   ├── privacy-policy.astro
│   │   └── terms-of-use.astro
│   ├── scenes/                    (three.js, dynamically imported)
│   │   ├── matrix-rain.ts
│   │   ├── hero-particles.ts
│   │   └── capabilities-helix.ts
│   ├── styles/tokens.css          (§6.3 / §6.4 as CSS variables)
│   └── content/copy.ts            (Appendix A, centralized)
├── functions/api/contact.ts       (Pages Function: Turnstile verify → D1 insert → email)
├── public/fonts/
├── astro.config.mjs
├── tailwind.config.mjs
└── wrangler.toml
```

### 12.3 DNS / migration note

techilyfly.com is a **live domain with live mailboxes** (`support@`, `business@`), not a green-field launch. Before cutting DNS over to Cloudflare:
1. Export current DNS records in full, especially **MX records** — losing these breaks existing email.
2. Stage the new build on a Pages preview URL / subdomain first.
3. Cut over the apex domain only after the preview has been checked end-to-end (including the contact form, which won't exist as a route until this rebuild ships it).

---

## 13. Non-Functional Requirements

### 13.1 Performance budget (the hard requirement)

| Metric | Target | Notes |
|---|---|---|
| Lighthouse Performance (Mobile) | ≥ 90 | Throttled "Slow 4G" profile |
| LCP | ≤ 2.5s (target 1.8s) | On Slow 4G / mid-tier Android |
| CLS | ≤ 0.1 | Reserve dimensions for all images/canvas; avoid layout shift from font swap |
| INP | ≤ 200ms | |
| Initial JS (above-the-fold, gzipped) | ≤ 150KB | Excludes lazily-loaded 3D scene chunks |
| Total initial route weight | ≤ 1.5MB | Excludes assets loaded on scroll/interaction |
| Fonts | 0 external font requests | Self-hosted, `font-display: swap`, only critical weights preloaded |

Direct consequences for the build (cross-referenced to where each is specified):
- No Tailwind Play CDN — compiled Tailwind only (§12.1).
- 3D scenes lazy-loaded per-section via IntersectionObserver, disposed when off-screen, tiered/skipped on `prefers-reduced-motion` and `saveData` (§10).
- Self-hosted fonts, no Google Fonts (§6.5).
- Static-first Astro output — no SSR cold start on the marketing pages (§12.1).
- Cloudflare's edge network (300+ PoPs, Brotli, HTTP/3) handles the "slow network, far from origin" half of the problem for free; the build handles the "don't ship too much" half.

### 13.2 Accessibility
WCAG 2.1 AA. Verify Coral-on-Cloud and Cloud-on-Graphite text combinations meet 4.5:1 contrast at body-text sizes before finalizing button/link states (Signal Coral on white is borderline for small text — check exact size/weight before shipping small Coral-on-white copy). Full keyboard nav (source already has a keyboard-navigation focus style — keep and extend to all interactive components). Respect `prefers-reduced-motion` (§10).

### 13.3 Browser support
Last 2 versions of evergreen browsers + iOS Safari. No IE11 considerations needed.

### 13.4 Security
Cloudflare Turnstile on the contact form; server-side validation in the Pages Function regardless of client-side checks; no secrets in client bundle (Wrangler secrets for any API tokens).

---

## 14. SEO & Metadata

Carry over the source's `<head>` pattern (title, meta description, Open Graph tags), updated for the new domain/brand:

```html
<title>Techily Fly - Your Own Virtual Tech Team</title>
<meta name="description" content="[Techily Fly's own positioning — see §11]">
<meta property="og:title" content="Techily Fly">
<meta property="og:image" content="https://techilyfly.com/images/og-techily-fly.png">
<meta property="og:description" content="[Techily Fly's own positioning — see §11]">
```

Astro's static output means every route pre-renders to real HTML — no JS-dependent content for crawlers to miss, which the source's canvas-heavy hero doesn't have to worry about either way since the copy itself is server-rendered HTML, not canvas text.

---

## 15. Analytics
Cloudflare Web Analytics beacon in `BaseLayout.astro`, no cookie banner needed (cookieless by design). Track the two CTA buttons (booking, case studies) and contact-form submissions as custom events if/when Web Analytics' current event-tracking options support it — confirm exact capability at implementation time since this product iterates.

---

## 16. Deployment & CI/CD
GitHub repo → Cloudflare Pages, auto-deploy on push to `main`, preview deployments on PRs. Free tier covers this fully at this project's traffic (500 builds/month, unlimited static bandwidth/requests — see Appendix B). `NODE_VERSION` env var set explicitly in Pages project settings to match Astro's current minimum.

---

## 17. Risks & Open Questions

- **Platform drift risk:** Cloudflare has been actively shifting new projects toward "Workers with static assets" as the unified platform; Pages remains supported today for this use case, but re-confirm the recommended path in Cloudflare's own onboarding flow at implementation time rather than assuming this document's snapshot is still current.
- **Email-binding limits:** the native Workers `send_email` binding (§12.1) is a newer capability — confirm its current daily/monthly sending limits before relying on it for a launch with any real traffic volume.
- **Process-section fidelity:** §8.4's 4-vs-5-step recommendation is a deliberate deviation from strict 1:1 copying — confirm which version Techily Fly wants before final build.
- **§11 items** are the main open dependency for launch-readiness; everything else in this document can be built against placeholders in parallel.

---

## Appendix A — Copy Deck (as carried over from idearise.co)

**Hero**
- Headline: "We are your **[typewriter]**" — cycling: *Virtual Tech Team / Automation Experts / Data Managers / Digital Transformers / Technology Backbone*
- Subhead: "We handle everything from strategy to execution, AI to analytics, like your in-house Software team would."
- Stats: `300+` Projects Delivered · `40+` Countries Served · `30%` Average Cost Saving *(placeholder — §11)*

**Capabilities (6 cards — title / description / detail line)**
1. Custom Software Development — Scalable web and mobile applications built with modern technologies — *Full-stack development using React, Python, Django and cloud-native architectures*
2. Workflow Automation — Streamline operations with intelligent automation solutions — *API integrations, and custom workflow engines to eliminate manual tasks*
3. AI/ML & Data Platforms — Harness the power of artificial intelligence and machine learning — *Predictive analytics, NLP, computer vision, and data pipeline development*
4. Integrations & APIs — Connect your systems with seamless integrations — *REST APIs, GraphQL, and third-party system integrations*
5. Dashboards & Analytics — Real-time insights with interactive data visualizations — *Business intelligence, KPI tracking, and custom reporting solutions*
6. DevOps & Infrastructure — Scalable cloud infrastructure and deployment automation — *AWS, Azure, GCP, Digital Ocean, and CI/CD pipeline setup*

**Process (recommended 5-step version — see §8.4)**
1. Understand/Strategy — Define your business goals and technical requirements — *Requirements analysis, technical feasibility, and project roadmap creation*
2. Design — Creating intuitive user experiences and system architecture — *UI/UX design, system architecture, and database design*
3. Build — Agile development with continuous integration and testing — *Sprint-based development, code reviews, and automated testing*
4. Deploy — Seamless deployment to production with monitoring setup — *Cloud deployment, performance optimization, and security hardening*
5. Support — Ongoing maintenance, updates, and feature enhancements — *24/7 monitoring, regular updates, and continuous improvement*

**Testimonials** — *[Placeholder ×6 — see §11]. Structure: quote (1–3 sentences) + name + role/company + country.*

**Clients marquee** — *[Placeholder ×13 — see §11]. Structure: company name on a gradient badge, continuous horizontal scroll.*

**CTA**
- Headline: "Your Concerns, Our Solutions"
- Subhead: "Let's Connect for 30 Minutes Chat"
- Body: "We will understand your challenges and share how our tech expertise can save you time, reduce costs, and speed up your growth."
- Buttons: "Book Free Consultation →" *(link TBD — §11)* · "Send an Email" *(address TBD — §11)*

**Footer**
- Tagline: "Your own Virtual Tech Team, working for you, to make your organization more efficient."
- Contact block: email + location *(TBD — §11)*
- Form fields: Name, Email, Message → "Send Now"
- Bottom bar: "© 2026 Techily Fly. All rights reserved." + Privacy Policy + Terms of Use links

---

## Appendix B — Cloudflare Free-Tier Reference

| Product | Free-tier limit (verify before launch — these move) |
|---|---|
| Pages | Unlimited static bandwidth & requests; 500 builds/month |
| Workers (incl. Pages Functions) | 100,000 requests/day; 10ms CPU time/request; 50 subrequests/invocation |
| D1 | 5GB storage; ~5M row reads/month |
| KV | 1GB storage; ~100K reads/day |
| R2 | 10GB storage/month; 1M Class A+B operations/month |
| Turnstile | Unlimited, no request cap; 20 widgets/account |
| Web Analytics | Free, unlimited |
| Email Service (`send_email` binding) | Native/free — confirm current volume limit at build time (newer product) |
| DNS + Universal SSL | Free |

*All figures above were cross-checked against multiple current sources as of August 2026; Cloudflare updates these periodically, so re-verify against developers.cloudflare.com/*​/platform/limits immediately before launch rather than trusting this table long-term.*
