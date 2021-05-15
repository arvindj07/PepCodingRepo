let plusBtn = document.querySelector(".plusBtn_container");
let sheetList = document.querySelector(".sheets_list");
let allCells = document.querySelectorAll(".grid .col");
let addressBox = document.querySelector(".address_box");
// SheetDB of 1st-sheet
let sheetDB = workSheetDB[0];
// Align-Buttons
let leftBtn = document.querySelector(".left");
let rightBtn = document.querySelector(".right");
let centerBtn = document.querySelector(".center");
// font-size
let fontBtn = document.querySelector(".font_size");
// font-family
let fontFamilyBtn = document.querySelector(".font_family");
// background-color
let bgColor = document.querySelector(".bg_color");
// foreground-color
let fgColor = document.querySelector(".fg_color");
// BUI buttons
let boldBtn = document.querySelector(".bold");
let italicBtn = document.querySelector(".italic");
let underlineBtn = document.querySelector(".underline");
// Formaula-Container
let formulaInput = document.querySelector(".formula_box");


// **********************************************************
//---------------- Sheets-Container

// Add eventListener on first Sheet
let firstSheet = document.querySelector(".sheet");
firstSheet.addEventListener("click", handleActiveSheet);

// event at Plus-button to Add-Sheets
plusBtn.addEventListener("click", function (e) {
  // Get Idx of Last Sheet
  let sheetsArr = document.querySelectorAll(".sheet");
  let lastSheetEle = sheetsArr[sheetsArr.length - 1];
  let idx = lastSheetEle.getAttribute("sheetIdx");
  idx = Number(idx); // convert String to Number
  let sheetNo = idx + 1;

  // Add new Sheet
  let newSheet = document.createElement("div");
  newSheet.setAttribute("class", "sheet");
  newSheet.setAttribute("sheetIdx", idx + 1);
  newSheet.innerText = `Sheet ${sheetNo + 1}`;
  sheetList.appendChild(newSheet);

  // Create new-SheetDB for New-Sheet
  initCurrSheetDB();

  // Clear all Cells of New-Sheet
  initUI();

  // set SheetDB of Curr-Sheet
  sheetDB = workSheetDB[idx + 1]

  // Set Active-Sheet
  sheetsArr = document.querySelectorAll(".sheet");
  sheetsArr.forEach((sheet) => {
    sheet.classList.remove("active_sheet");
  })
  sheetsArr[sheetsArr.length - 1].classList.add("active_sheet");

  // Add eventListener on new Sheet
  newSheet.addEventListener("click", handleActiveSheet);
});

// Initialize UI of sheet
function initUI() {
  // Reset Styles of All-cells and Empty content
  for (let i = 0; i < allCells.length; i++) {
    // styles
    allCells[i].style.fontWeight = "normal";
    allCells[i].style.fontStyle = "normal";
    allCells[i].style.textDecoration = "none";
    allCells[i].style.textAlign = "left";
    allCells[i].style.fontFamily = "Arial";
    allCells[i].style.fontSize = "16px";
    // bg nd fg prop
    //content
    allCells[i].innerText = "";
  }
}

// set clicked-sheet as active_sheet
function handleActiveSheet(e) {
  let mySheet = e.currentTarget;// clicked-sheet
  let sheetsArr = document.querySelectorAll(".sheet");
  // remove active_sheet class from all Sheets
  sheetsArr.forEach((sheet) => {
    sheet.classList.remove("active_sheet");
  })

  // add active_sheet class to current-Sheet
  if (!mySheet.classList[1]) {
    mySheet.classList.add("active_sheet");
  }

  // Get SheetDB of clicked-Sheet
  let idx = mySheet.getAttribute("sheetIdx");
  sheetDB = workSheetDB[idx];

  // Set data of clicked-Sheet
  setUI(sheetDB);


}

// Set Data of Clicked-Sheet
function setUI(sheetDB) {
  for (let i = 0; i < sheetDB.length; i++) {
    for (let j = 0; j < sheetDB[i].length; j++) {
      // get cell
      let cell = document.querySelector(`div[rid="${i}"][cid="${j}"]`);
      // cell properties
      let { bold, italic, underline, fontFamily, fontSize, halign, value } = sheetDB[i][j];
      cell.style.fontWeight = bold == true ? "bold" : "normal";
      cell.style.fontStyle = italic == true ? "italic" : "normal";
      cell.style.textDecoration = underline == true ? "underline" : "none";
      cell.style.textAlign = halign;
      cell.style.fontFamily = fontFamily;
      cell.style.fontSize = fontSize;
      // bg nd fg prop
      //content
      cell.innerText = value;

    }
  }
}

// **********************************************************
//------------------------ Cell-Functionality and Set Address-Box

// Add Click-eventListener to all-cells
for (let i = 0; i < allCells.length; i++) {
  allCells[i].addEventListener("click", handleCell);
}

// 1st cell is clicked by-default
allCells[0].click();

// Handle all Functionality on cell-Click
function handleCell(e) {
  // Set Address of cell in Address-Box, when a cell is clicked  
  let currCell = e.currentTarget;
  let rid = Number(currCell.getAttribute("rid"));
  let cid = Number(currCell.getAttribute("cid"));
  let rowAddress = rid + 1;
  let colAddress = String.fromCharCode(cid + 65);
  let address = colAddress + rowAddress;
  addressBox.value = address;

  // Initially,remove All-previously set Styles-> by removing active-state
  // Align-Btns
  leftBtn.classList.remove("active-btn");
  rightBtn.classList.remove("active-btn");
  centerBtn.classList.remove("active-btn");
  // BUI button
  boldBtn.classList.remove("active-btn");
  italicBtn.classList.remove("active-btn");
  underlineBtn.classList.remove("active-btn");

  // Now, Set Styles of clicked-Cell
  // using SheetDB(2d-arr)-> set Properties of clicked-cell
  let cellObj = sheetDB[rid][cid];
  // Set L,C,R -> halign Property
  if (cellObj.halign == "left") {
    leftBtn.classList.add("active-btn");
  }
  else if (cellObj.halign == "right") {
    rightBtn.classList.add("active-btn");
  }
  else if (cellObj.halign == "center") {
    centerBtn.classList.add("active-btn");
  }
  // Set BUI -> Style Prop
  if (cellObj.bold == true) {
    boldBtn.classList.add("active-btn");
  }
  if (cellObj.italic == true) {
    italicBtn.classList.add("active-btn");
  }
  if (cellObj.underline == true) {
    underlineBtn.classList.add("active-btn");
  }

  // Set Formula-Box
  if (cellObj.formula != "") {
    formulaInput.value = cellObj.formula;
  } else {
    formulaInput.value = "";
  }

}

// **********************************************************
//------------------------Menu-Container(Formatting)

// Add eventListner Alignment-Btn- i.e, L,C,R
leftBtn.addEventListener("click", alignCell);
rightBtn.addEventListener("click", alignCell);
centerBtn.addEventListener("click", alignCell);

// To set Text-align of clicked cell
function alignCell(e) {
  let alignBtn = e.currentTarget;
  // address of clicked-cell
  let address = addressBox.value;
  let { rid, cid } = getRidCidfromAddress(address);
  let cell = document.querySelector(`div[rid="${rid}"][cid="${cid}"]`);
  let alignDirec = alignBtn.getAttribute("class");
  cell.style.textAlign = alignDirec;

  // 1st , remove active-states from all L,C,R btns
  leftBtn.classList.remove("active-btn");
  rightBtn.classList.remove("active-btn");
  centerBtn.classList.remove("active-btn");

  // Set Active-State of L,C,R btn
  if (alignDirec == "left") {
    leftBtn.classList.add("active-btn");
  }
  else if (alignDirec == "right") {
    rightBtn.classList.add("active-btn");
  }
  else if (alignDirec == "center") {
    centerBtn.classList.add("active-btn");
  }

  // Update Style in SheetDB- 2D Array
  let cellObj = sheetDB[rid][cid];
  cellObj.halign = alignDirec;

}

// To Set Font-size, on change->event
fontBtn.addEventListener("change", setFontSize);
//Set Font-size
function setFontSize(e) {
  let fontSelectBtn = e.currentTarget;
  let fontSize = fontSelectBtn.value;
  // address of clicked-cell
  let address = addressBox.value;
  let { rid, cid } = getRidCidfromAddress(address);
  let cell = document.querySelector(`div[rid="${rid}"][cid="${cid}"]`);
  cell.style.fontSize = fontSize + "px";

}

// To Set Font-family on change->event
fontFamilyBtn.addEventListener("change", setFontFamily);
//Set Font-family
function setFontFamily(e) {
  // get font-family
  let fontFamilyBtn = e.currentTarget;
  let fontFamily = fontFamilyBtn.value;
  let address = addressBox.value;
  let { rid, cid } = getRidCidfromAddress(address);
  let cell = document.querySelector(`div[rid="${rid}"][cid="${cid}"]`);
  // set font-family
  cell.style.fontFamily = fontFamily;
}

// To Set Background Color on change->event
bgColor.addEventListener("change", setBgColor);
//Set Background Color
function setBgColor(e) {
  let bgColor = e.currentTarget;
  let color = bgColor.value;
  // address of clicked-cell
  let address = addressBox.value;
  let { rid, cid } = getRidCidfromAddress(address);
  let cell = document.querySelector(`div[rid="${rid}"][cid="${cid}"]`);
  cell.style.backgroundColor = color;
}

// To Set Foreground Color on change->event
fgColor.addEventListener("change", setFgColor);
//Set Foreground Color
function setFgColor(e) {
  let fgColor = e.currentTarget;
  let color = fgColor.value;
  // address of clicked-cell
  let address = addressBox.value;
  let { rid, cid } = getRidCidfromAddress(address);
  let cell = document.querySelector(`div[rid="${rid}"][cid="${cid}"]`);
  cell.style.color = color;
}

// addEventListener to B,U,I buttons
boldBtn.addEventListener("click", setBUI);
italicBtn.addEventListener("click", setBUI);
underlineBtn.addEventListener("click", setBUI);

// Set B,U,I of font
function setBUI(e) {
  let buiBtn = e.currentTarget;
  // get style value i.e, bold,underline or italics at 0th-class
  let fstyle = buiBtn.classList[0];
  // address of clicked-cell
  let address = addressBox.value;
  let { rid, cid } = getRidCidfromAddress(address);
  let cell = document.querySelector(`div[rid="${rid}"][cid="${cid}"]`);

  // To check State of BUI-Btns
  let isActive = buiBtn.classList.contains("active-btn");
  // get cell Property Obj-> from sheetDB
  let cellObj = sheetDB[rid][cid];

  // set Style and Store it in sheetDB-> 2D Array
  if (fstyle == "bold") {
    // bold
    // check state to toggle Bold-Btn
    if (isActive == false) {
      cell.style.fontWeight = fstyle;
      buiBtn.classList.add("active-btn");
      // update SheetDB
      cellObj.bold = true;
    } else {
      cell.style.fontWeight = "normal";
      buiBtn.classList.remove("active-btn");
      // update SheetDB
      cellObj.bold = false;
    }
  } else if (fstyle == "italic") {
    // italic
    if (isActive == false) {
      cell.style.fontStyle = fstyle;
      buiBtn.classList.add("active-btn");
      cellObj.italic = true;
    } else {
      cell.style.fontStyle = "normal";
      buiBtn.classList.remove("active-btn");
      cellObj.italic = false;
    }
  } else if (fstyle == "underline") {
    // underline
    if (isActive == false) {
      cell.style.textDecoration = fstyle;
      buiBtn.classList.add("active-btn");
      cellObj.underline = true;
    } else {
      cell.style.textDecoration = "none";
      buiBtn.classList.remove("active-btn");
      cellObj.underline = false;
    }
  }
}

// **********************************************************
//------------------------Formula Code

// To Store Cell-value in SheetDB
for (let i = 0; i < allCells.length; i++) {
  // event-> keyup on all-cells
  allCells[i].addEventListener("keyup", getCellValue);
}

// Handles 1. Value->Value and 2. Formula->Value
// Get inserted value at clicked-Cell and Set in SheetDB
function getCellValue(e) {
  // address of clicked-cell, on which you are entering value
  let address = addressBox.value;
  let { rid, cid } = getRidCidfromAddress(address);
  let cell = document.querySelector(`div[rid="${rid}"][cid="${cid}"]`);
  let cellObj = sheetDB[rid][cid];

  // set Value in SheetDB
  cellObj.value = cell.innerText;
  // Handle Formula->Value Operation
  if (cellObj.formula != "") {
    // Remove Formula
    removeFormula(cellObj, address);
  }
  // Re-Evaluate Children
  changeChildren(cellObj);

}

// Re-Evaluate Children
function changeChildren(cellObject) {
  // children of Parent-Cell
  let childrens = cellObject.children;
  for (let i = 0; i < childrens.length; i++) {
    let chAddress = childrens[i];
    // children's rid,cid Obj
    let chRICIObj = getRidCidfromAddress(chAddress);
    let chObj = sheetDB[chRICIObj.rid][chRICIObj.cid];
    let formula = chObj.formula;
    // Evaluate Children
    let evaluatedValue = evaluateFormula(formula);
    // Update Children UI and DB
    setUIByFormula(evaluatedValue, chRICIObj.rid, chRICIObj.cid);
    chObj.value = evaluatedValue;
    // Recursive-call to its children
    changeChildren(chObj);
  }
}

//Remove formula and Remove yourself from Parent's Children-Array
function removeFormula(cellObject, address) {
  let formula = cellObject.formula;
  let formulaTokens = formula.split(" ");
  // Find Parent-Obj using formula
  for (let i = 0; i < formulaTokens.length; i++) {
    let firstCharOfToken = formulaTokens[i].charCodeAt(0);
    if (firstCharOfToken >= 65 && firstCharOfToken <= 90) {
      let parentRIdCid = getRidCidfromAddress(formulaTokens[i]);
      // Parent
      let parentCellObject = sheetDB[parentRIdCid.rid][parentRIdCid.cid];
      let childrens = parentCellObject.children;
      let idx = childrens.indexOf(address);
      // Remove Itself from Parent's Children-Array
      childrens.splice(idx, 1);
    }
  }
  // Remove Formula ->DB
  cellObject.formula = "";

}

// Set Formula for a clicked-Cell
formulaInput.addEventListener("keydown", formulaIdentify);

// Handles 3.Value->Formula,  4.Formula->Formula
// Get Formula, evaluate, UI change
function formulaIdentify(e) {
  // clicked-cell address
  let address = addressBox.value;
  let { rid, cid } = getRidCidfromAddress(address);
  let formulaInput = e.currentTarget;
  if (e.key == "Enter" && formulaInput.value != "") {
    // get formula
    let Newformula = formulaInput.value;
    let cellObj = sheetDB[rid][cid];
    // Formula->Formula (Operation)
    let prevFormula = cellObj.formula;
    if (prevFormula != "" && prevFormula != Newformula) {
      // remove Previous-Formula
      removeFormula(cellObj, address);
    }
    // evaluate-formula
    let evaluatedValue = evaluateFormula(Newformula);
    // UI Change
    setUIByFormula(evaluatedValue, rid, cid);
    // Update DB and Set Parent's ChildArray
    setContentInDB(evaluatedValue, Newformula, rid, cid, address);
    // Re-Evaluate Children
    changeChildren(cellObj);
  }
}

// evaluate Given-Formula
function evaluateFormula(formula) {
  // formula-> "( A1 + A2 )"
  // split
  // [(, A1, +, A2,)]
  let formulaTokens = formula.split(" ");
  for (let i = 0; i < formulaTokens.length; i++) {
    let firstCharOfToken = formulaTokens[i].charCodeAt(0);
    // convert cell to cell-value ,ie, A1 -> 10
    if (firstCharOfToken >= 65 && firstCharOfToken <= 90) {
      let { rid, cid } = getRidCidfromAddress(formulaTokens[i]);
      let cellObject = sheetDB[rid][cid];
      let { value } = cellObject; // get cell-value
      // Replace ( A1 + A2) -> ( 10 + 20 )
      formula = formula.replace(formulaTokens[i], value);
    }
  }
  // infix evaluation-code use krna instead of eval
  let ans = eval(formula);
  return ans;

}

// On setting Formula, Set UI of cell
function setUIByFormula(value, rid, cid) {
  // set cell-value
  let cell = document.querySelector(`.col[rid="${rid}"][cid="${cid}"]`);
  cell.innerText = value;
}

// Update DB and Update Parent's Children Array
function setContentInDB(value, formula, rid, cid, address) {
  // Set Formula, Value in DB
  let cellObject = sheetDB[rid][cid];
  cellObject.value = value;
  cellObject.formula = formula;
  let formulaTokens = formula.split(" ");
  // Update Parent's Children-Arr using formula-tokens
  for (let i = 0; i < formulaTokens.length; i++) {
    let firstCharOfToken = formulaTokens[i].charCodeAt(0);
    // check for Parent-Cell
    if (firstCharOfToken >= 65 && firstCharOfToken <= 90) {
      let parentRIdCid = getRidCidfromAddress(formulaTokens[i]);
      let cellObject = sheetDB[parentRIdCid.rid][parentRIdCid.cid];
      //  Update Parent's Children-Arr
      cellObject.children.push(address)
    }
  }
}

// **********************************************************
//------------------------Handle Styling of Grid

// Height Change in Cells-> Set Left-Col height
for (let i = 0; i < allCells.length; i++) {
  allCells[i].addEventListener("keydown", changeCellHeight);
}

// Set Left-Col height to Cell-Height
function changeCellHeight(e) {
  let address = addressBox.value;
  let { rid, cid } = getRidCidfromAddress(address);
  // get-height of Current cell
  let currCell = e.currentTarget;
  let obj = currCell.getBoundingClientRect();
  let height = obj.height;
  // Set height of Left-Col -> Corresponding to cell-height
  let leftCol = document.querySelectorAll(".left-col .left-col_box")[rid];
  leftCol.style.height = height + "px";
}

// Handle Scroll On Grid
let gridContainer = document.querySelector(".grid_container");
gridContainer.addEventListener("scroll", handleGridScroll);

// Handle Sticky of Top-Row and Left-Col
function handleGridScroll(e) {
  let gridContainer=e.currentTarget;
  // Get top and left Coordinates of Grid during each-Scroll
  let top = gridContainer.scrollTop;
  let left = gridContainer.scrollLeft;
  // Set Top-Row to Top-Coordinate of Grid
  topRow.style.top = top + "px";
  // Set Left-Col to Left-Coordinate of Grid
  leftCol.style.left = left + "px";
}

// **********************************************************
//------------------------Helper Function

// function to get rid and cid of cell, from address in address-box
function getRidCidfromAddress(address) {
  // convert char to Ascii code  
  let colAddress = address.charCodeAt(0);
  let rowAddress = address.slice(1);

  let cid = colAddress - 65;
  let rid = Number(rowAddress) - 1;

  return { cid, rid };
}

