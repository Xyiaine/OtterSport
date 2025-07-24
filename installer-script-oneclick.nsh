
; TotalInstallerOtterSport Windows One-Click Installer
; NSIS Script for silent installation with health monitoring

!define APPNAME "TotalInstallerOtterSport"
!define APPVERSION "1.0.0"
!define APPGUID "{12345678-1234-1234-1234-123456789012}"

; One-click installation configuration
SilentInstall silent
AutoCloseWindow true
ShowInstDetails nevershow

; Health monitoring integration
Section "HealthMonitoring"
  ; Initialize health system during installation
  ExecWait '"$INSTDIR\smart-installer-health-system.cjs"'
SectionEnd

; Main installation section
Section "MainInstall"
  ; Silent installation with health monitoring
  SetOutPath "$INSTDIR"
  
  ; Install application files
  File /r "client\dist\*"
  File /r "server\*"
  File /r "shared\*"
  File "ultimate-total-health-system.cjs"
  File "smart-installer-health-system.cjs"
  
  ; Create shortcuts
  CreateShortCut "$DESKTOP\TotalInstallerOtterSport.lnk" "$INSTDIR\TotalInstallerOtterSport.exe"
  CreateShortCut "$SMPROGRAMS\TotalInstallerOtterSport.lnk" "$INSTDIR\TotalInstallerOtterSport.exe"
  
  ; Auto-launch application after installation
  ExecShell "open" "$INSTDIR\TotalInstallerOtterSport.exe"
SectionEnd
