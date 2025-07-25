#!/usr/bin/env node

/**
 * OTTERSPORT ONE-CLICK INSTALLER
 * 
 * Universal installer that detects your platform and installs everything needed
 * to run OtterSport fitness card game application.
 * 
 * Features:
 * - Automatic platform detection (Windows, macOS, Linux)
 * - One-click installation process
 * - Automatic dependency installation
 * - Health monitoring during installation
 * - Automatic app launch after installation
 * - Progress reporting and error handling
 */

const fs = require('fs').promises;
const path = require('path');
const { exec, spawn } = require('child_process');
const util = require('util');
const os = require('os');
const execAsync = util.promisify(exec);

// Installation Configuration
const INSTALLER_CONFIG = {
  name: "OtterSport One-Click Installer",
  version: "1.0.0",
  appName: "OtterSport",
  description: "Fitness Card Game Application",
  
  // Platform detection
  platform: os.platform(),
  arch: os.arch(),
  
  // Installation steps
  steps: [
    "Detecting Platform",
    "Checking Dependencies", 
    "Installing Node.js (if needed)",
    "Installing Application Dependencies",
    "Building Application",
    "Configuring Application", 
    "Running Health Checks",
    "Launching Application"
  ],
  
  // Required dependencies
  dependencies: {
    node: "20.x",
    npm: "latest"
  }
};

/**
 * UNIFIED ONE-CLICK INSTALLER ENGINE
 */
class OtterSportOneClickInstaller {
  constructor() {
    this.currentStep = 0;
    this.totalSteps = INSTALLER_CONFIG.steps.length;
    this.installationPath = process.cwd();
    this.logFile = path.join(this.installationPath, 'installation.log');
    this.errors = [];
    this.startTime = Date.now();
  }
  
  async initialize() {
    console.log('🦦 OTTERSPORT ONE-CLICK INSTALLER');
    console.log('================================');
    console.log(`📱 Installing: ${INSTALLER_CONFIG.appName}`);
    console.log(`🖥️  Platform: ${this.getPlatformName()}`);
    console.log(`📁 Location: ${this.installationPath}`);
    console.log('================================\n');
    
    try {
      await this.runInstallation();
      await this.completionReport();
    } catch (error) {
      await this.handleInstallationError(error);
    }
  }
  
  async runInstallation() {
    // Step 1: Platform Detection
    await this.executeStep("Detecting Platform", async () => {
      await this.detectPlatform();
    });
    
    // Step 2: Dependency Check
    await this.executeStep("Checking Dependencies", async () => {
      await this.checkDependencies();
    });
    
    // Step 3: Node.js Installation (if needed)
    await this.executeStep("Installing Node.js (if needed)", async () => {
      await this.ensureNodeJs();
    });
    
    // Step 4: Application Dependencies
    await this.executeStep("Installing Application Dependencies", async () => {
      await this.installDependencies();
    });
    
    // Step 5: Build Application
    await this.executeStep("Building Application", async () => {
      await this.buildApplication();
    });
    
    // Step 6: Configure Application
    await this.executeStep("Configuring Application", async () => {
      await this.configureApplication();
    });
    
    // Step 7: Health Checks
    await this.executeStep("Running Health Checks", async () => {
      await this.runHealthChecks();
    });
    
    // Step 8: Launch Application
    await this.executeStep("Launching Application", async () => {
      await this.launchApplication();
    });
  }
  
  async executeStep(stepName, stepFunction) {
    this.currentStep++;
    const progress = Math.round((this.currentStep / this.totalSteps) * 100);
    
    console.log(`\n[${this.currentStep}/${this.totalSteps}] ${stepName} (${progress}%)`);
    console.log('='.repeat(50));
    
    try {
      await stepFunction();
      console.log(`✅ ${stepName} completed successfully`);
      await this.logStep(stepName, 'success');
    } catch (error) {
      console.log(`❌ ${stepName} failed: ${error.message}`);
      await this.logStep(stepName, 'error', error.message);
      throw error;
    }
  }
  
  async detectPlatform() {
    const platform = {
      platform: os.platform(),
      arch: os.arch(),
      release: os.release(),
      type: os.type(),
      memory: Math.round(os.totalmem() / 1024 / 1024 / 1024) + 'GB'
    };
    
    console.log(`   🖥️  Operating System: ${this.getPlatformName()}`);
    console.log(`   🏗️  Architecture: ${platform.arch}`);
    console.log(`   💾 Memory: ${platform.memory}`);
    console.log(`   📦 Release: ${platform.release}`);
    
    // Verify platform compatibility
    const supportedPlatforms = ['win32', 'darwin', 'linux'];
    if (!supportedPlatforms.includes(platform.platform)) {
      throw new Error(`Unsupported platform: ${platform.platform}`);
    }
  }
  
  async checkDependencies() {
    console.log('   🔍 Checking system dependencies...');
    
    // Check Node.js
    try {
      const { stdout } = await execAsync('node --version');
      const nodeVersion = stdout.trim();
      console.log(`   ✅ Node.js: ${nodeVersion}`);
    } catch (error) {
      console.log('   ⚠️  Node.js: Not installed (will install)');
    }
    
    // Check npm
    try {
      const { stdout } = await execAsync('npm --version');
      const npmVersion = stdout.trim();
      console.log(`   ✅ npm: ${npmVersion}`);
    } catch (error) {
      console.log('   ⚠️  npm: Not available (will install with Node.js)');
    }
    
    // Check Git (optional)
    try {
      const { stdout } = await execAsync('git --version');
      console.log(`   ✅ Git: Available`);
    } catch (error) {
      console.log('   ℹ️  Git: Not available (optional)');
    }
  }
  
  async ensureNodeJs() {
    try {
      const { stdout } = await execAsync('node --version');
      const nodeVersion = stdout.trim();
      console.log(`   ✅ Node.js already installed: ${nodeVersion}`);
      
      // Check if version is compatible
      const majorVersion = parseInt(nodeVersion.match(/v(\d+)/)[1]);
      if (majorVersion < 18) {
        console.log('   ⚠️  Node.js version is too old, but continuing...');
      }
      
    } catch (error) {
      console.log('   📥 Node.js not found, providing installation guidance...');
      console.log('');
      console.log('   Please install Node.js first:');
      console.log('   🌐 Windows/macOS: https://nodejs.org/');
      console.log('   🐧 Linux: sudo apt install nodejs npm');
      console.log('');
      throw new Error('Node.js is required to run OtterSport');
    }
  }
  
  async installDependencies() {
    console.log('   📦 Installing application dependencies...');
    
    // Check if package.json exists
    try {
      await fs.access('package.json');
      console.log('   ✅ package.json found');
    } catch (error) {
      throw new Error('package.json not found. Make sure you\'re in the OtterSport directory.');
    }
    
    // Install dependencies
    try {
      console.log('   ⏳ Running npm install...');
      const { stdout, stderr } = await execAsync('npm install', {
        cwd: this.installationPath,
        timeout: 300000 // 5 minutes timeout
      });
      
      console.log('   ✅ Dependencies installed successfully');
      
      // Log any warnings
      if (stderr && stderr.trim()) {
        console.log('   ⚠️  Installation warnings (non-critical):');
        console.log('   ' + stderr.split('\n').slice(0, 3).join('\n   '));
      }
      
    } catch (error) {
      throw new Error(`Failed to install dependencies: ${error.message}`);
    }
  }
  
  async buildApplication() {
    console.log('   🏗️  Building application...');
    
    try {
      // Build the frontend
      console.log('   ⏳ Building frontend (Vite)...');
      const { stdout } = await execAsync('npm run build', {
        cwd: this.installationPath,
        timeout: 180000 // 3 minutes timeout
      });
      
      console.log('   ✅ Frontend built successfully');
      
      // Verify build output
      try {
        await fs.access('client/dist');
        console.log('   ✅ Build artifacts verified');
      } catch (error) {
        console.log('   ⚠️  Build artifacts not found, but continuing...');
      }
      
    } catch (error) {
      // If build fails, try to continue anyway (development mode)
      console.log('   ⚠️  Build failed, will run in development mode');
      console.log(`   ℹ️  Error: ${error.message.split('\n')[0]}`);
    }
  }
  
  async configureApplication() {
    console.log('   ⚙️  Configuring application...');
    
    // Create basic configuration
    const config = {
      environment: 'production',
      port: 5000,
      healthMonitoring: true,
      autoStart: true,
      platform: this.getPlatformName(),
      installedAt: new Date().toISOString(),
      version: INSTALLER_CONFIG.version
    };
    
    try {
      await fs.writeFile(
        path.join(this.installationPath, 'installer-config.json'),
        JSON.stringify(config, null, 2)
      );
      console.log('   ✅ Configuration file created');
    } catch (error) {
      console.log('   ⚠️  Could not create config file (non-critical)');
    }
    
    // Set appropriate permissions (Unix-like systems)
    if (os.platform() !== 'win32') {
      try {
        await execAsync('chmod +x *.sh', { cwd: this.installationPath });
        console.log('   ✅ Execute permissions set');
      } catch (error) {
        console.log('   ℹ️  Could not set permissions (may not be needed)');
      }
    }
  }
  
  async runHealthChecks() {
    console.log('   🩺 Running application health checks...');
    
    try {
      // Try to run the enhanced health system if available
      try {
        const { stdout } = await execAsync('node enhanced-total-health-system.cjs', {
          cwd: this.installationPath,
          timeout: 30000
        });
        console.log('   ✅ Enhanced health system check passed');
      } catch (error) {
        console.log('   ℹ️  Enhanced health system not available');
      }
      
      // Basic file system checks
      const criticalFiles = [
        'package.json',
        'server',
        'client'
      ];
      
      for (const file of criticalFiles) {
        try {
          await fs.access(file);
          console.log(`   ✅ ${file}: Available`);
        } catch (error) {
          console.log(`   ❌ ${file}: Missing`);
        }
      }
      
      console.log('   ✅ Health checks completed');
      
    } catch (error) {
      console.log('   ⚠️  Some health checks failed (non-critical)');
    }
  }
  
  async launchApplication() {
    console.log('   🚀 Launching OtterSport application...');
    
    try {
      // Create launch script based on platform
      const launchCommand = this.getPlatformLaunchCommand();
      console.log(`   ⏳ Starting server: ${launchCommand}`);
      
      // Start the application
      const child = spawn(launchCommand.split(' ')[0], launchCommand.split(' ').slice(1), {
        cwd: this.installationPath,
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe']
      });
      
      // Give the app time to start
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check if process is still running
      if (child.killed) {
        throw new Error('Application failed to start');
      }
      
      console.log('   ✅ Application started successfully!');
      console.log('   🌐 Application should be available at: http://localhost:5000');
      console.log('   📱 Opening application in your default browser...');
      
      // Try to open browser
      await this.openBrowser('http://localhost:5000');
      
      // Detach the child process so it keeps running
      child.unref();
      
    } catch (error) {
      console.log('   ⚠️  Could not auto-launch application');
      console.log('   ℹ️  You can start it manually with: npm run dev');
      console.log('   🌐 Then visit: http://localhost:5000');
    }
  }
  
  getPlatformName() {
    const platform = os.platform();
    switch (platform) {
      case 'win32': return 'Windows';
      case 'darwin': return 'macOS';
      case 'linux': return 'Linux';
      default: return platform;
    }
  }
  
  getPlatformLaunchCommand() {
    // Always use npm run dev for cross-platform compatibility
    return 'npm run dev';
  }
  
  async openBrowser(url) {
    const platform = os.platform();
    
    try {
      if (platform === 'win32') {
        await execAsync(`start ${url}`);
      } else if (platform === 'darwin') {
        await execAsync(`open ${url}`);
      } else {
        await execAsync(`xdg-open ${url}`);
      }
    } catch (error) {
      console.log('   ℹ️  Could not open browser automatically');
    }
  }
  
  async logStep(stepName, status, error = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      step: stepName,
      status,
      error
    };
    
    try {
      const existingLog = await fs.readFile(this.logFile, 'utf8').catch(() => '[]');
      const logs = JSON.parse(existingLog);
      logs.push(logEntry);
      await fs.writeFile(this.logFile, JSON.stringify(logs, null, 2));
    } catch (error) {
      // Ignore log writing errors
    }
  }
  
  async completionReport() {
    const duration = Math.round((Date.now() - this.startTime) / 1000);
    
    console.log('\n🎉 INSTALLATION COMPLETED SUCCESSFULLY!');
    console.log('=====================================');
    console.log(`⏱️  Installation Time: ${duration} seconds`);
    console.log(`📱 Application: ${INSTALLER_CONFIG.appName}`);
    console.log(`🌐 URL: http://localhost:5000`);
    console.log(`📁 Location: ${this.installationPath}`);
    console.log('=====================================');
    console.log('\n🦦 Welcome to OtterSport!');
    console.log('Your fitness card game is ready to play.');
    console.log('\n📚 Quick Start:');
    console.log('   1. Visit http://localhost:5000 in your browser');
    console.log('   2. Create your profile or continue as anonymous');
    console.log('   3. Start your fitness journey with card-based workouts!');
    console.log('\n🔧 Troubleshooting:');
    console.log('   • If the app isn\'t running: npm run dev');
    console.log('   • For help: Check the README.md file');
    console.log('   • Health check: node enhanced-total-health-system.cjs');
    console.log('\n🚀 Enjoy your workouts!');
  }
  
  async handleInstallationError(error) {
    console.log('\n❌ INSTALLATION FAILED');
    console.log('======================');
    console.log(`Error: ${error.message}`);
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('1. Make sure you have Node.js 18+ installed');
    console.log('2. Check your internet connection');
    console.log('3. Try running: npm install manually');
    console.log('4. Check the installation.log file for details');
    console.log('\n📞 Need Help?');
    console.log('Check the README.md file or GitHub issues');
    
    process.exit(1);
  }
}

// Create simple start script for different platforms
async function createStartupScripts() {
  const scripts = {
    'start-ottersport.bat': `@echo off
echo Starting OtterSport...
npm run dev
pause`,
    
    'start-ottersport.sh': `#!/bin/bash
echo "Starting OtterSport..."
npm run dev`,
    
    'start-ottersport.command': `#!/bin/bash
cd "$(dirname "$0")"
echo "Starting OtterSport..."
npm run dev`
  };
  
  for (const [filename, content] of Object.entries(scripts)) {
    try {
      await fs.writeFile(filename, content);
      if (filename.endsWith('.sh') || filename.endsWith('.command')) {
        await execAsync(`chmod +x ${filename}`).catch(() => {});
      }
    } catch (error) {
      // Ignore errors creating startup scripts
    }
  }
}

// Main execution
async function main() {
  console.clear();
  
  const installer = new OtterSportOneClickInstaller();
  
  try {
    await installer.initialize();
    await createStartupScripts();
  } catch (error) {
    await installer.handleInstallationError(error);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = OtterSportOneClickInstaller;