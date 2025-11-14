echo off
echo  : This command will install dragtextpp in the current user's profile as the subfolder .droptexpp 
pause : 
echo on
mkdir %USERPROFILE%\.droptextpp
copy "CMD\DROP TEXT pp.cmd" %USERPROFILE%\.droptextpp
copy DOCS\README.md %USERPROFILE%\.droptextpp
copy DOCS\cli_help.txt %USERPROFILE%\.droptextpp
copy JS\droptextpp.js %USERPROFILE%\.droptextpp

start explorer.exe %USERPROFILE%\.droptextpp

pause The installation folder, %USERPROFILE%\.droptextpp is being opened. To dismiss this window
