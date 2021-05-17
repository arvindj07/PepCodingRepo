// Grid-Logic
let topRow = document.querySelector(".top-row");
let str = "";
for (let i = 0; i < 26; i++) {
  str += `<div class='col'>${String.fromCharCode(65 + i)}</div>`;
}
topRow.innerHTML = str;
let leftCol = document.querySelector(".left-col");
str = ""
for (let i = 0; i < 100; i++) {
  str += `<div class='left-col_box'>${i + 1}</div>`
}
leftCol.innerHTML = str;

// 2d array
let grid = document.querySelector(".grid");
str = "";
for (let i = 0; i < 100; i++) {
  str += `<div class="row">`
  for (let j = 0; j < 26; j++) {
    str += `<div class='col' rid=${i} cid=${j} contenteditable="true"></div>`
  }
  str += "</div>";
}
grid.innerHTML = str;

//*************************************************Data of Sheets */

// WorkSheetDB -> stores info of each-sheet
// SheetDB -> stores info of Each-cell in a Sheet

let workSheetDB = [];

// func to initialise Current-Sheet-DB
// func is Called when new-sheet is created
function initCurrSheetDB() {
  // Store-Initial Style of each cell in 2D Array-> SheetDB
  let sheetDB = [];

  for (let i = 0; i < 100; i++) {
    let row = [];// array of objects
    for (let j = 0; j < 26; j++) {
      // obj of each cell-> contains default style of cell
      let cell = {
        // bg,fg
        bold: false,
        italic: false,
        underline: false,
        fontFamily: "Arial",
        fontSize: "16",
        halign: "left",  // L,C,R
        value: "",
        children: [],
        formula: "",
      }
      row.push(cell);
    }
    sheetDB.push(row);
  }
  workSheetDB.push(sheetDB);
  console.log(workSheetDB);
}

initCurrSheetDB();  // called to create sheetDB of 1st sheet