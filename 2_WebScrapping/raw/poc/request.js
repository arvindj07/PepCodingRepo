let fs=require("fs");
let request= require("request");
let cheerio= require("cheerio");

request("https://www.google.com",cb);

function cb(err,response,html){
  if(err){
    console.log("Error: ",err);
  }else{
    // console.log(html);  // inner Html content of the pg, to which we made the request to
    extractionHtml(html);
  }
}

function extractionHtml(html){
  let selectorTool= cheerio.load(html);
  let selectElement= selectorTool("#SIvCob"); // selects by id from google html pg
  console.log(selectElement.text());          // text() displays text content of the element, html() displays that  
                                              //particular element as a whole
}

console.log("after");