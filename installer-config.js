/**
 * OtterSport Desktop Installer Configuration
 * Electron Builder configuration for creating installers
 */

module.exports = {
  appId: "com.ottersport.app",
  productName: "TotalInstallerOtterSport",
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
    oneClick: true,
    allowToChangeInstallationDirectory: false,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: "TotalInstallerOtterSport",
    include: "installer-script.nsh",
    installerHeaderIcon: "game-assets/interface/logo.png"
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