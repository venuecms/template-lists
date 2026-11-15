# VenueCMS template-lists

This is a starter template for [Venue CMS](https://venuecms.com).

It is built with Next.js and uses the [Venue SDK](https://venue.gitbook.io/docs/sdk) to connect to your VenueCMS instance.
This is one of the templates we use for rendering sites when users choose to host via Venue but can also be used as a template for building your own site using the SDK.

This version — originally made for Swedish band [Fire!](https://earthwindand.com) renders events and products as lists with links to their respective 'ticketing' (events) and 'buy link' (products) URLs rather than having individual pages for each item.

Profiles matching tag 'featured' show on homepage (to-do: configure tag in site settings)
Configurable homepage product grid (can choose # of items and # of columns)
Featured pages are rendered on the homepage. 

## Getting Started

First, install your dependencies:

```
pnpm install
```

Then run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
