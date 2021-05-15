let fs = require("fs");
let path = require("path");

// Input
let input=process.argv.slice(2);
let dirpath=input[0];   // path of folder to be organized

// File-Types
let types = {
  media: ["mp4", "mkv", "mp3"],
  archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
  documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
  app: ['exe', 'dmg', 'pkg', "deb"]
}

// Create Directory
function dirCreator(dirpath){
  if(fs.existsSync(dirpath)==false){
    fs.mkdirSync(dirpath);
  }
}

//checks whether a File exists in curr path 
function isFileChecker(dirPath) {
  return fs.lstatSync(dirPath).isFile(); 
}

//returns an array of contents,which exists in the dirPath
function readContent(dirPath) {
  return fs.readdirSync(dirPath); 
}

// Copy File To Destination-Folder
functioncopyFileToFolder(dirpath,destFolder){
  let orgFileName= path.basename(dirpath);        // define the name of the file to which content is to be copied
  let destFilePath=path.join(destFolder,orgFileName);   // Destination File-Path
  fs.copyFileSync(dirpath,destFilePath);
}

// Get Directory-name in Organized Folder for given-path
function getDirectoryName(dirpath){
  let ext=dirpath.split('.').pop(); // gets the file-name extension at the end of dirpath
  
  for(let key in types){
    // check if array contains 'ext'
    if(types[key].includes(ext)){
      return key;
    }

    // for(let i=0;i< types[key].length;i++){
    //   if(types[key][i]==ext){
    //     return key;
    //   }
    // }
    
  }

  // if file doesnt belong to any types that we defined
  return "others";
}

  
// Create Folder for-> File-Types
let orgFilePath=path.join(dirpath,"organized_files");     //organized file path within dirpath folder
dirCreator(orgFilePath);                                  // create a folder which contains organized folder

// making diff folders based on type of files ,inside organized_folder 
for(let key in types){
  let innerPath=path.join(orgFilePath,key); 
  dirCreator(innerPath);
} 

let otherPath=path.join(orgFilePath,"others");    // if the file doesnt belong to any type of files
dirCreator(otherPath);


// Traverse through the folder , to reach files and Organise it
function OrganizeDir(dirpath){
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
      OrganizeDir(path.join(dirpath,children[i]));    
    }

  }
}

OrganizeDir(dirpath); // calling organize function to organise Folder, we get dirpath from input
