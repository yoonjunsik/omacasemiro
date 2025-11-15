const fs = require('fs');

const products = JSON.parse(fs.readFileSync('crawler/unisportstore-products.json', 'utf8'));

// 빅클럽 필터
const bigClubs = [
    'chelsea', 'liverpool', 'manchester', 'city', 'real madrid',
    'arsenal', 'barcelona', 'bayern', 'tottenham', 'milan',
    'inter', 'juventus', 'psg', 'paris'
];

// 제외 키워드
const excludeKeywords = [
    'kids', 'children', 'youth', 'junior', 'women',
    'long sleeve', 'mini-kit', 'mini kit'
];

const filtered = products.filter(p => {
    const name = p.name.toLowerCase();

    // 빅클럽 체크
    const isBigClub = bigClubs.some(club => name.includes(club));
    if (!isBigClub) return false;

    // 제외 키워드 체크
    const shouldExclude = excludeKeywords.some(keyword => name.includes(keyword));
    if (shouldExclude) return false;

    return true;
});

console.log(`✅ 필터링 완료: ${filtered.length}개 제품`);

fs.writeFileSync(
    'crawler/bigclub-products.json',
    JSON.stringify(filtered, null, 2)
);

console.log('✅ 저장: crawler/bigclub-products.json');

// 팀별 통계
const teamStats = {};
filtered.forEach(p => {
    bigClubs.forEach(club => {
        if (p.name.toLowerCase().includes(club)) {
            teamStats[club] = (teamStats[club] || 0) + 1;
        }
    });
});

console.log('\n📊 팀별 제품 수:');
Object.entries(teamStats)
    .sort((a, b) => b[1] - a[1])
    .forEach(([team, count]) => {
        console.log(`   ${team}: ${count}개`);
    });
