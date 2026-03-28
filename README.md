# West Coast Beauty Co. Website

This is a Next.js website for West Coast Beauty Co., a beauty and wellness brand. The site is built with Next.js 14, TypeScript, and Tailwind CSS.

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