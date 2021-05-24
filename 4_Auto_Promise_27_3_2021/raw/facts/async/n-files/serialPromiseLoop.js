let fs = require("fs").promises;
let arr = ["../f1.txt", "../f2.txt", "../f3.txt"];
console.log("before");
let frp = fs.readFile(arr[0]);
for (let i = 1; i < arr.length; i++) {
    // frp=frp.then() , results in Promise-Chainning
    frp = frp.then(function (data) {
        console.log("content->" + data);
        return fs.readFile(arr[i]);    // return promise 
    })
}
console.log("after");

frp.then(function (data) {
    console.log("content->" + data);
})



