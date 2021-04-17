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
  
  function getInfo(name,rating,address){
    let resNameArrEle=document.querySelectorAll(name);      // Name elements
    let resRatingArrEle=document.querySelectorAll(rating);  // Rating elements
    let resAddressArrEle=document.querySelectorAll(address);// Address elements

    let resNameDetailsArr=[];   // Restaurant Details
    for(let i=0;i<resNameArrEle.length;i++){
      let restaurantName=resNameArrEle[i].innerText;
      let restaurantRating=resRatingArrEle[i].innerText.split(" ")[0];  // split to get only rating
      let restaurantAddress=resAddressArrEle[i].innerText;

      let details={
        name:restaurantName,
        rating:restaurantRating,
        address:restaurantAddress
      }
      resNameDetailsArr.push(details);
    }

    return resNameDetailsArr; // Array of Objects
  }

  // Get Restaurant Info from DOM
  let resDetails=await page.evaluate(getInfo,nameSelector,ratingSelector,addressSelector);
  console.log(resDetails);

  
})();