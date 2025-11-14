const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function crawlCapoStore() {
    console.log('Starting Capo Store crawler...\n');

    const allProducts = [];
    const maxPages = 22; // Full crawl of all pages

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        console.log(`Crawling page ${pageNum}/${maxPages}...`);

        const url = `https://www.capostore.co.kr/goods/goods_list.php?cateCd=052005&page=${pageNum}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });

            const $ = cheerio.load(response.data);
            const products = [];

            // Find all product items - they are in div.item_gallery_type > ul > li
            $('.item_gallery_type ul li').each((index, element) => {
                try {
                    const $el = $(element);

                    // Product name (contains model code in parentheses)
                    const nameElement = $el.find('strong.item_name');
                    const fullName = nameElement.text().trim();

                    // Skip if no product name
                    if (!fullName) return;

                    // Extract model code from parentheses and remove hyphens
                    const modelMatch = fullName.match(/\(([A-Z0-9\-]+)\)/);
                    const modelCode = modelMatch ? modelMatch[1].replace(/-/g, '') : '';

                    // Brand
                    const brandElement = $el.find('.item_brand strong');
                    const brand = brandElement.text().trim();

                    // Prices
                    const salePriceElement = $el.find('.item_price span');
                    const salePrice = salePriceElement.length ?
                        parseInt(salePriceElement.text().replace(/[^\d]/g, '')) : 0;

                    const originalPriceElement = $el.find('.fixed-price');
                    const originalPrice = originalPriceElement.length ?
                        parseInt(originalPriceElement.text().replace(/[^\d]/g, '')) : salePrice;

                    // Product URL
                    const linkElement = $el.find('.item_tit_box a, a[href*="goods_view"]').first();
                    const productUrl = linkElement.attr('href') || '';
                    const fullUrl = productUrl ?
                        `https://www.capostore.co.kr/goods/${productUrl.replace('../goods/', '')}` : '';

                    // Image URL
                    const imgElement = $el.find('.item_photo_box img').first();
                    const imageUrl = imgElement.attr('src') || '';

                    // Discount rate
                    const discountRate = originalPrice > 0 ?
                        Math.round((1 - salePrice / originalPrice) * 100) : 0;

                    if (modelCode && fullName) {
                        products.push({
                            name: fullName,
                            modelCode: modelCode,
                            brand: brand,
                            originalPrice: originalPrice,
                            salePrice: salePrice,
                            discountRate: discountRate,
                            url: fullUrl,
                            image: imageUrl
                        });
                    }
                } catch (err) {
                    console.error('Error parsing product:', err.message);
                }
            });

            console.log(`  Found ${products.length} products`);
            allProducts.push(...products);

            // Wait 500ms between requests to be polite
            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
            console.error(`Error crawling page ${pageNum}:`, error.message);
        }
    }

    console.log(`\nTotal products collected: ${allProducts.length}`);

    // Save results
    const outputPath = 'crawler/capostore-products.json';
    fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2));
    console.log(`Saved to ${outputPath}`);

    // Group by model code to check for duplicates
    const byModelCode = {};
    allProducts.forEach(product => {
        if (!byModelCode[product.modelCode]) {
            byModelCode[product.modelCode] = [];
        }
        byModelCode[product.modelCode].push(product);
    });

    const duplicates = Object.entries(byModelCode).filter(([code, products]) => products.length > 1);
    if (duplicates.length > 0) {
        console.log(`\nFound ${duplicates.length} duplicate model codes`);
    }

    // Sample output
    console.log('\nSample products (first 5):');
    allProducts.slice(0, 5).forEach((p, i) => {
        console.log(`\n${i + 1}. ${p.name}`);
        console.log(`   Model: ${p.modelCode}`);
        console.log(`   Brand: ${p.brand}`);
        console.log(`   Price: ${p.originalPrice.toLocaleString()}원 -> ${p.salePrice.toLocaleString()}원 (${p.discountRate}% off)`);
        console.log(`   URL: ${p.url}`);
    });

    return allProducts;
}

// Run
crawlCapoStore()
    .then(() => console.log('\nCrawling completed successfully!'))
    .catch(err => console.error('\nCrawling failed:', err));
