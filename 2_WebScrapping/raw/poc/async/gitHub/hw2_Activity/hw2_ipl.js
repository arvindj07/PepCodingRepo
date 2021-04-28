let fs=require("fs");
let path= require("path");
let request=require("request");
let cheerio= require("cheerio");

let url=`https://www.espncricinfo.com/series/ipl-2020-21-1210595`;
let homeUrl=`https://www.espncricinfo.com`;

function createDirectory(TeamName){
  let pathOfFolder= path.join(__dirname,TeamName);
  if(!fs.existsSync(pathOfFolder)){
    fs.mkdirSync(pathOfFolder);
  }
}

function createPlayerFile(name,TeamName){
  let filePath=path.join(__dirname,TeamName,name+".json");

  if(!fs.existsSync(filePath)){
    fs.writeFileSync(filePath,"");

  }  
}

// Request To home pg
request(url,cb);
function cb(err,resp,html){
  if(err){
    console.log("Error : "+err);
  }else{
    extractViewAllResults(html);
  }
}

// Extract View-All-Results Link
function extractViewAllResults(html){
  let selTool= cheerio.load(html);
  let link=selTool(`a[data-hover="View All Results"]`).attr('href');
  let fullLink= homeUrl+link;

  getScoreBoard(fullLink);
}

// Get ScoreBoard of each Match from The Pg
function getScoreBoard(fullLink){
  let url=fullLink;
  
  request(url,cb);
  function cb(err,resp,html){
    if(err){
      console.log("Error : "+err);
    }else{
      extractScoreBoard(html);
    }
  }

}

// Extract ScoreBoard of each Match from The Pg
function extractScoreBoard(html){
  let selTool= cheerio.load(html);
  let scoreBoardArrEle=selTool(`a[data-hover="Scorecard"]`);  //  All ScoreBoard Elements

  for(let i=0;i<scoreBoardArrEle.length;i++){
    let link= selTool(scoreBoardArrEle[i]).attr('href');
    let fullLink= homeUrl+link;

    getPlayersInfo(fullLink);
  }
}

function getPlayersInfo(fullLink){
  let url=fullLink;

  request(url,cb);
  function cb(err,resp,html){
    if(err){
      console.log("Error : "+err);
    }else{
      extractPlayersInfo(html);
    }
  }
}

function extractPlayersInfo(html){
  let selTool = cheerio.load(html);

  let bothTeamCard=selTool(`.card.content-block.match-scorecard-table`);
  
  // loop i<2 ,coz we only need info of 2 Teams' Card
  for(let i=0;i<2;i++){
    let TeamName= selTool(bothTeamCard[i]).find('.col').text();
    TeamName=TeamName.split('INNINGS')[0];    // get TeamName only
    TeamName=TeamName.trim();

    createDirectory(TeamName);  // create Directory for Each team

    // Get Batsman Of Current Team
    let allBatsmenEle=selTool(bothTeamCard[i]).find('table.table.batsman tbody tr');  // get each batsman-row
    for(let i=0;i<allBatsmenEle.length-1;i+=2){
      let name=selTool(allBatsmenEle[i]).find(`.batsman-cell`).text();
      name=name.trim();

      // Create Player File
      createPlayerFile(name,TeamName);

      // Get Info of Batsman from table-data i.e, td for the curr row
      let batmanInfo=selTool(allBatsmenEle[i]).find('td');  // array of info
    
      // getting required info
      let runs=selTool(batmanInfo[2]).text();
      let ball=selTool(batmanInfo[3]).text();
      let fours=selTool(batmanInfo[5]).text();
      let sixes=selTool(batmanInfo[6]).text();
      let sr=selTool(batmanInfo[7]).text();

      let data;
      let filePath=path.join(__dirname,TeamName,name+".json");

      // read-File
      data=fs.readFileSync(filePath,"utf8");

      // check if file is empty
      if(data.length!=0){
        data=JSON.parse(data);
      }else{
        data=[];
      }

      // push new obj of info
      data.push({
        "runs":runs,
        ball,
        fours,      // shorthand for fours:fours
        sixes,
        sr
      });

      // convert json to string before writing the file
      data=JSON.stringify(data);      
      fs.writeFileSync(filePath,data);
    }
  }

}

