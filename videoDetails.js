const apiKey= "AIzaSyCU2iWox3vmpH7OD7iRoidj2N0vnw2PQAk";
const url = "https://www.googleapis.com/youtube/v3/commentThreads";
const commentsContainer = document.getElementById("comments-container");

window.addEventListener("load", () => {
  let videoId = document.cookie.split("=")[1];

  if (YT) {
    new YT.Player("video-placeholder", {
      height: "600",
      width: "1050",
      videoId,
    });

    loadComments(videoId);
  }
});

async function loadComments(videoId) {
  let endpoint = `${url}?key=${apiKey}&videoId=${videoId}&maxResults=10&part=snippet`;
  console.log(videoId);
  const response = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?key=AIzaSyCU2iWox3vmpH7OD7iRoidj2N0vnw2PQAk&videoId=${videoId}&maxResults=10&part=snippet`).then(res=> res.json());
  // const result = response.json();
  console.log(response);
  response.items.forEach((item) => {
    const repliesCount = item.snippet.totalReplyCount;
    const {
      authorDisplayName,
      textDisplay,
      likeCount,
      authorProfileImageUrl: profileUrl,
      publishedAt,
    } = item.snippet.topLevelComment.snippet;

    const div = document.createElement("div");
    div.className = "comment";
    div.innerHTML = `
    <img src="${profileUrl}" class="author-profile" alt="author profile" />
    <b>${authorDisplayName}</b>
    <p>${textDisplay}</p>`;

    commentsContainer.appendChild(div);
  });
}