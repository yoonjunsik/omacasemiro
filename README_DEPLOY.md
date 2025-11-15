# 배포 가이드

## 중요: GitHub Pages 배포 구조

이 프로젝트는 **gh-pages 브랜치**에서 배포됩니다.
- `main` 브랜치: 개발 및 작업용
- `gh-pages` 브랜치: 실제 배포용 (https://omacasemiro.shop)

**반드시 두 브랜치를 모두 업데이트해야 변경사항이 라이브 사이트에 반영됩니다!**

## 자동 배포 (권장)

```bash
./deploy.sh
```

이 스크립트가 자동으로:
1. main 브랜치 푸시
2. gh-pages로 전환 및 병합
3. gh-pages 푸시
4. main 브랜치로 복귀

## 수동 배포

```bash
# 1. main 브랜치에서 작업 후 커밋
git add .
git commit -m "메시지"
git push origin main

# 2. gh-pages 브랜치로 병합
git checkout gh-pages
git merge main
git push origin gh-pages
git checkout main
```

## 배포 확인

```bash
./check-deployment.sh
```

또는

```bash
./monitor-deployment.sh
```

배포 상태: https://github.com/yoonjunsik/omacasemiro/actions

## 주의사항

- ⚠️ main 브랜치만 푸시하면 라이브 사이트에 반영되지 않습니다
- ⚠️ gh-pages 브랜치를 직접 수정하지 마세요 (항상 main에서 병합)
- ✅ 배포는 1-2분 소요됩니다
- ✅ CDN 캐시는 최대 10분 소요될 수 있습니다
