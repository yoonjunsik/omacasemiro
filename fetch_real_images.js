const fs = require('fs');
const https = require('https');

// Read the data.js file
const dataContent = fs.readFileSync('/Users/junsikyoon/omacasemiro/js/data.js', 'utf8');

// Extract the uniformData array
const uniformDataMatch = dataContent.match(/const uniformData = (\[[\s\S]*?\]);/);
if (!uniformDataMatch) {
    console.error('Could not find uniformData array');
    process.exit(1);
}

const uniformData = JSON.parse(uniformDataMatch[1]);

console.log(`Total products: ${uniformData.length}\n`);

// Priority fixes for known broken images
const priorityFixes = {
    'JI7419': {
        search: 'Manchester United 25/26 third kit',
        unisport_link: 'https://www.unisportstore.com/football-shirts/man-utd-third-shirt-adidas-2025-26-authentic/396411/'
    },
    'FN8776-688': {
        search: 'Liverpool 24/25 home kit Nike',
        unisport_link: 'https://www.unisportstore.com/football-shirts/liverpool-home-shirt-nike-2024-25/394458/'
    }
};

// Fetch image from Unisportstore
async function fetchUnisportstoreImage(productId) {
    const url = `https://www.unisportstore.com/api/products/${productId}`;

    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.image) {
                        resolve(json.image);
                    } else {
                        reject('No image in API response');
                    }
                } catch (e) {
                    reject('Failed to parse JSON: ' + e.message);
                }
            });
        }).on('error', reject);
    });
}

// Extract product ID from Unisportstore URL
function extractUnisportId(url) {
    const match = url.match(/\/(\d+)\/?$/);
    return match ? match[1] : null;
}

// Main function to fetch images
async function fetchImages() {
    console.log('Fetching images from product pages...\n');

    const imageMap = new Map();

    // Check products with Unisportstore offers
    for (const product of uniformData) {
        if (product.site_offers && product.site_offers.length > 0) {
            for (const offer of product.site_offers) {
                if (offer.site_name === '유니스포츠' && offer.affiliate_link) {
                    const productId = extractUnisportId(offer.affiliate_link);
                    if (productId) {
                        console.log(`Checking ${product.model_code} on Unisportstore (ID: ${productId})...`);
                        try {
                            const imageUrl = await fetchUnisportstoreImage(productId);
                            if (imageUrl) {
                                imageMap.set(product.model_code, {
                                    source: 'Unisportstore',
                                    url: imageUrl,
                                    team: product.team,
                                    season: product.season,
                                    kit_type: product.kit_type
                                });
                                console.log(`  ✓ Found image: ${imageUrl}\n`);
                            }
                        } catch (err) {
                            console.log(`  ✗ Error: ${err}\n`);
                        }

                        // Rate limiting
                        await new Promise(resolve => setTimeout(resolve, 200));
                    }
                }
            }
        }
    }

    // Save the image map
    const imageMapObject = {};
    imageMap.forEach((value, key) => {
        imageMapObject[key] = value;
    });

    fs.writeFileSync(
        '/Users/junsikyoon/omacasemiro/fetched_images.json',
        JSON.stringify(imageMapObject, null, 2)
    );

    console.log(`\n✓ Fetched ${imageMap.size} images`);
    console.log('Results saved to fetched_images.json');

    return imageMap;
}

fetchImages().catch(console.error);
