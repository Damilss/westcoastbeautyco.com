# Instagram Feed Migration Notes (Archive)

This file is archived for historical context only.

The current source of truth is:
- `docs/instagram-feed.md`

Current implementation summary:
- Homepage Instagram feed uses the public Behold JSON endpoint.
- Rendering is handled by the custom client component in `app/components/instagram-feed.tsx`.
- Data normalization is handled in `app/lib/behold-feed.ts`.
