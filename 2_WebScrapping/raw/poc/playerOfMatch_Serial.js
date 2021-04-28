let request= require("request");
let cheerio=require("cheerio");

let url=`https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results`;

console.log("before");

request(url,cb); // get data from link
function cb(err,response,html){
  if(err){
    console.log("Error: "+err);
  }else{
    extractMatch(html);
  }
}

// For Home-Page
function extractMatch(html){
  let selectorTool= cheerio.load(html);
  let ScorecardArr= selectorTool(`a[data-hover="Scorecard"]`);  // get Scorecard 'a' tag

  let allLinks=[];  // to get all Links
  
  for(let i=0;i<ScorecardArr.length;i++){
    let matchLink=selectorTool(ScorecardArr[i]).attr('href');   
    let fullLink= "https://www.espncricinfo.com"+matchLink;
    
    allLinks.push(fullLink);
  }

  getPlayerSerially(allLinks,0);

}

                              // To request for Players-Link Serially
function getPlayerSerially(allLinks,n){
  if(n== allLinks.length){
    return;
  }else{
    request(allLinks[n],cb);
    function cb(err, response,html){    // callback to the above request
      if(err){
        console.log("Error: "+err);
      }else{
        extractPlayerOfMatch(html);
        getPlayerSerially(allLinks,n+1);
      }
    }

  }
}


// To get Player Of Match
function extractPlayerOfMatch(html){
  let selectorTool= cheerio.load(html);
  let playerOfMatchEle= selectorTool(`.best-player-content`);
  let playerName= playerOfMatchEle.text();
  console.log(playerName);
  
}

console.log("after");