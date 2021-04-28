let fs=require("fs");
let request= require("request");
let cheerio=require("cheerio");

let url=`https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard`;

request(url,cb);    // requesting the link for data/Html

function cb(err,response,html){
  if(err){
    console.log("Error: ",err);
  }else{
    // console.log(html);  // inner Html content of the pg, to which we made the request to
    extractionHtml(html);
  }
}

function extractionHtml(html){
  let selectorTool=cheerio.load(html);
  let bowlerTable= selectorTool(".table.bowler"); // array of bowlers-table

  // Initialize ,Max-Wicket nd Name
  let max_wicket=-1;
  let max_name="";

  // Loop on Two Bowler-Table
  for(let i=0;i<bowlerTable.length;i++){
    //data of all bowlers at each table,from tr
    let singleInningsBowlers= selectorTool(bowlerTable[i]).find("tbody tr"); 

    // data of Each Bowler
    for(let j=0;j<singleInningsBowlers.length;j++){
      let singleAllCol=selectorTool(singleInningsBowlers[j]).find("td");  // full-data of each bowler,from td
      let name= selectorTool(singleAllCol[0]).text();
      let wicket= selectorTool(singleAllCol[4]).text();

      console.log(`Name:${name}, Wicket:${wicket}`);      // Print name and wickets 

      if(max_wicket<Number.parseInt(wicket)){     // convert string to int using Number.parseInt()
        max_wicket=wicket;
        max_name=name;
      }
    }

    console.log("-------------------------------------------");
    console.log(`Max-Wicket is taken by ${max_name}, wickets-${max_wicket}`);
  }
  
}

console.log("after");