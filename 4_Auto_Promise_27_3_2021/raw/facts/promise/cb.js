let lib = require("./lib");
// cb -> trust issues
let amount = 100;
let tocut = 20;
function chargeCreditCard() {
    amount = amount - tocut;
    console.log(`Remaining amount ${amount}`)
}

// function fn1() {
//     amount = 0;
//     console.log(`Remaining amount ${amount}`)
// }
console.log("Before");
// async function
// lib.analyzedata("TV", chargeCreditCard);
let promiseObj = lib.promisifiedAnalyzedata("TV");
promiseObj.then(chargeCreditCard);
// promiseObj.then(fn1);    // this way,u can change the value of amount again
console.log("After");
