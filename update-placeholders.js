const fs = require('fs');

const file = fs.readFileSync('js/christmas.js', 'utf8');

// 각 구단별 SVG
const svgs = {
    tottenham: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23132257" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3ESpurs%3C/text%3E%3C/svg%3E',
    manutd: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23DA291C" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EMan%20Utd%3C/text%3E%3C/svg%3E',
    mancity: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%236CABDD" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EMan%20City%3C/text%3E%3C/svg%3E',
    barcelona: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23004D98" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EBar%C3%A7a%3C/text%3E%3C/svg%3E',
    bayern: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23DC052D" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EBayern%3C/text%3E%3C/svg%3E',
    bvb: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23FDE100" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="black" text-anchor="middle" dy=".3em"%3EBVB%3C/text%3E%3C/svg%3E'
};

let updated = file
    .replace(/https:\/\/via\.placeholder\.com\/400x400\/132257\/ffffff\?text=Spurs\+Christmas\+\d+/g, svgs.tottenham)
    .replace(/https:\/\/via\.placeholder\.com\/400x400\/DA291C\/ffffff\?text=Man\+Utd\+Christmas\+\d+/g, svgs.manutd)
    .replace(/https:\/\/via\.placeholder\.com\/400x400\/6CABDD\/ffffff\?text=Man\+City\+Christmas\+\d+/g, svgs.mancity)
    .replace(/https:\/\/via\.placeholder\.com\/400x400\/004D98\/ffffff\?text=Barca\+Christmas\+\d+/g, svgs.barcelona)
    .replace(/https:\/\/via\.placeholder\.com\/400x400\/DC052D\/ffffff\?text=Bayern\+Christmas\+\d+/g, svgs.bayern)
    .replace(/https:\/\/via\.placeholder\.com\/400x400\/FDE100\/000000\?text=BVB\+Christmas\+\d+/g, svgs.bvb);

fs.writeFileSync('js/christmas.js', updated);
console.log('✅ Updated all placeholder URLs to SVG data URIs');
