let fs = require('fs').promises;

let f1promise = fs.readFile('./f1.txt');
f1promise
  .then(function (data) {
    console.log("data->" + data);
    return 3;
    // return fs.readFile('./f1.txt');
    // Agr value return kiya tho,nxt then() will get value 
    // Agr promise obj return kiya tho, nxt then() will get resolved value of that promise
  })
  .then(function(data){
    console.log("data->"+data); // Prints 3 or data in f1.txt
  })
  .catch(function (err) {
    console.log(err);
  })