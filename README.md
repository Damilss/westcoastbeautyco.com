# West Coast Beauty Co. Website

This is a Next.js website for West Coast Beauty Co., a beauty and wellness brand. The site is built with Next.js 14, TypeScript, and Tailwind CSS.

## Documentation

- [Instagram Feed Integration](./docs/instagram-feed.md)

## Repository Structure

```
.
├── app/                    # Next.js App Router pages and components
│   ├── components/         # Reusable components
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global CSS
│   └── page.module.css     # Home page specific CSS
├── public/                 # Static assets
│   └── favicon.ico         # Website favicon
├── references/             # Reference materials
│   └── working-site/       # Working site reference files
├── package.json            # Project dependencies and scripts
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # This file
```

## Key Files

- `app/page.tsx` - Main home page component
- `app/layout.tsx` - Root layout component
- `app/globals.css` - Global CSS styles
- `references/working-site/` - Previous Shopify site files. 

## Getting Started

1. First, install the dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## Instagram Feed Setup

The home page Instagram section is API-backed with an automatic local fallback.

Detailed implementation and behavior docs:
- `docs/instagram-feed.md`

1. Copy `.env.example` to `.env.local`
2. Set:
   - `INSTAGRAM_ACCESS_TOKEN`
   - `INSTAGRAM_ACCOUNT_HANDLE` (defaults to `westcoastbeauty.co`)
3. Optional:
   - `INSTAGRAM_IG_USER_ID` (if your token flow needs an explicit IG user id)
   - `INSTAGRAM_FEED_LIMIT` (default `10`, max `20`)
   - `INSTAGRAM_CACHE_TTL_SECONDS` (default `1800`)

Internal endpoint:
- `GET /api/instagram/feed?limit=10`
