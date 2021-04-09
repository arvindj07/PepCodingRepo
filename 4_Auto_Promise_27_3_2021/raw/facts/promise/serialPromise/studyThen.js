let fs=require("fs");

let frp=fs.promises.readFile("f1.txt");

let thenKP=frp.then(cb);

function cb(data){
  console.log("data->"+data);
  return fs.promises.readFile("f2.txt");
}

thenKP.then(function (data){
  console.log("ThenKP Value->"+data);
})