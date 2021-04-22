let fs=require('fs');
let path=require('path');

//google for the fs module given below
function isFileChecker(dirPath) {
  return fs.lstatSync(dirPath).isFile();  //function in fs module which checks whether a File exists in the passed dirPath
}
function readContent(dirPath) {
return fs.readdirSync(dirPath); //function which returns an array of contents,which exists in the dirPath.Content can be 
                                //a File or a Directory
}

function viewTree(dirPath,indent){
  let isFile= isFileChecker(dirPath);

  if(isFile){
    console.log(indent,path.basename(dirPath)+"*"); // path.basename()is used to return the last file/directory in the  
                                                    //current path
  }else{
   
    console.log(indent,path.basename(dirPath));

    //get children
    let children=readContent(dirPath);

    // console.log("children: ",children); // to check the content of children

    // recursive call for Children in Current Directory
    for(let i=0;i<children.length;i++){
      viewTree(path.join(dirPath,children[i]),indent+"\t");    
    }

  }

}

viewTree("E:\\1PepCoding\\1_file_system","");//while pasting the path of a Folder, add an extra '\' ie,E:\\1PepCoding   
                                              //instead of E:\1PepCoding