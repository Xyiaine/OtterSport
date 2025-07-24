/**
 * OtterSport Desktop Installer Configuration
 * Electron Builder configuration for creating installers
 */

module.exports = {
  appId: "com.ottersport.app",
  productName: "OtterSport",
  directories: {
    output: "dist-installer"
  },
  files: [
    "client/dist/**/*",
    "server/**/*",
    "shared/**/*",
    "game-assets/**/*",
    "electron-main.js",
    "package.json",
    "node_modules/**/*",
    "!node_modules/**/test/**/*",
    "!node_modules/**/*.d.ts",
    "!node_modules/**/.bin/**/*"
  ],
  extraResources: [
    {
      from: "game-assets",
      to: "game-assets"
    }
  ],
  win: {
    target: [
      {
        target: "nsis",
        arch: ["x64", "ia32"]
      }
    ],
    icon: "game-assets/interface/logo.png",
    publisherName: "OtterSport Team",
    verifyUpdateCodeSignature: false
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: "OtterSport",
    include: "installer-script.nsh"
  },
  mac: {
    target: [
      {
        target: "dmg",
        arch: ["x64", "arm64"]
      }
    ],
    icon: "game-assets/interface/logo.png",
    category: "public.app-category.healthcare-fitness"
  },
  linux: {
    target: [
      {
        target: "AppImage",
        arch: ["x64"]
      },
      {
        target: "deb",
        arch: ["x64"]
      }
    ],
    icon: "game-assets/interface/logo.png",
    category: "Game;Sports"
  },
  publish: null // Don't auto-publish
};