const fs = require("fs")
const path = require("path");
const cwd = process.cwd();

// create install folder for single user (dot file in home directory)

const installFolder = path.resolve(process.env.HOME, ".droptextpp");
try {
    fs.mkdirSync(installFolder);
}
catch( err) {
    if( err.code != "EEXIST") {
        console.error( `An error occured trying to create directory ${installFolder}`, err);
        exit(1);
    }
}      

// copy static files to install folder

function winCopy(src, dir) {
    const filename = path.basename(src);
    const dest = path.join( dir, filename);
    src = path.resolve(cwd, src);

    try {
        fs.copyFileSync( src, dest);
    }
    catch(err) {
        console.error( `Error copying ${src} to ${dest}`, err);
        process.exit(1);
    }
// console.log("copyFile src: '%s', dir: '%s', dest: '%s'", src, dir, dest);
}
winCopy( "./LICENSE.txt", installFolder);
winCopy( "./README.md", installFolder);
winCopy( "./docs/gnu_cli_help.txt", installFolder);
winCopy( "./version.txt", installFolder);
winCopy( "./js/droptextpp.js", installFolder);
winCopy( "./ico/droptextpp.png", installFolder);
	
// find gnome-terminal

function findTerminal( terminalName = "gnome-terminal") {
    const envPaths = process.env.PATH.split (':');

    for(let dirName of envPaths) {
        let dir;
        try {
            dir = fs.opendirSync(dirName);
        }
        catch(err) {
            continue;
        }
        let dirent;
        while (dirent = dir.readSync()) {
            if( dirent.name == terminalName) {
                const fullPath = path.resolve(dirName, terminalName);
                try {
                    fs.accessSync( fullPath, fs.constants.X_OK);
                }
                catch(err) {
                    continue;
                }
                return fullPath;
            }	
        }    
    } 
    return null; 
}
const terminal = findTerminal();	
if( !terminal) {
    throw new Error("gnome-terminal not found in list of directories specified by environment PATH value")
}
					
// create desktop launcher

const nodePath = process.argv[0];
const scriptPath = path.resolve(installFolder, "./droptextpp.js");
const execString = `${terminal} --profile=keepopen -- ${nodePath} ${scriptPath} ""%U"" ; echo Press Enter to close terminal; read line`;
const launcherPath = path.resolve(installFolder, "./Drop Text Preprocessor (TPP).desktop");
const launcher =
`[Desktop Entry]
Name="Drop Text Preprocessor (TPP)"
Comment="launcher for droptextpp with dropped file as argument"
Exec=${execString}
Icon=${path.resolve(installFolder, "./droptextpp.png")}
Terminal=false
Type=Application
Name[en_AU]=Drop Text Preprocessor (TPP).desktop
`; 
//console.log(launcher)

try {
    fs.writeFileSync( launcherPath, launcher);
}
catch( err) {
    console.error("An error occured writing desktop launcher", err);
    process.exit(1);
}
try {
    fs.chmodSync( launcherPath, "744");
}
catch( err) {
    console.error("An error occured setting desktop launcher permissions", err);
    process.exit(1);
}

// open file directory and exit

console.log("droptextpp successfully installed in home subdirectory '.droptextpp'");
var exec = require('child_process').exec;
exec(`xdg-open "${installFolder}"`);
process.exit(0);

