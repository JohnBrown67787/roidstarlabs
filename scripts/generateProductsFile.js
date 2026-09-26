import fs from 'fs';

const rawProducts = JSON.parse(fs.readFileSync('scripts/rawProducts.json', 'utf8'));

function decodeHtml(html) {
  if (!html) return '';
  return html
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8243;/g, '″')
    .replace(/&quot;/g, '"')
    .replace(/&#038;/g, '&')
    .replace(/<[^>]*>/g, '')
    .trim();
}

const cleanedProducts = rawProducts.map((p, index) => {
  const minorUnit = p.prices?.currency_minor_unit ?? 2;
  const divisor = Math.pow(10, minorUnit);
  const rawPrice = parseInt(p.prices?.price || '0', 10);
  const rawRegPrice = parseInt(p.prices?.regular_price || '0', 10);
  const rawSalePrice = parseInt(p.prices?.sale_price || '0', 10);

  const price = rawPrice / divisor;
  const regularPrice = rawRegPrice > 0 ? rawRegPrice / divisor : price;
  const salePrice = p.on_sale && rawSalePrice > 0 ? rawSalePrice / divisor : null;

  // Categories
  const cats = (p.categories || []).map(c => ({
    name: decodeHtml(c.name),
    slug: c.slug
  }));

  const primaryCategory = cats[0]?.name || 'Uncategorized';
  const categorySlug = cats[0]?.slug || 'uncategorized';
  const allCategorySlugs = cats.map(c => c.slug);
  const allCategoryNames = cats.map(c => c.name);

  // Images
  const primaryImg = p.images?.[0]?.src || 'https://roidstarlabs.com/wp-content/uploads/2026/07/cropped-ChatGPT-Image-Jul-14-2026-10_09_49-AM.png';
  const hoverImg = p.images?.[1]?.src || null;

  // Description
  const rawDesc = decodeHtml(p.short_description || p.description || '');
  const description = rawDesc.length > 280 ? rawDesc.slice(0, 277) + '...' : rawDesc || 'Premium pharmaceutical grade gear and performance wellness product.';

  return {
    id: p.id,
    name: decodeHtml(p.name),
    slug: p.slug,
    category: primaryCategory,
    categorySlug: categorySlug,
    categories: allCategoryNames,
    categorySlugs: allCategorySlugs,
    price: price,
    regularPrice: regularPrice,
    salePrice: salePrice,
    rating: parseFloat(p.average_rating || '0'),
    reviewCount: p.review_count || 0,
    popularity: rawProducts.length - index,
    image: primaryImg,
    hoverImage: hoverImg,
    fullImage: primaryImg,
    description: description,
    inStock: p.is_in_stock ?? true,
    sku: p.sku || ''
  };
});

console.log(`Cleaned ${cleanedProducts.length} products.`);

// Reconstruct complete Categories Tree with actual live product counts
const categoryHierarchy = [
  { id: 'anti-aging', name: 'Anti-Aging' },
  { 
    id: 'brands', 
    name: 'Brands', 
    children: [
      { id: 'apoxar', name: 'Apoxar' },
      { id: 'apoxer', name: 'Apoxer' }
    ]
  },
  { 
    id: 'hair-skin-sleep', 
    name: 'Hair, Skin & Sleep', 
    children: [
      { id: 'accutane', name: 'Accutane' },
      { id: 'finasteride', name: 'Finasteride' },
      { id: 'zopiclone', name: 'Zopiclone' }
    ]
  },
  { 
    id: 'hgh-pertides', 
    name: 'HGH & Pertides', 
    children: [
      { id: 'hgh-growth-hormone', name: 'HGH - Growth Hormone' },
      { id: 'hgh-176-191', name: 'HGH-176-191' },
      { id: 'igf-1-insulin-growth-factor', name: 'IGF-1 – Insulin Growth Factor' },
      { id: 'pt-141', name: 'PT-141' }
    ]
  },
  { 
    id: 'injectable-steroids', 
    name: 'Injectable Steroids', 
    children: [
      { id: 'boldenones-eq', name: 'Boldenones - EQ' },
      { id: 'nandrolone', name: 'Nandrolone' },
      { id: 'sustanon', name: 'Sustanon' },
      { id: 'testosterone', name: 'Testosterone' },
      { id: 'testosterone-400', name: 'Testosterone 400' }
    ]
  },
  { 
    id: 'oral-steroids', 
    name: 'Oral Steroids', 
    children: [
      { id: 'anadrol-oxymetholone', name: 'Anadrol - Oxymetholone' },
      { id: 'anavar-oxandrolone', name: 'Anavar - Oxandrolone' },
      { id: 'dianabol', name: 'Dianabol' },
      { id: 'proviron-mesterolone', name: 'Proviron - Mesterolone' },
      { id: 'turinabol', name: 'Turinabol' },
      { id: 'winstrol-stanozolol', name: 'Winstrol - Stanozolol' }
    ]
  },
  { 
    id: 'post-cycle-therapy', 
    name: 'Post Cycle Therapy', 
    children: [
      { id: 'anti-estrogen', name: 'Anti Estrogen' },
      { id: 'arimidex-anastrozole', name: 'Arimidex - Anastrozole' },
      { id: 'aromasin-exemestane', name: 'Aromasin - Exemestane' },
      { id: 'clomid-clomiphene-citrate', name: 'Clomid - Clomiphene Citrate' },
      { id: 'femara-letrozole', name: 'Femara - Letrozole' },
      { id: 'hcg-gonadotropin', name: 'HCG - Gonadotropin' },
      { id: 'ketotifen', name: 'Ketotifen' },
      { id: 'nolvadex-tamoxifen', name: 'Nolvadex - Tamoxifen' },
      { id: 'skin-hair-more', name: 'Skin, Hair & More' }
    ]
  },
  { 
    id: 'sarms', 
    name: 'SARMs', 
    children: [
      { id: 'andarine-s4', name: 'Andarine - S4' },
      { id: 'cardarine-gw501516', name: 'Cardarine - GW501516' },
      { id: 'ligandrol-lgd-4033', name: 'Ligandrol - LGD-4033' },
      { id: 'mk-677-ibutamoren', name: 'MK-677 - Ibutamoren' },
      { id: 'ostarine-mk-2866', name: 'Ostarine - MK-2866' },
      { id: 'rad-140-testolone', name: 'RAD-140 - Testolone' },
      { id: 'stenabolic-sr9009', name: 'Stenabolic - SR9009' },
      { id: 'yk-11', name: 'YK-11' }
    ]
  },
  { 
    id: 'sex-health', 
    name: 'Sex Health', 
    children: [
      { id: 'cialis', name: 'Cialis' },
      { id: 'viagra', name: 'Viagra' }
    ]
  },
  { 
    id: 'smart-drugs', 
    name: 'Smart Drugs', 
    children: [
      { id: '3fpm-stimulant', name: '3FPM (Stimulant)' },
      { id: 'cerebral-smart-drug', name: 'Cerebral (Smart Drug) stack - Innovagen' },
      { id: 'modafinil', name: 'Modafinil' },
      { id: 'noopept-smart-drug', name: 'Noopept (Smart Drug) 20mg/ml - Innovagen' },
      { id: 'pao-stack', name: 'PAO Stack (Smart Drug) 500mg/30caps - Innovagen' },
      { id: 'smart-drug-innovagen', name: 'Smart Drug 25mg/30tabs - Innovagen' }
    ]
  },
  { 
    id: 'syringes-accessories', 
    name: 'Syringes & Accessories', 
    children: [
      { id: 'drawing-needles', name: 'Drawing Needles' },
      { id: 'syringes-hgh-peptides', name: 'Syringes for HGH,HCG, Peptides,' },
      { id: 'syringes-steroids', name: 'Syringes for Steroid Injections' },
      { id: 'water-injections', name: 'Water For Injections' }
    ]
  },
  { id: 'uncategorized', name: 'Uncategorized' },
  { 
    id: 'weight-loss', 
    name: 'Weight Loss', 
    children: [
      { id: 'clenbuterol', name: 'Clenbuterol' },
      { id: 'cytomel-t3', name: 'Cytomel - T3' },
      { id: 'meridia', name: 'Meridia' },
      { id: 'weight-loss-blends', name: 'Weight Loss Blends' }
    ]
  }
];

// Calculate counts
const finalCategories = categoryHierarchy.map(cat => {
  const matchCount = cleanedProducts.filter(p => 
    p.categorySlugs.includes(cat.id) || p.categories.some(c => c.toLowerCase().includes(cat.name.toLowerCase()))
  ).length;

  const children = cat.children ? cat.children.map(sub => ({
    ...sub,
    count: cleanedProducts.filter(p => 
      p.categorySlugs.includes(sub.id) || p.categories.some(c => c.toLowerCase().includes(sub.name.toLowerCase()))
    ).length
  })) : undefined;

  return {
    ...cat,
    count: matchCount,
    children
  };
});

// Footer lists
const latestProducts = cleanedProducts.slice(0, 4);
const bestSelling = cleanedProducts.filter(p => p.price <= 110 && p.price >= 65).slice(0, 4);
const topRated = cleanedProducts.filter(p => p.rating >= 2.5).slice(0, 4);

const galleryImages = [
  "https://roidstarlabs.com/wp-content/uploads/2024/01/diuretics-liver-heart-PhotoRoom.png-PhotoRoom-405x400-1-removebg-preview-280x280.png",
  "https://roidstarlabs.com/wp-content/uploads/2024/01/pharmacy-grade-PhotoRoom.png-PhotoRoom-100x100.png",
  "https://roidstarlabs.com/wp-content/uploads/2024/01/istockphoto-534682529-170667a-280x280.webp",
  "https://roidstarlabs.com/wp-content/uploads/2024/01/images-removebg-preview-100x100.png"
];

// Generate JS output
const outputJs = `// Generated complete catalog of all ${cleanedProducts.length} products on roidstarlabs.com
export const CATEGORIES = ${JSON.stringify(finalCategories, null, 2)};

export const PRODUCTS = ${JSON.stringify(cleanedProducts, null, 2)};

export const LATEST_PRODUCTS = ${JSON.stringify(latestProducts, null, 2)};

export const BEST_SELLING = ${JSON.stringify(bestSelling, null, 2)};

export const TOP_RATED = ${JSON.stringify(topRated, null, 2)};

export const GALLERY_IMAGES = ${JSON.stringify(galleryImages, null, 2)};
`;

fs.writeFileSync('src/data/products.js', outputJs);
console.log('Saved src/data/products.js with all 146 products!');

// Also generate SQL insert file for Supabase
const sqlLines = [
  '-- Supabase insertion script for all 146 products from roidstarlabs.com',
  '-- Run this in your Supabase SQL Editor if you want to store them in your cloud DB',
  '',
  'INSERT INTO public.products (id, name, category, category_slug, price, rating, popularity, image, description, in_stock)',
  'VALUES'
];

const valueRows = cleanedProducts.map(p => {
  const safeName = p.name.replace(/'/g, "''");
  const safeCat = p.category.replace(/'/g, "''");
  const safeSlug = p.categorySlug.replace(/'/g, "''");
  const safeDesc = p.description.replace(/'/g, "''");
  return `(${p.id}, '${safeName}', '${safeCat}', '${safeSlug}', ${p.price}, ${p.rating}, ${p.popularity}, '${p.image}', '${safeDesc}', ${p.inStock})`;
});

sqlLines.push(valueRows.join(',\n') + ';');
fs.writeFileSync('supabase_insert_products.sql', sqlLines.join('\n'));
console.log('Saved supabase_insert_products.sql with all 146 products!');
