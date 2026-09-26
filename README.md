# roidstarlabs

Full React + Vite + Supabase replica of https://roidstarlabs.com/ featuring:
- **Homepage**: Auto-rotating hero carousel, blue 12-category showcase, and editorial story sections.
- **Shop Catalog**: Expandable hierarchical category filters, interactive price slider, search, and sorting.
- **Product Experience**: Live product cards, secondary image hover transitions, star ratings, and Quick View modals.
- **Cart & Checkout**: Slide-out cart drawer with quantity adjustments and credit card payment checkout.
- **Supabase Integration**: Live order persistence and backend synchronization.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. Run locally:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```
