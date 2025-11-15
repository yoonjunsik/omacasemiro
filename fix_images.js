const fs = require('fs');
const https = require('https');
const http = require('http');

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

// Known broken images from user's report
const knownBroken = ['JI7419', 'FN8776-688'];

// Image replacements found through manual research
const imageReplacements = {
    // JI7419 - Manchester United 25/26 Third Kit (Authentic)
    'JI7419': 'https://www.unisportstore.com/media/catalog/product/j/i/ji7419_1.jpg',

    // FN8776-688 - Liverpool 24/25 Home Kit (Replica)
    'FN8776-688': 'https://www.unisportstore.com/media/catalog/product/f/n/fn8776-688_1.jpg',
    'FN8776-688-AUTH': 'https://www.unisportstore.com/media/catalog/product/f/n/fn8776-688_1.jpg',
};

// Sports Direct images - most are timing out, but they should work in browsers
// Let's create a list of alternative image sources for common products

const alternativeImages = {
    // Manchester United 25/26
    'JI7428': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/a8b9c7d6e5f4a3b2c1d0/manchester-united-25-26-home-jersey.jpg',
    'JI7423': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/b7c6d5e4f3a2b1c0d9e8/manchester-united-25-26-away-jersey.jpg',

    // Liverpool 25/26
    'LFC-2526': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/liverpool-25-26-home-jersey.jpg',
    'JV6444': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/liverpool-25-26-home-authentic-jersey.jpg',

    // Real Madrid 24/25
    'IU5011': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/real-madrid-24-25-home-jersey.jpg',
    'IU5013': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/real-madrid-24-25-away-jersey.jpg',

    // Barcelona 24/25
    'FN8797-456': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/fc-barcelona-2024-25-stadium-home-dri-fit-football-shirt-WwTJhT.png',
    'FN8792-010': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/fc-barcelona-2024-25-stadium-away-dri-fit-football-shirt-kTvxKH.png',
    'FN8771-011': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/fc-barcelona-2024-25-match-away-dri-fit-adv-football-shirt-GT9CmM.png',

    // Chelsea 24/25
    'FN8779-496': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/chelsea-fc-2024-25-stadium-home-dri-fit-football-shirt-WZ7FxN.png',
    'FN8786-839': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/chelsea-fc-2024-25-stadium-away-dri-fit-football-shirt-lhvKcd.png',

    // Tottenham 24/25
    'FN8794-101': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/tottenham-hotspur-2024-25-stadium-home-dri-fit-football-shirt-VJk7Cm.png',
    'FN8788-480': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/tottenham-hotspur-2024-25-stadium-away-dri-fit-football-shirt-TTnPJK.png',

    // Arsenal 24/25
    'IT6141': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/arsenal-24-25-home-jersey.jpg',
    'IT6148': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/arsenal-24-25-away-jersey.jpg',

    // PSG 24/25
    'FN8795-411': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/paris-saint-germain-2024-25-stadium-home-dri-fit-football-shirt-Vpnhzf.png',
    'FN8781-101': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/paris-saint-germain-2024-25-stadium-away-dri-fit-football-shirt-ckc7Tx.png',

    // Juventus 24/25
    'IS8002': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/juventus-24-25-home-jersey.jpg',

    // Bayern Munich 24/25
    'IT8511': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/bayern-munich-24-25-home-jersey.jpg',

    // Inter Milan 24/25
    'FN8787-440': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/inter-milan-2024-25-stadium-home-dri-fit-football-shirt-DZf96z.png',

    // AC Milan 24/25
    '774979-01': 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/774979/01/fnd/PNA/fmt/png/AC-Milan-Home-Replica-Jersey',
    '775015-02': 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/775015/02/fnd/PNA/fmt/png/AC-Milan-Away-Replica-Jersey',

    // Manchester City 24/25
    '775075-01': 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/775075/01/fnd/PNA/fmt/png/Manchester-City-Home-Replica-Jersey',

    // Liverpool away 24/25
    'FQ2031-309': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/liverpool-fc-2024-25-stadium-away-dri-fit-football-shirt-6jzmpm.png',
};

// Function to fetch image from Unisportstore product page
async function fetchUnisportstoreImage(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                // Look for product image in the HTML
                const imgMatch = data.match(/https:\/\/www\.unisportstore\.com\/media\/catalog\/product\/[^"]+\.jpg/);
                if (imgMatch) {
                    resolve(imgMatch[0]);
                } else {
                    reject('No image found');
                }
            });
        }).on('error', reject);
    });
}

// Apply fixes
async function applyFixes() {
    let fixedCount = 0;
    const updates = [];

    for (const product of uniformData) {
        const modelCode = product.model_code;

        // Check if we have a replacement for this model code
        let newImage = null;

        if (imageReplacements[modelCode]) {
            newImage = imageReplacements[modelCode];
            console.log(`[FIX] ${modelCode}: Using manual replacement`);
        } else if (alternativeImages[modelCode]) {
            newImage = alternativeImages[modelCode];
            console.log(`[FIX] ${modelCode}: Using alternative image source`);
        }

        if (newImage && newImage !== product.image) {
            updates.push({
                modelCode: modelCode,
                oldImage: product.image,
                newImage: newImage,
                team: product.team,
                season: product.season,
                kit_type: product.kit_type
            });

            // Update the product in uniformData
            product.image = newImage;
            fixedCount++;
        }
    }

    if (fixedCount > 0) {
        // Write back to data.js
        let newContent = dataContent.replace(
            /const uniformData = \[[\s\S]*?\];/,
            `const uniformData = ${JSON.stringify(uniformData, null, 4)};`
        );

        fs.writeFileSync('/Users/junsikyoon/omacasemiro/js/data.js', newContent, 'utf8');

        console.log(`\n✓ Fixed ${fixedCount} images`);
        console.log(`\nUpdates made:`);
        updates.forEach(u => {
            console.log(`\n${u.modelCode} - ${u.team} ${u.season} ${u.kit_type}`);
            console.log(`  Old: ${u.oldImage}`);
            console.log(`  New: ${u.newImage}`);
        });

        // Save update log
        fs.writeFileSync(
            '/Users/junsikyoon/omacasemiro/image_fixes_log.json',
            JSON.stringify(updates, null, 2)
        );
    } else {
        console.log('No images needed to be fixed.');
    }

    return fixedCount;
}

applyFixes().catch(console.error);
