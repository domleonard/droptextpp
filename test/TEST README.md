
## TEST README
### Test folder from the GitHub respository.

1. Before running tests in the "test" directory make sure Droptextpp has already been installed in the current user's home directory/profile.

2. "Drop Text Preprocessor (TPP).cmd" is a Droptextpp launcher for Windows. Under linux, copy the DropTextpp launcher created during installation to a downloaded copy of the test folder.

3. Other .cmd files run `node` with arguments under Windows.
   To test these command files in linux open a terminal in the  **test folder of the downloaded Droptextpp GitHub respository** - or navigate to it in an open terminal. Next copy and paste the Node command below to test various Droptextpp command line options:
    
    * test help:  
            node ~/.droptextpp/droptextpp.js -h
    
    * test version:  
            node ~/.droptextpp/droptextpp.js -v
    
    * test pipe:  
            node ~/.droptextpp/droptextpp.js -p "testFolder/pipe_output.txt"
    
    * test EOF_line_terminator:  
	       node ~/.droptextpp/droptextpp.js -p "testFolder/test_EOF_line_terminator.txt"
    
    _Tests are known to fail if the working directory of the terminal is not a downloaded copy of the Droptextpp "test" directory and/or Droptextpp is not installed._ 
	       
    
4. Generally drag test files  with a .txt extension onto a Droptextpp launcher noting that:
    * "test_ENOEXT" doesn't have an extension but is stlill drag and dropped onto the Droptextp launcher for testing. 
 
5. Test files ending in "search" will create conditions that require Droptextpp to search through the directories of previously included files to locate a non-absolute filepath specified in a Droptextpp directive.
