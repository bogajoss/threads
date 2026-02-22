#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ANDROID_DIR="$ROOT_DIR/android"
APP_DIR="$ANDROID_DIR/app"
ANDROID_ASSETLINKS_PATH="$APP_DIR/src/main/assets/.well-known/assetlinks.json"
PUBLIC_ASSETLINKS_PATH="$ROOT_DIR/public/.well-known/assetlinks.json"
KEYSTORE_PROPS="$ANDROID_DIR/keystore.properties"
PACKAGE_NAME="com.mysys.app"

echo "======================================"
echo "Android App Links - SHA256 Generator"
echo "======================================"

if [[ ! -d "$APP_DIR" ]]; then
    echo "Error: android/app not found. Run from project root."
    exit 1
fi

extract_sha() {
    local keystore_path="$1"
    local alias_name="$2"
    local store_password="$3"
    local key_password="$4"

    keytool -list -v \
        -keystore "$keystore_path" \
        -alias "$alias_name" \
        -storepass "$store_password" \
        -keypass "$key_password" 2>/dev/null | awk '/SHA256:/{print $2; exit}'
}

DEBUG_KEYSTORE="$HOME/.android/debug.keystore"
if [[ ! -f "$DEBUG_KEYSTORE" ]]; then
    echo "Debug keystore not found. Generating by assembling debug once..."
    (cd "$ANDROID_DIR" && ./gradlew assembleDebug >/dev/null)
fi

DEBUG_SHA256="$(extract_sha "$DEBUG_KEYSTORE" "androiddebugkey" "android" "android" || true)"
if [[ -z "$DEBUG_SHA256" ]]; then
    echo "Failed to read debug SHA256 fingerprint."
    exit 1
fi

RELEASE_SHA256=""
if [[ -f "$KEYSTORE_PROPS" ]]; then
    source "$KEYSTORE_PROPS"
    RELEASE_KEYSTORE_PATH="$ANDROID_DIR/${storeFile}"
    if [[ -f "$RELEASE_KEYSTORE_PATH" ]]; then
        RELEASE_SHA256="$(extract_sha "$RELEASE_KEYSTORE_PATH" "$keyAlias" "$storePassword" "$keyPassword" || true)"
    fi
fi

mkdir -p "$(dirname "$ANDROID_ASSETLINKS_PATH")"
mkdir -p "$(dirname "$PUBLIC_ASSETLINKS_PATH")"

write_assetlinks() {
    local output_path="$1"

    if [[ -n "$RELEASE_SHA256" ]]; then
        cat > "$output_path" <<EOF
[{
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
        "namespace": "android_app",
        "package_name": "$PACKAGE_NAME",
        "sha256_cert_fingerprints": [
            "$DEBUG_SHA256",
            "$RELEASE_SHA256"
        ]
    }
}]
EOF
    else
        cat > "$output_path" <<EOF
[{
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
        "namespace": "android_app",
        "package_name": "$PACKAGE_NAME",
        "sha256_cert_fingerprints": [
            "$DEBUG_SHA256"
        ]
    }
}]
EOF
    fi
}

write_assetlinks "$ANDROID_ASSETLINKS_PATH"
write_assetlinks "$PUBLIC_ASSETLINKS_PATH"

echo ""
echo "Debug SHA256:   $DEBUG_SHA256"
if [[ -n "$RELEASE_SHA256" ]]; then
    echo "Release SHA256: $RELEASE_SHA256"
else
    echo "Release SHA256: Not found (configure android/keystore.properties first)"
fi
echo ""
echo "assetlinks.json updated:"
echo "- $ANDROID_ASSETLINKS_PATH"
echo "- $PUBLIC_ASSETLINKS_PATH"
echo ""
echo "Deploy from public path to server URL:"
echo "https://feed.systemadminbd.com/.well-known/assetlinks.json"
