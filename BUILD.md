# Building My Pills Android APK

This guide explains how to build the My Pills Android APK for testing and distribution.

## Prerequisites

- Node.js 18+
- Java 17+
- Android SDK 33+
- React Native CLI

## Local Build

### Quick Build
```bash
# Install dependencies
npm install

# Generate app icons
npm run generate-icons

# Build APK
npm run build:android
```

### Manual Build
```bash
# Install dependencies
npm ci

# Generate icons
npm run generate-icons

# Clean previous builds
cd android
./gradlew clean
cd ..

# Build release APK
cd android
./gradlew assembleRelease
cd ..
```

The APK will be created at: `android/app/build/outputs/apk/release/app-release.apk`

## GitHub Actions Build

The project includes a GitHub Actions workflow that automatically builds APKs on:

- Push to `main` or `develop` branches
- Pull requests to `main`
- Manual trigger via GitHub Actions tab

### Download APK

1. Go to the **Actions** tab in your GitHub repository
2. Click on the latest successful workflow run
3. Scroll down to **Artifacts** section
4. Download the `app-release` artifact
5. Extract the APK file

### Automatic Release

When pushing to `main` branch, the workflow will:
1. Build the APK
2. Create a GitHub release
3. Attach the APK to the release
4. Make it available for download

## Installing the APK

1. Download the APK file
2. On your Android device, go to **Settings > Security**
3. Enable **"Install from unknown sources"** or **"Allow from this source"**
4. Open the APK file with a file manager
5. Follow the installation prompts

## Troubleshooting

### Build Fails
- Ensure all dependencies are installed: `npm ci`
- Clean the build: `npm run clean`
- Check Android SDK is properly configured
- Verify Java version is 17+

### APK Won't Install
- Check Android version compatibility (min SDK 21)
- Ensure "Unknown sources" is enabled
- Try uninstalling previous version first
- Check available storage space

### Icons Not Showing
- Run `npm run generate-icons` to regenerate icons
- In a real project, convert SVG files to PNG format
- Use Android Studio Image Asset Studio for proper icons

## Development

### Debug Build
```bash
npm run build:android-debug
```

### Run on Device
```bash
npm run android
```

### Start Metro
```bash
npm start
```

## Production Notes

For production releases:
1. Generate a proper keystore (not the debug one)
2. Update app version in `android/app/build.gradle`
3. Test thoroughly on multiple devices
4. Consider using App Bundle instead of APK
5. Upload to Google Play Store

## File Structure

```
android/app/build/outputs/apk/
├── debug/
│   └── app-debug.apk
└── release/
    └── app-release.apk
```

## Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Review the build output
3. Ensure all prerequisites are met
4. Create an issue in the repository