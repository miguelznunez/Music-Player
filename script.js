let track_index = 0;
let isPlaying = false;
let updateTimer;

let track_name = document.querySelector("#track-name");
let track_artist = document.querySelector("#track-artist");
let track_art = document.querySelector("#track-art");

let playpause_btn = document.querySelector("#play_pause");
let previous_btn = document.querySelector("#previous-track");
let next_btn = document.querySelector("#next-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");
  
// Create the audio element for the player
let curr_track = document.createElement('audio');
let track_list = [
  {
    name: "HOUSE PARTY",
    artist: "Meek Mill",
    image: "meek_mill-house_party.jpeg",
    path: "Meek Mill - House Party.mp3",
    hex: "#637c92"
  },
  {
    name: "MANGO",
    artist: "Kormak",
    image: "kormak-mango.jpg",
    path: "Kormak - Mango.mp3",
    hex: "#D6722C"
  },
  {
    name: "CREW",
    artist: "GoldLink",
    image: "goldlink_crew.jpg",
    path: "GoldLink - Crew.mp3",
    hex: "#fb6c5c"
  }
];

playpause_btn.addEventListener("click", () => {
  playpauseTrack();
})

previous_btn.addEventListener("click", () => {
  prevTrack();
})

next_btn.addEventListener("click", () => {
  nextTrack();
})

function playpauseTrack() {
  if (!isPlaying) 
    playTrack();
  else 
    pauseTrack();
}

function playTrack() {
  curr_track.play();
  isPlaying = true;
  playpause_btn.innerHTML = '<i class="fas fa-pause"></i>';
}


function loadTrack(track_index) {
  // Clear the previous seek timer
  clearInterval(updateTimer);
  resetValues();

  // Load a new track
  curr_track.src = track_list[track_index].path;
  curr_track.load();

  // Update details of the track
  track_art.style.backgroundImage = `linear-gradient(to bottom, transparent 0%, black), url(${track_list[track_index].image})`;
  track_name.textContent = track_list[track_index].name;
  track_artist.textContent = track_list[track_index].artist;
  document.body.style.background = `${track_list[track_index].hex}`;
  document.body.style.background = `-webkit-radial-gradient(center, ${track_list[track_index].hex}, #000000)`;
  document.body.style.background = `-moz-radial-gradient(center, ${track_list[track_index].hex}, #000000)`;
  document.body.style.background = `radial-gradient(ellipse at center, ${track_list[track_index].hex}, #000000)`;

  // Set an interval of 1000 milliseconds
  // for updating the seek slider
  updateTimer = setInterval(seekUpdate, 1000);

  // Move to the next track if the current finishes playing
  // using the 'ended' event
  curr_track.addEventListener("ended", nextTrack);

}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  
  playpause_btn.innerHTML = '<i class="fa fa-play"></i>';
}

function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

function prevTrack() {
  if (track_index > 0)
    track_index -= 1;
  else track_index = track_list.length - 1;
    
  loadTrack(track_index);
  playTrack();
}

function nextTrack() {
  if (track_index < track_list.length - 1) 
    track_index += 1;
  else 
    track_index = 0;

  loadTrack(track_index);
  playTrack();
}

function seekTo() {
  seekto = curr_track.duration * (seek_slider.value / 100);

  curr_track.currentTime = seekto;
}

function setVolume() {
  curr_track.volume = volume_slider.value / 100;
}

function seekUpdate() {
  let seekPosition = 0;

  // Check if the current track duration is a legible number
  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);
    seek_slider.value = seekPosition;

    // Calculate the time left and the total duration
    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

    // Add a zero to the single digit time values
    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

    // Display the updated duration
    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}

document.addEventListener("click", e => {
  const isDropdownButton = e.target.matches("[data-dropdown-button]")
  if (!isDropdownButton && e.target.closest("[data-dropdown]") != null) return

  let currentDropdown
  if (isDropdownButton) {
    currentDropdown = e.target.closest("[data-dropdown]")
    currentDropdown.classList.toggle("active")
  }

  document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
    if (dropdown === currentDropdown) return
    dropdown.classList.remove("active")
  })
})

// Load the first track in the tracklist
loadTrack(track_index);