const fs = require("fs")
const path = require("path");

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

function copyFile(src, dir) {
    const filename = path.basename(src);
    const dest = path.join( dir, filename);
    try {
        fs.copyFileSync( src, dest);
    }
    catch(err) {
        console.error( `Error copying ${src} to ${dest}`, err);
        process.exit(1);
    }
// console.log("copyFile src: '%s', dir: '%s', dest: '%s'", src, dir, dest);
}
const appPath = path.resolve( __dirname, "./js/droptextpp.js");
copyFile( appPath, installFolder);
const cli_help = path.resolve( __dirname, "./docs/cli_help.txt");
copyFile( cli_help, installFolder);
const icon = path.resolve(__dirname, "./ico/droptextpp.png");
copyFile( icon, installFolder);
const license = path.resolve(__dirname, "./docs/LICENSE.txt");
copyFile( license, installFolder);
const readme = path.resolve(__dirname, "./docs/README.md");
copyFile( license, installFolder);	

// create desktop launcher

const nodePath = process.argv[0];
const scriptPath = path.resolve(installFolder, "./droptextpp.js");
const execString = `${nodePath} ${scriptPath} ""%U""`;


const launcherPath = path.resolve(installFolder, "./droptextpp.desktop");
const launcher =
`[Desktop Entry]
Name="drop texT PreProcessor (TPP)"
Comment="launcher for droptextpp with dropped file as argument"
Exec=${execString}
Icon=${path.resolve(installFolder, "./droptextpp.png")}
Terminal=true
Type=Application
Name[en_AU]=Drop Text Preprocessor (TPP).desktop
`; 

try {
    fs.writeFileSync( launcherPath, launcher);
}
catch( err) {
    console.error("An error occured writing desktop launcher", err);
    exit(1);
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


