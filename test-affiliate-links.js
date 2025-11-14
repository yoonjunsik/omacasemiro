const { convertToAffiliateLink } = require('./js/affiliate-links.js');

console.log('🔗 Testing LinkPrice Affiliate Link Conversion\n');

// 테스트 케이스
const testCases = [
    {
        storeName: '지그재그',
        originalUrl: 'https://zigzag.kr/catalog/products/163384852',
        expectedUrl: 'https://click.linkprice.com/click.php?m=zigzag&a=A100700570&l=9999&l_cd1=3&l_cd2=0&tu=https%3A%2F%2Fzigzag.kr%2Fcatalog%2Fproducts%2F163384852'
    },
    {
        storeName: '지그재그',
        originalUrl: 'https://zigzag.kr/catalog/products/147476624',
        expectedUrl: 'https://click.linkprice.com/click.php?m=zigzag&a=A100700570&l=9999&l_cd1=3&l_cd2=0&tu=https%3A%2F%2Fzigzag.kr%2Fcatalog%2Fproducts%2F147476624'
    }
];

testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.storeName}`);
    console.log(`Original: ${testCase.originalUrl}`);

    const converted = convertToAffiliateLink(testCase.storeName, testCase.originalUrl);
    console.log(`Converted: ${converted}`);
    console.log(`Expected: ${testCase.expectedUrl}`);

    const passed = converted === testCase.expectedUrl;
    console.log(`Result: ${passed ? '✅ PASS' : '❌ FAIL'}`);

    if (!passed) {
        console.log('\nDifferences:');
        console.log(`  Converted: ${converted}`);
        console.log(`  Expected:  ${testCase.expectedUrl}`);
    }

    console.log('-'.repeat(80));
    console.log('');
});

// 링크프라이스 미등록 판매처 테스트
console.log('Test 3: Non-LinkPrice Store (카포스토어)');
const nonLpUrl = 'https://www.capostore.co.kr/goods/goods_view.php?goodsNo=1000030461';
const nonLpConverted = convertToAffiliateLink('카포스토어', nonLpUrl);
console.log(`Original: ${nonLpUrl}`);
console.log(`Converted: ${nonLpConverted}`);
console.log(`Result: ${nonLpUrl === nonLpConverted ? '✅ PASS (unchanged as expected)' : '❌ FAIL'}`);
