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
    return loginPageClickPromise;
  })
  .then(function (){    //  Logged-In and Reached DashBoard
   
    console.log("Logged-IN and at DashBoard");
  })
 .catch(function (err){
    console.log(err);
  })

  console.log("After");