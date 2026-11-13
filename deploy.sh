#!/bin/sh
# Siteyi derleyip GitHub Pages'e (gh-pages dalı) gönderir. Kullanım: npm run deploy
set -e
cd "$(dirname "$0")"
npm run build
REMOTE=$(git remote get-url origin)
cd dist
touch .nojekyll
rm -rf .git
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C .. config user.name)" -c user.email="$(git -C .. config user.email)" commit -q -m "Deploy $(date '+%Y-%m-%d %H:%M')"
git push -q -f "$REMOTE" gh-pages
rm -rf .git
echo "Yayınlandı."
