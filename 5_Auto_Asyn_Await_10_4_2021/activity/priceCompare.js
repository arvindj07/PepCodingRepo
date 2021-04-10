let puppeteer = require("puppeteer");
let fs = require("fs");
let links = ["https://www.amazon.in", "https://www.flipkart.com", "https://paytmmall.com/"];
let pName = process.argv[2];    // take product name as input from console

console.log("Before");
(async function () {
    try {
        let browserInstance = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        });
        let AmazonDetails = await getListingFromAmazon(links[0], browserInstance, pName);
        console.table(AmazonDetails);

        let FlipkartDetails=await getListingFromFlipkart(links[1], browserInstance, pName);
        console.table(FlipkartDetails);


    } catch (err) {
        console.log(err);
    }
})();

//  product Name,url of amazon home page
// output-> top 5 matching product -> price Name print 
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
        // return Promise, resolved value of this promise will contain array returned by 'getProductNames' func
        return await gtab.evaluate(getProductNames, nameSelector, priceSelector);


    } catch (err) {
        console.log(err);
    }
}

async function waitAndClick(selector, gtab) {
    await gtab.waitForSelector(selector, { visible: true });
    let clickPromise = gtab.click(selector);
    return clickPromise;
}

function getProductNames(nameSelector, priceSelector) {
    let details = []; // Array of objects

    let productNames = document.querySelectorAll(nameSelector);
    let productPrices = document.querySelectorAll(priceSelector);  // start from idx 1

    for (let i = 0; i < 5; i++) {
        let p_name = productNames[i].innerText;
        let p_price = productPrices[i].innerText;

        details.push({
            p_name,
            p_price
        })
    }

    return details;
}

