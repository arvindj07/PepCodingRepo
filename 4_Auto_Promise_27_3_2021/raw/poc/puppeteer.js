let puppeteer = require('puppeteer');

//browser launch
let browserWillBeLaunchedPromise= puppeteer.launch({
  headless:false ,  // to make the browser visible
});

//callback hell
//-------------
// browserWillBeLaunchedPromise
//   .then(function (browserInstance){
//     //new tab
//     let newPagePromise= browserInstance.newPage();
//     newPagePromise
//       .then(function (newPage){
//         console.log("New Tab Opened");
//         // go to pepcoding-site from new tab
//         let pageWillBeOpenedPromise=newPage.goto("https://pepcoding.com");
//         pageWillBeOpenedPromise
//           .then(function(){
//             console.log("page is opened");
//           })


//       })

//   })

// Promise Chainning
browserWillBeLaunchedPromise
  .then(function (browserInstance){
    //new tab
    let newPagePromise= browserInstance.newPage();
    return newPagePromise;
  }).then(function (newPage){
    console.log("New Tab Opened");
    // go to pepcoding-site from new tab
    let pageWillBeOpenedPromise=newPage.goto("https://pepcoding.com");
    return pageWillBeOpenedPromise;
  }).then(function(){
    console.log("page is opened");
  }).catch(function (err){
    console.log(err);
  })

console.log(browserWillBeLaunchedPromise);

  

  