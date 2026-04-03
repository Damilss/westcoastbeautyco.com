# West Coast Beauty Co. Website

This is a Next.js website for West Coast Beauty Co., a beauty and wellness brand. The site is built with Next.js, TypeScript, and Tailwind CSS.

## Documentation

- Instagram Feed (Current): `docs/instagram-feed.md`
- Instagram Feed (Archive): `docs/instagram-third-party-embed-migration.md`

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

The homepage Instagram section renders from the public Behold JSON endpoint:
- `https://feeds.behold.so/jidFIqDLkPBGRR83dk3E`

Notes:
- No API keys are required.
- No `.env` configuration is required for the feed.
- The feed is fetched client-side in `app/components/instagram-feed.tsx`.
