# West Coast Beauty Co. Website

This is a Next.js website for West Coast Beauty Co., a beauty and wellness brand. The site is built with Next.js, TypeScript, and Tailwind CSS.

## Documentation

- Instagram Feed (Current): `docs/instagram-third-party-embed-migration.md`
- Instagram Feed (Deprecated Note): `docs/instagram-feed.md`

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open:
```
http://localhost:3000
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Instagram Feed

The home page Instagram section uses a Behold embed via `@behold/react`.

Setup:
1. Create/connect a feed in Behold.
2. Set `NEXT_PUBLIC_BEHOLD_FEED_ID` in `.env.local`.

Behavior:
- If `NEXT_PUBLIC_BEHOLD_FEED_ID` is set, the feed renders on the home page.
- If it is missing, the Instagram section is hidden.
