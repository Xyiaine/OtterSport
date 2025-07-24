#!/bin/bash

echo "========================================"
echo " OtterSport Desktop Installer Builder"
echo "========================================"
echo

echo "Step 1: Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Frontend build failed!"
    exit 1
fi

echo
echo "Step 2: Creating desktop application..."
node build-installer.js
if [ $? -ne 0 ]; then
    echo "ERROR: Desktop build failed!"
    exit 1
fi

echo
echo "========================================"
echo " SUCCESS! Installer created successfully"
echo "========================================"
echo
echo "The installers can be found in: dist-installer/"
echo
echo "Available files:"
ls -la dist-installer/ 2>/dev/null || echo "No installer files found"
echo
echo "You can now distribute these files to users"
echo "who want to install OtterSport on their computers."