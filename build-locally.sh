#!/bin/bash

echo "🚀 Building Android APK locally..."
echo "This script will build the APK on your local machine"
echo ""

# Check if we're in the right directory
if [ ! -f "android/build.gradle" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if Android SDK is available
if [ -z "$ANDROID_HOME" ]; then
    echo "❌ Error: ANDROID_HOME environment variable is not set"
    echo "Please set ANDROID_HOME to your Android SDK path"
    echo "Example: export ANDROID_HOME=/path/to/android-sdk"
    exit 1
fi

echo "✅ Android SDK found at: $ANDROID_HOME"

# Check if Java is available
if ! command -v java &> /dev/null; then
    echo "❌ Error: Java is not installed or not in PATH"
    exit 1
fi

echo "✅ Java found: $(java -version 2>&1 | head -1)"

# Navigate to android directory
cd android

# Make gradlew executable
chmod +x gradlew

echo "🔧 Building APK..."

# Clean and build
./gradlew clean
./gradlew assembleRelease

# Check if APK was created
APK_PATH="app/build/outputs/apk/release/app-release.apk"
if [ -f "$APK_PATH" ]; then
    echo ""
    echo "🎉 SUCCESS! APK built successfully!"
    echo "📱 APK location: $APK_PATH"
    echo "📏 APK size: $(du -h "$APK_PATH" | cut -f1)"
    echo ""
    echo "You can now:"
    echo "1. Install the APK on your Android device"
    echo "2. Upload it to GitHub Releases"
    echo "3. Share it with others"
    echo ""
    echo "APK file: $(pwd)/$APK_PATH"
else
    echo ""
    echo "❌ Build failed - APK not found"
    echo "Check the build output above for errors"
    exit 1
fi