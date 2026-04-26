#!/bin/bash

set -e

echo "🚀 Starting deployment..."

# === CONFIG ===
PROJECT_DIR="$HOME/data_fedora/Projects/kutub-syamilah/kutub-syamilah-fe"
BUILD_DIR="$PROJECT_DIR/out"
TARGET_DIR="/var/www/kutub"

# === DETECT NGINX USER ===
NGINX_USER=$(ps -eo user,comm | grep nginx | grep -v root | head -n1 | awk '{print $1}')

if [ -z "$NGINX_USER" ]; then
  echo "⚠️ Nginx user not found, fallback to www-data"
  NGINX_USER="www-data"
fi

echo "👤 Nginx user detected: $NGINX_USER"

# === BUILD NEXT.JS ===
echo "📦 Building Next.js..."
cd "$PROJECT_DIR"
npm install
npm run build

# kalau pakai next export
if [ -f "package.json" ]; then
  if grep -q "next export" package.json; then
    echo "📤 Running next export..."
    npx next export
  fi
fi

# === PREPARE TARGET DIR ===
echo "📁 Preparing target directory..."
sudo mkdir -p "$TARGET_DIR"

# === SYNC FILES ===
echo "🔄 Syncing files to /var/www..."
sudo rsync -av --delete "$BUILD_DIR"/ "$TARGET_DIR"/

# === PERMISSIONS ===
echo "🔐 Setting permissions..."
sudo chown -R $NGINX_USER:$NGINX_USER "$TARGET_DIR"
sudo chmod -R 755 "$TARGET_DIR"

# === SELINUX FIX (FEDORA) ===
if command -v getenforce &> /dev/null; then
  if [ "$(getenforce)" != "Disabled" ]; then
    echo "🛡️ Fixing SELinux context..."
    sudo chcon -R -t httpd_sys_content_t "$TARGET_DIR"
  fi
fi

# === RESTART NGINX ===
echo "🔁 Restarting Nginx..."
sudo nginx -t
sudo systemctl restart nginx

echo "✅ Deployment finished!"