let puppeteer = require('puppeteer');
let {email,password}= require('../../secrets');

let gtab; // To store reference of the New-Tab 

console.log("before");
//browser launch
let browserWillBeLaunchedPromise= puppeteer.launch({
  headless:false ,  // to make the browser visible
  defaultViewport:null,
  args:["--start-maximized"],
});

browserWillBeLaunchedPromise
  .then(function (browserInstance){   // Launch the browser
    let newTabPromise = browserInstance.newPage();  // create new Tab
    return newTabPromise;
  })
  .then(function (newTab){          // Redirected to New Tab/Page
    let loginPagePromise= newTab.goto(`https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login`);

    gtab=newTab;  // reference of the New-Tab formed
    return loginPagePromise;
  })
  .then(function (){                // Go-to Login-Page
    
    let emailTypedPromise=gtab.type(`#input-1`, email, {delay: 100}); // type username
    return emailTypedPromise;
  })
  .then(function (){
    let passwordTypedPromimse=gtab.type(`#input-2`, password, {delay: 100}); // type password
    return passwordTypedPromimse;
  })
  .then(function (){
    let loginPageClickPromise=gtab.click(`button[data-analytics="LoginPassword"]`); // click on      
                                                                                    //Submit-form
    let combinedPromise= Promise.all([loginPageClickPromise,
      gtab.waitForNavigation({waitUnitil:"networkidle0"})]);

    return combinedPromise;
  })
  .then(function (){    //  Logged-In and Reached DashBoard
    
    let interviewKitClickPromise=gtab.click(`.card-content h3[title="Interview Preparation Kit"]`);

    let combinedPromise= Promise.all(
      [interviewKitClickPromise,
      gtab.waitForNavigation({waitUntil:"networkidle0"}) ]);
    
    console.log("Logged-IN and at DashBoard");
    return combinedPromise;
  })
  .then(function (){
    // After navigation to the page, wait for the page to be visible i.e, wait for the selector at that Page, which is found after the page is visible
    let warmUpElementPromise= gtab.waitForSelector(`a[data-attr1="warmup"]`, {visible:true});
    return warmUpElementPromise;
  })
  .then(function (){

    let warmUpClickPromise=gtab.click(`a[data-attr1="warmup"]`);
    let socketMerchantElementPromise= gtab.waitForSelector(`a[data-attr1="sock-merchant"]`, {visible:true});

    let combinedPromise= Promise.all(
      [warmUpClickPromise,
      gtab.waitForNavigation({waitUntil:"networkidle0"}),
      socketMerchantElementPromise ]);  // we can combine the waitSelector() promise ,here also

    console.log("Inside Interview Kit");

    return combinedPromise;
  })
  .then(function (){
    let saleByMatchClickPromise=gtab.click(`a[data-attr1="sock-merchant"]`);

    let combinedPromise= Promise.all([saleByMatchClickPromise,
      gtab.waitForNavigation({waitUntil:"networkidle0"})]);

    console.log("Inside Warm-Up Challenge");

    return combinedPromise;
  })
  .then(function (){
    
    console.log("Inside Sales By Match");
  })
 .catch(function (err){
    console.log(err);
  })

  console.log("After");