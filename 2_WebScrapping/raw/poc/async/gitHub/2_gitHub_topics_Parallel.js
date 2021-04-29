let request= require("request");
let cheerio=require("cheerio");
let path=require("path");
let fs= require("fs");
let PDFDocument = require("pdfkit");

let url=`https://github.com/topics`;
let homeUrl=`https://github.com`;

console.log("before");

// Ccreate-Directory
function dirCreator(TopicName){
  let pathOfFolder=path.join(__dirname,TopicName);
  fs.mkdirSync(pathOfFolder, { recursive: true });
}

// Create-File
function createFile(repoName,TopicName){
  let pathOfFile= path.join(__dirname,TopicName,repoName+".json");  // create json file for Repo
  if(fs.existsSync(pathOfFile)==false){
    let createStream = fs.createWriteStream(pathOfFile);
    createStream.end();
  }
}

// ------------------------Start-Point of Code
request(url,cb);
function cb(err,response,html){
  if(err){
    console.log("Error: "+err);
  }else{
    extractTopics(html);
  }
}

// Get Topics Links- 3 Links
function extractTopics(html){
  let selectorTool= cheerio.load(html);
  let topicsArr= selectorTool(`.topic-box.position-relative.hover-grow.height-full.text-center.border.color-border-secondary.rounded.color-bg-primary.p-5 a`);
  
  for(let i=0;i<topicsArr.length;i++){
    let link=selectorTool(topicsArr[i]).attr('href');    
    let fullLink="https://github.com"+link; // Topics-link

    getRepositories(fullLink);    
  }
  
}

function getRepositories(fullLink){
  let url=fullLink;

  request(url,cb);
  function cb(err,response,html){
    if(err){
      console.log("Error: "+err);
    }else{
      extractRepositories(html); // Get Repo Links for Particular Topic
      
    }
  }
}


// Get Repository Links - 8-links
function extractRepositories(html){
  let selectorTool= cheerio.load(html);
  let RepoLinkArr= selectorTool(`.d-flex.flex-justify-between.my-3 .text-bold`);  // get all Links

  let TopicName= selectorTool(".h1-mktg").text();
  TopicName=TopicName.trim();
  console.log(TopicName);

  dirCreator(TopicName);  // Func to create Directory for each Topics  
  
  for(let i=0;i<8;i++){
    let link=selectorTool(RepoLinkArr[i]).attr('href');
    let fullLink=homeUrl+link;

    // Repo-Name will be at the end of the link- fullLink
    let repoName= fullLink.split('/').pop();
    repoName=repoName.trim();

    createFile(repoName,TopicName);   // Create Repo-File
    
    let fullRepoLink= fullLink+"/issues";     // Directly getting Issues-Link
    getIssues(fullRepoLink,repoName,TopicName);
  }
}


function getIssues(fullLink,repoName,TopicName){
  let url=fullLink;

  request(url,cb);
  function cb(err,response,html){
    if(err){
      // if Issue-Page is not found, handle that error
      if(response.statusCode==404){
        console.log("No issue Page Found");
      }else{
        console.log(err);
      }
    }else{
      extractIssues(html,repoName,TopicName); // Get Issues of Particular Repositories      
    }
  }
}

// Get All Issues In Single-Pg of That Repo
function extractIssues(html,repoName,TopicName){
  let selTool= cheerio.load(html);
  let allIssueElements =selTool(`a[data-hovercard-type="issue"]`); // get array of links to all Issues in Issue-Tab

  // Array of Objects
  let arr=[];

  for(let i=0;i<allIssueElements.length;i++){
    let issueName= selTool(allIssueElements[i]).text();
    let issueLink=selTool(allIssueElements[i]).attr('href');

    let fullLink=homeUrl+issueLink;

    // Pushing Objects into Array
    arr.push({
      "Name": issueName,
      "Link":fullLink
    });
  }
  let data = JSON.stringify(arr);   // Always convert Json to String , to write to a File
  console.table(arr);

  let filePath= path.join(__dirname,TopicName,repoName+".json");    
  fs.writeFileSync(filePath, data);     // write to json-file

  // To create PDF

  // let filePath= path.join(__dirname,TopicName,repoName+".pdf");  
  // let pdfDoc = new PDFDocument;
  // pdfDoc.pipe(fs.createWriteStream(filePath));
  // pdfDoc.text(data);
  // pdfDoc.end();  
   
}

console.log("after");