#!/bin/bash

# 자동 배포 스크립트
# main 브랜치의 변경사항을 gh-pages로 자동 병합 및 배포

set -e  # 에러 발생 시 즉시 중단

echo "🚀 배포 시작..."
echo ""

# 현재 브랜치 확인
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 현재 브랜치: $CURRENT_BRANCH"

# main 브랜치가 아니면 경고
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  경고: main 브랜치가 아닙니다."
    read -p "계속하시겠습니까? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ 배포 취소됨"
        exit 1
    fi
fi

# 변경사항이 있는지 확인
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  커밋되지 않은 변경사항이 있습니다."
    git status --short
    read -p "모든 변경사항을 커밋하시겠습니까? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "커밋 메시지: " COMMIT_MSG
        git commit -m "$COMMIT_MSG"
    else
        echo "❌ 배포 취소됨"
        exit 1
    fi
fi

echo ""
echo "1️⃣ main 브랜치 푸시 중..."
git push origin main
echo "✅ main 브랜치 푸시 완료"

echo ""
echo "2️⃣ gh-pages 브랜치로 전환 중..."
git checkout gh-pages

echo ""
echo "3️⃣ main 브랜치 병합 중..."
git merge main -m "Deploy: merge main into gh-pages"

echo ""
echo "4️⃣ gh-pages 브랜치 푸시 중..."
git push origin gh-pages
echo "✅ gh-pages 브랜치 푸시 완료"

echo ""
echo "5️⃣ main 브랜치로 복귀 중..."
git checkout main

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 배포 완료!"
echo ""
echo "GitHub Pages가 1-2분 내에 업데이트됩니다."
echo "배포 상태 확인: https://github.com/yoonjunsik/omacasemiro/actions"
echo ""
echo "사이트: https://omacasemiro.shop"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
