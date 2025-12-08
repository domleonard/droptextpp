# Droptextpp

A generic text file preprocessor for text files with a minimal directive set of #include, #clone, #skip and #endskip commands. Mouse drag and drop operations are intended to drive the preprocessor although a command line interface is provided. Output files are generally updated in place to avoid changing filenames in programs which use them. Written to refactor code and test revisions by simply re-running an app or reloading a web page.

## System requirements

1. Windows® or Linux OS that supports desktop launchers (".desktop" files).
2. For linux only, installation of `gnome-terminal` if not already installed.
3. [Node.js](https://nodejs.org) installed and accessible using default terminal environment settings.
4. Input files encoded in UTF-8 or ASCII (without the use of LATIN character codes in the range 128-255).
5. A text editor with utf8 support: output files are written with utf8 encoding and line feeds for line termination.

## Installation

### No installation

This option if for terminal use only - mouse operation will not be installed.

1. Grab a copy of `droptextpp.js` off [GitHub](https://github.com/domleonard/droptextpp).
2. Grab copies of `version.txt` and the cli help file for your system (`gnu_cli_help.txt` or `win_cli_help.txt`) from the repository's `docs` folder and save them along side `droptextpp.js` in the same local directory.
3. Run `droptextpp.js` in a terminal under node.

    If the file to be preprocessed is not a [template file](#template-files) the [`-p`](#command-line-syntax) option for `droptexpp.js` must be provided in the terminal command line to write output to stdout &ndash; as in:

        node droptexpp.js -p sourcefile [ > outputfile]

### Single user Installation for Windows

1. Download `droptextpp` project files from its [GitHub repository](https://github.com/domleonard/droptextpp) by clicking on the green "Code" button in the repository followed by clicking on "Download ZIP" in the drop down.
2. Double click on the downloaded zip  to open it in Windows' file Explorer where it listed as a "compressed folder".
3. Copy the "droptextpp-main" folder into an uncompressed folder of your choice, say the desktop - it's not needed after installation except to run tests in the `test` folder.
4. Double click on the **Win_install_single_user.cmd** command in the uncompressed folder. This installs droptextpp in your user profile (typically located at `C:\Users\user_name`) in a subfolder called ".droptextpp" and then opens the installation folder in file explorer. 
5. Copy the `Drop Text Preprocessor (TPP).cmd` file from the installation folder to the desktop or location of your choice.
    * Optionally but recommended, create a shortcut to the command file and under its properties click the "Change Icon" button near the bottom to use the icon (.ico file) in the installation folder, and clear the "Start in" folder name if present.
    
	The command file or shortcut can be copied to multiple locations and/or renamed for more convenient access in file explorer. The command file or shortcut executes the droptextpp preprocessor on a file drag and dropped, or copied and pasted, onto it. 

### Single user Installation for linux based OS
1. Check if `gnome-terminal` is the default terminal program on your system:
    
    Open a terminal window and right click the window area. If it shows a drop down list with "profile" and "show Menubar" entries, make sure "showMenubar" is checked and in the menu bar click `help > about`. If it shows you're running `gnome-terminal` by default proceed to the next step.

    Otherwise check if it's installed:
	
	Type `gnome-terminal` in a terminal and press `Enter`. If it opens a new terminal window, use that one and proceed to the next step.

    Otherwise install `gnome-terminal` on your system and run it to open a terminal window for the next step.

2. Check/create a "keepopen" terminal profile
    
    Right click in your (gnome) terminal window and hover over "profiles. If it doesn't show a profile named "keepopen", click on preferences, then click "+" to create a new profile, calling it "keepopen" and then proceed to edit: under the "Command" tab change the "What to do when command exits" drop down to "Hold the terminal open".

3. Download `droptextpp` files from [GitHub](https://github.com/domleonard/droptextpp) and unpack the zip file.
4.  Navigate to the _unpacked-zip-file_/droptexttp-main directory, right click and open a terminal in it.
5. Copy and paste the following command into terminal and press `Enter`
    
        node linux_install_single_user.js

    This installs droptextpp in a `.droptextpp` folder in the user's home directory and then opens it in a file explorer window.
6. Copy the "Drop Text Preprocessor (TPP).desktop" desktop launcher file to any location in which it can be conveniently accessed. The launcher can be copied and/or renamed multiple times as may prove convenient. The launcher executes the droptextpp preprocessor on a file drag and dropped onto it. 

### Uninstall

If not installed for mouse usage delete local copies of `droptextpp.js`, version and help files downloaded from the repository.

If installed for mouse use delete the `.droptestpp` subfolder in the user's home folder. Copied versions of `DROP TEXT pp.cmd` or shortcut under Windows or the desktop launcher under Linux, all referring back to the deleted installation folder, will stop working.


## Template files

Template file names are a device to combine the names of input and output files for text preprocessing into the name of the template file so it can be used in a single drag and drop mouse operation to run the text preprocessor

Template File name syntax:

       outputFilename.TPP.outputFileExtension

1. Template files produce output in the directory they're in. 
2. Template files must have an explicit file extension.
3. Template file paths have the case insensitive string ".TPP" inserted before their extension
4. The full path of the output file is that of the template file with the ".TPP" string before its extension removed.

Example: Drag and dropping "my-great-novel.TPP.txt" onto "Drop Text Preprocessor (TPP)" command (Windows) or Linux desktop launcher would read lines from the TPP file and write output to "my-great-novel.txt" in the same folder as the template file.

Note: "tpp" is the last three letters of `droptextpp`. A template file name ending in `tpp.tpp` would create an output file with a `.tpp` extension.
 
 ## General operation
 
 Determine what file you want the preprocessor to create or overwrite.
 
 If the file already exists, [create a backup copy and] rename the file to turn it into a template file - meaning insert ".TPP" immediately before its file extension.
 
 If and only if the file doesn't exist, create an empty template file based on the name of the output file to be created.
 
 Edit the template file, which can contain any mix of preprocessor directives and source lines of general text, to make changes.
 
 Drag and drop the template file onto the original or a copy of "Drop Text Preprocessor (TPP)" command or desktop launcher to create or update the output file.
 
### Note
 
Droptextpp updates the output file quietly. It does not ask permission to "overwrite" the output file by design.


## Command line syntax

Windows:
 ### **`   node %USERPROFILE%/.droptextpp/droptextpp.js [-h] [-v] [-p] source`**  
GNU/Linux:
### `   node ~/.droptextpp/droptextpp.js [-h] [-v] [-p] source`

where `%USERPROFILE%` is replaced by the user's home folder under Windows and `./` is replaced by the user's home directory under Linux, and

 **-h**
: displays help on the terminal - any other other command line arguments passed to droptextpp are ignored.

**-v**
: displays the version of droptextpp installed on the terminal and exits.

**-p**
: Write preprocessor output to standard output (stdout), allowing it to be read on the terminal, redirected to a file specified in the command line, or piped to a following process.
  
  **source**
 * Specifies the file path of the source file to be read by the preprocessor. Relative paths in the command line are [resolved](#filepath-resolution) against the current working directory when the command is run.
 * If the `-p` option is not used, the source file must be a template file: the output file name is that of the template file with the '.TPP' component removed, and is written to the folder containing the template source.
 * If the `-p` option is used, the source file doesn't need to be template file and doesn't need to have a file extension.
 * The input file must be encoded using "utf-8" with line terminators of ASCII CR, CRLF or LF characters.
 * The output file is  encoded using "utf-8" with the LF character used as line terminator.

		
## Technical Notes

### Desktop environment
* Droptextpp is a desktop utility using synchronous file system access. As written it is not suitable for production.


### Case Sensitivity
  * Option letters in the command line are case insensitive.
  * The ".TTP" marker in template file names is case insensitive.
  * Distinguishing between names of included files in the same directory when checking for recursive inclusion errors is case **insensitive** if the file system is case insensitive or the OS provides case insensitive file access,  and case **sensitive** if the OS and file system are too.
  * All files are read or written matching the case of filepath letters supplied in the command line or in preprocessor directives.
  * Preprocessor directive _names_ in source files are written in lower case and are case sensitive.

### Line terminators

Droptextpp treats files as a set of lines where each line is a set of zero or more characters terminated by a line terminator. Line terminators may be any of:
 * `CRLF` - carriage return followed by line feed,
 * `CR  ` - carriage return by itself,
 * `LF  ` - line feed by itself.
 * `EOF ` - End of file if the file is empty, or the last line of the file contains text or white space but doesn't end with an explicit line terminator.
     *  This ensures compatability  between text files saved in editors that may or may not enforce a rule that text files must end in a line terminator.
     *  Code implementation is to ignore input terminators immediatly before EOF and deem the line to be terminated by EOF.
	 *  For WYSIWIG text editing in Linux, try turning off the "Ensure trailing Newlines" option in the XED editor. For a light weight option under Windows try the Notepad++ editor.
 
### Filepath resolution

* The filepath of the input source file supplied in the command line is resolved against the current working directory if the path is relative. This does not apply to files that are dropped or pasted onto a .cmd file in Windows (or dragged onto a launcher in Linux) because the OS supplies their absolute path information when dropped.
* Relative directive filepath arguments are resolved by trying to find them relative to the directory of the include file they are in, and if not found searching backwards through the directories of any parent include files that are still being processed, stopping at the directory of the main source file (whether dropped or explicitly provided in the command line). If the file still has not been found, an attempt is made to find it relative to the current working directory of the Droptextpp process.
* Using "<" and ">" around included file names to search a  specific list of include directories as implemented in C preprocessors has not been implemented.
* It is recommended to always double quote filepath arguments supplied in preprocessor directives and may become necessary in the future.
* Any number of leading and trailing quotation marks are removed from filepath arguments before removing leading and trailing white space from the result. File paths with leading or trailing spaces are not supported.


### No Indentation of directives

Droptextpp does NOT support indentation of its preprocessor directives in order to minimise conflict between the syntax of the file being preprocessed and the syntax of the directives. Only input file lines that start with a hash mark ('#') which is immediately followed by one or more lower case English letters may need manual checking for conflict with droptextpp directive names.


### Conflict resolution

Conflict between preprocessor directives and intended text file content can be resolved in one of three ways:

1. Use `#clone` instead of an `#include` directive to copy an input file to output without scanning it for preprocessor directives.
1. Modify the source file line if feasible to remove the conflict 
    E.G. If an HTML line started with `#include` inside a paragraph, inserting a space before the '#' would compact with the line feed as HTML white space.
1. Give up. Some scenarios, such as attempting to preprocess C or C++ files that contain directives for the C preprocessor, are probably doomed to fail before they start.



## Preprocessor Directives

### Syntax
> `#verb[ ["]argument["]][ ]`

* Directives start with a `#` character in the first column of a line, immediately followed by the name of the directive (verb).
* Directives which take an argument MUST be followed by white space before the argument.
* Argument values may optionally be provided between a pair of leading and trailing ASCII double quotation marks. If such leading and trailing quotation marks are detected they are removed automatically, allowing spaces (and double quote marks allowed within filenames by some file systems) to remain in place.
* Leading and trailing white space surrounding an argument is also trimmed _after_ removal of any leading or trailing double quotation marks surrounding the argument.
* White space after the directive is optional and ignored if present.

### List of Directives

**`#clone "filepath"`**
- Copy lines verbatim from the file provided as argument to output, without scanning content lines for preprocessor directives during the operation.

    
**`#include "filepath"`**
- Copy lines from the file provided as argument to output, scanning lines for preprocessor directives starting in column one and executing them if detected.


**`#skip`**
- Start skipping input lines, starting with the `skip` directive and ending after an `#endskip` command which balances a previous `#skip` at the same nesting level. Unlike block comments in the C programming language family, well-formed #skip/#endskip blocks can be nested. Skipping across input file boundaries is not supported.

* While skipping, lines are examined, but only for balanced #skip/#endskip directives to support nesting. A missing #endskip error is generated if end of file is encountered while skipping is in progress.


**`#endskip`**
- End skipping. The skip directive terminated is the  nearest previous `#skip` directive in the same file which has not already been terminated (`#skip`/`#endskip` blocks can be nested).

 
 






