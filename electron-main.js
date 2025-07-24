/**
 * OtterSport Desktop Application
 * Main Electron process for creating native desktop app
 */

const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// Keep a global reference of the window object
let mainWindow;
let serverProcess;

/**
 * Create the main application window
 */
function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'game-assets/interface/logo.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    titleBarStyle: 'default',
    show: false // Don't show until ready
  });

  // Set application menu
  createMenu();

  // Start the backend server
  startServer();

  // Load the app after a short delay to ensure server is ready
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:5000');
    mainWindow.show();
  }, 3000);

  // Handle window closed
  mainWindow.on('closed', function () {
    mainWindow = null;
    stopServer();
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Handle window ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Focus on window
    if (process.platform === 'darwin') {
      app.dock.show();
    }
  });
}

/**
 * Start the Express server in a child process
 */
function startServer() {
  const serverScript = path.join(__dirname, 'server/index.ts');
  
  console.log('Starting OtterSport server...');
  
  serverProcess = spawn('node', ['-r', 'tsx/cjs', serverScript], {
    env: { 
      ...process.env, 
      NODE_ENV: 'production',
      PORT: '5000'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`Server: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`Server Error: ${data}`);
  });

  serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
}

/**
 * Stop the Express server
 */
function stopServer() {
  if (serverProcess) {
    console.log('Stopping OtterSport server...');
    serverProcess.kill();
    serverProcess = null;
  }
}

/**
 * Create application menu
 */
function createMenu() {
  const template = [
    {
      label: 'OtterSport',
      submenu: [
        {
          label: 'About OtterSport',
          click() {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About OtterSport',
              message: 'OtterSport v1.0.0',
              detail: 'A fitness card game application that helps you build consistent daily workout habits.\n\nBuilt with React, Node.js, and PostgreSQL.'
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Preferences...',
          accelerator: 'CmdOrCtrl+,',
          click() {
            // Open preferences - could navigate to settings page
            mainWindow.webContents.executeJavaScript('window.location.hash = "/settings"');
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click() {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Workout',
      submenu: [
        {
          label: 'Start Workout',
          accelerator: 'CmdOrCtrl+N',
          click() {
            mainWindow.webContents.executeJavaScript('window.location.hash = "/workout"');
          }
        },
        {
          label: 'View Decks',
          accelerator: 'CmdOrCtrl+D',
          click() {
            mainWindow.webContents.executeJavaScript('window.location.hash = "/decks"');
          }
        },
        {
          label: 'Card Battle Mode',
          accelerator: 'CmdOrCtrl+B',
          click() {
            mainWindow.webContents.executeJavaScript('window.location.hash = "/game-modes/battle"');
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Home',
          accelerator: 'CmdOrCtrl+H',
          click() {
            mainWindow.webContents.executeJavaScript('window.location.hash = "/home"');
          }
        },
        {
          label: 'Progress',
          accelerator: 'CmdOrCtrl+P',
          click() {
            mainWindow.webContents.executeJavaScript('window.location.hash = "/progress"');
          }
        },
        { type: 'separator' },
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click() {
            mainWindow.reload();
          }
        },
        {
          label: 'Force Reload',
          accelerator: 'CmdOrCtrl+Shift+R',
          click() {
            mainWindow.webContents.reloadIgnoringCache();
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
          click() {
            mainWindow.webContents.toggleDevTools();
          }
        }
      ]
    },
    {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          click() {
            mainWindow.minimize();
          }
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          click() {
            mainWindow.close();
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            shell.openExternal('https://github.com/ottersport/ottersport');
          }
        },
        {
          label: 'Report Issue',
          click() {
            shell.openExternal('https://github.com/ottersport/ottersport/issues');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  stopServer();
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On macOS, re-create window when dock icon is clicked
  if (mainWindow === null) {
    createWindow();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});

// Handle certificate errors
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  if (url.startsWith('http://localhost:')) {
    // Allow localhost for development
    event.preventDefault();
    callback(true);
  } else {
    callback(false);
  }
});