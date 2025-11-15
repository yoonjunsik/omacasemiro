const fs = require('fs');
const data = JSON.parse(fs.readFileSync('crawler/capostore-products.json', 'utf8'));

console.log('=== Capo Store Crawl Summary ===\n');
console.log('Total products:', data.length);

// Check for products without model codes
const noModelCode = data.filter(p => !p.modelCode);
console.log('Products without model code:', noModelCode.length);

// Count by brand
const byBrand = {};
data.forEach(p => {
    byBrand[p.brand] = (byBrand[p.brand] || 0) + 1;
});
console.log('\nProducts by brand:');
Object.entries(byBrand).sort((a, b) => b[1] - a[1]).forEach(([brand, count]) => {
    console.log('  ' + brand + ':', count);
});

// Check for duplicates by model code
const byModelCode = {};
data.forEach(p => {
    if (!byModelCode[p.modelCode]) byModelCode[p.modelCode] = [];
    byModelCode[p.modelCode].push(p);
});
const duplicates = Object.entries(byModelCode).filter(([_, prods]) => prods.length > 1);
console.log('\nDuplicate model codes:', duplicates.length);
if (duplicates.length > 0) {
    console.log('  Examples:');
    duplicates.slice(0, 3).forEach(([code, prods]) => {
        console.log('    ' + code + ': ' + prods.length + ' products');
    });
}

// Price statistics
const prices = data.map(p => p.salePrice).filter(p => p > 0);
const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);
console.log('\nPrice range:');
console.log('  Min:', minPrice.toLocaleString(), '원');
console.log('  Max:', maxPrice.toLocaleString(), '원');
console.log('  Average:', avgPrice.toLocaleString(), '원');

// Discount statistics
const discounts = data.map(p => p.discountRate).filter(d => d > 0);
const avgDiscount = Math.round(discounts.reduce((a, b) => a + b, 0) / discounts.length);
console.log('\nAverage discount rate:', avgDiscount + '%');

// Sample last 5 products
console.log('\nLast 5 products:');
data.slice(-5).forEach((p, i) => {
    console.log('  ' + (data.length - 4 + i) + '. ' + p.name + ' (' + p.modelCode + ')');
});
