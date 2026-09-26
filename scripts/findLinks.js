import https from 'https';

https.get('https://roidstarlabs.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const linkMatches = [...data.matchAll(/href=["'](https?:\/\/roidstarlabs\.com\/[^"']*)["']/g)];
    const uniqueLinks = [...new Set(linkMatches.map(m => m[1]))];
    console.log('Unique Links on Home:');
    uniqueLinks.forEach(l => console.log(' -', l));
  });
}).on('error', err => console.error(err));
