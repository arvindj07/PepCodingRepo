//commands
//view --tree , --flat
//organize-> same folder, multiple folder
//help

// [node, mycli.js, view, dirname, mode]
// node mycli.js organize _/foldername
//node mycli.js help

let  helpFn=require("./commands/help");
let view=require("./commands/view")  ;
let {organizeFn}=require("./commands/organize") ; // Object de-structuring

let input=process.argv.slice(2); // getting the passed input command , from the console
let cmd=input[0];     

switch(cmd){
  case "view":
    view.viewFn();
    break;
  case "help":
    helpFn.helpExecutor();
    break;
  case "organize":
    organizeFn(); //Object de-structured
    break;
  default:
    console.log("Enter Wrong Command, enter help to see the list of commands");
}