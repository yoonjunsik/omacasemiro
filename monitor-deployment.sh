#!/bin/bash

for i in {1..10}; do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "배포 확인 시도 #$i ($(date '+%H:%M:%S'))"
  echo ""

  HTML_DEPLOYED=false
  JS_DEPLOYED=false

  if curl -s "https://omacasemiro.shop/product.html" | grep -q "HOTFIX"; then
    echo "✅ product.html 배포 완료!"
    HTML_DEPLOYED=true
  else
    echo "⏳ product.html 배포 대기 중..."
  fi

  if curl -s "https://omacasemiro.shop/js/product.js" | grep -q "Affiliate links 처리"; then
    echo "✅ product.js 배포 완료!"
    JS_DEPLOYED=true
  else
    echo "⏳ product.js 배포 대기 중..."
  fi

  if [ "$HTML_DEPLOYED" = "true" ] && [ "$JS_DEPLOYED" = "true" ]; then
    echo ""
    echo "🎉🎉🎉 모든 파일 배포 완료! 🎉🎉🎉"
    echo ""
    echo "이제 브라우저에서:"
    echo "1. Ctrl+Shift+Delete (또는 Cmd+Shift+Delete)로 캐시 삭제"
    echo "2. https://omacasemiro.shop/product.html?id=HJ4590-456 재접속"
    echo ""
    exit 0
  fi

  if [ $i -lt 10 ]; then
    echo ""
    echo "30초 후 재시도..."
    sleep 30
  fi
done

echo ""
echo "⚠️ 10번 시도 후에도 배포가 완료되지 않았습니다."
echo "GitHub Pages에 문제가 있을 수 있습니다."
echo "https://github.com/yoonjunsik/omacasemiro/actions 에서 확인해주세요."
