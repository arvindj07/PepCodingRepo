let puppeteer = require('puppeteer');
let { email, password } = require('../../secrets'); // get email-id nd pw
let { codes } = require("./codes"); // locally stored code-soln

console.log("before");

//IIFEE
(async function () {

  try {
    //  Browser launch kra 
    let browserInstance = await puppeteer.launch({
      headless: false,                              // to make the browser visible
      defaultViewport: null,
      args: ["--start-maximized"],
    });
    
    // gtab is the Page instance
    let gtab = await browserInstance.newPage();  // create new Tab
    // goto-login pg
    await gtab.goto(`https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login`); 
    await gtab.type(`#input-1`, email, { delay: 100 }); // type username
    await gtab.type(`#input-2`, password, { delay: 100 }); // type password
    await gtab.click(`button[data-analytics="LoginPassword"]`);   // click on submit

    await waitAndClick(`a[href="/interview/interview-preparation-kit"]`,gtab); // wait nd click on Interview-kit
    await waitAndClick(`a[data-attr1="warmup"]`,gtab); // wait nd click on wsrm-up challenges

    let url = gtab.url();  // url of warm-up page

    // solve each quesn using questionSolver() func
    for (let i = 0; i < codes.length; i++) {
      await questionSolver(url, codes[i].soln, codes[i].qName, gtab);  
    }

    console.log("Finished");

  } catch (err) {
    console.log("Error->" + err);
  }


})();


// promise-based func-> to wait for selector nd then click on it
async function waitAndClick(selector, gtab) {
  await gtab.waitForSelector(selector, { visible: true });
  let clickPromise = gtab.click(selector);  // click on selector
  return clickPromise;  // return Promise

}

// function- to solve Each question
async function questionSolver(modulePageurl, code, questionName, gtab) {

  await gtab.goto(modulePageurl);   // warm-up wale pg pe jana ,i.e, module-page

  // Func task -> select the Given-Question and click on it from browser
  await gtab.evaluate(selectQuestionFn, questionName);
  await typeAndCopyCode(code, gtab);  // type nd then Copy the code from Custom-Input Text-Area
  await waitAndClick(`.monaco-editor.no-user-select.vs`,gtab); // Wait nd click on Editor i.e, Monaco-editor

  // Paste the copied code to browser
  await gtab.keyboard.press('A');
  await gtab.keyboard.press('V');
  await gtab.keyboard.up('Control');
  
  let clickSubmit = waitAndClick(`.pull-right.btn.btn-primary.hr-monaco-submit`,gtab);  // Click on submit Button
  return clickSubmit;   // return Promise
}

// Type nd then Copy Code from Custom-Input Text-Area
async function typeAndCopyCode(code,gtab) {
  // wait nd click on check-box of custom-input
  await waitAndClick(`.custom-checkbox.inline`,gtab);// after click on check-box, cursor directly moves 
  // type code, inside custom-input text-Area
  await gtab.type(`.custominput`, code);
  await gtab.keyboard.down('Control');
  await gtab.keyboard.press('A');

  return gtab.keyboard.press('X');  //  return promise

}


// the code, in this method will run inside browser console, coz of evaluate() func in puppeteer
// Func task- It will match the question passed from local with the question on pg and then click on it
function selectQuestionFn(questionName) {
  let allH4Ele = document.querySelectorAll("h4");
  let textArr = [];

  for (let i = 0; i < allH4Ele.length; i++) {
    let myQuestion = allH4Ele[i].innerText.split("\n")[0]; // only get question-name part
    myQuestion = myQuestion.trim();
    textArr.push(myQuestion);
  }
  //   to match with quesntioname passed from local-file
  let idx = textArr.indexOf(questionName);
  console.log(idx);
  allH4Ele[idx].click();  // to click on that matching Question element 

}

console.log("After");