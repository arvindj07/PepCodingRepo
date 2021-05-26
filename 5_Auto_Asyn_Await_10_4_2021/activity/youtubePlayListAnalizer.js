let puppeteer = require("puppeteer");
let fs = require("fs");

(async function () {
  try {
    let browserInstance = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ["--start-maximized"],
    });

    let page = await browserInstance.newPage();  // gives instance of Page/Tab

    // goto youtube-Playlist link
    await page.goto("https://www.youtube.com/playlist?list=PLRBp0Fe2GpgnIh0AiYKh7o7HnYAej-5ph");

    // selector for no. of Videos nd Views
    let videoNdViewSelector = `#stats .style-scope.ytd-playlist-sidebar-primary-info-renderer`;
    await page.waitForSelector(videoNdViewSelector);
    let videosViewsArr = await page.evaluate(getVideosViews, videoNdViewSelector);  // handler func

    let videos = videosViewsArr[0];
    let views = videosViewsArr[1];
    console.log("videos->" + videos);
    console.log("views->" + views);

    // to convert video-Count from string to Number format 
    let videosCount = videos.split(" ")[0];
    videosCount = Number(videosCount);  // total no. of videos in Playlist

    // Selectors for Duration nd Title of each video
    let durationSelector = `span.style-scope.ytd-thumbnail-overlay-time-status-renderer`;
    await page.waitForSelector(durationSelector);
    let titleSelector = `a#video-title`
    await page.waitForSelector(titleSelector);

    // get total no. of videos loaded , after scrolling till bottom of page
    let pCurrentVideoCount = await scrollToBottom(page, titleSelector);
    
    // scroll down the page , till the no. of loaded videos is approx equal to total no. of videos in playlist
    while (videosCount - 50 > pCurrentVideoCount) { // -50 ka hum jugad lga rhe h, to terminate the loop
      pCurrentVideoCount = await scrollToBottom(page, titleSelector);
    }

    // Get the Title nd Duration of all Videos in Playlist after every video gets loaded, i.e, after scrolling down till bottom
    let timeDurArr = await page.evaluate(getStats, durationSelector, titleSelector);
    console.table(timeDurArr);  

  } catch (err) {
    console.log("error-> " + err);
  }
})();

// task-> get total no. of Videos nd Views of Playlist
function getVideosViews(selector) {
  let VideosViewsEle = document.querySelectorAll(selector);
  let detailsArr = [];

  let no_videos = VideosViewsEle[0].innerText;
  let no_views = VideosViewsEle[1].innerText;
  detailsArr.push(no_videos, no_views);

  return detailsArr;
}

// task-> to get the Title and Duration of All the Videos in Playlist, after Scroll till bottom
// return details in the form of array of objects
function getStats(durationSelector, titleSelector) {
  let durationEleArr = document.querySelectorAll(durationSelector);
  let titleEleArr = document.querySelectorAll(titleSelector);
  let detailsArr = [];  // array of objects,object stores detail of each video i.e., title nd duration

  for (let i = 0; i < durationEleArr.length; i++) {
    let duration = durationEleArr[i].innerText;
    let title = titleEleArr[i].innerText;
    detailsArr.push({
      duration,
      title
    });
  }

  return detailsArr;  // return array
}

// task-> to scroll till bottom of a Page, and return total no. of videos/titles loaded
async function scrollToBottom(page, title) {

  // scroll-to-bottom nd return total no. of videos/titles loaded (Done inside DOM)
  function getLengthConsoleFn(title) {
    window.scrollBy(0, window.innerHeight); // scroll-window till bottom
    let titleElemArr = document.querySelectorAll(title);  // select all video-titles loaded
    
    return titleElemArr.length; // return the length, ie, total no. of videos loaded
  }

  return page.evaluate(getLengthConsoleFn, title);
}