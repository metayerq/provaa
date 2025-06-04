
# Provaa Mobile App Setup Guide

This guide will help you set up the Provaa mobile app using Capacitor.

## Prerequisites

- Node.js installed
- For iOS: macOS with Xcode installed
- For Android: Android Studio installed

## Setup Steps

### 1. Transfer to GitHub and Clone
1. Click "Export to GitHub" button in Lovable
2. Clone the repository to your local machine:
   ```bash
   git clone <your-github-repo-url>
   cd <your-project-directory>
   ```

### 2. Install Dependencies
```bash
npm install
```

### 3. Initialize Capacitor (if not already done)
```bash
npx cap init
```

### 4. Add Mobile Platforms
```bash
# For iOS
npx cap add ios

# For Android  
npx cap add android
```

### 5. Build the Web App
```bash
npm run build
```

### 6. Sync Capacitor
```bash
npx cap sync
```

### 7. Update Platform Dependencies
```bash
# For iOS
npx cap update ios

# For Android
npx cap update android
```

### 8. Run on Device/Emulator
```bash
# For Android
npx cap run android

# For iOS (requires macOS)
npx cap run ios
```

## Development Workflow

For development with hot reload:
1. The capacitor.config.ts is already configured to point to the Lovable preview URL
2. This allows you to see changes in real-time on your mobile device
3. When ready for production, build locally and sync

## Key Features

- ✅ Mobile-optimized UI with safe area handling
- ✅ Touch-friendly interactions with proper tap targets
- ✅ Native app feel with proper animations
- ✅ Enhanced booking experience for mobile
- ✅ Responsive design that works across all screen sizes

## Troubleshooting

- **iOS build issues**: Ensure Xcode is up to date
- **Android build issues**: Check Android Studio SDK installation
- **Hot reload not working**: Verify the server URL in capacitor.config.ts

## Next Steps

1. Test the app on physical devices
2. Configure app icons and splash screens
3. Set up push notifications (if needed)
4. Prepare for app store deployment
