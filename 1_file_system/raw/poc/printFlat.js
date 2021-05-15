// file system -> node modules
// google

let fs=require('fs');
let path=require('path');

// To Check if current path is of - File or not
function isFileChecker(dirPath) {
  return fs.lstatSync(dirPath).isFile();  //function in fs module which checks whether a File exists in the passed dirPath
}

// Get File/Folder inside current Directory
function readContent(dirPath) {
return fs.readdirSync(dirPath); //returns File/Directory name array inside dirpath
                                
}


// Main-Func
function viewFlat(dirPath){
  // dirPath-> file/folder

  let isFile= isFileChecker(dirPath);

  if(isFile){
    // Base-Case
    console.log(dirPath+"*");
  }else{
    //print Path for current directory
    console.log(dirPath);

    //get children
    let children=readContent(dirPath);


    // recursive call for Children in Current Directory
    for(let i=0;i<children.length;i++){
      viewFlat(path.join(dirPath,children[i]));    //passing the path of children wrt to the root path given
    }
  }
}

viewFlat("E:\\1PepCoding\\1_file_system"); //  while pasting the path of a Folder, add an extra '\' ie,   
                                        // E:\\1PepCoding   instead of E:\1PepCoding ,coz, '\' is escape sequence