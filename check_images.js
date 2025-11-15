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

console.log(`Total products: ${uniformData.length}`);

// Function to check if URL is accessible
function checkImageUrl(url) {
    return new Promise((resolve) => {
        const protocol = url.startsWith('https') ? https : http;

        const req = protocol.get(url, { timeout: 5000 }, (res) => {
            const isValid = res.statusCode === 200 &&
                           res.headers['content-type'] &&
                           res.headers['content-type'].startsWith('image/');
            resolve({
                valid: isValid,
                statusCode: res.statusCode,
                contentType: res.headers['content-type']
            });
            req.abort();
        });

        req.on('error', (err) => {
            resolve({ valid: false, error: err.message });
        });

        req.on('timeout', () => {
            req.abort();
            resolve({ valid: false, error: 'timeout' });
        });
    });
}

// Check all images
async function checkAllImages() {
    const results = [];
    let checkedCount = 0;
    let brokenCount = 0;

    for (const product of uniformData) {
        checkedCount++;
        const result = await checkImageUrl(product.image);

        const productInfo = {
            team: product.team,
            kit_type: product.kit_type,
            season: product.season,
            version: product.version,
            model_code: product.model_code,
            image: product.image,
            valid: result.valid,
            statusCode: result.statusCode,
            contentType: result.contentType,
            error: result.error,
            site_offers: product.site_offers
        };

        if (!result.valid) {
            brokenCount++;
            console.log(`\n[BROKEN] ${product.model_code} - ${product.team} ${product.season} ${product.kit_type}`);
            console.log(`  Current URL: ${product.image}`);
            console.log(`  Status: ${result.statusCode || result.error}`);
            if (product.site_offers && product.site_offers.length > 0) {
                console.log(`  Available sites: ${product.site_offers.map(s => s.site_name).join(', ')}`);
            }
        }

        results.push(productInfo);

        // Progress indicator
        if (checkedCount % 10 === 0) {
            console.log(`\nProgress: ${checkedCount}/${uniformData.length} checked, ${brokenCount} broken so far`);
        }

        // Small delay to avoid overwhelming servers
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Save results to file
    fs.writeFileSync(
        '/Users/junsikyoon/omacasemiro/image_check_results.json',
        JSON.stringify(results, null, 2)
    );

    console.log('\n\n=== SUMMARY ===');
    console.log(`Total checked: ${checkedCount}`);
    console.log(`Broken/Invalid: ${brokenCount}`);
    console.log(`Valid: ${checkedCount - brokenCount}`);
    console.log(`\nResults saved to: image_check_results.json`);
}

checkAllImages().catch(console.error);
