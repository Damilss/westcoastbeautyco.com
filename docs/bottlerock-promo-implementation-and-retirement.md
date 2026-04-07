# BottleRock Homepage Promo: Implementation Log + Retirement Guide

## Purpose
This document captures everything implemented for the homepage BottleRock promo, the runtime issues encountered during implementation, and exact instructions to remove the feature and restore the pre-promo homepage/header behavior.

Date of work: April 7, 2026.

## What Was Implemented

### Homepage promo system
- Added a dedicated client controller component for homepage-only promo behavior:
  - `app/components/home-bottlerock-promo.tsx`
- Added all promo-specific styling:
  - `app/components/home-bottlerock-promo.module.css`
- Updated homepage to use promo controller instead of directly rendering `SiteHeader`:
  - `app/page.tsx`

### Header extensibility for promo banner
- Extended `SiteHeader` with optional props:
  - `promoSlot?: ReactNode`
  - `forceSolidBackground?: boolean`
- Banner now renders in a slot directly below header content when provided:
  - `app/components/site-header.tsx`
- Added slot positioning rules:
  - `app/page.module.css` (`.headerPromoSlot`)

### Promo behavior (normal behavior)
- Popup appears for eligible users on homepage.
- Closing popup shows fallback banner below header.
- Banner dismiss is session-based.
- Popup re-appears after 24 hours if user has not clicked through.
- Clicking CTA from popup/banner marks user as visited and suppresses promo.
- Storage keys used:
  - `wcbc:bottlerock:visited` (`localStorage`)
  - `wcbc:bottlerock:popup-dismissed-at` (`localStorage`)
  - `wcbc:bottlerock:banner-dismissed-session` (`sessionStorage`)

### Demo mode currently enabled
- Popup is intentionally forced to show on every homepage load for client demos.
- Banner is also forced in demo flow after popup close.
- Current toggle:
  - `ALWAYS_SHOW_POPUP_FOR_DEMO = true` in `app/components/home-bottlerock-promo.tsx`

### Assets used
- Popup background: `/bottlerockstage.png`
- Popup lockup: `/West Coast Beauty Co. x BottleRock.png`
- Popup accent texture: `/bottlerockconfetti.jpg`
- Banner logo: `/BR25-Logo-Black-NapaValley.avif`

## Runtime Errors Encountered and Fixes

### 1) `useSyncExternalStore` infinite loop
Observed errors:
- `The result of getSnapshot should be cached to avoid an infinite loop`
- `Maximum update depth exceeded`

Root cause:
- `getSnapshot` returned a new object every render.

Fix:
- Added snapshot caching and shallow equality in `home-bottlerock-promo.tsx` so identical state returns a stable object reference.

### 2) Next Image unconfigured host (Instagram CDN)
Observed error:
- `Invalid src prop ... hostname "scontent-...cdninstagram.com" is not configured under images`

Root cause:
- `next.config.ts` only allowed `behold.pictures`.

Fix:
- Added `remotePatterns` for:
  - `**.cdninstagram.com`
  - `**.fbcdn.net`

Note:
- After changing `next.config.ts`, dev server restart is required.

## Files Touched by This Work
- `app/components/home-bottlerock-promo.tsx` (new)
- `app/components/home-bottlerock-promo.module.css` (new)
- `app/components/site-header.tsx` (updated)
- `app/page.tsx` (updated)
- `app/page.module.css` (updated)
- `next.config.ts` (updated for Instagram image hosts)

## Retirement Instructions (Remove Completely)

### Use this prompt with a coding agent
```md
Task: Remove the BottleRock homepage promo system completely and restore the homepage/header to pre-promo behavior.

Requirements:
1. Delete promo files:
   - app/components/home-bottlerock-promo.tsx
   - app/components/home-bottlerock-promo.module.css

2. Restore homepage header usage in app/page.tsx:
   - Remove HomeBottleRockPromo import.
   - Re-introduce SiteHeader import and SITE_NAV_LINKS import.
   - Replace <HomeBottleRockPromo /> with:
     <SiteHeader links={SITE_NAV_LINKS} activeHref="/" />

3. Revert SiteHeader API and rendering in app/components/site-header.tsx:
   - Remove ReactNode import.
   - Remove props: promoSlot and forceSolidBackground.
   - Restore original header class selection based only on atTop.
   - Remove promo slot render block:
     {promoSlot ? <div className={styles.headerPromoSlot}>{promoSlot}</div> : null}

4. Revert app/page.module.css:
   - Remove .headerPromoSlot rules.

5. Decide on next.config.ts:
   - If you want exact pre-promo state, remove remotePatterns for:
     - **.cdninstagram.com
     - **.fbcdn.net
   - If Instagram feed should remain stable, keep these host patterns.
   - Add a short note in PR about the choice.

6. Verify:
   - npm run lint
   - npm run build

Acceptance criteria:
- No homepage popup or promo banner.
- Header behavior matches original transparent-at-top scrolling behavior.
- Homepage compiles and renders correctly on mobile and desktop.
- Build and lint pass (allowing existing non-blocking warnings already present in repo).
```

## Optional: Keep Feature but Disable Demo Mode
If the feature should remain live but stop forced demo behavior:
- In `app/components/home-bottlerock-promo.tsx`, set:
  - `ALWAYS_SHOW_POPUP_FOR_DEMO = false`

This restores standard persistence logic (daily popup cadence + session banner behavior).
