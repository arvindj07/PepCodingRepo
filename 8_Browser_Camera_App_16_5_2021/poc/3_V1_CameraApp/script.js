let videoEle = document.querySelector("#video_element")
let videoRecorder = document.querySelector("#record_video"); // Record-Btn
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

// Click on Record-Btn
videoRecorder.addEventListener("click", function (e) {
  if (!mediaRecorder) {
    alert("Allow/Wait Permission");
    return;
  }
  if (recordState == false) {
    // Start Recording
    mediaRecorder.start();
    videoRecorder.innerHTML = "Recording...";
  } else {
    // Stop Recording
    mediaRecorder.stop();
    videoRecorder.innerHTML = "Record";
  }
  recordState = !recordState;// toggle-state
})