#!/bin/bash
SOURCE="/workspaces/codespaces-blank/threads/public/logo.png"
RES_DIR="/workspaces/codespaces-blank/threads/android/app/src/main/res"

# Function to resize and copy
resize_icon() {
  local size=$1
  local dest_dir=$2
  local name=$3
  mkdir -p "$RES_DIR/$dest_dir"
  convert "$SOURCE" -resize ${size}x${size} "$RES_DIR/$dest_dir/$name"
}

resize_splash() {
  local w=$1
  local h=$2
  local dest_dir=$3
  local name=$4
  mkdir -p "$RES_DIR/$dest_dir"
  convert "$SOURCE" -resize ${w}x${h} -background white -gravity center -extent ${w}x${h} "$RES_DIR/$dest_dir/$name"
}

echo "Generating Icons..."
# Standard Icons
resize_icon 48 "mipmap-mdpi" "ic_launcher.png"
resize_icon 72 "mipmap-hdpi" "ic_launcher.png"
resize_icon 96 "mipmap-xhdpi" "ic_launcher.png"
resize_icon 144 "mipmap-xxhdpi" "ic_launcher.png"
resize_icon 192 "mipmap-xxxhdpi" "ic_launcher.png"

# Round Icons
resize_icon 48 "mipmap-mdpi" "ic_launcher_round.png"
resize_icon 72 "mipmap-hdpi" "ic_launcher_round.png"
resize_icon 96 "mipmap-xhdpi" "ic_launcher_round.png"
resize_icon 144 "mipmap-xxhdpi" "ic_launcher_round.png"
resize_icon 192 "mipmap-xxxhdpi" "ic_launcher_round.png"

# Foreground Icons (Adaptive)
resize_icon 108 "mipmap-mdpi" "ic_launcher_foreground.png"
resize_icon 162 "mipmap-hdpi" "ic_launcher_foreground.png"
resize_icon 216 "mipmap-xhdpi" "ic_launcher_foreground.png"
resize_icon 324 "mipmap-xxhdpi" "ic_launcher_foreground.png"
resize_icon 432 "mipmap-xxxhdpi" "ic_launcher_foreground.png"

echo "Generating Splash Screens..."
# Portrait
resize_splash 320 480 "drawable-port-mdpi" "splash.png"
resize_splash 480 800 "drawable-port-hdpi" "splash.png"
resize_splash 720 1280 "drawable-port-xhdpi" "splash.png"
resize_splash 960 1600 "drawable-port-xxhdpi" "splash.png"
resize_splash 1280 1920 "drawable-port-xxxhdpi" "splash.png"

# Landscape
resize_splash 480 320 "drawable-land-mdpi" "splash.png"
resize_splash 800 480 "drawable-land-hdpi" "splash.png"
resize_splash 1280 720 "drawable-land-xhdpi" "splash.png"
resize_splash 1600 960 "drawable-land-xxhdpi" "splash.png"
resize_splash 1920 1280 "drawable-land-xxxhdpi" "splash.png"

# Generic Splash (fallback)
mkdir -p "$RES_DIR/drawable"
convert "$SOURCE" -resize 480x800 -background white -gravity center -extent 480x800 "$RES_DIR/drawable/splash.png"

echo "Done."
