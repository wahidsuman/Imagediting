# My Pills - Family Medication Tracker

A comprehensive Android app for managing medications with individual and family plan features.

## Features

### Free Tier (Individual)
- ✅ Add and manage personal medications
- ✅ Take photos of pills for easy identification
- ✅ Smart push notifications with pill images
- ✅ Medication history tracking
- ✅ One-time setup, works reliably
- ✅ Elderly-friendly large UI design

### Premium Tier (Family Plan)
- 🏆 All free features
- 👨‍👩‍👧‍👦 Add up to 5 family members
- 👀 View family medication status
- 📱 Remote pill management with permissions
- ☁️ Cloud sync across devices
- 📊 Advanced analytics and reports
- 🔔 Customizable notifications
- 💾 Data backup and restore
- 🆘 Priority support

## Technical Features

- **Reliable Notifications**: Uses Android WorkManager for guaranteed delivery
- **Offline-First**: Works without internet, syncs when available
- **Image Recognition**: Custom pill photos for easy identification
- **Family Sharing**: Real-time sync across family devices
- **Permission System**: Secure remote management with user consent
- **Data Security**: Local SQLite with cloud backup
- **Accessibility**: Large fonts, high contrast, voice support

## Installation

### Prerequisites
- Node.js 16+
- React Native CLI
- Android Studio
- Android SDK 21+

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. For Android:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx react-native run-android
   ```

### Permissions
The app requires the following permissions:
- Camera (for pill photos)
- Storage (for saving images)
- Notifications (for reminders)
- Internet (for cloud sync)

## Project Structure

```
src/
├── screens/           # App screens
├── services/          # Business logic
├── navigation/        # Navigation setup
└── components/        # Reusable components

android/               # Android-specific code
├── app/
│   ├── src/main/
│   │   ├── java/     # Java/Kotlin code
│   │   ├── res/      # Resources
│   │   └── AndroidManifest.xml
│   └── build.gradle
└── build.gradle
```

## Key Services

- **DatabaseService**: SQLite operations and data management
- **NotificationService**: Push notifications and scheduling
- **AuthService**: User authentication and family management

## Database Schema

- **pills**: Medication data with images and scheduling
- **users**: User accounts and family admin status
- **family_members**: Family member relationships
- **pill_history**: Medication taking history
- **subscriptions**: Premium subscription management

## Development

### Running the App
```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### Building for Production
```bash
# Android
cd android
./gradlew assembleRelease

# iOS
cd ios
xcodebuild -workspace PillReminderApp.xcworkspace -scheme PillReminderApp -configuration Release
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@mypills.app or visit our help center.

## Roadmap

- [ ] iOS version
- [ ] Web dashboard
- [ ] AI pill recognition
- [ ] Integration with pharmacies
- [ ] Health data export
- [ ] Multi-language support