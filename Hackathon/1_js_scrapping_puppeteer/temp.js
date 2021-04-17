let fs=require("fs");
let puppeteer= require("puppeteer");

let place=process.argv[2];

// Main-code
(async function(){
  let browserInstance = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args:["--start-maximized"]
  });

  let page= await browserInstance.newPage();
  await page.goto("https://www.google.com/maps"); // gogle-maps

  // Search- Restaurant Nearby
  let restaurant="restaurants near "+place;
  await page.waitForSelector(`input[aria-label="Search Google Maps"]`,{visible:true});
  await page.type(`input[aria-label="Search Google Maps"]`,restaurant);
  await page.keyboard.press('Enter');

  // Selectors- for Restaurant Info
  let nameSelector=`div.tYZdQJV9xeh__title-container`;
  let ratingSelector=`div.tYZdQJV9xeh__star-rating-container`;
  let addressSelector=`div[class="tYZdQJV9xeh__info-line"]>div[jsinstance="0"]`;

  await page.waitForSelector(nameSelector,{visible:true});
  await page.waitForSelector(ratingSelector,{visible:true});
  await page.waitForSelector(addressSelector,{visible:true});
  

  

  function scrollPage(sel,nameSelector){
    let ele=document.querySelectorAll(sel);
    ele[1].scrollTop=ele[1].scrollHeight;
    let resNameArrEle=document.querySelectorAll(nameSelector);      // Name elements
    console.log(resNameArrEle.length);
    return resNameArrEle.length
  }

  let total=0,prev=-1;
  let divSel=`div[role="region"]`;
  while(prev!=total){
    prev=total;
    // await page.waitForNavigation({
    //   waitUntil: 'networkidle0',
    // });
    // await page.waitForNavigation({
    //   waitUntil: 'domcontentloaded',
    // });
    total=await page.evaluate(scrollPage,divSel,nameSelector);
    await page.waitFor(1000);    
    
    
  }
  
  console.log(total);
  

  
})();