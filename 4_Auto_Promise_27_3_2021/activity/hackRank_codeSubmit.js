let puppeteer = require('puppeteer');
let {email,password}= require('../../secrets');

let gtab;

console.log("before");
//browser launch
let browserWillBeLaunchedPromise= puppeteer.launch({
  headless:false ,  // to make the browser visible
  defaultViewport:null,
  args:["--start-maximized"],
});

browserWillBeLaunchedPromise
  .then(function (browserInstance){
    let newTabPromise = browserInstance.newPage();  // create new Tab
    return newTabPromise;
  })
  .then(function (newTab){
    let loginPagePromise= newTab.goto(`https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login`);

    gtab=newTab;  // reference of the New-Tab formed
    return loginPagePromise;
  })
  .then(function (){
    let emailTypedPromise=gtab.type(`#input-1`, email, {delay: 100});
    return emailTypedPromise;
  })
  .then(function (){
    let passwordTypedPromimse=gtab.type(`#input-2`, password, {delay: 100});
    return passwordTypedPromimse;
  })
  .then(function (){
    let loginPageClickPromise=gtab.click(`button[data-analytics="LoginPassword"]`);
    return loginPageClickPromise;
  })
  .then(function (){
    console.log("Logged In")
  })
  .catch(function (err){
    console.log(err);
  })

  console.log("After");