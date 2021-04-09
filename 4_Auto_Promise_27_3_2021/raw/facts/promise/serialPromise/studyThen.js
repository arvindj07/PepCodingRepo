let fs=require("fs");

let frp=fs.promises.readFile("f1.txt");
// here, frp is the Promise, and cb is the handler func
// frp-> Promise, cb-> handler func
let thenKP=frp.then(cb);
// thenKp-> then Ka Promise
function cb(data){
  console.log("data->"+data);
  return fs.promises.readFile("f2.txt");
}

thenKP.then(function (data){
  console.log("ThenKP Value->"+data);
})