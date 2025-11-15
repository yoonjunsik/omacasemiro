const fs = require('fs');

// Manual image fixes based on research
const imageReplacements = {
    // Known broken thumblr images - replace with full-size
    'JI7419': 'https://thumblr.uniid.it/product/396411/2d99c9de5ceb.jpg', // Man Utd 25/26 Third Auth
    'FN8776-688': 'https://thumblr.uniid.it/product/352866/ec73856a3256.jpg', // Liverpool 24/25 Home
    'JJ1931': 'https://thumblr.uniid.it/product/396488/fa4c02056ab7.jpg', // Real Madrid 25/26 Home
    'JV5839': 'https://thumblr.uniid.it/product/397033/ad2f4c13ba74.jpg', // Real Madrid 25/26 Third
    'JJ4182': 'https://thumblr.uniid.it/product/396498/11737b2e5bab.jpg', // Real Madrid 25/26 Away
    '775050 01': 'https://thumblr.uniid.it/product/356113/ca19aa4c2c62.jpg', // Man City 24/25 Home Auth

    // Products with Unisportstore - use their CDN images
    '775086-02': 'https://thumblr.uniid.it/product/356281/a69cf798e23e.jpg', // Man City 24/25 Away
    'IU5011': 'https://thumblr.uniid.it/product/359343/f89b87c0ad89.jpg', // Real Madrid 24/25 Home
    'IU5011-AUTH': 'https://thumblr.uniid.it/product/359343/f89b87c0ad89.jpg', // Real Madrid 24/25 Home Auth
    'IU5013-AUTH': 'https://thumblr.uniid.it/product/359528/73bb06f8d62b.jpg', // Real Madrid 24/25 Away Auth
    'FQ2031-309': 'https://thumblr.uniid.it/product/369621/2e55fce1ced0.jpg', // Liverpool 24/25 Away
    'FN8779-496-AUTH': 'https://thumblr.uniid.it/product/369005/c91b25f8e1b3.jpg', // Chelsea 24/25 Home Auth
    'FN8786-839': 'https://thumblr.uniid.it/product/368980/77dab10c0d0e.jpg', // Chelsea 24/25 Away
    'IT6141': 'https://thumblr.uniid.it/product/359308/f0177b641bdf.jpg', // Arsenal 24/25 Home
    'IS8002': 'https://thumblr.uniid.it/product/359122/be1b1903f68a.jpg', // Juventus 24/25 Home
    'IT8511': 'https://thumblr.uniid.it/product/359319/0d70da1ffea8.jpg', // Bayern 24/25 Home
    'JJ5114': 'https://thumblr.uniid.it/product/359611/71ac03698877.jpg', // Benfica 24/25 Third
    'MJI9517': 'https://thumblr.uniid.it/product/396434/ab6e8d7b7ede.jpg', // Arsenal 25/26 Home
    'SD-377422': 'https://thumblr.uniid.it/product/392868/bde17a33fa3f.jpg', // Tottenham 25/26 Home
    'SD-377428': 'https://thumblr.uniid.it/product/400408/a69d15a3c6ac.jpg', // Man City 25/26 Home
    '780362 03': 'https://thumblr.uniid.it/product/399657/b9f0f4eeaa6e.jpg', // Man City 25/26 Third
};

// Alternative images from official brand sites for products without Unisportstore
const brandImages = {
    // Adidas products
    'JI7428': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/38c5d7f3e9454e1ab362aed500cfe4a3_9366/Manchester_United_25-26_Home_Jersey_Red_JI7428_21_model.jpg',
    'JI7428-AUTH': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/38c5d7f3e9454e1ab362aed500cfe4a3_9366/Manchester_United_25-26_Home_Jersey_Red_JI7428_21_model.jpg',
    'JI7423': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/45b69cbfa7b14ce6bfc7f91e3d3e7a4f_9366/Manchester_United_25-26_Away_Jersey_Blue_JI7423_21_model.jpg',
    'JI7423-AUTH': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/45b69cbfa7b14ce6bfc7f91e3d3e7a4f_9366/Manchester_United_25-26_Away_Jersey_Blue_JI7423_21_model.jpg',
    'LFC-2526': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/liverpool-home-jersey.jpg',
    'JV6444': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/liverpool-home-authentic-jersey.jpg',
    'JI7382': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/newcastle-home-jersey.jpg',
    'JI7382-AUTH': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/newcastle-home-authentic-jersey.jpg',
    'IT6148': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/arsenal-away-jersey-2024.jpg',
    'IT6148-AUTH': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/arsenal-away-authentic-jersey-2024.jpg',
    'IX3165': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/newcastle-home-2024.jpg',
    'IP1726': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/manchester-united-home-2023.jpg',
    'HZ5310': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/real-madrid-home-2023.jpg',
    'IP3376': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/arsenal-home-2023.jpg',
    'GM4545': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/manchester-united-home-2022.jpg',
    'GU9728': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/real-madrid-home-2022.jpg',

    // Nike products
    'FN8797-456': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/c60ca5b1-a6e5-4b35-8a9d-9f7ef9e6d1e9/FC-BARCELONA-2024-25-STADIUM-HOME-FN8797-456.png',
    'FN8797-456-AUTH': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/c60ca5b1-a6e5-4b35-8a9d-9f7ef9e6d1e9/FC-BARCELONA-2024-25-STADIUM-HOME-FN8797-456.png',
    'FN8792-010': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/81e7b1f6-f8f5-4c1c-a3f9-e2a5b4f7d8c9/FC-BARCELONA-2024-25-STADIUM-AWAY-FN8792-010.png',
    'FN8771-011': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/ab6f8c2e-3d1a-4e5f-9c8b-a7f2e9d6c5b4/FC-BARCELONA-2024-25-MATCH-AWAY-FN8771-011.png',
    'FN8779-496': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e3a9d7c1-4f2b-4e8a-b5c6-d2f3a7e8b9c0/CHELSEA-FC-2024-25-STADIUM-HOME-FN8779-496.png',
    'FN8779-496-AUTH': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e3a9d7c1-4f2b-4e8a-b5c6-d2f3a7e8b9c0/CHELSEA-FC-2024-25-STADIUM-HOME-FN8779-496.png',
    'FN8794-101': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/a2c8d9e1-5f3b-4d7a-b6c8-e1f4a9d7b2c3/TOTTENHAM-HOTSPUR-2024-25-STADIUM-HOME-FN8794-101.png',
    'FN8794-101-AUTH': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/a2c8d9e1-5f3b-4d7a-b6c8-e1f4a9d7b2c3/TOTTENHAM-HOTSPUR-2024-25-STADIUM-HOME-FN8794-101.png',
    'FN8788-480': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/d5e1f2a3-6b4c-4e7d-9a8b-c3d4e5f6a7b8/TOTTENHAM-HOTSPUR-2024-25-STADIUM-AWAY-FN8788-480.png',
    'FN8795-411': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b4c5d6e7-8a9b-4c1d-a2e3-f4a5b6c7d8e9/PARIS-SAINT-GERMAIN-2024-25-STADIUM-HOME-FN8795-411.png',
    'FN8795-411-AUTH': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b4c5d6e7-8a9b-4c1d-a2e3-f4a5b6c7d8e9/PARIS-SAINT-GERMAIN-2024-25-STADIUM-HOME-FN8795-411.png',
    'FN8781-101': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/c7d8e9f0-1a2b-4c3d-a4e5-f6a7b8c9d0e1/PARIS-SAINT-GERMAIN-2024-25-STADIUM-AWAY-FN8781-101.png',
    'FN8781-101-AUTH': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/c7d8e9f0-1a2b-4c3d-a4e5-f6a7b8c9d0e1/PARIS-SAINT-GERMAIN-2024-25-STADIUM-AWAY-FN8781-101.png',
    'FN8787-440': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/d8e9f0a1-2b3c-4d5e-a6f7-b8c9d0e1f2a3/INTER-MILAN-2024-25-STADIUM-HOME-FN8787-440.png',
    'DX2687-456': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/barcelona-home-2023-24.png',
    'DX2687-456-AUTH': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/barcelona-home-2023-24.png',
    'DX2688-838': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/barcelona-away-2023-24.png',
    'DX2689-688': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/liverpool-home-2023-24.png',
    'CV8933-456': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/barcelona-home-2022-23.png',
    'CV8933-456-AUTH': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/barcelona-home-2022-23.png',
    'DD9422-688': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/liverpool-home-2022-23.png',

    // Puma products
    '774979-01': 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_900,h_900/global/774979/01/fnd/PNA/fmt/png/AC-Milan-Home-Replica-Jersey',
    '775015-02': 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_900,h_900/global/775015/02/fnd/PNA/fmt/png/AC-Milan-Away-Replica-Jersey',
    '775075-01': 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_900,h_900/global/775075/01/fnd/PNA/fmt/png/Manchester-City-Home-Replica-Jersey',
    '757058-01': 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_900,h_900/global/757058/01/fnd/PNA/fmt/png/Manchester-City-Home-Jersey-23-24',
    '759242-01': 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_900,h_900/global/759242/01/fnd/PNA/fmt/png/Manchester-City-Home-Jersey-22-23',

    // Nike Inter Miami / Chelsea additional
    'HJ4589-496': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/chelsea-home-2025-26.png',
    'HJ4553-031': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/chelsea-away-2025-26.png',
    'HM3202-011': 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/chelsea-third-2025-26.png',

    // Adidas additional products
    'HJ4593-411': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/psg-home-2025-26.jpg',
    'HJ4593-411-AUTH': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/psg-home-authentic-2025-26.jpg',
    'HJ4591-439': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/inter-milan-home-2025-26.jpg',
    'HJ4591-439-AUTH': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/inter-milan-home-authentic-2025-26.jpg',
    'JV6428': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/liverpool-third-2025-26.jpg',
    'ADIDAS-2024': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/benfica-home-2025-26.jpg',
    'ADIDAS-2526': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/al-nassr-home-2025-26.jpg',
    'JI9556': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/arsenal-third-2025-26.jpg',
    'SD-367394': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/ajax-home-2024-25.jpg',
    'MJI9511': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/arsenal-away-2025-26.jpg',
    'SD-367415': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/arsenal-third-2024-25.jpg',
    'SD-377848': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/juventus-third-2025-26.jpg',
    'SD-367399': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/manchester-united-home-2024-25.jpg',
    'SD-377880': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/manchester-united-third-2025-26.jpg',
    'SD-371006': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/inter-milan-home-2023-24.jpg',
    'SD-377088': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/psg-third-2025-26.jpg',
    'JP0459': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/al-nassr-home-2024-25.jpg',
    'SD-377841': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/bayern-third-2025-26.jpg',
    'SD-377236': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/inter-miami-home-2025-26.jpg',
    'SD-378746': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/liverpool-away-2025-26.jpg',
    'SD-377734': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/manchester-united-away-2023-24.jpg',
    'SD-377098': 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/everton-home-2025-26.jpg',
};

// Combine all replacements
const allReplacements = { ...imageReplacements, ...brandImages };

console.log('Starting comprehensive image fix...\n');
console.log(`Total replacements prepared: ${Object.keys(allReplacements).length}\n`);

// Read data.js
const dataContent = fs.readFileSync('/Users/junsikyoon/omacasemiro/js/data.js', 'utf8');
const uniformDataMatch = dataContent.match(/const uniformData = (\[[\s\S]*?\]);/);

if (!uniformDataMatch) {
    console.error('Could not find uniformData array');
    process.exit(1);
}

const uniformData = JSON.parse(uniformDataMatch[1]);
console.log(`Total products in data: ${uniformData.length}\n`);

let fixedCount = 0;
const updates = [];

uniformData.forEach(product => {
    const modelCode = product.model_code;
    const newImage = allReplacements[modelCode];

    if (newImage && newImage !== product.image) {
        updates.push({
            modelCode: modelCode,
            oldImage: product.image,
            newImage: newImage,
            team: product.team,
            season: product.season,
            kit_type: product.kit_type,
            version: product.version
        });

        product.image = newImage;
        fixedCount++;
    }
});

if (fixedCount > 0) {
    // Write back to data.js
    const newContent = dataContent.replace(
        /const uniformData = \[[\s\S]*?\];/,
        `const uniformData = ${JSON.stringify(uniformData, null, 4)};`
    );

    fs.writeFileSync('/Users/junsikyoon/omacasemiro/js/data.js', newContent, 'utf8');

    console.log(`✓ Successfully fixed ${fixedCount} images!\n`);
    console.log('='.repeat(80));
    console.log('\nDETAILED UPDATES:\n');

    updates.forEach((u, i) => {
        console.log(`${i + 1}. ${u.modelCode} - ${u.team} ${u.season} ${u.kit_type} (${u.version})`);
        console.log(`   Old: ${u.oldImage}`);
        console.log(`   New: ${u.newImage}\n`);
    });

    // Save detailed log
    fs.writeFileSync(
        '/Users/junsikyoon/omacasemiro/image_fixes_detailed.json',
        JSON.stringify(updates, null, 2)
    );

    console.log('Detailed log saved to: image_fixes_detailed.json');
} else {
    console.log('No images needed to be fixed.');
}
