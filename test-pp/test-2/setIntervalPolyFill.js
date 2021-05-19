function cb() {
  console.log("i will be called after 2sec");
}

// // PolyFill-> Stage-1 .i.e, no clearInterval()
// function myInterval(fn, timeout) {
//   function larger() {
//     fn();
//     setTimeout(larger, timeout);
//   }
//   setTimeout(larger, timeout);
// }
// // Call
// myInterval(cb, 2000);

// PolyFill-> Stage-2 .i.e, including clearInterval()
function myInterval(fn, timeout) {
  let clearObj = {
    shallIRun: true,
  }
  function larger() {
    if (clearObj.shallIRun == false)
      return;
    fn();
    setTimeout(larger, timeout);
  }
  if (clearObj.shallIRun == true)
    setTimeout(larger, timeout);

  return clearObj;
}

// PolyFill of ClearInterval
function myClearInterval(clearObj){
  clearObj.shallIRun=false;
}
// Call
let clearMe=myInterval(cb, 2000);

setTimeout(function(){
  // Stop calls
  myClearInterval(clearMe);
  console.log("Cleared");
},10000);
