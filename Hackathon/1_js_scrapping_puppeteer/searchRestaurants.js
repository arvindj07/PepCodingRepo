let fs = require("fs");
let puppeteer = require("puppeteer");
let PDFDocument = require("pdfkit");
let path = require("path");
let nodemailer= require("nodemailer");

let place = process.argv[2];

// Main-code
(async function () {
  let browserInstance = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"]
  });

  let page = await browserInstance.newPage();
  await page.goto("https://www.google.com/maps"); // gogle-maps

  await page.waitFor(2000);
  // Search- Restaurant Nearby
  let restaurant = "restaurants near " + place;
  await page.waitForSelector(`input[aria-label="Search Google Maps"]`, { visible: true });
  await page.type(`input[aria-label="Search Google Maps"]`, restaurant);
  await page.keyboard.press('Enter');

  // Selectors- for Restaurant Info
  let nameSelector = `div.tYZdQJV9xeh__title-container`;
  let ratingSelector = `div.tYZdQJV9xeh__star-rating-container`;
  let addressSelector = `div[class="tYZdQJV9xeh__info-line"]>div[jsinstance="0"]`;

  await page.waitForSelector(nameSelector, { visible: true });
  await page.waitForSelector(ratingSelector, { visible: true });
  await page.waitForSelector(addressSelector, { visible: true });

  function scrollPage(leftPane, nameSelector) {
    let ele = document.querySelectorAll(leftPane);  // left-Pane Element
    ele[1].scrollTop = ele[1].scrollHeight;
    let resNameArrEle = document.querySelectorAll(nameSelector);      // Name elements
    console.log(resNameArrEle.length);
    return resNameArrEle.length
  }

  let total = 0, prev = -1;
  let leftPaneSelector = `div[role="region"]`;
  while (prev != total) {
    prev = total;
    total = await page.evaluate(scrollPage, leftPaneSelector, nameSelector);
    await page.waitFor(1000);
  }


  function getInfo(name, rating, address) {
    let resNameArrEle = document.querySelectorAll(name);      // Name elements
    let resRatingArrEle = document.querySelectorAll(rating);  // Rating elements
    let resAddressArrEle = document.querySelectorAll(address);// Address elements

    let resNameDetailsArr = [];   // Restaurant Details
    for (let i = 0; i < resNameArrEle.length; i++) {
      let restaurantName = resNameArrEle[i].innerText;
      let restaurantRating = resRatingArrEle[i].innerText.split(" ")[0];  // split to get only rating
      let restaurantAddress = resAddressArrEle[i].innerText;

      let details = {
        name: restaurantName,
        rating: restaurantRating,
        address: restaurantAddress
      }
      resNameDetailsArr.push(details);
    }

    return resNameDetailsArr; // Array of Objects
  }

  // Get Restaurant Info from DOM
  let resDetails = await page.evaluate(getInfo, nameSelector, ratingSelector, addressSelector);
  console.table(resDetails);

  let data = JSON.stringify(resDetails);

  // To create PDF
  let filePath = path.join(__dirname, place + ".pdf");
  let pdfDoc = new PDFDocument;
  pdfDoc.pipe(fs.createWriteStream(filePath));
  pdfDoc.text(data);
  pdfDoc.end();

  // To create json file
  createFile(place);
  let filePath2 = path.join(__dirname, place + ".json");
  fs.writeFileSync(filePath2, data);

  // Send Email, with Attachments(PDF)
  //step-1
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'heathledgerakajoker@gmail.com',
      pass: 'ledger2008'
    }
  });

  //step-2
  let mailOptions = {
    from: 'heathledgerakajoker@gmail.com',
    to: 'tommycruise1997@gmail.com',
    subject: 'TesTing and Test',
    text: 'Mail Send',
    attachments: [
      { filename:  `${place}.pdf`, path: filePath }
    ]
  }

  //step-3
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("error " + err);
    } else {
      console.log("Mail sent successfully!!");
    }
  })


})();

// Create-File
function createFile(place) {
  let pathOfFile = path.join(__dirname, place + ".json");  // create json file for Repo
  if (fs.existsSync(pathOfFile) == false) {
    let createStream = fs.createWriteStream(pathOfFile);
    createStream.end();
  }
}