# Deep Link Setup Guide

## Overview
This guide explains how to set up deep linking for your Android app so that links like `https://feed.systemadminbd.com/p/123` open directly in your app.

## What's Already Configured ✅

### 1. Capacitor Config (`capacitor.config.ts`)
- App ID: `com.mysys.app`
- Server URL: `https://feed.systemadminbd.com`
- Custom URL scheme: `mysys://`
- Android App Links enabled

### 2. Android Manifest (`android/app/src/main/AndroidManifest.xml`)
Intent filters added for:
- Custom scheme: `mysys://`
- HTTPS links: `https://feed.systemadminbd.com/*`
- Specific paths: `/p/`, `/r/`, `/profile/`, `/m/`, `/c/`

### 3. React App (`src/hooks/useDeepLinks.ts`)
- Hook to handle deep links
- Automatically navigates to correct pages

### 4. Clipboard Support
- Works on both Web and Android
- Base URL: `https://feed.systemadminbd.com`

## Required Steps 🔧

### Step 1: Configure release signing (one-time)

Release signing now uses:
- Keystore file: `android/app/release-key.jks`
- Config file: `android/keystore.properties`

If `android/keystore.properties` exists, `assembleRelease` will produce a properly signed release APK.

### Step 2: Get SHA256 Fingerprints

Use the helper script (recommended):

```bash
chmod +x get_sha256.sh
./get_sha256.sh
```

This script will:
- Read debug SHA256 from `~/.android/debug.keystore`
- Read release SHA256 from `android/keystore.properties` + configured keystore
- Update `android/app/src/main/assets/.well-known/assetlinks.json`

Manual commands if needed:

**For Debug Build:**
```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

**For Production Build:**
```bash
keytool -list -v -keystore android/app/release-key.jks -alias mysys_release
```

### Step 3: Create/Update assetlinks.json

Update the file at: `android/app/src/main/assets/.well-known/assetlinks.json`

Replace `YOUR_DEBUG_SHA256_HERE` and `YOUR_PRODUCTION_SHA256_HERE` with actual fingerprints.

Example:
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.mysys.app",
    "sha256_cert_fingerprints": [
      "14:6D:10:20:DE:F1:29:11:11:11:11:11:11:11:11:11:11:11:11:11:11:11:11:11:11:11:11:11:11:11:11:11",
      "AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78"
    ]
  }
}]
```

### Step 4: Host assetlinks.json on Your Server

**IMPORTANT:** You must host the assetlinks.json file on your web server.

Upload the file to: `https://feed.systemadminbd.com/.well-known/assetlinks.json`

The file must be accessible at exactly this URL.

You can verify it works by visiting:
```
https://feed.systemadminbd.com/.well-known/assetlinks.json
```

### Step 5: Build and Sign Your APK

**Debug APK:**
```bash
pnpm build
npx cap sync android
cd android
./gradlew assembleDebug
```
Output: `android/app/build/outputs/apk/debug/app-debug.apk`

**Release APK (Production):**
```bash
pnpm apk
cd android
./gradlew assembleRelease
```
Output: `android/app/build/outputs/apk/release/app-release.apk`

Verify signing:
```bash
keytool -printcert -jarfile android/app/build/outputs/apk/release/app-release.apk | grep SHA256
```

### Step 6: Verify App Links

After installing the app on your device:

1. **Check if links are verified:**
   - Go to Android Settings → Apps → MySys → Open by default
   - Should show "Supported links: feed.systemadminbd.com"
   - Toggle should be ON for "Open supported links"

2. **Test deep links:**
   - Send a link like `https://feed.systemadminbd.com/p/123` to your phone
   - Click the link from WhatsApp, Chrome, etc.
   - It should open directly in your app

3. **Test custom scheme:**
   - Try opening: `mysys://p/123`
   - Should also open in your app

## Troubleshooting 🔍

### Links opening in browser instead of app

1. **Check assetlinks.json is hosted correctly:**
   ```bash
   curl https://feed.systemadminbd.com/.well-known/assetlinks.json
   ```

2. **Verify SHA256 fingerprints match:**
   - The fingerprints in assetlinks.json must match your app's signing certificate
   - For Play Store apps, use the **App Signing** certificate from Play Console

3. **Re-verify app links on device:**
   ```bash
   adb shell pm verify-app-links --re-verify com.mysys.app
   ```

4. **Check AndroidManifest.xml:**
   - Make sure `android:autoVerify="true"` is present
   - Make sure intent filters are inside the MainActivity

### App crashes on deep link

1. Check logcat for errors:
   ```bash
   adb logcat | grep -i "capacitor\|deep\|link"
   ```

2. Make sure the route exists in your React app

### Links work from outside but not from inside app

This is handled by the `launchMode="singleTask"` in AndroidManifest.xml. Links clicked inside the app will open in the same app instance.

## Testing Deep Links

### From ADB (Command Line)
```bash
# Test HTTPS link
adb shell am start -W -a android.intent.action.VIEW \
  -d "https://feed.systemadminbd.com/p/123" com.mysys.app

# Test custom scheme
adb shell am start -W -a android.intent.action.VIEW \
  -d "mysys://p/123" com.mysys.app
```

### From Browser
1. Open Chrome on your Android device
2. Navigate to: `https://feed.systemadminbd.com/p/123`
3. Tap the link
4. Should open in app

## Summary

| Feature | Status |
|---------|--------|
| Copy Link (Web) | ✅ Works |
| Copy Link (Android) | ✅ Works |
| Deep Links (HTTPS) | ✅ Configured |
| Deep Links (Custom Scheme) | ✅ Configured |
| App Links Verification | ⚠️ Requires assetlinks.json on server |

## Next Steps

1. Run `./get_sha256.sh` and upload generated assetlinks.json to server
2. Build signed release with `./gradlew assembleRelease`
3. Install APK and test app links on device
4. Keep `android/keystore.properties` and `android/app/release-key.jks` backed up securely
