class DropTextpp {

	constructor (parent, argv=null) {
		// instances are called "pp", short for "preprocessor", in code.

		this.lineNo = 0;
		this.error = "";
		this.oError = null; // Error instance object
		if( !parent) {
			this.createFromArgs(argv);
		}
		else {
			this.createFromParent(parent);
		}
	}
	
	clone( includePath) {
		if( !includePath  || includePath == '""') {
			this.exitOnError( 'ECLONENOPATH');
		}
		const fsIncludePath = this.parseInclude(includePath, true); // may exit on error
		let text;
		
		try {
			text = fs.readFileSync(fsIncludePath,'utf8');
		}
		catch (err) {
			this.exitOnError("EFILEREAD", err);
		}
		// clone lines:
		const includeLines = this.lineSplit(text);
		const outLines = this.outLines;
		includeLines.forEach( line=>outLines.push(line)); 
	}
	
	createFromArgs( argv) {
				
		this.fsInsensitive = this.isFSInsensitive();
		this.proto = this.constructor.prototype;
		this.proto.ppName = this.constructor.name;
		this.proto.outLines = [];
		this.proto.outPath = null;
		this.proto.activeIncludes = {}; // indexed by includePathKey
		this.proto.activeArray = []; // LIFO array of Preprocessor objects
		this.proto.opts = this.getOpts(argv);
		if( this.opts.h) {
			this.echoHelp();
			process.exit(0);
		}
        if( this.opts.v) {
            this.echoVersion();
            process.exit(0);
        }
        if( !this.opts.p && process.platform == "linux") {
            console.log('\n\n'); // linux desktop launcher can obscure about 2.33 lines of console output
        }
		this.parent = null;
		this.filePath = "source file inclusion";
		this.lines = [`#include ${this.opts.sourceArg}`];
		this.lineNo = 0;
		this.includeLine = this.lines[0];
    }
	
	createFromParent(parent) {
		this.parent = parent;
		this.filePath = parent.includePath;
		// lines added in 'include' method
	}
	
	echoHelp() {
        const fileName = process.platform == "win32" ? "win_cli_help.txt" : "gnu_cli_help.txt"
        const help = this.echoRead( fileName);
        console.log( help ? help : "undefined");
        this.echoVersion();
    }
    echoRead( fileName) {
        let filePath = path.resolve( __dirname, fileName);
		if(!fs.existsSync( filePath)) {
			filePath = path.resolve( __dirname, path.join("../docs", fileName))				; // in GitHub repository
		}
		let text;
        try {
            text = fs.readFileSync(filePath, 'utf8');
        }
        catch( error) {
            console.error("Unable to locate '%s' at '%s'", fileName, filePath);
            return null;
        }       
		text = text.replaceAll("<b>", "\x1b[1m");
		text= text.replaceAll("</b>", "\x1b[22m");
		return text;
	}
    echoVersion() {
        let text = this.echoRead("version.txt");
        console.log( text || "undefined");
    }
	
	exec() {
		if( this.parent) {
			this.activeArray.push(this);
			this.activeIncludes[this.filePathKey] = this;
		}			
		const lines = this.lines;
		this.skipStarts = [];
		let skipPointer = -1;
		let bSkipping = false;
		const reAction = /^\#([a-zA-Z0-9]+)(\s*)(.*)/;

		for( let lineNo = 0; lineNo < lines.length; ++lineNo) {
			const line = lines[lineNo];
			this.lineNo = lineNo;
			if( reAction.test(line)) {
				const [str, verb, space, param] = reAction.exec(line);
				if( param && !space) {
					if(!bSkipping) this.outLines.push(line);
					continue;
				}
				if( verb == "skip") {
					bSkipping = true;
					this.skipStarts.push(lineNo);
					continue;
				}
				if( verb == "endskip") {
					if( !this.skipStarts.length) {
						this.exitOnError("E_UNEXP_ENDSKIP");
					}
					this.skipStarts.pop();
					bSkipping = this.skipStarts.length > 0;
					continue;	
				}
				if( bSkipping) {
					continue;
				}
				if( verb == "include") {
					this.include( param.trim());
					continue;
				}
				if( verb == "clone") {
					this.clone( param.trim());
					continue;
				}
			}
			if(!bSkipping) this.outLines.push(line);
		}
		if(bSkipping) { 
			let skipLineNos = this.skipStarts.map( lineNo => lineNo+1).join(", ");
			this.exitOnError('ENOENDSKIP', null, skipLineNos);
		}
		if( this.parent) {
			this.activeArray.pop;
			delete this.activeIncludes[this.filePathKey];
		}
	}
	
	exitOnError(eCode, errorInstance = null, hint="") {
		if( this.activeArray.length ) {
			console.error("\nInclude Stack:");
			this.activeArray.forEach( (pp, i) => {
				const parent = pp.parent;
				if( parent) {
					console.error(`${i}. '${parent.includeLine}'   at "${parent.filePath}" line ${parent.lineNo+1}`);
				}
				else {
					console.error(`${i}. '${pp.includeLine}'   (source file)`);
				}
			});
		}
		else console.error("\nInclude Stack: \<empty\>");
		
		const errorLine = this.lines[this.lineNo];
		let errorAt = `"${this.filePath}" line ${this.lineNo+1}`;
		let errorFrom = "";

		if( this.parent) {	
			let includeLine = this.parent.includeLine;
			let includeWhere = `"${this.parent.filePath} line ${this.parent.lineNo+1}`;
			errorFrom = `'${includeLine}' at ${includeWhere}`;
		}

		const eCodeMsg = {
			ENO_EXT: "The command line source file requires a filetype extension (unless the -p option is piping output to stdout)",
			ENO_FILE: "File not found: relative file paths in directives are resolved against directories of files on the Include stack, searched in reverse order to find a matching file before attempting to resolve them against the current working directory (CWD). Relative file paths from the terminal command line are resolved directly against the CWD.",

			ENO_TPP_OR_PIPE: `Command lne source files must be a template files (unless the -p option is piping output to stdout)\n Template files are identified by inserting ".tpp" in the file name immediatey preceding its filetype extension, where ".tpp" is case insensitive.\n E.G. 'myfile.TPP.txt' is a template file whose  output will  be written to file 'myfile.txt'`,
			ECYCLICINCLUDE: "Cyclic Inclusion: an included file cannot include itself or a file that results in an inclusion of itself",
			EINCNOPATH:  "'#include' must be followed by a filepath argument, \n OR the command line is missing a source file argument",
			ECLONENOPATH: "'#clone' must be followed by a filepath argument",
			EFILEREAD: "Error reading file",
			E_UNEXP_ENDSKIP: "Unexpected '#endskip' when not skipping lines.",
			ENOENDSKIP: `Unexpected end of include file while skipping lines\n hint - #endSkip  for #skip(s) started at line(s) ${hint} expected`,
			EFILEWRITE: "Error writing file",

		};
		let msgLines;
		if( eCode && eCodeMsg[eCode]) {
			msgLines = eCodeMsg[eCode].split('\n'); 
		}
		else if( eCode) {
			msgLines = [`Unknown error code '${eCode}'`];
		}
		else if(!errorInstance) {
			msgLines = ["Unspecified error"];
		}

		console.error( `\nError Line: `);
		console.error(`        '${errorLine}'`)	
		console.error(`    at: ${errorAt}`)
		console.error(`\nError code: '${eCode}'`)
		msgLines.forEach( line => console.error(line));
		
		if( errorInstance) throw errorInstance;
		process.exit(1);
	}
		
	getOpts(argv) {
		//console.log("Array argv: ", argv);
		const opts = {otherArgs: []}; // length = number of options selected.
		const validOpts = "hpv"; // echo help file and exit, or write output to stdout for pipe or redirection
		const invalidOpts = [];
		const reSwitch = /[\/-][a-zA-Z]*\s*$/;
		const bError = false;
		for(let i = 0; i < validOpts.length; ++i) {
			opts[ validOpts[i]] = false;
		}
		for(let i = 2; i < argv.length; ++i) {  // skip "node" and "droptextpp[.js"
			let opt = argv[i];
			if( reSwitch.test(opt)) {
				let letters = opt.substring(1);
				for (const letter of letters) {
					if(validOpts.indexOf(letter) >=0) {
						opts[letter] = {opt, argvIndex: i};
					}
					else invalidOpts.push( opt);
				}
			}
			else {
				opts.otherArgs.push( argv[i]);
			}
		}
		
		if( invalidOpts.length) {
			console.error("\nError: Invalid command option(s) " + invalidOpts.join(", "));
			process.exit(1);
		}
		opts.sourceArg = opts.otherArgs[0];
		//console.log("getOpts:  ", opts);
		return opts;
	}
	
	include( includePath) {
		if( !includePath  || includePath == '""') {
			this.exitOnError( 'EINCNOPATH');
		}
		const fsIncludePath = this.parseInclude(includePath, false); // may exit on error
		const filePathKey = this.fsInsensitive ? fsIncludePath.toLowerCase() : fsIncludePath;
		if(this.activeIncludes[ filePathKey]) {
			this.exitOnError("ECYCLICINCLUDE");
		}		
		this.includePath = fsIncludePath;
		if(!includePath) {
			this.exitOnError( 'EINCNOPATH');
		}
		let includeLines;
		try {
			let lines = fs.readFileSync(fsIncludePath,'utf8');
			includeLines = this.lineSplit(lines);
		}
		catch (err) {
			this.exitOnError("EFILEREAD", err);
		}
		
		// create a child preprocessor object to process the include.
		const pp = new DropTextpp(this);
		pp.filePath = fsIncludePath;
		pp.filePathKey = filePathKey;
		pp.lines = includeLines;
		pp.exec();
	}
	
	isFSInsensitive() {
		let base = path.basename(__filename);
		let different = base.toUpperCase();
		if( different == base) {
			different = base.toLowerCase();
		}
		let differentPath = path.resolve(__dirname, different);
		// console.log("Comparing filepaths '%s' vs '%s'", __filename, differentPath);
		return fs.existsSync( differentPath);
	}
	
	lineSplit(text) {
		if( !text) return []; // empty file;
		let lines = text.split(/\r\n|\r|\n/g);
		return lines;
	}

	parseInclude(includePath, bClone) {
		// console.log("parseInclude( %s, %s) ", includePath, bClone)
		let firstChar = includePath[0];
		let endChar = includePath[includePath.length-1];
		if( firstChar == '"' && endChar == firstChar) {
			includePath = includePath.slice(1,-1);
		}
		includePath = includePath.trim();
		if(!includePath) {
			this.exitOnError( bClone ? 'ECLONENOPATH' : 'EINCNOPATH');
		}
		this.includeLine = this.lines[this.lineNo];
		this.includePath = includePath;
		let foundPath;
		if(path.isAbsolute(includePath)) {
			if( fs.existsSync(includePath)) {
				foundPath = includePath;
				//console.log("includePath %s is Absolute foundPath: %s", includePath, foundPath);
			}
		}
		else if( !this.parent) {
			foundPath = path.resolve(includePath);
		}
		else {
			for( let index = this.activeArray.length-1; index >= 0; --index){
				let pp = this.activeArray[index];
				let searchDir = path.dirname(pp.filePath);
				let tryPath = path.join(searchDir, includePath)
				if( fs.existsSync( tryPath)) {
					foundPath = tryPath;
					//console.log("Stack path[%s] resolved %s to  %s", pp.filePath, includePath, foundPath);
					break;
				}
			}
			if(!foundPath) {
				let tryPath = path.resolve(includePath);
				if(  fs.existsSync(tryPath)) {
					foundPath = tryPath;
					//console.log("cwd resolved %s to %s", includePath, foundPath);
				}
			}			
		}
		if( !foundPath) {
			this.exitOnError('ENO_FILE');
		}
	
		if(!bClone && !this.parent && !this.opts.p) {
			const oPath = path.parse(foundPath);
			let ext  = oPath.ext;
			if( ext == '.') {
				ext = "";
			}
			if(!ext) {
				this.exitOnError( "ENO_EXT");
			}
			let nameParts = oPath.name.split('.');
			let tpp = nameParts.pop();
			const bTPP = nameParts.length && tpp && tpp.toLowerCase() === "tpp";
			if(!bTPP) {
				this.exitOnError("ENO_TPP_OR_PIPE");
			}
			oPath.base = nameParts.join("") + oPath.ext;
			this.proto.outPath = path.format(oPath);
		}

		return foundPath;
	}
	writeOut() {
		if( !this.outLines.length) {
			this.outLines.push("");
		}
		let text = this.outLines.join('\n');
		if( this.opts.p) {
			fs.writeSync( process.stdout.fd, text);
		}
		else {
			try {
				fs.writeFileSync(this.outPath, text);
			}
			catch ( error) {
				this.exitOnError( "EFILEWRITE", error);
			};
			console.log("Drop Text Preprocessor (TPP) output successfully written to: ", this.outPath);
		}
	}
}

function main(argv) {
	// create a DropTextpp object from arguments
	const pp = new DropTextpp(null, argv); // preprocessor 
	pp.exec();
	pp.writeOut();
	process.exit(0);
}

const path = require("node:path");
const process = require("node:process");
const fs = require("node:fs");
main( Array.from(process.argv));
