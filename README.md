# West Coast Beauty Co. Website

This is a Next.js website for West Coast Beauty Co., a beauty and wellness brand. The site is built with Next.js 14, TypeScript, and Tailwind CSS.

## Documentation

- Instagram Feed (Current): docs/instagram-third-party-embed-migration.md
- Instagram Feed (Deprecated): docs/archive/instagram-meta-integration.md

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open:
```
http://localhost:3000
```

## Available Scripts

- npm run dev — Start development server  
- npm run build — Build for production  
- npm run start — Start production server  
- npm run lint — Run ESLint  

---

## Instagram Feed (Current Implementation)

The Instagram section uses a **third-party embed (Behold)** instead of a custom API or Meta integration.

### Key Characteristics

- No Meta Developer account required
- No backend API route
- No access tokens stored in this project
- Feed is rendered via a client-side React component
- Content is managed through the Behold dashboard

### Setup

1. Create a Behold account  
2. Connect the client’s Instagram account  
3. Create a feed in the Behold dashboard  
4. Copy the `feedId`  

5. Add to `.env.local`:

```env
NEXT_PUBLIC_BEHOLD_FEED_ID=your_feed_id_here
```

### Behavior

- Feed renders automatically when `NEXT_PUBLIC_BEHOLD_FEED_ID` is set  
- If missing, the section fails gracefully  

---

## Deprecated Instagram Implementation

The previous implementation used:

- Meta Instagram API
- Server-side fetching and normalization
- In-memory caching
- Local fallback media
- Internal API route (`/api/instagram/feed`)

This has been **fully removed**.

Reference:
- docs/archive/instagram-meta-integration.md

---

## Notes

- This project intentionally avoids Meta app setup and review complexity  
- Instagram functionality is fully delegated to a third-party provider  
- For more control in the future, consider:
  - Behold JSON feed
  - or a custom Meta API integration
