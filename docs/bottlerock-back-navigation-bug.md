# BottleRock Back Navigation Reveal Bug

Date: April 7, 2026

## Summary
On `/bottlerock`, browser Back/Forward navigation could restore the page with sections below the transition hidden until manual refresh.

## Symptoms
- Returning to `/bottlerock` via browser Back sometimes showed only header/upper content.
- Sections after the transition text did not appear.
- Manual refresh restored content.

## Root Cause
The route depended on scroll-triggered reveal wrappers (`ScrollReveal`) for core content sections. On browser history restore (bfcache/back-forward), reveal lifecycle did not consistently re-run for those wrappers, leaving some sections in hidden initial state.

## Attempts Tried
1. Replaying reveal on `pageshow` with remount keys.
2. Forcing visible state via `pageshow`/`popstate` logic.
3. One-time hard reload on back-forward restore.

These approaches were not consistently reliable across restore paths and introduced global complexity.

## Final Fix Implemented
- Removed `ScrollReveal` wrappers from core `/bottlerock` content sections:
  - beauty section
  - poster section
  - lineup/video section
  - closing booking section
- Restored shared `app/components/scroll-reveal.tsx` to baseline behavior (no global back-navigation hacks).

## Files Changed
- `app/bottlerock/page.tsx`
- `app/components/scroll-reveal.tsx`

## Tradeoff
- `/bottlerock` no longer uses scroll-reveal animation for those sections.
- Back/forward navigation is now reliable and no content stays hidden.
