const image = document.getElementById('cover'),
    title = document.getElementById('music-title'),
    artist = document.getElementById('music-artist'),
    currentTimeEl = document.getElementById('current-time'),
    durationEl = document.getElementById('duration'),
    progress = document.getElementById('progress'),
    playerProgress = document.getElementById('player-progress'),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next'),
    playBtn = document.getElementById('play'),
    background = document.getElementById('bg-img');

const music = new Audio();

const songs = [
    {
        path: 'https://res.cloudinary.com/do3d7xlrt/video/upload/v1770719753/lmlyd-_AudioTrimmer.com_ovnnl0.mp3',
        cover: 'https://res.cloudinary.com/do3d7xlrt/image/upload/v1770728339/9415f990-809e-47dc-9114-630a033f46b1_dyyxm1.jpg',
    },
    {
        path: 'https://res.cloudinary.com/do3d7xlrt/video/upload/v1770729166/tnwm_io2ytj.mp3',
        cover: 'https://res.cloudinary.com/do3d7xlrt/image/upload/v1770728363/tnwm_z0hjhk.jpg',
    },
    {
        path: 'https://res.cloudinary.com/do3d7xlrt/video/upload/v1770729159/04_jfi3di.mp3',
        cover: 'https://res.cloudinary.com/do3d7xlrt/image/upload/v1770728347/idr_vl8omp.jpg',
    }
];

let musicIndex = 0;
let isPlaying = false;

function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    isPlaying = true;
    // Change play button icon
    playBtn.classList.replace('fa-play', 'fa-pause');
    // Set button hover title
    playBtn.setAttribute('title', 'Pause');
    music.play();
}

function pauseMusic() {
    isPlaying = false;
    // Change pause button icon
    playBtn.classList.replace('fa-pause', 'fa-play');
    // Set button hover title
    playBtn.setAttribute('title', 'Play');
    music.pause();
}

function loadMusic(song) {
    music.src = song.path;
    image.src = song.cover;
    background.src = song.cover;
}

function changeMusic(direction) {
    musicIndex = (musicIndex + direction + songs.length) % songs.length;
    loadMusic(songs[musicIndex]);
    playMusic();
}

function updateProgressBar() {
    const { duration, currentTime } = music;

    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
        durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
        currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`;
    }
}

music.addEventListener('loadedmetadata', () => {
    const { duration } = music;
    const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
    durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
});

function setProgressBar(e) {
    const width = playerProgress.clientWidth;
    const clickX = e.offsetX;
    music.currentTime = (clickX / width) * music.duration;
}

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeMusic(-1));
nextBtn.addEventListener('click', () => changeMusic(1));
music.addEventListener('ended', () => changeMusic(1));
music.addEventListener('timeupdate', updateProgressBar);
playerProgress.addEventListener('click', setProgressBar);

loadMusic(songs[musicIndex]);

window.onload = function () {
const songsByYear = {
    y2016: [
      { title: "2016 Hit", file: "https://res.cloudinary.com/do3d7xlrt/video/upload/v1770729159/04_jfi3di.mp3" },
      { title: "Retro 2016", file: "song2.mp3" }
    ],
    y2017: [
      { title: "Beat 2017", file: "song3.mp3" },
      { title: "Cool Track", file: "song4.mp3" }
    ],
    y2018: [
      { title: "Classic 2018", file: "song5.mp3" },
      { title: "Chill 2018", file: "song6.mp3" }
    ],
    y2019: [
      { title: "Hype 2019", file: "song7.mp3" },
      { title: "Groove 2019", file: "song8.mp3" }
    ],
    y2020: [
      { title: "Vibe 2020", file: "song9.mp3" },
      { title: "Lockdown Jam", file: "song10.mp3" }
    ],
    y2021: [
      { title: "Fresh 2021", file: "song11.mp3" },
      { title: "Summer 2021", file: "song12.mp3" }
    ],
    y2022: [
      { title: "Wave 2022", file: "song13.mp3" },
      { title: "Rhythm 2022", file: "song14.mp3" }
    ],
    y2023: [
      { title: "Pop 2023", file: "song15.mp3" },
      { title: "Bass 2023", file: "song16.mp3" }
    ],
    y2024: [
      { title: "New Beats", file: "song17.mp3" },
      { title: "Loop 2024", file: "song18.mp3" }
    ],
    y2025: [
      { title: "Futuristic", file: "song19.mp3" },
      { title: "Synth Drop", file: "song20.mp3" }
    ]
  };

  function showSongs(yearId) {
    const container = document.getElementById("song-container");
    const songs = songsByYear[yearId];

    if (!songs || songs.length === 0) {
      container.style.display = "none";
      return;
    }

    container.innerHTML = ""; // Clear old
    container.style.display = "flex"; // Show container

    songs.forEach(song => {
      const songCard = document.createElement("div");
      songCard.className = "song-card";

      const title = document.createElement("div");
      title.className = "song-title";
      title.textContent = song.title;

      const button = document.createElement("button");
      button.className = "play-btn";
      button.textContent = "Play";

      const audio = new Audio(song.file);

      button.onclick = () => {
        audio.play();
      };

      songCard.appendChild(title);
      songCard.appendChild(button);
      container.appendChild(songCard);
    });
  }
};



  
  
  
  

  

