#!/bin/bash

export PORT=3300
export NEXT_PUBLIC_KUTUB_API=https://kutub.litensweet.id/api
export NEXT_PUBLIC_SITE_URL=https://kutub.litensweet.id

echo "Installing dependencies..."
npm install

echo "Cleaning previous build..."
rm -rf .next

echo "Building Next.js..."
npm run build

echo "Starting Next.js..."
npm start -- -p 3300