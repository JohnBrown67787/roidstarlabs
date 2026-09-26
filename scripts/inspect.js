import fs from 'fs';

const rawProducts = JSON.parse(fs.readFileSync('scripts/rawProducts.json', 'utf8'));
const rawCategories = JSON.parse(fs.readFileSync('scripts/rawCategories.json', 'utf8'));

console.log('Sample product fields:', Object.keys(rawProducts[0]));
console.log('Sample product details:', {
  id: rawProducts[0].id,
  name: rawProducts[0].name,
  categories: rawProducts[0].categories,
  prices: rawProducts[0].prices,
  images: rawProducts[0].images?.map(img => img.src),
  average_rating: rawProducts[0].average_rating,
  is_in_stock: rawProducts[0].is_in_stock
});

// Group products by main category
const categoryCounts = {};
rawProducts.forEach(p => {
  const cat = p.categories?.[0]?.name || 'Uncategorized';
  categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
});
console.log('Products per main category:', categoryCounts);
