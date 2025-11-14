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

// Function to fetch product page HTML and extract image URL
function fetchUnisportstoreImageFromPage(productId) {
    return new Promise((resolve, reject) => {
        const url = `https://www.unisportstore.com/api/products/${productId}`;

        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': '*/*'
            }
        }, (res) => {
            if (res.statusCode !== 200) {
                return reject(`Status ${res.statusCode}`);
            }

            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    // Try to extract image URL from HTML
                    const imgMatch = data.match(/https:\/\/thumblr\.uniid\.it\/product\/\d+\/[a-f0-9]+\.jpg/i);
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

// Extract product ID from Unisportstore URL
function extractProductId(url) {
    const match = url.match(/\/(\d+)\/?$/);
    return match ? match[1] : null;
}

async function fixAllImages() {
    console.log('Fetching images from Unisportstore product pages...\n');
    console.log('='.repeat(80));

    const updates = [];
    let fixedCount = 0;
    let errorCount = 0;

    for (const product of uniformData) {
        // Check if image uses broken /thumb.jpg pattern
        if (product.image.includes('/thumb.jpg')) {
            const unisport = product.site_offers?.find(o => o.site_name === '유니스포츠');

            if (unisport && unisport.affiliate_link) {
                const productId = extractProductId(unisport.affiliate_link);

                if (productId) {
                    console.log(`\nFetching: ${product.model_code} - ${product.team} ${product.season} ${product.kit_type}`);
                    console.log(`  Product ID: ${productId}`);
                    console.log(`  Old URL: ${product.image}`);

                    try {
                        const newImage = await fetchUnisportstoreImageFromPage(productId);
                        console.log(`  New URL: ${newImage}`);
                        console.log(`  ✓ Success!`);

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

                        // Rate limiting
                        await new Promise(resolve => setTimeout(resolve, 300));

                    } catch (err) {
                        console.log(`  ✗ Error: ${err}`);
                        errorCount++;
                    }
                } else {
                    console.log(`\n✗ ${product.model_code}: Could not extract product ID from ${unisport.affiliate_link}`);
                    errorCount++;
                }
            } else {
                console.log(`\n✗ ${product.model_code}: No Unisportstore link found`);
                errorCount++;
            }
        }
    }

    console.log('\n' + '='.repeat(80));
    console.log(`\n✓ Fixed: ${fixedCount} images`);
    console.log(`✗ Errors: ${errorCount} products`);

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
            '/Users/junsikyoon/omacasemiro/unisport_image_fixes.json',
            JSON.stringify(updates, null, 2)
        );
        console.log('✓ Saved log to unisport_image_fixes.json');
    }

    return { fixedCount, errorCount, updates };
}

fixAllImages().catch(console.error);
