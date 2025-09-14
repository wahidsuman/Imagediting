#!/bin/bash

# Build script for Android APK
set -e

echo "🚀 Building My Pills Android APK..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Generate icons
echo "🎨 Generating app icons..."
npm run generate-icons

# Clean previous builds
echo "🧹 Cleaning previous builds..."
cd android
./gradlew clean
cd ..

# Build release APK
echo "🔨 Building release APK..."
cd android
./gradlew assembleRelease
cd ..

# Check if APK was created
APK_PATH="android/app/build/outputs/apk/release/app-release.apk"
if [ -f "$APK_PATH" ]; then
    echo "✅ APK built successfully!"
    echo "📱 APK location: $APK_PATH"
    echo "📏 APK size: $(du -h "$APK_PATH" | cut -f1)"
else
    echo "❌ APK build failed!"
    exit 1
fi

echo "🎉 Build complete! You can now install the APK on your Android device."