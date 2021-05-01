let plusBtn = document.querySelector(".plusBtn_container");
let sheetList = document.querySelector(".sheets_list");

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

