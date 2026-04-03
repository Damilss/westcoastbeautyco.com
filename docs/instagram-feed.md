# Instagram Feed (Current Implementation)

The homepage Instagram section now uses a public Behold JSON endpoint and a custom client-side renderer.

## Endpoint

- `https://feeds.behold.so/jidFIqDLkPBGRR83dk3E`

## Architecture

- Data source: public Behold feed JSON (no auth token required)
- Render target: bottom section on the homepage
- UI: responsive card grid (3-column desktop, 2-column mobile)
- Behavior: each card opens the Instagram permalink in a new tab

## Key Files

- `app/lib/behold-feed.ts`
  - Feed request + normalization helpers
- `app/components/instagram-feed.tsx`
  - Client component that fetches and renders posts
- `app/components/instagram-feed.module.css`
  - Instagram section and card styling
- `app/page.tsx`
  - Homepage integration point

## Data Mapping

Each rendered item is normalized from Behold `posts[]` and includes:

- `id`
- `timestamp`
- `permalink`
- `caption`
- `mediaType`
- `previewUrl`
- `isReel`

## Operational Notes

- No `.env` configuration is required.
- No internal API route is required.
- If the endpoint fails, the section keeps layout and shows an unavailable status.
