#!/bin/bash

# Script to help set up GitHub repository and push code

echo "🚀 Setting up GitHub repository for My Pills app..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: My Pills Android app with GitHub Actions"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if remote exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "✅ Remote origin already configured"
    echo "📍 Remote URL: $(git remote get-url origin)"
else
    echo "⚠️  No remote origin configured"
    echo "📝 Please add your GitHub repository as origin:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
fi

# Show current status
echo ""
echo "📊 Current git status:"
git status --short

echo ""
echo "🎯 Next steps:"
echo "1. Create a new repository on GitHub (if you haven't already)"
echo "2. Add the remote origin:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
echo "3. Push the code:"
echo "   git add ."
echo "   git commit -m 'Add GitHub Actions workflows'"
echo "   git push -u origin main"
echo "4. Check the Actions tab in your GitHub repository"
echo "5. Download the APK from the Actions artifacts"

echo ""
echo "📁 Workflow files created:"
echo "   - .github/workflows/test.yml (simple test)"
echo "   - .github/workflows/android-build.yml (basic build)"
echo "   - .github/workflows/build-android.yml (full build with release)"

echo ""
echo "✅ Setup complete! Follow the steps above to push to GitHub."