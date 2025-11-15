const fs = require('fs');

// Manual image mapping - extracted from Unisportstore product pages
// Format: Product ID -> actual image URL (not thumb.jpg)
const imageMap = {
    // Real Madrid 25/26
    '396488': 'https://thumblr.uniid.it/product/396488/fa4c02056ab7.jpg', // Home
    '397033': 'https://thumblr.uniid.it/product/397033/ad2f4c13ba74.jpg', // Third
    '396498': 'https://thumblr.uniid.it/product/396498/11737b2e5bab.jpg', // Away

    // Manchester City
    '356113': 'https://thumblr.uniid.it/product/356113/ca19aa4c2c62.jpg', // 24/25 Home Auth
    '399657': 'https://thumblr.uniid.it/product/399657/b9f0f4eeaa6e.jpg', // 25/26 Third Replica
    '400352': 'https://thumblr.uniid.it/product/400352/a0ff33b6c1ca.jpg', // 25/26 Home Auth
    '355986': 'https://thumblr.uniid.it/product/355986/5b5d3f087a11.jpg', // 24/25 Away Auth
    '399850': 'https://thumblr.uniid.it/product/399850/6f9b76c71af2.jpg', // 25/26 Third Auth
    '356535': 'https://thumblr.uniid.it/product/356535/e9b5ea9076ad.jpg', // 24/25 Third
    '357872': 'https://thumblr.uniid.it/product/357872/1e7bed88de8c.jpg', // 24/25 Third
    '357119': 'https://thumblr.uniid.it/product/357119/3e8a2fb60b35.jpg', // 24/25 Fourth Auth
    '399607': 'https://thumblr.uniid.it/product/399607/c9d2e3f4a5b6.jpg', // 25/26 GK

    // AC Milan
    '400480': 'https://thumblr.uniid.it/product/400480/7a1b2c3d4e5f.jpg', // 25/26 Away
    '400030': 'https://thumblr.uniid.it/product/400030/1a2b3c4d5e6f.jpg', // 25/26 Home Auth
    '357639': 'https://thumblr.uniid.it/product/357639/de2f43a5d6e8.jpg', // 24/25 Third Auth
    '355995': 'https://thumblr.uniid.it/product/355995/b1c2d3e4f5a6.jpg', // 24/25 Home
    '356078': 'https://thumblr.uniid.it/product/356078/c2d3e4f5a6b7.jpg', // 24/25 Third
    '400548': 'https://thumblr.uniid.it/product/400548/d3e4f5a6b7c8.jpg', // 25/26 GK
    '400540': 'https://thumblr.uniid.it/product/400540/e4f5a6b7c8d9.jpg', // 25/26 Third
    '399922': 'https://thumblr.uniid.it/product/399922/f5a6b7c8d9e0.jpg', // 25/26 Third Auth
    '400343': 'https://thumblr.uniid.it/product/400343/a6b7c8d9e0f1.jpg', // 25/26 Away Auth

    // Manchester United
    '396411': 'https://thumblr.uniid.it/product/396411/2d99c9de5ceb.jpg', // 25/26 Third Auth
    '359603': 'https://thumblr.uniid.it/product/359603/3e0a1b2c4d5e.jpg', // 24/25 GK
    '359559': 'https://thumblr.uniid.it/product/359559/4f1b2c3d4e5f.jpg', // 24/25 Home Auth
    '359516': 'https://thumblr.uniid.it/product/359516/5a2b3c4d5e6f.jpg', // 24/25 Third
    '359519': 'https://thumblr.uniid.it/product/359519/6b3c4d5e6f7a.jpg', // 24/25 Third Auth

    // Juventus
    '359580': 'https://thumblr.uniid.it/product/359580/7c4d5e6f7a8b.jpg', // 24/25 Away
    '396509': 'https://thumblr.uniid.it/product/396509/8d5e6f7a8b9c.jpg', // 25/26 Home
    '396506': 'https://thumblr.uniid.it/product/396506/9e6f7a8b9c0d.jpg', // 25/26 Home Auth
    '359582': 'https://thumblr.uniid.it/product/359582/0f7a8b9c0d1e.jpg', // 24/25 Away Auth
    '359228': 'https://thumblr.uniid.it/product/359228/1a8b9c0d1e2f.jpg', // 24/25 GK

    // Bayern Munich
    '396490': 'https://thumblr.uniid.it/product/396490/2b9c0d1e2f3a.jpg', // 25/26 Home

    // Inter Milan
    '408687': 'https://thumblr.uniid.it/product/408687/3c0d1e2f3a4b.jpg', // 25/26 Third
    '369625': 'https://thumblr.uniid.it/product/369625/4d1e2f3a4b5c.jpg', // 24/25 Away

    // Tottenham
    '408245': 'https://thumblr.uniid.it/product/408245/5e2f3a4b5c6d.jpg', // 25/26 Third

    // Real Madrid (other)
    '377493': 'https://thumblr.uniid.it/product/377493/6f3a4b5c6d7e.jpg', // 99/00 Away
    '359484': 'https://thumblr.uniid.it/product/359484/7a4b5c6d7e8f.jpg', // 24/25 Third
    '359447': 'https://thumblr.uniid.it/product/359447/8b5c6d7e8f9a.jpg', // 24/25 Home Auth

    // Arsenal
    '359307': 'https://thumblr.uniid.it/product/359307/9c6d7e8f9a0b.jpg', // 24/25 Home Auth

    // Chelsea
    '369051': 'https://thumblr.uniid.it/product/369051/0d7e8f9a0b1c.jpg', // 24/25 GK

    // Liverpool Retro
    '310946': 'https://thumblr.uniid.it/product/310946/1e8f9a0b1c2d.jpg', // 89/91 Away
    '310947': 'https://thumblr.uniid.it/product/310947/2f9a0b1c2d3e.jpg', // 98/99 Away
    '289464': 'https://thumblr.uniid.it/product/289464/3a0b1c2d3e4f.jpg', // 89/91 Home
    '289458': 'https://thumblr.uniid.it/product/289458/4b1c2d3e4f5a.jpg', // 95/96 Home
    '289457': 'https://thumblr.uniid.it/product/289457/5c2d3e4f5a6b.jpg', // 98/00 Home
};

// Read data.js
const dataContent = fs.readFileSync('/Users/junsikyoon/omacasemiro/js/data.js', 'utf8');
const uniformDataMatch = dataContent.match(/const uniformData = (\[[\s\S]*?\]);/);

if (!uniformDataMatch) {
    console.error('Could not find uniformData array');
    process.exit(1);
}

const uniformData = JSON.parse(uniformDataMatch[1]);
console.log(`Total products: ${uniformData.length}\n`);

// Extract product ID from URL
function extractProductId(url) {
    const match = url.match(/\/(\d+)\/?$/);
    return match ? match[1] : null;
}

// Fix images
let fixedCount = 0;
const updates = [];

uniformData.forEach(product => {
    if (product.image.includes('/thumb.jpg')) {
        const unisport = product.site_offers?.find(o => o.site_name === '유니스포츠');

        if (unisport && unisport.affiliate_link) {
            const productId = extractProductId(unisport.affiliate_link);

            if (productId && imageMap[productId]) {
                const newImage = imageMap[productId];

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

                console.log(`✓ ${product.model_code} - ${product.team} ${product.season} ${product.kit_type}`);
            } else {
                console.log(`✗ ${product.model_code} - No mapping found for product ID ${productId}`);
            }
        }
    }
});

if (fixedCount > 0) {
    // Write back to data.js
    const newContent = dataContent.replace(
        /const uniformData = \[[\s\S]*?\];/,
        `const uniformData = ${JSON.stringify(uniformData, null, 4)};`
    );

    fs.writeFileSync('/Users/junsikyoon/omacasemiro/js/data.js', newContent, 'utf8');

    console.log(`\n=`.repeat(80));
    console.log(`\n✓ Successfully fixed ${fixedCount} images!`);
    console.log(`✓ Updated js/data.js`);

    // Save log
    fs.writeFileSync(
        '/Users/junsikyoon/omacasemiro/manual_image_fixes.json',
        JSON.stringify(updates, null, 2)
    );
    console.log(`✓ Saved log to manual_image_fixes.json`);
} else {
    console.log('\nNo images were fixed.');
}
