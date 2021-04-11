let puppeteer = require("puppeteer");
let fs = require("fs");
// Links of 3-Sites
let links = ["https://www.amazon.in", "https://www.flipkart.com", "https://paytmmall.com/"];
let pName = process.argv[2];    // take product name as input from console

console.log("Before");
(async function () {
    try {
        // launch browser
        // browser instance
        let browserInstance = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        });
        // Get Amazon Details
        let AmazonDetailsArr = await getListingFromAmazon(links[0], browserInstance, pName);
        
        // Get Flipkart Details
        let FlipkartDetailsArr=await getListingFromFlipkart(links[1], browserInstance, pName);
        
        // Get PaytmMall Details
        let paytmArr = await getListingFromPaytm(links[2], browserInstance, pName);

        // Print all Details in table format
        console.table(AmazonDetailsArr);
        console.table(FlipkartDetailsArr);
        console.table(paytmArr);


    } catch (err) {
        console.log(err);
    }
})();

//  input->url of site, browser Instance, product Name
//  output-> top 5 matching product -> Name and Price 
async function getListingFromAmazon(link, browserInstance, pName) {

    try {
        let gtab = await browserInstance.newPage();
        await gtab.goto(link);
        await gtab.type(`#twotabsearchtextbox`, pName, { delay: 100 });
        await waitAndClick(`.nav-search-submit.nav-sprite`, gtab);  // click on search

        let nameSelector = `.a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2`;   // product-name selector
        let priceSelector = `.a-price-whole`;   // product-price selector

        // wait for selector nd then evaluate
        await gtab.waitForSelector(nameSelector);   
        await gtab.waitForSelector(priceSelector);  
        // return Promimse, resolved value of this promise will contain array returned by 'getProductNames' func
        return await gtab.evaluate(getProductNames, nameSelector, priceSelector);


    } catch (err) {
        console.log(err);
    }
}

// get Top5 Flipkart Product Details
async function getListingFromFlipkart(link, browserInstance, pName) {
    try {
        let gtab = await browserInstance.newPage();
        await gtab.goto(link);
        await waitAndClick(`button[class="_2KpZ6l _2doB4z"]`, gtab);    // click-close of pop-up
        // type product name
        await gtab.type(`input[title="Search for products, brands and more"]`, pName, { delay: 100 });  
        await waitAndClick(`button[type="submit"]`, gtab);  // click on search

        let nameSelector = `a[class="s1Q9rs"]`;     // product-name selector
        let priceSelector = `div[class="_30jeq3"]`; // product-price selector

        // wait for selector nd then evaluate
        await gtab.waitForSelector(nameSelector);
        await gtab.waitForSelector(priceSelector);
        // return Promise. resolved value of this promise will contain array returned by 'getProductNames' func
        return await gtab.evaluate(getProductNames, nameSelector, priceSelector);


    } catch (err) {
        console.log(err);
    }
}

// Sir ka code, to get Top 5 Product from PaytmMall
async function getListingFromPaytm(link, browserInstance, pName) {
    let newPage = await browserInstance.newPage();
    await newPage.goto(link);
    await newPage.type("#searchInput",pName,{ delay: 200 });
    await newPage.keyboard.press("Enter",{ delay: 200 });
    await newPage.keyboard.press("Enter");
    await newPage.waitForSelector(".UGUy", { visible: true });
    await newPage.waitForSelector("._1kMS", { visible: true });
    function consoleFn(priceSelector, pNameSelector) {
        let priceArr = document.querySelectorAll(priceSelector);
        let PName = document.querySelectorAll(pNameSelector);
        let details = [];
        for (let i = 0; i < 5; i++) {
            let price = priceArr[i].innerText;
            let Name = PName[i].innerText;
            details.push({
                price, Name
            })
        }
        return details;
    }
    return newPage.evaluate(consoleFn,
        "._1kMS",
        ".UGUy");


}

// wait nd then click the selector
async function waitAndClick(selector, gtab) {
    await gtab.waitForSelector(selector, { visible: true });
    let clickPromise = gtab.click(selector);
    return clickPromise;
}

// Get product Names and Price using DOM
function getProductNames(nameSelector, priceSelector) {
    let details = []; // Array of objects

    let productNames = document.querySelectorAll(nameSelector); // product name element
    let productPrices = document.querySelectorAll(priceSelector);  // product price element

    // get Details of Top-5 Products
    for (let i = 0; i < 5; i++) {
        let p_name = productNames[i].innerText;     // product name
        let p_price = productPrices[i].innerText;   // product price

        // store as array of object
        details.push({
            p_name,
            p_price
        })
    }

    return details; // return array of product details
}

