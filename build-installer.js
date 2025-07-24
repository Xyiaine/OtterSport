#!/usr/bin/env node

/**
 * OtterSport Desktop Build Script
 * Builds the desktop application and creates installers
 */

const { build } = require('electron-builder');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🦦 Building OtterSport Desktop Application...\n');

async function buildDesktopApp() {
  try {
    // Step 1: Build the frontend
    console.log('📦 Building frontend...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Step 2: Verify required files exist
    console.log('🔍 Verifying build files...');
    const requiredFiles = [
      'client/dist',
      'server',
      'shared',
      'electron-main.js',
      'package.json'
    ];
    
    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`Required file/directory not found: ${file}`);
      }
    }
    
    // Step 3: Create installer configuration
    console.log('⚙️  Configuring installer...');
    const config = require('./installer-config.js');
    
    // Step 4: Build the desktop application
    console.log('🏗️  Building desktop application...');
    await build({
      config,
      win: ['nsis'],
      mac: ['dmg'],
      linux: ['AppImage', 'deb'],
      publish: 'never'
    });
    
    console.log('\n✅ Desktop application built successfully!');
    console.log('\n📁 Installer files created in: dist-installer/');
    
    // List created files
    const distDir = path.join(__dirname, 'dist-installer');
    if (fs.existsSync(distDir)) {
      const files = fs.readdirSync(distDir);
      console.log('\n📋 Created installers:');
      files.forEach(file => {
        const filePath = path.join(distDir, file);
        const stats = fs.statSync(filePath);
        const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`   • ${file} (${sizeInMB} MB)`);
      });
    }
    
    console.log('\n🎉 OtterSport Desktop is ready for distribution!');
    console.log('\n📖 Installation instructions:');
    console.log('   Windows: Run the .exe installer');
    console.log('   macOS: Open the .dmg file and drag to Applications');
    console.log('   Linux: Run the .AppImage or install the .deb package');
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
OtterSport Desktop Build Script

Usage:
  node build-installer.js [options]

Options:
  --help, -h     Show this help message
  --win-only     Build Windows installer only
  --mac-only     Build macOS installer only
  --linux-only   Build Linux installer only

Examples:
  node build-installer.js              # Build for all platforms
  node build-installer.js --win-only   # Build Windows installer only
`);
  process.exit(0);
}

// Platform-specific builds
if (args.includes('--win-only')) {
  build({ win: ['nsis'], publish: 'never' });
} else if (args.includes('--mac-only')) {
  build({ mac: ['dmg'], publish: 'never' });
} else if (args.includes('--linux-only')) {
  build({ linux: ['AppImage', 'deb'], publish: 'never' });
} else {
  buildDesktopApp();
}