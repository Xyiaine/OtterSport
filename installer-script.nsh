# OtterSport NSIS Installer Script
# Custom installer script for Windows

!macro customInit
  # Check if Node.js is installed
  ExecWait '"node" --version' $0
  ${If} $0 != 0
    MessageBox MB_YESNO "Node.js is required to run OtterSport but was not found on your system.$\n$\nWould you like to download and install Node.js now?" IDYES install_nodejs IDNO skip_nodejs
    
    install_nodejs:
      ExecShell "open" "https://nodejs.org/en/download/"
      MessageBox MB_OK "Please install Node.js and then run the OtterSport installer again."
      Abort
    
    skip_nodejs:
      MessageBox MB_OK "OtterSport may not work properly without Node.js. You can install it later from nodejs.org"
  ${EndIf}
!macroend

!macro customInstall
  # Create data directory
  CreateDirectory "$APPDATA\OtterSport"
  
  # Set permissions for data directory
  AccessControl::GrantOnFile "$APPDATA\OtterSport" "(S-1-5-32-545)" "FullAccess"
  
  # Create desktop shortcut with custom icon
  CreateShortCut "$DESKTOP\OtterSport.lnk" "$INSTDIR\OtterSport.exe" "" "$INSTDIR\resources\game-assets\interface\logo.png"
  
  # Register file associations (optional)
  WriteRegStr HKCR ".otter" "" "OtterSport.Workout"
  WriteRegStr HKCR "OtterSport.Workout" "" "OtterSport Workout File"
  WriteRegStr HKCR "OtterSport.Workout\DefaultIcon" "" "$INSTDIR\resources\game-assets\interface\logo.png"
  WriteRegStr HKCR "OtterSport.Workout\shell\open\command" "" '"$INSTDIR\OtterSport.exe" "%1"'
!macroend

!macro customUnInstall
  # Clean up data directory (ask user first)
  MessageBox MB_YESNO "Do you want to remove your workout data and progress? This cannot be undone." IDYES remove_data IDNO keep_data
  
  remove_data:
    RMDir /r "$APPDATA\OtterSport"
    goto cleanup_registry
  
  keep_data:
    MessageBox MB_OK "Your workout data has been preserved in $APPDATA\OtterSport"
  
  cleanup_registry:
    # Remove file associations
    DeleteRegKey HKCR ".otter"
    DeleteRegKey HKCR "OtterSport.Workout"
    
    # Remove desktop shortcut
    Delete "$DESKTOP\OtterSport.lnk"
!macroend