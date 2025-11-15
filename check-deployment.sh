#!/bin/bash

echo "🔍 GitHub Pages 배포 상태 확인 중..."
echo ""

# 배포된 파일 확인
echo "1️⃣ product.js 파일 확인 (최신 코드 포함 여부):"
if curl -s "https://omacasemiro.shop/js/product.js" | grep -q "Affiliate links 처리"; then
    echo "✅ 최신 코드가 배포되었습니다!"
else
    echo "⏳ 아직 배포 중입니다. 잠시 후 다시 시도해주세요."
fi

echo ""
echo "2️⃣ product.html 파일 확인 (버전 확인):"
if curl -s "https://omacasemiro.shop/product.html" | grep -q "v=20250115-001"; then
    echo "✅ product.html이 최신 버전입니다!"
else
    echo "⏳ product.html 배포 중..."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "배포가 완료되면 다음을 시도해주세요:"
echo "1. 브라우저에서 Ctrl+Shift+Delete (또는 Cmd+Shift+Delete)"
echo "2. '캐시된 이미지 및 파일' 선택 후 삭제"
echo "3. https://omacasemiro.shop/product.html?id=HJ4590-456 재접속"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
