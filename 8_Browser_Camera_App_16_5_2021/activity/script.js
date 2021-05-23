let videoEle = document.querySelector("#video_element")
let videoRecorder = document.querySelector("#record_video"); // Record-Btn
let capturebtn = document.querySelector("#capture");// Capture-btn
let timingELem = document.querySelector("#timing"); // timing-Ele
let clearObj; // setInterval- clearObj
let allFilters = document.querySelectorAll(".filter"); // get All-Filter Elements
let uiFilter = document.querySelector(".ui-filter");  // UI- Filter Container
let filterColor = ""; // current Filter-Color
let zoomInElem = document.querySelector("#plus-container");// Zoom-IN element
let zoomOutElem = document.querySelector("#minus-container");// Zoom-Out element
let zoomLevel = 1; // Zoom-Level Info
let mediaRecorder; // to handle recording
let recordState = false; // store Start/Stop state of recording
let buffer = []; // to save recording
let constraints = {
  video: true,
  audio: true
}

let promise = navigator.mediaDevices.getUserMedia(constraints);
promise
  .then(function (mediaStream) {
    // Put mediaStream In Video-Element
    videoEle.srcObject = mediaStream;
    mediaRecorder = new MediaRecorder(mediaStream);// Handle recording

    // Save Recording -> on mediaRecorder.start();
    mediaRecorder.addEventListener("dataavailable", function (e) {
      buffer.push(e.data);
    })

    // Download Recording -> on mediaRecorder.stop();
    mediaRecorder.addEventListener("stop", function (e) {
      // Download from Browser
      let blob = new Blob(buffer, { type: "video/mp4" });
      let url = window.URL.createObjectURL(blob);

      // download Btn
      let a = document.createElement("a");
      a.download = "file.mp4";
      a.href = url;
      a.click();
      buffer = [];// Clear Buffer for nxt Recording
    })
  })
  .catch(function (err) {
    console.log(err);
  })

// Video Record-Btn
videoRecorder.addEventListener("click", function (e) {
  if (!mediaRecorder) {
    alert("Allow/Wait Permission");
    return;
  }
  if (recordState == false) {
    // Start Recording
    mediaRecorder.start();
    videoRecorder.classList.add("record-animation"); // add animation
    startCounting(); // Start-Timer
  } else {
    // Stop Recording
    mediaRecorder.stop();
    videoRecorder.classList.remove("record-animation"); // remove aninmation
    stopCounting(); // Stop-Timer
  }
  recordState = !recordState;// toggle-state
})


// Capture-Btn->  Capture Image and Download it 
capturebtn.addEventListener("click", function () {
  // create a canvas element , equal to size of your video frame
  let canvas = document.createElement("canvas");
  canvas.width = videoEle.videoWidth;
  canvas.height = videoEle.videoHeight;
  let tool = canvas.getContext("2d"); // get Tool
  capturebtn.classList.add("capture-animation"); // add animation-class
  // Zoom-In/Out in Canvas
  tool.scale(zoomLevel, zoomLevel);
  // To Implement center-Zoom
  let x = (canvas.width / zoomLevel - canvas.width) / 2;
  let y = (canvas.height / zoomLevel - canvas.height) / 2;
  // draw a Image/Video-frame on that canvas
  tool.drawImage(videoEle, x, y);
  // draw Filter over Image on Canvas
  if (filterColor) {
    tool.fillStyle = filterColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);
  }
  // convert Canvas to Link 
  let link = canvas.toDataURL();
  // Download 
  let anchor = document.createElement("a");
  anchor.href = link;
  anchor.download = "file.png";
  anchor.click();
  // remove link and canvas
  anchor.remove();
  canvas.remove();

  // I need one second of that animation, so remove animation-class after 1 sec using setTimeout
  setTimeout(function () {
    capturebtn.classList.remove("capture-animation");
  }, 1000)
})

// Start-Timer
function startCounting() {
  timingELem.classList.add("timing-active"); // make Timer-element visible
  let timeCount = 0;
  // Update Timer-Ele.innertext after every 1sec using setInterval()
  clearObj = setInterval(function () {
    let seconds = timeCount % 60;
    seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    let minutes = Number.parseInt(timeCount / 60) % 60;  //  use Number.parseInt to convert Decimal to Integer
    minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    let hours = Number.parseInt(timeCount / 3600);
    hours = hours < 10 ? `0${hours}` : `${hours}`;
    timingELem.innerText = `${hours}:${minutes}:${seconds}`;
    timeCount++;
  }, 1000);
}

// Stop-Timer
function stopCounting() {
  timingELem.classList.remove("timing-active"); // make Timer-Ele invisble from pg
  timingELem.innerText = "00: 00: 00";
  clearInterval(clearObj);  // Stop setInterval()
}

// Filter Apply to UI
for (let i = 0; i < allFilters.length; i++) {
  allFilters[i].addEventListener("click", function () {
    let color = allFilters[i].style.backgroundColor
    if (color) {
      // Add filter to ui
      uiFilter.classList.add("ui-filter-active");
      uiFilter.style.backgroundColor = color;
      filterColor = color;
    } else {
      // Remove Filter From UI
      uiFilter.classList.remove("ui-filter-active");
      uiFilter.style.backgroundColor = "";
      filterColor = "";

    }
  })
}

// UI of Zoom-In
zoomInElem.addEventListener("click", function () {
  if (zoomLevel < 3) {
    zoomLevel += 0.2;
    videoEle.style.transform = `scale(${zoomLevel})`;
  } 
})
// UI of Zoom-Out
zoomOutElem.addEventListener("click", function () {
  if (zoomLevel > 1) {
    zoomLevel -= 0.2;
    videoEle.style.transform = `scale(${zoomLevel})`;
  } 
})

