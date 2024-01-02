const videoPlayerEl = document.querySelector('.video-player');
const videoEl = document.querySelector('.video-player__video');
const progressBarContainerEl = document.querySelector('.video-player__progress-bar-container');
const progressBarEl = document.querySelector('.video-player__progress-bar');
const playBtnEl = document.getElementById('play-btn');
const volumeIconEl = document.getElementById('volume-icon');
const volumeBarContainerEl = document.querySelector('.video-player__volume-bar-container');//
const volumeBarEl = document.querySelector('.video-player__volume-bar');
const currentTimeEl = document.querySelector('.video-player__time-elapsed');
const durationEl = document.querySelector('.video-player__time-duration');
const fullscreenBtnEl = document.querySelector('.video-player__fullscreen-btn');
const videoSpeedEl = document.querySelector('.video-player__speed-selection');

// Play & Pause ----------------------------------- //

const PLAY_BTN_STATE = {
  PLAY: 'play',
  PAUSE: 'pause',
}

function togglePlayBtnUI({ newState }) {
  const oldState = newState === PLAY_BTN_STATE.PLAY ? PLAY_BTN_STATE.PAUSE : PLAY_BTN_STATE.PLAY;
  playBtnEl.classList.replace(`fa-${oldState}`, `fa-${newState}`);
  playBtnEl.setAttribute('title', `${newState}`);
}

function togglePlay() {
  const isVideoPaused = videoEl.paused;
  if (isVideoPaused) {
    videoEl.play();
    togglePlayBtnUI({ newState: PLAY_BTN_STATE.PAUSE });
  } else {
    videoEl.pause();
    togglePlayBtnUI({ newState: PLAY_BTN_STATE.PLAY });
  }
}

// Video time ---------------------------------- //

function prettyFormatVideoTime({ time }) {
  const minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  seconds = seconds > 9 ? seconds : `0${seconds}`;
  return `${minutes}:${seconds}`;
}

function updateVideoDurationUI() {
  const videoDuration = videoEl.duration;
  const videoDurationToDisplay = prettyFormatVideoTime({ time: videoDuration });
  durationEl.textContent = `${videoDurationToDisplay}`;
}

function updateVideoElapsedTimeUI({ currentTime }) {
  const currentTimeToDisplay = prettyFormatVideoTime({ time: currentTime });
  currentTimeEl.textContent = `${currentTimeToDisplay} /`;
}

function updateVideoProgressBarUI({ currentTime, videoDuration }) {
  const videoProgressInPercentage = (currentTime / videoDuration) * 100;
  progressBarEl.style.width = `${videoProgressInPercentage}%`;
}

function updateVideoProgressUI() {
  const currentTime = videoEl.currentTime;
  const videoDuration = videoEl.duration;
  updateVideoElapsedTimeUI({ currentTime });
  updateVideoProgressBarUI({ currentTime, videoDuration });
}

function setVideoProgress({ progressBarClickedLocationRangeInXAxis }) {
  const progressBarLength = progressBarContainerEl.offsetWidth;
  const ratio = progressBarClickedLocationRangeInXAxis / progressBarLength;
  const videoDuration = videoEl.duration;
  const newTime = videoDuration * ratio;
  videoEl.currentTime = newTime;
}

// Volume Controls --------------------------- //

let lastVolume = 1;
const VOLUME_STATE = {
  MUTE: 'mute',
  UNMUTE: 'unmute'
}

function changeVolumeIcon() {
  const volume = videoEl.volume;
  volumeIconEl.className = '';
  if (volume > 0.7) {
    volumeIconEl.classList.add('fas', 'fa-volume-up');
    volumeIconEl.setAttribute('title', 'Mute');
  } else if (volume > 0) {
    volumeIconEl.classList.add('fas', 'fa-volume-down');
    volumeIconEl.setAttribute('title', 'Mute');
  } else if (volume === 0) {
    volumeIconEl.classList.add('fas', 'fa-volume-mute');
    volumeIconEl.setAttribute('title', 'Unmute');
  }
}

function changeVideoVolume({ volumeBarClickedLocationRangeInXAxis }) {
  const volumeBarContainerElLength = volumeBarContainerEl.offsetWidth;
  // volume value between 0 - 1
  let volume = volumeBarClickedLocationRangeInXAxis / volumeBarContainerElLength;
  if (volume < 0.1) {
    volume = 0;
  } else if (volume > 0.9) {
    volume = 1;
  }

  if (volume !== 0) {
    lastVolume = volume;
  }

  volumeBarEl.style.width = `${volume * 100}%`;
  videoEl.volume = volume;
  changeVolumeIcon();
}

function toggleMute() {
  if (videoEl.volume) {
    lastVolume = videoEl.volume;
    videoEl.volume = 0;
    volumeBarEl.style.width = 0;
    changeVolumeIcon();
  } else {
    videoEl.volume = lastVolume;
    volumeBarEl.style.width = `${lastVolume * 100}%`;
    changeVolumeIcon();
  }
}

// Change Playback Speed -------------------- //

function changeSpeed() {
  videoEl.playbackRate = videoSpeedEl.value;
}

// Fullscreen ------------------------------- //

function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  }
  videoEl.classList.add('video-player--fullscreen');
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  }
  videoEl.classList.remove('video-player--fullscreen');
}

function toggleFullscreen() {
  const isInFullscreen = document.fullscreenElement;
  !isInFullscreen ? openFullscreen(videoPlayerEl) : closeFullscreen();
}

// Handler Functions

function playBtnElClickHandler() {
  togglePlay();
}

function videoElClickHandler() {
  togglePlay();
}

function videoElEndedHandler() {
  togglePlayBtnUI({ newState: PLAY_BTN_STATE.PLAY })
}

function videoElTimeupdateHandler() {
  updateVideoProgressUI();
}

function videoElCanPlayHandler() {
  updateVideoProgressUI();
  updateVideoDurationUI();
}

function progressBarContainerClickHandler(e) {
  const progressBarClickedLocationRangeInXAxis = e.offsetX;
  setVideoProgress({ progressBarClickedLocationRangeInXAxis });
}

function volumeBarContainerElClickHandler(e) {
  const volumeBarClickedLocationRangeInXAxis = e.offsetX;
  changeVideoVolume({ volumeBarClickedLocationRangeInXAxis });
}

function volumeIconElClickHandler() {
  toggleMute();
}

function videoSpeedElChangeHandler() {
  changeSpeed();
}

function fullscreenBtnElClickHandler() {
  toggleFullscreen();
}

videoEl.addEventListener('click', videoElClickHandler);
videoEl.addEventListener('ended', videoElEndedHandler);
videoEl.addEventListener('timeupdate', videoElTimeupdateHandler);
videoEl.addEventListener('canplay', videoElCanPlayHandler);
playBtnEl.addEventListener('click', playBtnElClickHandler);
progressBarContainerEl.addEventListener('click', progressBarContainerClickHandler);
volumeBarContainerEl.addEventListener('click', volumeBarContainerElClickHandler);
volumeIconEl.addEventListener('click', volumeIconElClickHandler);
videoSpeedEl.addEventListener('change', videoSpeedElChangeHandler);
fullscreenBtnEl.addEventListener('click', fullscreenBtnElClickHandler);
