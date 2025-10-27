#!/bin/bash
set -e

VERSION=$(node -p "require('./package.json').version")
TAG="v$VERSION"

echo "Creating release for version $VERSION..."

git checkout master
git pull origin master
git tag -a "$TAG" -m "Release version $VERSION"
git push origin "$TAG"

echo "✅ Tag $TAG pushed! Check GitHub Actions for automated publish."
echo "🔗 https://github.com/valehasadli/BlinkHub/actions"
