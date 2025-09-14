#!/bin/bash

# Test script to verify the build process
set -e

echo "🧪 Testing My Pills build process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Test 1: Check dependencies
echo "📋 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Test 2: Check Android setup
echo "🤖 Checking Android setup..."
if [ ! -d "android" ]; then
    echo "❌ Error: Android directory not found"
    exit 1
fi

if [ ! -f "android/gradlew" ]; then
    echo "❌ Error: Gradle wrapper not found"
    exit 1
fi

# Test 3: Generate icons
echo "🎨 Testing icon generation..."
npm run generate-icons

# Test 4: Check if icons were created
ICON_DIRS=("ldpi" "mdpi" "hdpi" "xhdpi" "xxhdpi" "xxxhdpi")
for dir in "${ICON_DIRS[@]}"; do
    ICON_PATH="android/app/src/main/res/mipmap-${dir}/ic_launcher.svg"
    if [ -f "$ICON_PATH" ]; then
        echo "✅ Icon created for ${dir}"
    else
        echo "❌ Icon missing for ${dir}"
    fi
done

# Test 5: Check Gradle configuration
echo "⚙️ Checking Gradle configuration..."
if grep -q "MYAPP_UPLOAD_STORE_FILE" android/gradle.properties; then
    echo "✅ Keystore configuration found"
else
    echo "⚠️  Keystore configuration not found (will be created during build)"
fi

# Test 6: Test Gradle clean
echo "🧹 Testing Gradle clean..."
cd android
./gradlew clean
cd ..

echo "✅ Gradle clean successful"

# Test 7: Check if we can build (debug only for testing)
echo "🔨 Testing debug build..."
cd android
./gradlew assembleDebug
cd ..

# Check if debug APK was created
DEBUG_APK="android/app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$DEBUG_APK" ]; then
    echo "✅ Debug APK built successfully!"
    echo "📱 Debug APK location: $DEBUG_APK"
    echo "📏 Debug APK size: $(du -h "$DEBUG_APK" | cut -f1)"
else
    echo "❌ Debug APK build failed!"
    exit 1
fi

echo ""
echo "🎉 All tests passed! The build process is working correctly."
echo "📝 You can now:"
echo "   - Run 'npm run build:android' to build release APK"
echo "   - Push to GitHub to trigger automatic build"
echo "   - Download APK from GitHub Actions artifacts"