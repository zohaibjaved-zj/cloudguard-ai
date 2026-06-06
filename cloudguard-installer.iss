[Setup]
AppName=CloudGuard AI
AppVersion=1.0.0
AppPublisher=CloudGuard AI Team
AppPublisherURL=https://github.com/your-username/cloudguard-ai
DefaultDirName={autopf}\CloudGuard AI
DefaultGroupName=CloudGuard AI
OutputDir=dist
OutputBaseFilename=CloudGuard_AI_Setup
SetupIconFile=icon.ico
Compression=lzma
SolidCompression=yes
WizardStyle=modern
LicenseFile=LICENSE
InfoBeforeFile=README.md

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Additional icons:"

[Files]
Source: "docker-compose.yml";        DestDir: "{app}";         Flags: ignoreversion
Source: "cloudguard-launcher.bat";   DestDir: "{app}";         Flags: ignoreversion
Source: "cloudguard-stop.bat";       DestDir: "{app}";         Flags: ignoreversion
Source: "backend\*";                 DestDir: "{app}\backend";  Flags: ignoreversion recursesubdirs
Source: "frontend\*";                DestDir: "{app}\frontend"; Flags: ignoreversion recursesubdirs
Source: "ml-service\*";              DestDir: "{app}\ml-service"; Flags: ignoreversion recursesubdirs
Source: "README.md";                 DestDir: "{app}";          Flags: ignoreversion

[Icons]
Name: "{group}\CloudGuard AI";            Filename: "{app}\cloudguard-launcher.bat"; IconFilename: "{app}\icon.ico"
Name: "{group}\Stop CloudGuard AI";       Filename: "{app}\cloudguard-stop.bat"
Name: "{group}\Uninstall CloudGuard AI";  Filename: "{uninstallexe}"
Name: "{autodesktop}\CloudGuard AI";      Filename: "{app}\cloudguard-launcher.bat"; IconFilename: "{app}\icon.ico"; Tasks: desktopicon

[Run]
Filename: "{app}\cloudguard-launcher.bat"; Description: "Launch CloudGuard AI now"; Flags: nowait postinstall skipifsilent

[Messages]
WelcomeLabel1=Welcome to CloudGuard AI Setup
WelcomeLabel2=This will install CloudGuard AI on your computer.%n%nCloudGuard AI requires Docker Desktop to be installed and running.%n%nClick Next to continue.
FinishedLabel=CloudGuard AI has been installed successfully.%n%nYou can launch it from the desktop shortcut or Start Menu.