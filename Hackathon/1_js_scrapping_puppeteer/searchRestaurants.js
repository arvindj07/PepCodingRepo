let fs = require("fs");
let puppeteer = require("puppeteer");
let PDFDocument = require("pdfkit");
let path = require("path");
let nodemailer = require("nodemailer");

let {auth_email,password}= require("./secret");

let place = process.argv[2];
let email = process.argv[3];

// Main-code
(async function () {
  // Browser-instance
  let browserInstance = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"]
  });

  // Page-Instance
  let page = await browserInstance.newPage();
  await page.goto("https://www.google.com/maps"); // google-maps
  await page.waitFor(2000);

  // Search- Restaurant 
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

  // ScrollPage
  let total = 0, prev = -1;
  let leftPaneSelector = `div[role="region"]`;
  while (prev != total) {
    prev = total;
    total = await page.evaluate(scrollPage, leftPaneSelector, nameSelector);
    await page.waitFor(1000);
  }


  // Get Restaurant Info from DOM
  let resDetails = await page.evaluate(getInfo, nameSelector, ratingSelector, addressSelector);
  console.table(resDetails);


  // To create PDF
  let filePath = path.join(__dirname, place + ".pdf");
  createPDF(place, resDetails);

  // Send Email, with Attachments(PDF)
  sendMail(email, place, filePath);

})();

// Scroll-Page
function scrollPage(leftPane, nameSelector) {
  let ele = document.querySelectorAll(leftPane);  // left-Pane Element
  ele[1].scrollTop = ele[1].scrollHeight;
  let resNameArrEle = document.querySelectorAll(nameSelector);      // Name elements
  console.log(resNameArrEle.length);
  return resNameArrEle.length
}

// Get Info Of Restaurants
function getInfo(name, rating, address) {
  let resNameArrEle = document.querySelectorAll(name);      // Name elements
  let resRatingArrEle = document.querySelectorAll(rating);  // Rating elements
  let resAddressArrEle = document.querySelectorAll(address);// Address elements

  let resNameDetailsArr = [];   // Restaurant Details
  for (let i = 0; i < resNameArrEle.length; i++) {
    let restaurantName = resNameArrEle[i] == undefined ? "" : resNameArrEle[i].innerText;
    let restaurantRating = resRatingArrEle[i] == undefined ? "" : resRatingArrEle[i].innerText.split(" ")[0];  // split to get only rating
    let restaurantAddress = resAddressArrEle[i] == undefined ? "" : resAddressArrEle[i].innerText;

    let details = {
      Restaurant: restaurantName,
      Rating: restaurantRating,
      Address: restaurantAddress
    }
    resNameDetailsArr.push(details);
  }

  return resNameDetailsArr; // Array of Objects
}

// Create PDF
function createPDF(place, resDetails) {
  let filePath = path.join(__dirname, place + ".pdf");
  let pdfDoc = new PDFDocument;
  pdfDoc.pipe(fs.createWriteStream(filePath));

  pdfDoc.fontSize(25).font('Times-Roman').fillColor('red').text("List Of Restaurants:");
  pdfDoc.moveDown(1);

  pdfDoc.fontSize(10);
  let counter = 1;
  for (let i = 0; i < resDetails.length; i++) {
    // let d=JSON.stringify(arr[i]);
    let str = `${counter}.`;
    for (let key in resDetails[i]) {
      if (key == "Restaurant") {
        str += key + " : " + resDetails[i][key];
        pdfDoc.fillColor('navy').font('Helvetica-Bold').text(str);
      } else {
        str += key + " : " + resDetails[i][key];
        pdfDoc.fillColor('black').font('Helvetica-Bold').text(str);
      }

      str = "";
    }
    pdfDoc.moveDown(1);
    counter++;

    if(counter==11){
      pdfDoc.addPage();
    }
  }

  pdfDoc.end();

}

// Send E-mail
function sendMail(email, place, filePath) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: auth_email,
      pass: password
    }
  });

  let mailOptions = {
    from: auth_email,
    to: email,
    subject: 'Restaurant List',
    text: `The Restaurants near ${place} has been sent , please check the attached PDF`,
    attachments: [
      { filename: `${place}.pdf`, path: filePath }
    ]
  }

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("error " + err);
    } else {
      console.log("Mail sent successfully!!");
    }
  })
}
