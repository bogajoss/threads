#!/bin/bash

# Script to get SHA256 fingerprints for Android App Links
# Run this script to get the fingerprints needed for assetlinks.json

echo "======================================"
echo "Android App Links - SHA256 Generator"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -d "android/app" ]; then
    echo "Error: Please run this script from the project root directory"
    exit 1
fi

echo "Getting DEBUG keystore SHA256 fingerprint..."
echo ""

# Try to get debug keystore fingerprint
if [ -f "android/app/debug.keystore" ]; then
    DEBUG_SHA256=$(keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android 2>/dev/null | grep "SHA256:" | awk '{print $2}')
    if [ ! -z "$DEBUG_SHA256" ]; then
        echo "✓ Debug SHA256: $DEBUG_SHA256"
    else
        echo "✗ Could not get debug SHA256"
        DEBUG_SHA256="YOUR_DEBUG_SHA256_HERE"
    fi
else
    echo "✗ Debug keystore not found. Building the app first..."
    cd android && ./gradlew assembleDebug && cd ..
    DEBUG_SHA256=$(keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android 2>/dev/null | grep "SHA256:" | awk '{print $2}')
    if [ ! -z "$DEBUG_SHA256" ]; then
        echo "✓ Debug SHA256: $DEBUG_SHA256"
    else
        DEBUG_SHA256="YOUR_DEBUG_SHA256_HERE"
    fi
fi

echo ""
echo "======================================"
echo "For PRODUCTION builds:"
echo "======================================"
echo "You need to use your production keystore."
echo "Run:"
echo "keytool -list -v -keystore /path/to/your/production.keystore -alias your_alias -storepass your_password"
echo ""
echo "======================================"
echo "Updating assetlinks.json..."
echo "======================================"

# Create or update assetlinks.json
mkdir -p android/app/src/main/assets/.well-known

cat > android/app/src/main/assets/.well-known/assetlinks.json << EOF
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.mysys.app",
    "sha256_cert_fingerprints": [
      "$DEBUG_SHA256"
    ]
  }
}]
EOF

echo "✓ assetlinks.json updated with debug fingerprint"
echo ""
echo "File location: android/app/src/main/assets/.well-known/assetlinks.json"
echo ""
echo "======================================"
echo "IMPORTANT: You must also host this file on your server!"
echo "Upload to: https://feed.systemadminbd.com/.well-known/assetlinks.json"
echo "======================================"
echo ""
echo "Content to upload:"
echo "--------------------------------------"
cat android/app/src/main/assets/.well-known/assetlinks.json
echo ""
echo "--------------------------------------"
