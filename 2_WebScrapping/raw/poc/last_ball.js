let fs=require("fs");
let request= require("request");
let cheerio=require("cheerio");

let url=`https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/ball-by-ball-commentary`;

request(url,cb);

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
  let allCommentaries=selectorTool(".d-flex.match-comment-padder.align-items-center .match-comment-long-text");
  console.log(allCommentaries.length);

  //rule, index-> cheerio-selector
  let lastCommentary= selectorTool(allCommentaries[0]).text();
  console.log(lastCommentary);
}

console.log("after");