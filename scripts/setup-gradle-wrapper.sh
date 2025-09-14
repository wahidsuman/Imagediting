#!/bin/bash

# Script to set up Gradle wrapper files

echo "🔧 Setting up Gradle wrapper..."

cd /workspace/android

# Make gradlew executable
chmod +x gradlew

# Download gradle-wrapper.jar
echo "📥 Downloading gradle-wrapper.jar..."
curl -L -o gradle/wrapper/gradle-wrapper.jar https://github.com/gradle/gradle/raw/v8.0.1/gradle/wrapper/gradle-wrapper.jar

if [ -f "gradle/wrapper/gradle-wrapper.jar" ]; then
    echo "✅ gradle-wrapper.jar downloaded successfully"
else
    echo "❌ Failed to download gradle-wrapper.jar"
    echo "📝 You can download it manually from:"
    echo "   https://github.com/gradle/gradle/raw/v8.0.1/gradle/wrapper/gradle-wrapper.jar"
    echo "   And place it in: android/gradle/wrapper/gradle-wrapper.jar"
fi

# Test gradlew
echo "🧪 Testing gradlew..."
if ./gradlew --version >/dev/null 2>&1; then
    echo "✅ Gradle wrapper is working!"
else
    echo "⚠️  Gradle wrapper test failed, but files are in place"
fi

echo "📁 Gradle wrapper files:"
ls -la gradle/wrapper/
ls -la gradlew*

echo "✅ Gradle wrapper setup complete!"