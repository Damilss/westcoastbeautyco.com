# Instagram Feed Integration

This document covers the Instagram feed implementation added to the landing page bottom section.

## Overview

The home page now uses a live Instagram feed pipeline with local fallback support:

- Live source: Meta Instagram API (server-side)
- Fallback source: curated local media in `/public`
- UI: 5x2 desktop grid, 2-column mobile, modal detail view, video support
- Internal API: `GET /api/instagram/feed`

## What Was Implemented

- Server-side data layer for Instagram media fetch + normalization.
- In-memory TTL cache (default 30 minutes).
- Account-handle validation (`INSTAGRAM_ACCOUNT_HANDLE`) before accepting live data.
- Automatic local fallback when credentials are missing or API fails.
- Internal feed endpoint for UI consumption.
- Home page Instagram component with:
  - Tile grid
  - Video indicator on video tiles
  - Modal with caption, date, permalink
  - Keyboard controls (`Esc`, `ArrowLeft`, `ArrowRight`)
- Remote image patterns for Instagram CDN domains in Next.js config.

## File Map

- `app/lib/instagram-types.ts`
  - Shared feed types used by API + UI.
- `app/lib/instagram-fallback.ts`
  - Curated fallback media list and helper.
- `app/lib/instagram-feed.ts`
  - Server-only feed resolver, normalization, caching, fallback logic.
- `app/api/instagram/feed/route.ts`
  - Internal JSON endpoint.
- `app/components/instagram-feed.tsx`
  - Client component for rendering the grid and modal.
- `app/components/instagram-feed.module.css`
  - Feed section and modal styling.
- `app/page.tsx`
  - Home page integration point.
- `next.config.ts`
  - `images.remotePatterns` entries for Instagram-hosted assets.
- `.env.example`
  - Environment variable template.

## Environment Variables

Use `.env.local` (copy from `.env.example`):

- `INSTAGRAM_ACCESS_TOKEN` (required for live API feed)
- `INSTAGRAM_ACCOUNT_HANDLE` (defaults to `westcoastbeauty.co`)
- `INSTAGRAM_IG_USER_ID` (optional, used for Graph `/IG_USER_ID/media` flow)
- `INSTAGRAM_FEED_LIMIT` (optional, default `10`, max `20`)
- `INSTAGRAM_CACHE_TTL_SECONDS` (optional, default `1800`)

## Internal API Contract

Endpoint:

- `GET /api/instagram/feed?limit=10`

Query params:

- `limit` (optional, bounded to max `20`)

Response shape:

```json
{
  "items": [
    {
      "id": "string",
      "permalink": "https://...",
      "caption": "string",
      "timestamp": "2026-03-28T00:00:00.000Z",
      "mediaType": "IMAGE | VIDEO | CAROUSEL_ALBUM",
      "thumbnailUrl": "https://... or null",
      "mediaUrl": "https://... or /local.jpg",
      "children": [
        {
          "id": "string",
          "mediaType": "IMAGE | VIDEO | CAROUSEL_ALBUM",
          "mediaUrl": "https://...",
          "thumbnailUrl": "https://... or null",
          "permalink": "https://..."
        }
      ]
    }
  ],
  "source": "instagram_api | fallback_local",
  "fetchedAt": "2026-03-28T00:00:00.000Z"
}
```

Response cache headers:

- `Cache-Control: public, max-age=0, s-maxage=<ttl>, stale-while-revalidate=<ttl>`

## Data Flow

1. `InstagramFeed` component requests `/api/instagram/feed?limit=<n>`.
2. Route handler calls `getInstagramFeed(...)`.
3. Data layer checks in-memory cache:
   - cache hit and fresh: return cached result
   - miss/expired: fetch live API and normalize
4. If live fetch is unavailable or invalid, fallback media is returned.
5. UI renders returned items and annotates source messaging.

## Fallback Behavior

Fallback is used when any of the following occurs:

- `INSTAGRAM_ACCESS_TOKEN` is missing
- Live request errors
- Live feed returns no valid items
- Username check does not match `INSTAGRAM_ACCOUNT_HANDLE`

Fallback content source:

- `FALLBACK_INSTAGRAM_ITEMS` in `app/lib/instagram-fallback.ts`

To refresh fallback content:

1. Add/replace media in `/public`
2. Update entries in `FALLBACK_INSTAGRAM_ITEMS`
3. Keep `timestamp` values in descending recency
4. Keep at least 10 items for the home grid

## UI and Interaction Details

- Grid:
  - Desktop: 5 columns
  - Tablet/mobile: 2 columns
- Modal:
  - Opens on tile click
  - Closes via close button, overlay click, or `Esc`
  - Navigates with arrows (buttons and keyboard)
  - Displays video with `controls` + `playsInline`
- Caption:
  - Full caption shown in modal
  - "View on Instagram" opens permalink in new tab

## Testing Checklist

Run:

- `npm run build`
- `npm run lint`

Manual checks:

1. No credentials configured:
   - Feed renders with local fallback items
   - Modal still works end-to-end
2. Valid credentials configured:
   - Feed source switches to live data
   - Video thumbnails render and videos play in modal
   - Per-post permalink opens expected Instagram post
3. Keyboard and modal:
   - `Esc` closes modal
   - `ArrowLeft` and `ArrowRight` navigate posts
4. Responsive:
   - Desktop: 5x2 visual grid
   - Mobile: 2-column stack with modal layout adjusted

## Notes

- Cache is process-memory based. In multi-instance deployments, each instance maintains its own feed cache.
- If deployment restarts, cache repopulates on first request.
- External image domains are explicitly whitelisted in `next.config.ts`.
