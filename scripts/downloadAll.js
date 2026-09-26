import https from 'https';
import fs from 'fs';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function fetchAllProducts() {
  console.log('Fetching page 1...');
  const res1 = await fetchUrl('https://roidstarlabs.com/wp-json/wc/store/v1/products?per_page=100&page=1');
  const page1 = JSON.parse(res1.body);
  console.log(`Page 1 count: ${page1.length}`);

  console.log('Fetching page 2...');
  const res2 = await fetchUrl('https://roidstarlabs.com/wp-json/wc/store/v1/products?per_page=100&page=2');
  let page2 = [];
  if (res2.status === 200) {
    page2 = JSON.parse(res2.body);
    console.log(`Page 2 count: ${page2.length}`);
  }

  const allRawProducts = [...page1, ...page2];
  console.log(`Total raw products fetched: ${allRawProducts.length}`);

  // Also check categories from Store API
  console.log('Fetching product categories...');
  const catRes = await fetchUrl('https://roidstarlabs.com/wp-json/wc/store/v1/products/categories?per_page=100');
  let rawCategories = [];
  if (catRes.status === 200) {
    rawCategories = JSON.parse(catRes.body);
    console.log(`Categories count: ${rawCategories.length}`);
  }

  fs.writeFileSync('scripts/rawProducts.json', JSON.stringify(allRawProducts, null, 2));
  fs.writeFileSync('scripts/rawCategories.json', JSON.stringify(rawCategories, null, 2));
  console.log('Saved rawProducts.json and rawCategories.json successfully!');
}

fetchAllProducts();
