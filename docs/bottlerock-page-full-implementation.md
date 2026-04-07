# BottleRock Page Full Implementation Log

Date: April 7, 2026
Route: `/bottlerock`

## Purpose
This document records the full implementation of the BottleRock landing page, including design/content decisions, asset usage, section ordering, bug history, and the final stable state.

## Final Scope Implemented
- Replaced invalid route content (raw iframe/no default export) with a complete App Router page.
- Built a full promotional landing flow with:
  - hero
  - transition section
  - client beauty lineup/menu section
  - BottleRock lineup poster section
  - YouTube lineup preview section
  - closing booking section
- Integrated with existing site shell:
  - `SiteHeader`
  - `SiteFooter`
  - existing nav links + Booksy URL constant

## Files Involved
Primary implementation files:
- `app/bottlerock/page.tsx`
- `app/bottlerock/page.module.css`

Supporting file touched during debugging:
- `app/components/scroll-reveal.tsx`

Related docs:
- `docs/bottlerock-back-navigation-bug.md`
- `docs/bottlerock-promo-implementation-and-retirement.md`

## Final Section Order (Current)
1. Hero
2. Transition text section
3. Client Beauty Lineup section (menu image + priced services)
4. BottleRock lineup poster section
5. YouTube lineup preview section
6. Closing booking section

## Asset Map (Final)
- Hero image: `/bottlerockstage.png`
- Transition background image: `/bottlerockconfetti.jpg`
- Beauty menu image: `/479B6213-CEE5-42D8-A4B1-B5895D6F3944.png`
- Lineup poster: `/bottlerock-lineup.webp`
- Closing hero image: `/stephencurrybottlerock.jpg`
- YouTube embed: `https://www.youtube-nocookie.com/embed/lu7ZeNRr0TI?si=zGOPUoZwEj6H5n2O`

## Content + CTA Decisions
- Hero copy emphasizes pre-festival booking urgency.
- Transition headline updated to:
  - `Plan your look before the first set`
- Beauty lineup section uses explicit service pricing from current menu image:
  - Signature Stack — `$305`
  - Curated Stack — `$265`
  - Titanium Piercing — `$135`
  - Gold Piercing — `$175`
- Primary CTA pattern remains Booksy-based through `BOOKSY_APPOINTMENT_URL`.
- Secondary support CTA links to `/contact` in relevant sections.

## Layout + Styling Decisions
- Page uses project’s existing design language:
  - CSS Modules
  - existing color tokens/typography from globals
  - border rhythm and card/grid patterns matching site style
- Hero:
  - full viewport presence with restrained overlay/glow and subtle entry animation
- Transition:
  - sticky text behavior on desktop
  - simplified static behavior at smaller breakpoints
  - confetti image backdrop for mood continuity
- Poster:
  - tuned to be larger and centered in-content (not full bleed)
- Video panel:
  - embedded frame vertically centered in the black container
- Closing section:
  - removed small bottom-right supporting image tile
  - retained strong split layout with main image + booking copy

## Responsive Behavior
Breakpoints aligned to site conventions:
- `max-width: 1100px`
- `max-width: 749px`

Responsive implementation highlights:
- desktop split-grid sections collapse to single-column on smaller widths
- CTA buttons expand to full-width on mobile where appropriate
- image wrappers use explicit `aspect-ratio` for stable layout

## Issues Encountered During Build
### 1) Initial route was invalid
- `/bottlerock` originally lacked a default export and failed build/typecheck.
- Fixed by replacing file with complete page component + metadata.

### 2) Poster sizing/order iterations
- Poster was temporarily made full-bleed; later revised to centered larger in-content block.
- Section order was revised multiple times; final order is documented above.

### 3) Video embed alignment issue
- Embed appeared visually misaligned within taller black container.
- Resolved by centering embed frame in `.videoShell`.

### 4) Back navigation + hidden content bug
- Scroll-reveal wrappers caused content after transition to stay hidden on browser back/restore in some cases.
- Multiple global reveal-reset approaches were tested and rejected due inconsistency.
- Final stable fix:
  - Remove `ScrollReveal` wrappers from core `/bottlerock` sections.
  - Revert shared `ScrollReveal` component to baseline behavior.
- See dedicated detail:
  - `docs/bottlerock-back-navigation-bug.md`

## Final Tradeoffs
- `/bottlerock` prioritizes reliability over scroll-triggered section reveal animation.
- Core sections now render immediately (no hidden-state risk on browser back/restore).

## Maintenance Guide
If updating this page later:
1. Update services in `FESTIVAL_SERVICES` in `app/bottlerock/page.tsx`.
2. Keep menu image + service list synchronized.
3. Preserve in-content section order unless campaign requirements change.
4. Avoid re-introducing reveal wrappers around critical content unless back/restore behavior is re-validated.
5. Validate desktop + mobile after any section order/sizing changes.

## QA Checklist
Use after changes to `/bottlerock`:
- Page loads with all sections visible.
- Back navigation to `/bottlerock` does not hide lower sections.
- Hero, transition, beauty lineup, poster, video, and closing sections render in correct order.
- YouTube embed is correctly framed and aligned.
- CTAs link correctly to Booksy and Contact.
- No layout shift from major media blocks.
- Lint passes for modified files.
