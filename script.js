let track_index = 0;
let isPlaying = false;
let updateTimer;
let shuffle = false;

let track_name = document.querySelector("#track-name");
let track_artist = document.querySelector("#track-artist");
let track_art = document.querySelector("#track-art");

let playpause_btn = document.querySelector("#play_pause");
let previous_btn = document.querySelector("#previous-track");
let next_btn = document.querySelector("#next-track");
let shuffle_btn = document.querySelector("#shuffle-track");

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
    album_image_small_jpg: "meek_mill-house_party_500px.jpg",
    album_image_small_webp: "meek_mill-house_party_500px.webp",
    album_image_big_jpg: "meek_mill-house_party_1000px.jpg",
    album_image_big_webp: "meek_mill-house_party_1000px.webp",
    path: "Meek Mill - House Party.mp3"
  },
  {
    name: "SHOOTERS",
    artist: "Tory Lanes",
    album_image_small_jpg: "tory_lanez-shooters_500px.jpp",
    album_image_small_webp: "tory_lanez-shooters_500px.webp",
    album_image_big_jpg: "tory_lanez-shooters_1000px.jpg",
    album_image_big_webp: "tory_lanez-shooters_1000px.webp",
    path: "Tory Lanez - Shooters.mp3"
  },
  {
    name: "WEED THEM OUT",
    artist: "Little Kirk",
    album_image_small_jpg: "little_kirk-weed_them_out_500px.jpg",
    album_image_small_webp: "little_kirk-weed_them_out_500px.webp",
    album_image_big_jpg: "little_kirk-weed_them_out_1000px.jpg",
    album_image_big_webp: "little_kirk-weed_them_out_1000px.webp",
    path: "Little Kirk - Weed Them Out.mp3"
  },
  {
    name: "HELLO",
    artist: "Pop Smoke",
    album_image_small_jpg: "pop_smoke-hello_500px.jpg",
    album_image_small_webp: "pop_smoke-hello_500px.webp",
    album_image_big_jpg: "pop_smoke-hello_1000px.jpg",
    album_image_big_webp: "pop_smoke-hello_1000px.webp",
    path: "Pop Smoke - Hello.mp3"
  },
  {
    name: "BOY BANDZ",
    artist: "Post Malone",
    album_image_small_jpg: "post_malone-boy_bands_500px.jpg",
    album_image_small_webp: "post_malone-boy_bands_500px.webp",
    album_image_big_jpg: "post_malone-boy_bands_1000px.jpg",
    album_image_big_webp: "post_malone-boy_bands_1000px.webp",
    path: "Post Malone - Boy Bandz.mp3"
  }
];

shuffle_btn.addEventListener("click", () => {
  if(shuffle === false){
    shuffle = true;
    document.querySelector(".fa-random").className += " active";
  }
  else{
    shuffle = false;
    removeActive()
    track_index = track_list.findIndex(x => x.path === curr_track.getAttribute("src"));
  }
})

playpause_btn.addEventListener("click", () => {
  playpauseTrack();
})

previous_btn.addEventListener("click", () => {
  prevTrack();
})

next_btn.addEventListener("click", () => {
  nextTrack();
})


function removeActive(){
  var current = document.querySelectorAll(".active");
  current[0].className = current[0].className.replace(" active", "");
}

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

function randomIndex(arr, excludeIndex){
  let indexes = Object.keys(arr); //get a list of indexes 
  indexes.splice(excludeIndex, 1); //remove the unwanted
  return indexes[Math.floor(Math.random() * indexes.length)]; //pick a new index
}

function loadTrack(track_index) {
  // Clear the previous seek timer
  clearInterval(updateTimer);
  resetValues();

  // If shuffle is activated choose a random song without repeating
  if(shuffle){
    track_index = randomIndex(track_list, track_list.findIndex(x => x.path === curr_track.getAttribute("src")));
  }

  // Load a new track
  curr_track.src = track_list[track_index].path;
  curr_track.load();

  // Update details of the track
  track_art.style.backgroundImage = `linear-gradient(to bottom, transparent 0%, black), url(${track_list[track_index].album_image_small_webp})`;
  track_name.textContent = track_list[track_index].name;
  track_artist.textContent = track_list[track_index].artist;

  track_name.classList.add('animate__animated', 'animate__fadeInUp');
  track_artist.classList.add('animate__animated', 'animate__fadeInUp');

  track_name.addEventListener('animationend', () => {
    track_name.classList.remove('animate__animated', 'animate__fadeInUp');
  });

  track_artist.addEventListener('animationend', () => {
    track_artist.classList.remove('animate__animated', 'animate__fadeInUp');
  });

  document.body.style.background = "#000000";
  document.body.style.background = `-webkit-radial-gradient(center, rgba(0, 0, 0, 0.4), #000000 90%), url(${track_list[track_index].album_image_big_webp})`;
  document.body.style.background = `-moz-radial-gradient(center, rgba(0, 0, 0, 0.4), #000000 90%), url(${track_list[track_index].album_image_big_webp})`;
  document.body.style.background = `radial-gradient(ellipse at center, rgba(0, 0, 0, 0.4), #000000 90%), url(${track_list[track_index].album_image_big_webp})`;

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