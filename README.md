
# `droptextpp`

A minimal preprocessor for generic text files. Run as a script under node with support for drag and drop operation in Windows to bypass terminal command line input. Written to refactor code and other text files, it supports four directives: #include, #clone, #skip and #endskip

## System requiremenets

1. Windows OS or a Linux distro that supports desktop launchers (.desktop files).
2. [Node.js](https://nodejs.org) installed and accesible using default terminal environment settings.
3. Input files must be encoded in UTF-8 or ASCII (without the use of LATIN character codes in the range 128-255).
4. A text editor with utf8 support: output files are written with utf8 encoding and use line feeds for line termination.

## Installation
**Single user Installation for Windows**

1. Download `droptextpp` project files from its [GitHub repository](https://github.com/domleonard/droptextpp) by clicking on the green "Code" button in the repository followed by clicking on "Download ZIP" in the drop down. Windows refers to zip files as "compressed folders".
2. Double click on the downloaded zip  to open it in Windows' file Explorer.
3. Copy the "droptextpp-main" folder into an uncompresed folder of you choice.
4. Double click on the **Win_install_single_user.cmd** command in the uncompressed folder. This installs droptextpp in your user profile (typically located at `C:\Users\user_name`) in a subfolder called ".droptextpp" and then opens the install folder in file explorer. 
5. Copy the `DROP TEXT pp.cmd` file from the installation folder to somewhere more conveniently accessible for later use (say the desktop for initial testing). The command file can be copied multiple times and/or renamed as well to make it more convenient access in file explorer. The command file executes the droptextpp preprocessor on a file drag and dropped, or copied or pasted, onto it. 

**Single user Installation for Linux**

**Desktop launcher under Construction November 21 2025 - Linux usage restricted to terminal use pending updates**

1. Download `droptextpp` files from [GitHub](https://github.com/domleonard/droptextpp) and unpack the zip file.
2.  Navigate to the _unpacked_ `droptttp-main` directory and open it in terminal
3. Copy and paste the following command into terminal and press `Enter`
    
        node linux_install_single_user.js
    		
	This installs droptextpp in a `.droptextpp` folder in the user's home directory and then opens it in a file explorer window.
4. Copy the "Drop Text Preprocessor (TPP).desktop" desktop launcher file to any location in which it can be conveniently accessed. The launcher can be copied and/or renamed multiple times as may prove convenient. The launcher executes the droptextpp preprocessor on a file drag and dropped onto it. In the distro available for testing, desktop launchers did **not** support copying and pasting files onto a launcher as an alternative to drag and drop operations on the same file.

**Termial Use Installation**

1. Grab a copy of `droptextpp.js` off Github and run it under node in  a terminal using the command line syntax below.


**Uninstall**

Delete the `.droptestpp` subfolder in your home directory. Copied versions of `DROP TEXT pp.cmd` or `Drop Text Preprocessor (TPP).desktop` refering back to the installation folder will stop working.



## Template files

Template file names are a device to combine input and output file names for the text preprocessor into the name of the template file. Template files can then be dragged and dropped onto a text preprocessor command file in a single mouse operation.

1. Template files produce output in the directory they're in. 
2. Template files must have a file extension and produce output files with the same extension.
3. Template file names must contain ".TPP" (without quotes) immediately preceding their extension.


File name syntax:

> outputFilename.TPP.outputFileExtension


Example: Drag and dropping "my-great-novel.TPP.txt" onto "DROP TEXT pp.cmd" would read lines from the TPP file and write output to "my-great-novel.txt" in the same folder as the template file.
 
 ## General operation
 
1. Determine what file you want the preprocessor to create or overwrite.
 1. If the file already exists, [create a backup copy and] rename the file to turn it into a template file - meaning insert ".TPP" immediately before its file extension.
1. If and only if the file doesn't exist, create an empty template file based on the name of the output file to be created.
1. Edit the template file, which can contain any mix of preprocessor directives and source lines of general text, to make changes.
1. Drag and drop the template file onto the original or a copy of "DROP TEXT pp.cmd" (or equivalent OS launcher or shortcut) to create or update the output file.
 
### Note
 
Droptextpp updates the output file quietly. It does not ask permission to "overwrite" the output file by design.


## Command line syntax

Windows:
### `   node %USERPROFILE%/.droptextpp/droptextpp.js [-h] source [-p]`

Linux:
### `   node ~/.droptextpp/droptextpp.js [-h] source [-p]`

  **-h**    displays help on the terminal - any other other command line arguments passed to droptextpp are ignored.
  
  **source**
 * Specifies the file path of the source file to be read by the preprocessor. Relative paths are resolved against the current working directory under terminal usage.
 * If the `-p` option is not used, the source file must be a template file: the output file name is that of the template file with the '.TPP' component removed, and is written to the folder containing the template source.
 * Use the -p option to write to `stdout` if  source is not a template file or output redirection is required.     
 * The input file must be encoded using "utf-8" with line terminators of ASCII CR, CRLF or LF characters.
 * The output file is  encoded using "utf-8" with the LF character used as line terminator.

	
  **-p**    Write preprocessor output to standard output (stdout).
  * This option allows redirecting output to a location provided in the command line, or piping it to another process.
  * If this option is set, the source argument does not need to be a template file or have a file extension.
		
## Technical Notes


### Case Sensitivity
  * Option letters in the command line are case insensitve.
  * The ".TTP" marker in template file names is case insensitive.
  * Distinguishing between names of included files in the same directory when checking for recursive inclusion errors is case **insensitive** if the file system is case insensitive or the OS provides case insensitive file access,  and case **sensitive** if the OS and file system are too.
  * All files are read or written matching the case of filepath letters supplied in the command line or in preprocessor directives.
  * Preprocessor directive _names_ in source files are written in lower case and are case sensitive.

### Line terminators

Droptextpp treats files as a set of lines where each line is a set of zero or more characters terminated by a line terminator. Line terminators may be any of:
 * `CRLF` - carriage return followed by line feed,
 * `CR  ` - carriage return by itself,
 * `LF  ` - line feed by itself, or
 * `EOF ` - End of File  - but only if the last line in the file is non empty but doesn't end with one of the preceding line terminators.
 

### Filepath resolution

* The filepath of the input source file supplied in the command line is resolved against the current working directory if the path is relative. This does not apply to files that are dropped or pasted onto a .cmd file in Windows (or dragged onto a launcher in Linux) because the OS supplies their absolute path information when dropped.
* Relative directive filepath arguments are resolved by trying to find them relative to the directory of the include file they are in, and if not found searching backwards throught the directories of any parent include files that are still being processed, stopping at the directoty of the main source file (whether dropped or explicitly provided in the command line).
* Using "<" and ">" around included file names to search a  specific list of include directories as implemented in C preprocessors has not been implemented.
* It is recommended to always double quote filepath arguments supplied to preprocessor directives.
* Any number of leading and trailing quotation marks are removed from filepath arguments before removing leading and trailing white space from the result. File paths with leading or trailing spaces are not suppported.


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
* White space after the directive is optional and ignored if present.

### List of Directives

**`#clone "filepath"`**
- Copy lines verbatim from the file provided as argument to output, without scanning content lines for preprocessor directives during the operation.

    
**`#include "filepath"`**
- Copy lines from the file provided as argument to output, scanning lines for preprocessor directives starting in column one and executing them if detected.


**`#skip`**
- Start skipping input lines, starting with the `skip` directive and ending after an `#endskip` command which balances a previous `#skip` at the same nesting level. Unlike block comments in the C programmming language family, well-formed #skip/#endskip blocks can be nested. Skipping across input file boundaries is not supported:

* While skipping, lines are examined only for balanced #skip/#endskip directives to support nesting. A missing #endskip error is generated if end of file is encountered while skipping is in progress.


**`#endskip`**
- End skipping. The skip directive terminated is the  nearest previous `#skip` directive in the same file which has not already been terminated (`#skip`/`#endskip` blocks can be nested).





 
 






