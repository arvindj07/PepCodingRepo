let plusBtn = document.querySelector(".plusBtn_container");
let sheetList = document.querySelector(".sheets_list");
let allCells = document.querySelectorAll(".grid .col");
let addressBox = document.querySelector(".address_box");
// Align-Buttons
let leftBtn = document.querySelector(".left");
let rightBtn = document.querySelector(".right");
let centerBtn = document.querySelector(".center");
// font-size
let fontBtn= document.querySelector(".font_size");

// Add eventListener on first Sheet
let firstSheet = document.querySelector(".sheet");
firstSheet.addEventListener("click", handleActiveSheet);

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

}

// Add eventListener to plus-button to add Sheets
plusBtn.addEventListener("click", function (e) {
  // Get Idx of Last Sheet
  let sheetsArr = document.querySelectorAll(".sheet");
  let lastSheetEle = sheetsArr[sheetsArr.length - 1];
  let idx = lastSheetEle.getAttribute("sheetIdx");
  idx = Number(idx); // conovert String to Number

  // Add new Sheet
  let newSheet = document.createElement("div");
  newSheet.setAttribute("class", "sheet");
  newSheet.setAttribute("sheetIdx", idx + 1);
  newSheet.innerText = `Sheet ${idx + 1}`;
  sheetList.appendChild(newSheet);

  // Add eventListener on new Sheet
  newSheet.addEventListener("click", handleActiveSheet);
});

// Add eventListener to all-cells
for (let i = 0; i < allCells.length; i++) {
  allCells[i].addEventListener("click", handleCell);
}

// 1st cell is clicked by-default
allCells[0].click();

// Set address of cell in Address-Box, when a cell is clicked
function handleCell(e) {
  currCell = e.currentTarget;
  let rid = Number(currCell.getAttribute("rid"));
  let cid = Number(currCell.getAttribute("cid"));
  let rowAddress = rid + 1;
  let colAddress = String.fromCharCode(cid + 65);
  let address = colAddress + rowAddress;
  addressBox.value = address;
}


// Add eventListner Alignment-Btn- i.e, L,C,R
leftBtn.addEventListener("click", alignCell);
rightBtn.addEventListener("click", alignCell);
centerBtn.addEventListener("click", alignCell);

// To set Text-align of clicked cell
function alignCell(e) {
  let alignBtn = e.currentTarget;
  // address of clicked-cell
  let address = addressBox.value;
  let { rid, cid } = getRidCidfrommAddress(address);
  let cell = document.querySelector(`div[rid="${rid}"][cid="${cid}"]`);
  let alignDirec = alignBtn.getAttribute("class");
  cell.style.textAlign = alignDirec;

}

// function to get rid and cid of cell, from address in address-box
function getRidCidfrommAddress(address) {
  // convert char to Ascii code  
  let colAddress = address.charCodeAt(0);
  let rowAddress = address.slice(1);

  let cid = colAddress - 65;
  let rid = Number(rowAddress) - 1;

  return {cid,rid};
}

// Set Font-size, on change->event
fontBtn.addEventListener("change",setFontSize);

function setFontSize(e){
  let fontSelectBtn=e.currentTarget;
  let fontSize=fontSelectBtn.value;
  // address of clicked-cell
  let address = addressBox.value;
  let { rid, cid } = getRidCidfrommAddress(address);
  let cell = document.querySelector(`div[rid="${rid}"][cid="${cid}"]`);
  cell.style.fontSize=fontSize+"px";

}


