let fs=require("fs");
let request= require("request");
let cheerio=require("cheerio");

let url=`https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard`;

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
  let batsmenTable= selectorTool(".table.batsman"); // batsmen-table

  let teamNames= selectorTool(".header-title.label"); // Team Names in first 2 elements of array
  
  // batsmen table
  for(let i=0;i<batsmenTable.length;i++){
    let singleInningsBatsmen= selectorTool(batsmenTable[i]).find("tbody tr"); //data of all bowlers at each table,from tr

    let currteamName= selectorTool(teamNames[i]).text();
    currteamName=currteamName.split('INNINGS')[0];         // To get only the Team Name
    currteamName= currteamName.trim();                     // to remove whitespaces from front nd back

    for(let j=0;j<singleInningsBatsmen.length-1;j+=2){
      let singleAllCol=selectorTool(singleInningsBatsmen[j]).find("td");  // full-data of each bowler,from td
      let name= selectorTool(singleAllCol[0]).text();

      console.log(`Name:${name} -> Team: ${currteamName}`);               // Print name 

    }

    console.log("-------------------------------------------");

  }
  
}

console.log("after");