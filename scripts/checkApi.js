import https from 'https';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function testApis() {
  console.log('Testing Store API...');
  try {
    const res1 = await fetchUrl('https://roidstarlabs.com/wp-json/wc/store/v1/products?per_page=100');
    console.log('Store API status:', res1.status);
    if (res1.status === 200) {
      const json = JSON.parse(res1.body);
      console.log('Store API returned products count:', json.length);
      console.log('First product sample:', json[0]?.name, json[0]?.prices?.price);
      return;
    }
  } catch (e) {
    console.log('Store API failed:', e.message);
  }

  console.log('Testing WP JSON API...');
  try {
    const res2 = await fetchUrl('https://roidstarlabs.com/wp-json/wp/v2/product?per_page=100');
    console.log('WP API status:', res2.status);
  } catch (e) {
    console.log('WP API failed:', e.message);
  }

  console.log('Testing Sitemaps...');
  try {
    const res3 = await fetchUrl('https://roidstarlabs.com/product-sitemap.xml');
    console.log('Product sitemap status:', res3.status);
  } catch (e) {
    console.log('Product sitemap failed:', e.message);
  }
}

testApis();
