const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsTimeoutMovement = null;
let volumeValue = 0.5
video.volume = volumeValue;


const handlePlayClick = (e) => {
    //if the video playing, pause it
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    //else play the video
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
} 


const handleMuteClick = (e) => {
    if (video.muted) {
        video.muted = false;
        video.volume = volumeValue;
    } else {
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? "Unmute" : "Mute";
    volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
    const {target: {value}} = event;
    if (video.muted) {
        video.mute=false
        muteBtn.innerText="Mute"
    }
    volumeValue = value;
    video.volume = value;
    
    if (Number(value) === 0) {
        muteBtn.innerText = "Unmute";
        video.muted = true;
    } else {
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
};

const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substring(14, 19);

const handleLoadedMetaData = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
};

const handelTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
}

const handleTimelineChange = (event) => {
    const {target:{value}} = event;
    video.currentTime = value;
};

const handleFullScreen = () => {
    const fullscreen = document.fullscreenElement;
    if(fullscreen){
        document.exitFullscreen();
        fullScreenIcon.classList = "fas fa-expand";
    } else {
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
    }
}

const hideControls = () => videoControls.classList.remove("showing");  //반복되는 부분 function으로 만들어주기

const handleMouseMove = () => {
    if(controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    } //timeout은 특정 숫자 id 가 있는데 그걸 체크하게 만들어서, id가 있으면(timeout 중이면) timeout중단하고 값을 기본인 null로 바꿔줌
    if(controlsTimeoutMovement) {
        clearTimeout(controlsTimeoutMovement);
        controlsTimeoutMovement = null;
    }
    videoControls.classList.add("showing");
    controlsTimeoutMovement =  setTimeout(hideControls, 3000)
}

const handleMouseLeave = () => {
    controlsTimeout =  setTimeout(hideControls, 3000);
}

const handleKeyboard = (e) => {
    if (e.key === " ") {
        handlePlayClick();
    } else if (e.key === "m") {
        handleMuteClick();
    } else if (e.key === "f") {
        videoContainer.requestFullscreen();
        fullScreenBtn.className = "fas fa-compress";
    } else if (e.key === "Escape") {
        document.exitFullscreen();
        fullScreenBtn.className = "fas fa-expand";
    }
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadeddata", handleLoadedMetaData);
video.addEventListener("timeupdate", handelTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
window.addEventListener("keyup", handleKeyboard);

video.readyState ? handleLoadedMetaData() : video.addEventListener("loadeddata", handleLoadedMetaData);