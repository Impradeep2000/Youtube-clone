const apiKey= "AIzaSyCU2iWox3vmpH7OD7iRoidj2N0vnw2PQAk";
const baseUrl = "https://www.googleapis.com/youtube/v3";

const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const container = document.getElementById("container");

function calculateTheTimeGap(publishTime) {
    let publishDate = new Date(publishTime);
    let currentDate = new Date();
  
    let secondsGap = (currentDate.getTime() - publishDate.getTime()) / 1000;
  
    const secondsPerDay = 24 * 60 * 60;
    const secondsPerWeek = 7 * secondsPerDay;
    const secondsPerMonth = 30 * secondsPerDay;
    const secondsPerYear = 365 * secondsPerDay;
  
    if (secondsGap < secondsPerDay) {
      return `${Math.ceil(secondsGap / (60 * 60))}hrs ago`;
    }
    if (secondsGap < secondsPerWeek) {
      return `${Math.ceil(secondsGap / secondsPerWeek)} weeks ago`;
    }
    if (secondsGap < secondsPerMonth) {
      return `${Math.ceil(secondsGap / secondsPerMonth)} months ago`;
    }
  
    return `${Math.ceil(secondsGap / secondsPerYear)} years ago`;
  }

  function viewsCount(views){
    const viewCount = parseInt(views);

    if (viewCount >= 1000000) {
        const mViews = Math.floor(viewCount / 1000000);
        return `${mViews}M`;
    } else if (viewCount >= 1000) {
        const kViews = Math.floor(viewCount / 1000);
        return `${kViews}k`;
    } else {
        return views;
    }
  }

function navigateToVideoDetails(videoId) {
    document.cookie = `id=${videoId}; path=/videoDetails.html`;
    window.location.href = "http://127.0.0.1:5500/videoDetails.html";
  }
 
function renderVideosOntoUI(videosList) {
    // videosList will be an array of video objects.
    container.innerHTML = "";
    videosList.forEach((video) => {
      const videoContainer = document.createElement("div");
      videoContainer.className = "video";
      videoContainer.innerHTML = `
      <div class="thumbnail">
            <img src="${video.snippet.thumbnails.high.url}" class="thumbnail-img" alt="vid">
      </div>
      <div class="bottom-container">
            <div class="logo-container">
                 <img src="${video.channelLogo}" class="logo" alt="random">
            </div>
            <div class="video-details">
                <p class="title">${video.snippet.title}</p>
                <p>${video.snippet.channelTitle}</p>
                <p>${viewsCount(video.statistics.viewCount)} . ${calculateTheTimeGap(video.snippet.publishTime)}</p>
            </div>
      </div>`;
  
      videoContainer.addEventListener("click", () => {
        navigateToVideoDetails(video.id.videoId);
        // console.log(video.id.videoId);
      });
  
      container.appendChild(videoContainer);
    });
  }

async function fetchChannelLogo(channelId) {
    const endpoint = `${baseUrl}/channels?key=${apiKey}&id=${channelId}&part=snippet`;
  
    try {
      const response = await fetch(endpoint);
      const result = await response.json();
      return result.items[0].snippet.thumbnails.high.url;
    } catch (error) {
      alert("Failed to load channel logo for ", channelId);
    }
  }

async function getVideoStatistics(videoId) {
    // https://www.googleapis.com/youtube/v3/videos?key=AIzaSyDvo2p4xMEI3GC-PWH02_0OAIN1h88k4rE&part=statistics
    const endpoint = `${baseUrl}/videos?key=${apiKey}&part=statistics&id=${videoId}`;
    try {
      const response = await fetch(endpoint);
      const result = await response.json();
      return result.items[0].statistics;
    } catch (error) {
      alert("Failed to fetch Statistics for ", videoId);
    }
  }

async function fetchSearchResults(searchString) {
    // searchString will the input entered by the user
    const endpoint = `${baseUrl}/search?key=${apiKey}&q=${searchString}&part=snippet&maxResults=20`;
    try {
      const response = await fetch(endpoint);
      const result = await response.json();
  
      for (let i = 0; i < result.items.length; i++) {
        let videoId = result.items[i].id.videoId;
        let channelId = result.items[i].snippet.channelId;
  
        let statistics = await getVideoStatistics(videoId);
        let channelLogo = await fetchChannelLogo(channelId);
  
        result.items[i].statistics = statistics;
        result.items[i].channelLogo = channelLogo;
      }
  
      renderVideosOntoUI(result.items); // 2
    } catch (error) {
      alert("Some error occured");
    }
  }

searchButton.addEventListener("click", () => {
    const searchValue = searchInput.value;
    fetchSearchResults(searchValue);
  });


  async function fetchRandomData() {
    try {
      const apiUrl = `${baseUrl}/videos?part=snippet&part=statistics&chart=mostPopular&regionCode=IN&key=${apiKey}&maxResults=20`;

      const response = await fetch(apiUrl).then(res=> {
        if(res.ok)
        {return res.json()
        }throw new Error(`HTTP error! Status: ${response.status}`);});
      console.log(response);

      renderVideosOntoUI(response.items);

    } catch (error) {
      console.error("Fetch error:", error);
    }
  }
  
  window.addEventListener("load",fetchRandomData);
  