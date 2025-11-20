echo off
echo  : This command will install dragtextpp in subfolder .droptexpp of the current user's profile	 
pause : 
echo on
mkdir %USERPROFILE%\.droptextpp
copy LICENSE.txt %USERPROFILE%\.droptextpp
copy README.md %USERPROFILE%\.droptextpp
copy docs\cli_help.txt %USERPROFILE%\.droptextpp
copy js\droptextpp.js %USERPROFILE%\.droptextpp
copy "cmd\DROP TEXT pp.cmd" %USERPROFILE%\.droptextpp
copy "ico\droptextpp.ico" %USERPROFILE%\.droptextpp
start explorer.exe %USERPROFILE%\.droptextpp
pause The installation folder, %USERPROFILE%\.droptextpp is being opened. To dismiss this window
