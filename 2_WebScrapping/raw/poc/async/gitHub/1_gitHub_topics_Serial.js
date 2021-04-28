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

// Get Topics Links

function extractTopics(html){
  let selectorTool= cheerio.load(html);
  let topicsArr= selectorTool(`.topic-box.position-relative.hover-grow.height-full.text-center.border.color-border-secondary.rounded.color-bg-primary.p-5 a`);

  let allTopicLinks=[];
  
  for(let i=0;i<topicsArr.length;i++){
    let link=selectorTool(topicsArr[i]).attr('href');
    
    let fullLinks="https://github.com"+link;
    allTopicLinks.push(fullLinks);
  }

  getTopicsSerially(allTopicLinks,0);
}

// Serially requesting for Topics
function getTopicsSerially(allTopicLinks,n){
  if(n==allTopicLinks.length){
    return;
  }else{
    let url=allTopicLinks[n];

    request(url,cb);
    function cb(err,response,html){
      if(err){
        console.log("Error: "+err);
      }else{
        extractRepositories(html); // Get Repo Links for Particular Topic

        // Making Serial request
        getTopicsSerially(allTopicLinks,n+1);
      }
    }

  }
}

function extractRepositories(html){
  let selectorTool= cheerio.load(html);
  let RepoLinkArr= selectorTool(`.d-flex.flex-justify-between.my-3 .text-bold`);  // get all Links

  let allRepoLinks=[];

  let TopicName= selectorTool(".h1-mktg").text();
  console.log(TopicName);
  
  for(let i=0;i<8;i++){
    let link=selectorTool(RepoLinkArr[i]).attr('href');
    let fullLinks="https://github.com"+link;
    
    allRepoLinks.push(fullLinks);
  }

  console.log(allRepoLinks);
}

console.log("after");