const fs = require('fs');
const https = require('https');

// Read data.js
const dataContent = fs.readFileSync('/Users/junsikyoon/omacasemiro/js/data.js', 'utf8');
const uniformDataMatch = dataContent.match(/const uniformData = (\[[\s\S]*?\]);/);

if (!uniformDataMatch) {
    console.error('Could not find uniformData array');
    process.exit(1);
}

const uniformData = JSON.parse(uniformDataMatch[1]);
console.log(`Total products: ${uniformData.length}\n`);

// Function to fetch product page and extract main image
function fetchProductImage(url) {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            }
        }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                // Follow redirect
                if (res.headers.location) {
                    return fetchProductImage(res.headers.location).then(resolve).catch(reject);
                }
            }

            if (res.statusCode !== 200) {
                return reject(`Status ${res.statusCode}`);
            }

            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    // Extract product ID from URL
                    const productIdMatch = url.match(/\/(\d+)\/?$/);
                    if (!productIdMatch) {
                        return reject('Could not extract product ID from URL');
                    }

                    const productId = productIdMatch[1];

                    // Find image URL in HTML - look for the first thumblr image with full hash
                    const imgPattern = new RegExp(`https://thumblr\\.uniid\\.it/product/${productId}/[a-f0-9]{12}\\.jpg`, 'i');
                    const imgMatch = data.match(imgPattern);

                    if (imgMatch) {
                        resolve(imgMatch[0]);
                    } else {
                        reject('No image URL found in page');
                    }
                } catch (e) {
                    reject('Error parsing page: ' + e.message);
                }
            });
        }).on('error', reject);
    });
}

// Extract product ID from URL
function extractProductId(url) {
    const match = url.match(/\/(\d+)\/?$/);
    return match ? match[1] : null;
}

async function fixAllImages() {
    console.log('Fetching images from Unisportstore product pages...\n');
    console.log('='.repeat(80) + '\n');

    const updates = [];
    let fixedCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const product of uniformData) {
        // Check if image uses broken /thumb.jpg pattern
        if (product.image.includes('/thumb.jpg')) {
            const unisport = product.site_offers?.find(o => o.site_name === '유니스포츠');

            if (unisport && unisport.affiliate_link) {
                const productId = extractProductId(unisport.affiliate_link);

                if (productId) {
                    console.log(`Fetching: ${product.model_code} - ${product.team} ${product.season} ${product.kit_type}`);
                    console.log(`  Product ID: ${productId}`);
                    console.log(`  URL: ${unisport.affiliate_link}`);

                    try {
                        const newImage = await fetchProductImage(unisport.affiliate_link);
                        console.log(`  ✓ Found: ${newImage}\n`);

                        updates.push({
                            modelCode: product.model_code,
                            oldImage: product.image,
                            newImage: newImage,
                            team: product.team,
                            season: product.season,
                            kit_type: product.kit_type,
                            version: product.version
                        });

                        product.image = newImage;
                        fixedCount++;

                        // Rate limiting - be nice to Unisportstore
                        await new Promise(resolve => setTimeout(resolve, 500));

                    } catch (err) {
                        console.log(`  ✗ Error: ${err}\n`);
                        errorCount++;
                    }
                } else {
                    console.log(`✗ ${product.model_code}: Could not extract product ID`);
                    errorCount++;
                }
            } else {
                console.log(`✗ ${product.model_code}: No Unisportstore link found`);
                skippedCount++;
            }
        }
    }

    console.log('\n' + '='.repeat(80));
    console.log(`\n✓ Fixed: ${fixedCount} images`);
    console.log(`✗ Errors: ${errorCount} products`);
    console.log(`- Skipped: ${skippedCount} products (no Unisportstore link)`);

    if (fixedCount > 0) {
        // Write back to data.js
        const newContent = dataContent.replace(
            /const uniformData = \[[\s\S]*?\];/,
            `const uniformData = ${JSON.stringify(uniformData, null, 4)};`
        );

        fs.writeFileSync('/Users/junsikyoon/omacasemiro/js/data.js', newContent, 'utf8');
        console.log('\n✓ Updated js/data.js');

        // Save detailed log
        fs.writeFileSync(
            '/Users/junsikyoon/omacasemiro/unisport_fixes.json',
            JSON.stringify(updates, null, 2)
        );
        console.log('✓ Saved log to unisport_fixes.json');
    }

    return { fixedCount, errorCount, skippedCount, updates };
}

fixAllImages().catch(console.error);
