let puppeteer = require('puppeteer');
let {email,password}= require('../../secrets'); // get email-id nd pw
let { codes } = require("./code");

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
    let url=gtab.url();  // url of warm-up page
    console.log(url);
    let quesnObj= codes[0];

    // call questionSolver, to solve each code
    questionSolver(url,quesnObj.soln, quesnObj.qName);
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

function questionSolver(modulePageurl, code, questionName){
  return new Promise(function (resolve,reject){
    // warm-up wale pg pe jana ,i.e, module-page
    let reachedPageUrlPromise= gtab.goto(modulePageurl);

    reachedPageUrlPromise
      .then(function (){
        // the code, in this method will run inside browser console, coz of evaluate() func in puppeteer
    // Func task- It will match the question passed from local with the question on pg and then click on it
        function submitQuestionFn(questionName){
          let allH4Ele= document.querySelectorAll("h4");
          let textArr=[];

          for(let i=0;i<allH4Ele.length;i++){
            let myQuestion= allH4Ele[i].innerText.split("\n")[0]; // only get question-name part
            myQuestion=myQuestion.trim();
            textArr.push(myQuestion);
          }
          //   to match with quesntioname passed from local-file
          let idx=textArr.indexOf(questionName);
          console.log(idx);
          allH4Ele[idx].click();  // to click on that matching Question element 

        }

        // evaluate() method ,helps to run the code in func-browserConsoleRun inside browser console
        let quesnClickPromise= gtab.evaluate(submitQuestionFn,questionName);
        return quesnClickPromise;
      })
      .then(function(){
        // after click on quesn, resolve the promise
        resolve();
      })
      .catch(function (err){
        reject(err);
      })

  });
}

  console.log("After");