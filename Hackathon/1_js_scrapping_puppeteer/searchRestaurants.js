let fs=require("fs");
let puppeteer= require("puppeteer");

// Main-code
(async function(){
  let browserInstance = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args:["--start-maximized"]
  });

  let page= await browserInstance.newPage();

  await page.goto("https://www.google.com/maps");
})();