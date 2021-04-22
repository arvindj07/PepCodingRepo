let fs = require("fs");
let path = require("path");

let types = {
  media: ["mp4", "mkv", "mp3"],
  archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
  documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
  app: ['exe', 'dmg', 'pkg', "deb"]
}

//check if Directory already exists or not
function dirCreator(dirpath){
  if(fs.existsSync(dirpath)==false){
    fs.mkdirSync(dirpath);
  }
}


function isFileChecker(dirPath) {
  return fs.lstatSync(dirPath).isFile(); //checks whether a File exists in curr path 
}

function readContent(dirPath) {
  return fs.readdirSync(dirPath); //returns an array of contents,which exists in the dirPath
}

function copyFileToFolder(dirpath,destFolder){
  let orgFileName= path.basename(dirpath);        // define the name of the file to which content is to be copied
  let destFilePath=path.join(destFolder,orgFileName); 
  fs.copyFileSync(dirpath,destFilePath);
}

function getDirectoryName(dirpath){
  let ext=dirpath.split('.').pop(); // gets the file-name extension at the end of dirpath
  
  for(let key in types){

    // looping through each array for the keys
    for(let i=0;i< types[key].length;i++){
      if(types[key][i]==ext){
        return key;
      }
    }
  }

  // if file doesnt belong to any types that we defined
  return "others";
}

// Traverse through the folder , to reach files
function OrganizeDir(dirpath,orgFilePath){
  let isFile= isFileChecker(dirpath);

  if(isFile){
    // getting destination directory, to where ,file is to be copied

    let foldername= getDirectoryName(dirpath);
    
    // set destination path
    let destPath=path.join(orgFilePath,foldername);
    copyFileToFolder(dirpath,destPath);

  }else{
   
    let children=readContent(dirpath);
    
    // recursive call for Children in Current Directory
    for(let i=0;i<children.length;i++){
      OrganizeDir(path.join(dirpath,children[i]),orgFilePath);    
    }

  }
}

// This is the function that is Returned from this module
function OrganizeFn(dirpath){
  let orgFilePath=path.join(dirpath,"organized_files");     //organized file path within dirpath folder
  dirCreator(orgFilePath);                                  // create a folder which contains organized folder

  // making diff folders inside organized_folder base on type of files
  for(let key in types){
    let innerPath=path.join(orgFilePath,key); 
    dirCreator(innerPath);
  } 

  let otherPath=path.join(orgFilePath,"others");    // if the file doesnt belong to any type of files
  dirCreator(otherPath);

  OrganizeDir(dirpath,orgFilePath); // calling organize function to organise Folder
}

module.exports= {
  organizeFn : OrganizeFn
}

