let fs = require("fs");
let PDFDocument = require("pdfkit");
let path = require("path");

let arr = [
  {
    "name": "SIKKA (Cafe & lounge) 25%off",
    "rating": "4.6(26)",
    "address": "Restaurant"
  },
  {
    "name": "Pipeline Cafe",
    "rating": "4.0(1,142)",
    "address": "Restaurant · 37, Second Floor, Satya Niketan, South Moti Bagh"
  },
  {
    "name": "High On Burgers",
    "rating": "3.9(139)",
    "address": "Fast Food · 213, Satyaniketan"
  }
]

// To create PDF
let filePath = path.join(__dirname, "ouput.pdf");
let pdfDoc = new PDFDocument;
pdfDoc.pipe(fs.createWriteStream(filePath));

pdfDoc.fontSize(25).font('Times-Roman').fillColor('red').text("List Of Restaurants:");
pdfDoc.moveDown(1);

pdfDoc.fontSize(10);
let counter = 1;
for (let i = 0; i < arr.length; i++) {
  // let d=JSON.stringify(arr[i]);
  let str = `${counter}.`;
  for (let key in arr[i]) {
    if (key == "name") {
      str += key + " : " + arr[i][key];
      pdfDoc.fillColor('navy').font('Helvetica-Bold').text(str);
    } else {
      str += key + " : " + arr[i][key];
      pdfDoc.fillColor('black').font('Helvetica-Bold').text(str);
    }

    str = "";
  }
  pdfDoc.moveDown(1);
  counter++;
}

pdfDoc.end();