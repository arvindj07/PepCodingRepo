// file system -> node modules
// google

let fs=require('fs');
let path=require('path');

function isFileChecker(dirPath) {
  return fs.lstatSync(dirPath).isFile();  //function in fs module which checks whether a File exists in the passed dirPath
}
function readContent(dirPath) {
return fs.readdirSync(dirPath); //function which returns an array of contents,which exists in the dirPath.Content can be 
                                //a File or a Directory
}

function viewFlat(dirPath){
  // dirPath-> file/folder

  let isFile= isFileChecker(dirPath);

  if(isFile){
    console.log(dirPath+"*");
  }else{
    //directory
    //print Path for current directory
    console.log(dirPath);

    //get children
    let children=readContent(dirPath);

    // console.log("children: ",children); // to check the content of children

    // recursive call for Children in Current Directory
    for(let i=0;i<children.length;i++){
      viewFlat(path.join(dirPath,children[i]));    //passing the path of children wrt to the root path given
    }

  }

}

viewFlat("E:\\1PepCoding\\1_file_system"); //while pasting the path of a Folder, add an extra '\' ie,E:\\1PepCoding   
                                          //instead of E:\1PepCoding