let fs = require("fs");

console.log("Before");
// async function -> await 
(async function () {
    let frP = fs.promises.readFile("f1.txt");
    console.log("before adding await");
    let data = await frP;
    console.log("data" + data);
    console.log("After reading data");
    let f2P = fs.promises.readFile("f2.txt");
    let sFileData = await f2P;
    console.log("data" + sFileData);
})();

// async function fn() {
//     let frP = fs.promises.readFile("f1.txt");
//     console.log("before adding await");
//     frP.then(function (data) {
//         console.log("data" + data);
//         let f2P = fs.promises.readFile("f2.txt");
//         return f2P;
//     }).then(function (sFileData) {
//         console.log("data" + sFileData);

//     })
// }
console.log("After");
console.log("other");
