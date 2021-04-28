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
  
  for(let i=0;i<ScorecardArr.length;i++){
    let matchLink=selectorTool(ScorecardArr[i]).attr('href');   // get link in each 'a' tag
    // But this link is not full-link, as it doesn't include home-link

    let fullLink= "https://www.espncricinfo.com"+matchLink;
    // console.log(fullLink);

    displayPlayerOfMatch(fullLink);
  }

}



function displayPlayerOfMatch(fullLink){
  request(fullLink,cb);
  function cb(err, response,html){    // callback to the above request
    if(err){
      console.log("Error: "+err);
    }else{
      extractPlayerOfMatch(html);
    }
  }

}

// To get Player Of Match
function extractPlayerOfMatch(html){
  let selectorTool= cheerio.load(html);
  let playerOfMatchEle= selectorTool(`.best-player-name`);
  let playerName= playerOfMatchEle.text();
  console.log(playerName);

  // let teamArr= selectorTool(".name");
  // for(let i=2;i<playerName.length;i++){
  //   let team=selectorTool(teamArr[i]).text();
  //   console.log(team);
  // }
  
}

console.log("after");