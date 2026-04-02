# Instagram Third-Party Embed Migration

## Goal

Replace the current custom Instagram feed pipeline with a third-party embedded feed using **Behold**.

The new implementation must:
- remove dependency on `INSTAGRAM_ACCESS_TOKEN`
- remove server-side Instagram fetch, caching, and normalization logic
- remove the internal API route `GET /api/instagram/feed`
- remove local fallback feed logic used only for Instagram
- keep the Instagram section on the home page
- preserve a polished responsive layout on the landing page
- avoid any Meta app, app review, or production review work in this codebase

## Context

The current project uses:
- server-side Instagram data fetch
- in-memory TTL cache
- account-handle validation
- fallback local media
- internal API route
- custom grid and modal UI
- remote image patterns in Next config

We are replacing all of that with a vendor-managed embed.

## Vendor Choice

Use **Behold**.

Reasons:
- official React component
- works with Next.js
- zero dependencies
- configuration is managed in the vendor dashboard
- supports responsive widget configuration and breakpoints
- can later support a JSON feed if we ever want a custom UI again

## Desired Architecture

### New architecture
- Client-facing landing page renders a Behold widget component directly
- No internal Instagram API route
- No server-side token management for Instagram
- No custom normalization layer
- No custom fallback feed logic
- No Instagram-specific image domain config needed unless another unrelated feature still requires it

### Data source
- Feed content is managed in Behold dashboard
- The client’s Instagram account is connected through Behold authorization
- The page uses a `BEHOLD_FEED_ID` environment variable

## Environment Variables

### Remove
Delete all Instagram-Meta-specific variables from `.env.example` and any related docs unless still used elsewhere:
- `INSTAGRAM_ACCESS_TOKEN`
- `INSTAGRAM_ACCOUNT_HANDLE`
- `INSTAGRAM_IG_USER_ID`
- `INSTAGRAM_FEED_LIMIT`
- `INSTAGRAM_CACHE_TTL_SECONDS`

### Add
Add:

```env
BEHOLD_FEED_ID=
```

Optional:

```env
NEXT_PUBLIC_BEHOLD_FEED_ID=
```

Use `NEXT_PUBLIC_BEHOLD_FEED_ID` if the component is rendered directly in the client and needs the ID in browser code.

## Dependency Changes

Install:

```bash
npm install @behold/react
```

## Files To Remove

Delete these files if they are no longer referenced anywhere:
- `app/lib/instagram-types.ts`
- `app/lib/instagram-fallback.ts`
- `app/lib/instagram-feed.ts`
- `app/api/instagram/feed/route.ts`

## Files To Replace or Update

### Replace
- `app/components/instagram-feed.tsx`
- `app/components/instagram-feed.module.css`

### Update
- `app/page.tsx`
- `next.config.ts`
- `.env.example`
- any README or internal docs that describe the old Meta token flow

## Implementation Requirements

### 1. Replace custom feed component with a Behold wrapper

Create or rewrite `app/components/instagram-feed.tsx` as a thin client component around Behold.

Target implementation shape:

```tsx
"use client";

import BeholdWidget from "@behold/react";

type InstagramFeedProps = {
  feedId?: string;
  className?: string;
};

export default function InstagramFeed({
  feedId = process.env.NEXT_PUBLIC_BEHOLD_FEED_ID,
  className,
}: InstagramFeedProps) {
  if (!feedId) {
    return null;
  }

  return (
    <section className={className} aria-labelledby="instagram-heading">
      <div className="instagramSectionInner">
        <div className="instagramHeader">
          <p className="eyebrow">Instagram</p>
          <h2 id="instagram-heading">Follow the latest work</h2>
          <p className="instagramSubcopy">Live feed powered by Instagram.</p>
        </div>

        <div className="instagramWidgetShell">
          <BeholdWidget feedId={feedId} />
        </div>
      </div>
    </section>
  );
}
```

### 2. Remove custom fetch logic

The new component must **not**:
- call `/api/instagram/feed`
- use `fetch`
- manage loading state for custom JSON
- manage modal state
- parse captions, timestamps, or child media
- switch between `instagram_api` and `fallback_local`

### 3. Simplify styling

Keep the section visually consistent with the rest of the landing page, but stop styling the internal post cards and modals as if we own the feed markup.

Only style:
- section spacing
- heading and subheading
- outer widget container
- max width
- border radius
- overflow
- background surface
- optional shadow

Do **not** try to deeply target vendor internals unless absolutely necessary.

Recommended CSS direction:

```css
.instagramSection {
  padding: 6rem 1.25rem;
}

.instagramSectionInner {
  max-width: 1200px;
  margin: 0 auto;
}

.instagramHeader {
  margin-bottom: 1.5rem;
}

.instagramWidgetShell {
  border-radius: 24px;
  overflow: hidden;
}
```

### 4. Keep the home page integration point

Retain the Instagram section on the homepage in `app/page.tsx`, but ensure it simply renders the new widget-based component.

### 5. Clean up Next config

Review `next.config.ts`.

If Instagram CDN image remote patterns were added only for the old custom implementation, remove them.

If another unrelated feature still uses those domains, keep only the domains still required.

## Copy and UX Changes

Update visible copy so it no longer implies:
- internal API status
- fallback or local source messaging
- source switching
- custom video modal behavior

Remove any text that references:
- `fallback_local`
- “using fallback content”
- “live source unavailable”
- source labels from API response

## Behold Dashboard Setup Notes

This code change assumes a human will do the vendor setup separately:

1. Create a Behold account
2. Connect the Instagram account as a source
3. Create a widget feed
4. Copy the `feedId`
5. Put the `feedId` into `NEXT_PUBLIC_BEHOLD_FEED_ID`

## Acceptance Criteria

### Functional
- Home page shows a live Instagram feed using Behold
- No Meta developer token exists anywhere in project env files
- No route exists at `app/api/instagram/feed/route.ts`
- No custom server-side Instagram fetch code remains
- Build succeeds
- Lint succeeds

### UX
- Section still fits landing page design
- Widget is responsive on desktop and mobile
- Feed renders when `NEXT_PUBLIC_BEHOLD_FEED_ID` is set
- Section hides cleanly or fails gracefully when `NEXT_PUBLIC_BEHOLD_FEED_ID` is missing

### Code quality
- Remove dead types and helpers tied only to the old Instagram pipeline
- No leftover imports from deleted modules
- No stale documentation mentioning Meta token setup

## Optional Enhancement

If we later want more styling control without going back to Meta app work, we can switch from Behold’s React widget to a Behold JSON feed and build our own presentational component on top of that vendor feed.

## Non-Goals

Do not:
- rebuild the existing modal or gallery experience on this pass
- preserve the old internal API contract
- preserve local Instagram fallback media logic
- keep account-handle validation
- keep in-memory cache for Instagram
- add a new server action for Instagram

This migration is meant to simplify the stack.
