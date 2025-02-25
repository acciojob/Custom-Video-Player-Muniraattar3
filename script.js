// Get our elements from the DOM
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

// 1. Toggle play/pause on the video
function togglePlay() {
  // If the video is paused, play it; otherwise, pause it.
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

// 2. Update the play/pause button icon
function updateButton() {
  // Set the icon to ► if video is paused, or ❚ ❚ if it's playing.
  const icon = video.paused ? '►' : '❚ ❚';
  toggle.textContent = icon;
}

// 3. Skip video time by a certain amount (using data-skip attribute)
function skip() {
  // Parse the skip value from the button's data attribute and update currentTime
  video.currentTime += parseFloat(this.dataset.skip);
}

// 4. Handle range input updates for volume and playback speed
function handleRangeUpdate() {
  // Use the input's name to update the corresponding property on the video element
  video[this.name] = this.value;
}

// 5. Update the progress bar as the video plays
function handleProgress() {
  // Calculate the percentage of video played
  const percent = (video.currentTime / video.duration) * 100;
  // Update the progress bar's flexBasis (or width) to reflect the percentage played
  progressBar.style.flexBasis = `${percent}%`;
}

// 6. Scrub (seek) through the video when clicking or dragging on the progress bar
function scrub(e) {
  // Calculate the new time based on click position relative to the progress bar's width
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

// Hook up the event listeners

// Play/pause toggling via video click and the toggle button
video.addEventListener('click', togglePlay);
toggle.addEventListener('click', togglePlay);

// Update play/pause button icon when the video plays or pauses
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

// Update the progress bar as the video time updates
video.addEventListener('timeupdate', handleProgress);

// Skip buttons: when clicked, move video time by the value in data-skip
skipButtons.forEach(button => button.addEventListener('click', skip));

// Update volume and playback speed when range inputs change or when mouse moves over them
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

// Make the progress bar clickable and draggable for seeking
let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

// (Optional) Handle video loading errors gracefully
video.addEventListener('error', () => {
  console.error("Error loading the video.");
  // Here you could also display an error message on the player.
});
