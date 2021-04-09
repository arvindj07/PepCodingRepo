let fs=require("fs");
let arr=["f1.txt","f2.txt","f3.txt"]; // file-path array

let frp=fs.promises.readFile(arr[0]);

for(let i=1;i<arr.length;i++){
  frp=frp.then(function(data){    // frp=frp.then() is done for chainning
    console.log("content-> "+data);
    return fs.promises.readFile(arr[i]);
  })
}

// to consume the last read file
frp.then(function(data){
  console.log("content-> "+data);
}).catch(function(err){
  console.log("err-> "+err);
})