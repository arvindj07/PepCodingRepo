let puppeteer = require('puppeteer');

//browser launch
let browserWillBeLaunchedPromise= puppeteer.launch({
  headless:false ,  // to make the browser visible
});

browserWillBeLaunchedPromise
  .then(function (browserInstance){
    //new tab
    let newPagePromise= browserInstance.newPage();
    newPagePromise
      .then(function (newPage){
        console.log("New Tab Opened");
        // go to pepcoding-site from new tab
        let pageWillBeOpenedPromise=newPage.goto("https://pepcoding.com");
        pageWillBeOpenedPromise
          .then(function(){
            console.log("page is opened");
          })


      })

  })

console.log(browserWillBeLaunchedPromise);

  

  