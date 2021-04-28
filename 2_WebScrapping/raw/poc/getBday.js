let request= require("request");
let cheerio=require("cheerio");

let url=`https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard`;

console.log("before");

request(url,cb);    // requesting the link for data/Html
function cb(err,response,html){
  if(err){
    console.log("Error: ",err);
  }else{
    extractionHtml(html);
  }
}

function extractionHtml(html){
  let selectorTool=cheerio.load(html);

  let teamNameEleArr= selectorTool(".Collapsible h5");  // team name 
  let teamNameArr=[];

  for(let i=0;i<teamNameEleArr.length;i++){
    let teamName= selectorTool(teamNameEleArr[i]).text();
    teamName=teamName.split("INNINGS")[0];
    teamName=teamName.trim();
    
    teamNameArr.push(teamName);
  }

  let batsmenTable= selectorTool(".table.batsman"); // batsmen-table

  // batsmen table
  for(let i=0;i<batsmenTable.length;i++){
    let batsmenNameAnchors= selectorTool(batsmenTable[i]).find("tbody tr .batsman-cell a"); // this gives an array of   
                                                                                          //anchor tag in curr table
    for(let j=0;j<batsmenNameAnchors.length;j++){
      let name= selectorTool(batsmenNameAnchors[j]).text();           //player name
      let team = teamNameArr[i];                                      // player team
      let playerLink=selectorTool(batsmenNameAnchors[j]).attr('href');// player pg link
      
      // console.log(`${name} ${team} ${playerLink}`);
      printBirthDays(playerLink,name,team);
    }

    console.log("-------------------------------------------");
  }
  
}

function printBirthDays(playerLink,name,team){
  request(playerLink,cb);
  function cb(err,response,html){
    if(err){
      console.log("error: ", err);
    }else{
      extractBday(html,name,team);
    }
  }
}

function extractBday(html,name,team){
  let selTool= cheerio.load(html);

  let bdayEle=selTool(".ciPlayerinformationtxt span");
  let bday= selTool(bdayEle[1]).text();             // get bday from element
  bday=bday.trim();

  console.log(`${name} : ${team} : ${bday}`);

} 

console.log("after");