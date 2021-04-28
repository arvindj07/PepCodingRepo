let request= require("request");
let cheerio=require("cheerio");

let url=`https://github.com/topics`;

console.log("before");

request(url,cb);
function cb(err,response,html){
  if(err){
    console.log("Error: "+err);
  }else{
    extractTopics(html);
  }
}

//--------------- Topics
// Get Topics Links- 3 Links
function extractTopics(html){
  let selectorTool= cheerio.load(html);
  let topicsArr= selectorTool(`.topic-box.position-relative.hover-grow.height-full.text-center.border.color-border-secondary.rounded.color-bg-primary.p-5 a`);
  
  // for(let i=0;i<topicsArr.length;i++){
    for(let i=0;i<1;i++){
    let link=selectorTool(topicsArr[i]).attr('href');    
    let fullLink="https://github.com"+link;

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

//---------  Repositories
// Get Repository Links - 8-links
function extractRepositories(html){
  let selectorTool= cheerio.load(html);
  let RepoLinkArr= selectorTool(`.d-flex.flex-justify-between.my-3 .text-bold`);  // get all Links

 let TopicName= selectorTool(".h1-mktg").text();
  console.log(TopicName);
  
  // for(let i=0;i<8;i++){
    for(let i=0;i<4;i++){
    let link=selectorTool(RepoLinkArr[i]).attr('href');
    let fullLink="https://github.com"+link;

    extractIssueTab(fullLink,TopicName);
  }
}

function extractIssueTab(fullLink,TopicName){
  let url=fullLink;

  request(url,cb);
  function cb(err,response,html){
    if(err){
      console.log("Error: "+err);
    }else{
      getRepositoryIssuesTab(html,TopicName); // Get link to Issues tab
      
    }
  }
}

//----------- Issues-Tab
// Get Issue-Tab Of Repositories
function getRepositoryIssuesTab(html,TopicName){
  let selTool= cheerio.load(html);
  let issueTabElement= selTool(`a[data-tab-item="i1issues-tab"]`);

  //----------Check if Issue Tab exists
  if(issueTabElement!=undefined){
    let issueLink=issueTabElement.attr('href'); // get Issue-tab Link
    let fullLink="https://github.com"+issueLink;
    // console.log(fullLink);

    extractIssues(fullLink);
  }
  
}

function extractIssues(fullLink){
  let url=fullLink;

  request(url,cb);
  function cb(err,response,html){
    if(err){
      console.log("Error: "+err);
    }else{
// var allRepoIssues=[];
      getRepositoryIssues(html); // Get Issues of Particular Repositories      
    }
  }

}

function getRepositoryIssues(html){
  let selTool= cheerio.load(html);
  let allIssueElements =selTool(`a[data-hovercard-type="issue"]`); // get array of links to all Issues in Issue-Tab

  let allIssueName=[];
  let allIssueLink=[];

  for(let i=0;i<allIssueElements.length;i++){
    let issueName= selTool(allIssueElements[i]).text();
    let issueLink=selTool(allIssueElements[i]).attr('href');

    let fullLink="https://github.com"+issueLink;

    allIssueName.push(issueName);
    allIssueLink.push(fullLink);
  }

  // console.log(allIssueName);
  // console.log(allIssueLink);

  obj={};

  for(let i=0;i<allIssueName.length;i++){
    let key=allIssueName[i];
    let value=allIssueLink[i];

    obj[key]=value;
  }

  console.log(obj);
  // console.log(JSON.stringify(obj));
  
// return obj;

}




// use selector- a[data-hovercard-type="issue"] to get name and link in issue tab
console.log("after");