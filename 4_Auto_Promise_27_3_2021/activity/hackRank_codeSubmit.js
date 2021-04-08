let puppeteer = require('puppeteer');
let {email,password}= require('../../secrets'); // get email-id nd pw

let gtab; // To store reference of the New-Tab 
console.log("before");

//  Browser launch kra
let browserWillBeLaunchedPromise= puppeteer.launch({
  headless:false ,                              // to make the browser visible
  defaultViewport:null,
  args:["--start-maximized"],
});

browserWillBeLaunchedPromise
  .then(function (browserInstance){    
    //  New-Tab open kiya             
    let newTabPromise = browserInstance.newPage();  // create new Tab
    return newTabPromise;
  })
  .then(function (newTab){    
    //   New-Tab ke andhar Login-Page open kiya
    let loginPagePromise= newTab.goto(`https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login`);

    gtab=newTab;  // reference of the New-Tab formed
    return loginPagePromise;
  })
  .then(function (){        
    //   Username type kiya   
    let emailTypedPromise=gtab.type(`#input-1`, email, {delay: 100}); // type username
    return emailTypedPromise;
  })
  .then(function (){
    //  Password type kiya
    let passwordTypedPromimse=gtab.type(`#input-2`, password, {delay: 100}); // type password
    return passwordTypedPromimse;
  })
  .then(function (){
    //  Login pe click krdiya
    let loginPageClickPromise=gtab.click(`button[data-analytics="LoginPassword"]`); 
    return loginPageClickPromise;
  })
  .then(function (){ 
    // Interview-Kit pe click kiya    
    let interviewKitClickPromise=waitAndClick(`a[href="/interview/interview-preparation-kit"]`);
    return interviewKitClickPromise;
  })
  .then(function (){
    // Warm-up challenges pe Click kiya
    let warmUpClickPromise=waitAndClick(`a[data-attr1="warmup"]`);
    return warmUpClickPromise;
  })
  .then(function (){
    return gtab.url();  // return url of warm-up page
  })
  .then(function (url){
    console.log(url);
    
  })
 .catch(function (err){
    console.log(err);
  })

// promise-based func-> to wait for selector nd then click on it
function waitAndClick(selector){  
  return new Promise(function(resolve,reject){
    // wait for selector
    let selectorWaitPromise= gtab.waitForSelector(selector,{visible:true});
    selectorWaitPromise
      .then(function(){
          return gtab.click(selector);  // click on selector
      })
      .then(function(){
          resolve();    // jb dono kaam ho jaye(i.e, wait nd click), call resolve()
      })
      .catch(function(err){   // to catch any error
        reject(err);
      })
  })
}

  console.log("After");