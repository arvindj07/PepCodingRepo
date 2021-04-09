let puppeteer = require('puppeteer');
let {email,password}= require('../../secrets'); // get email-id nd pw
let { codes } = require("./codes");

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

    // call questionSolver, to solve each Question
    let fqsp=questionSolver(url,quesnObj.soln, quesnObj.qName);

    for(let i=1;i<codes.length;i++){
      fqsp=fqsp.then(function (){
        return questionSolver(url,codes[i].soln,codes[i].qName);  // return promise
      })
    }

    return fqsp;  // remember to return the promise
  })
  .then(function (){
    console.log("All question submitted");
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

// function- to solve Each question
function questionSolver(modulePageurl, code, questionName){
  return new Promise(function (resolve,reject){
    // warm-up wale pg pe jana ,i.e, module-page
    let reachedPageUrlPromise= gtab.goto(modulePageurl);

    reachedPageUrlPromise
      .then(function (){
        // Func task -> select the Given-Question: questionName, and click on it from browser
        let quesnClickPromise= gtab.evaluate(selectQuestionFn,questionName);
        return quesnClickPromise;
      })
      .then(function (){
        // type nd then Copy the code from Custom-Input Text-Area
        let typeAndCopyCodePromise= typeAndCopyCode(code);
        return typeAndCopyCodePromise;
      })
      .then(function (){
        // Wait nd click on Editor i.e, Monaco-editor
        return waitAndClick(`.monaco-editor.no-user-select.vs`);
      })
      .then(function (){
        // Press A -> Select All 
        return gtab.keyboard.press('A');
      })
      .then(function (){
        // Press V -> Paste our code
        return gtab.keyboard.press('V');
      })
      .then(function (){
        // Release Ctrl-key
        return gtab.keyboard.up('Control');
      })
      .then(function (){
        // Click on submit Button
        return waitAndClick(`.pull-right.btn.btn-primary.hr-monaco-submit`);
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

// Type nd then Copy Code from Custom-Input Text-Area
function typeAndCopyCode(code){
  return new Promise(function(resolve,reject){
    // wait nd click on check-box of custom-input
    let clickCheckBox=waitAndClick(`.custom-checkbox.inline`);// after click on check-box, cursor directly moves 
                                                              //to text-area
    clickCheckBox
    .then(function (){
      // type code, inside custom-input text-Area
      return gtab.type(`.custominput`,code);
    })
    .then(function (){
      // Press and Hold Ctrl-key
      return gtab.keyboard.down('Control');
    })
    .then(function (){
      // Press A -> Select All
      return gtab.keyboard.press('A');
    })
    .then(function (){
      // Press X -> Cut the Code
      return gtab.keyboard.press('X');
    })
    .then(function (){
      resolve();  // call resolve, when all done
    })
    .catch(function (err){
      reject(err);
    })

  })
}


// the code, in this method will run inside browser console, coz of evaluate() func in puppeteer
// Func task- It will match the question passed from local with the question on pg and then click on it
function selectQuestionFn(questionName){
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

// code submit
function codeSubmit(code){
  let editor= document.querySelector(`.monaco-editor.no-user-select.vs`);
  editor.innerHTML=code;
  let submitButton=document.querySelector(`.pull-right.btn.btn-primary.hr-monaco-submit`);
  submitButton.click();
}

  console.log("After");