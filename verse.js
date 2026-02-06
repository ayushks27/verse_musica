document.addEventListener("DOMContentLoaded", () => {

/* ================= GLOBAL MEDIA MANAGER (FULL SYNC ENGINE) ================= */

  const MediaManager = {
  currentAudio: null,
  currentVideo: null,
  currentBtn: null,

  /* ---------- AUDIO PLAY ---------- */
  playAudio(audio, btn=null){

    /* 1️⃣ STOP ANY PLAYING VIDEO */
    if(this.currentVideo){
      this.currentVideo.pause();
      this.currentVideo.currentTime = 0;
      this.currentVideo = null;
    }

    /* 2️⃣ STOP PREVIOUS AUDIO */
    if(this.currentAudio && this.currentAudio !== audio){
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;

      /* reset previous button */
      if(this.currentBtn){
        this.currentBtn.classList.remove("bx-pause");
        this.currentBtn.classList.add("bx-play");
      }
    }

    this.currentAudio = audio;
    this.currentBtn = btn;

    audio.play();

    audio.dispatchEvent(new Event("play"));

    window.registerSongPlay = function(audio, meta){

      if(!audio || !meta) return;

      console.log("Tracking:", meta.title);

      // add to history
      PlayerDB.addHistory(meta);

      // save progress continuously
      audio.ontimeupdate = () => {
        PlayerDB.setLast(meta, audio.currentTime);
      };

      // notification when started
      PlayerDB.addNotification({
        text: "Now playing " + meta.title + " • " + meta.artist,
        time: Date.now()
      });

    };

    /* remove previous glow */
    document.querySelectorAll(".playing-cover")
      .forEach(el=>el.classList.remove("playing-cover"));

    /* add glow to current cover */
    if(meta?.cover){
      document.querySelectorAll(`img[src="${meta.cover}"]`)
        .forEach(img=>img.classList.add("playing-cover"));
    }

    /* update icon */
    if(btn){
      btn.classList.remove("bx-play");
      btn.classList.add("bx-pause");
    }

    /* when audio ends */
    audio.onended = ()=>{
      if(this.currentBtn){
        this.currentBtn.classList.remove("bx-pause");
        this.currentBtn.classList.add("bx-play");
      }
      this.currentAudio = null;
      this.currentBtn = null;
    };
  },

  /* ---------- AUDIO PAUSE ---------- */
  pauseAudio(audio, btn=null){
    audio.pause();

    audio.dispatchEvent(new Event("pause"));

    if(btn){
      btn.classList.remove("bx-pause");
      btn.classList.add("bx-play");
    }

    if(this.currentAudio === audio){
      this.currentAudio = null;
      this.currentBtn = null;
    }
  },

  /* ---------- VIDEO PLAY ---------- */
  playVideo(video){

    /* STOP AUDIO FIRST */
    if(this.currentAudio){
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;

      if(this.currentBtn){
        this.currentBtn.classList.remove("bx-pause");
        this.currentBtn.classList.add("bx-play");
      }

      this.currentAudio = null;
      this.currentBtn = null;
    }

    /* STOP PREVIOUS VIDEO */
    if(this.currentVideo && this.currentVideo !== video){
      this.currentVideo.pause();
      this.currentVideo.currentTime = 0;
    }

    this.currentVideo = video;
    video.play();
  }
};

/* ================= MAIN PLAYER (SMART SYNC) ================= */

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playPauseBTN");

const progress = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

if (audio && playBtn) {

  /* -------- REAL UI SYNC (IMPORTANT) -------- */
  function updateMainPlayerUI() {

    if (audio.paused) {
      playBtn.classList.remove("bx-pause");
      playBtn.classList.add("bx-play");
    } else {
      playBtn.classList.remove("bx-play");
      playBtn.classList.add("bx-pause");
    }

  }

  /* Sync with REAL audio state */
  audio.addEventListener("play", updateMainPlayerUI);
  audio.addEventListener("pause", updateMainPlayerUI);
  audio.addEventListener("ended", updateMainPlayerUI);


  /* -------- PLAY BUTTON -------- */
  window.playPause = function () {

    if (audio.paused) {
      MediaManager.playAudio(audio, playBtn);
    } else {
      MediaManager.pauseAudio(audio, playBtn);
    }

  };


  /* -------- DURATION -------- */
  audio.addEventListener("loadedmetadata", () => {
    if (durationEl) durationEl.textContent = formatTime(audio.duration);
  });


  /* -------- PROGRESS -------- */
  audio.addEventListener("timeupdate", () => {

    if (progress) {
      progress.value = (audio.currentTime / audio.duration) * 100 || 0;
    }

    if (currentTimeEl) {
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }

  });


  /* -------- SEEK -------- */
  progress?.addEventListener("input", () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
  });


  /* -------- RESET WHEN ENDS -------- */
  audio.addEventListener("ended", () => {
    if (progress) progress.value = 0;
  });


  /* -------- TIME FORMAT -------- */
  function formatTime(sec) {
    if (isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

}

/* ================= LISTEN NOW ================= */
document.addEventListener('click',e=>{
  if(e.target.id==='audioControl'){
    const audio=document.getElementById('audioPlayer');
    if(!audio) return;
    audio.paused?MediaManager.playAudio(audio):MediaManager.pauseAudio(audio);
  }
});

/* ================= TOP SONGS (data-audio items) ================= */
document.addEventListener('click',e=>{
  const item=e.target.closest('.item[data-audio]');
  if(!item) return;
  const src=item.dataset.audio;
  if(!item._audio) item._audio=new Audio(src);
  const a=item._audio;
  a.paused?MediaManager.playAudio(a):MediaManager.pauseAudio(a);
});

/* ================= SCROLL CARDS (.aud-btn) ================= */
document.querySelectorAll('.aud-btn').forEach(btn=>{
  btn.addEventListener('click',e=>{
    e.stopPropagation();
    const audio=btn.parentElement.querySelector('audio');
    if(!audio) return;
    audio.paused?MediaManager.playAudio(audio):MediaManager.pauseAudio(audio);
  });
});

/* ================= PLAYBUTTON (Decade hits) ================= */
document.querySelectorAll('.playButton').forEach(btn=>{
  btn.addEventListener('click',e=>{
    e.stopPropagation();
    const id=btn.dataset.audio;
    const audio=document.getElementById(id);
    if(!audio) return;
    audio.paused?MediaManager.playAudio(audio):MediaManager.pauseAudio(audio);
  });
});

/* ================= UNDERRATED ARTISTS (ISOLATED HANDLER) ================= */
// capture phase so other click systems never interfere
document.addEventListener('click',function(e){
  const btn=e.target.closest('.audio-control-btn');
  if(!btn) return;
  e.preventDefault();
  e.stopImmediatePropagation();

  const src=btn.dataset.audio;
  if(!src) return;

  if(!btn._audio) btn._audio=new Audio(src);
  const audio=btn._audio;

  if(audio.paused){
    MediaManager.playAudio(audio);
    btn.textContent='⏸ Pause';
  }else{
    MediaManager.pauseAudio(audio);
    btn.textContent='▶ Play';
  }

  audio.onended=()=>btn.textContent='▶ Play';
},true);

/* ================= DISCOVER GALLERY ================= */
window.playSong=function(path){
  if(!window._galleryAudio) window._galleryAudio=new Audio(path);
  else window._galleryAudio.src=path;
  MediaManager.playAudio(window._galleryAudio);
};

/* ================= PODCAST ================= */
document.querySelectorAll('.podcast').forEach(p=>{
  const img=p.querySelector('img');
  const frame=p.querySelector('iframe');

  if(frame) frame.style.display='none';

  img?.addEventListener('click',()=>{
    const opening = frame.style.display !== 'block';

    if(opening){
      if(MediaManager.currentAudio){
        MediaManager.currentAudio.pause();
        MediaManager.currentAudio.currentTime=0;
        MediaManager.currentAudio=null;
      }
      if(MediaManager.currentVideo){
        MediaManager.currentVideo.pause();
        MediaManager.currentVideo.currentTime=0;
        MediaManager.currentVideo=null;
      }
      document.querySelectorAll('video').forEach(v=>{v.pause();v.currentTime=0;});
      document.querySelectorAll('audio').forEach(a=>{a.pause();a.currentTime=0;});
    }

    frame.style.display = opening ? 'block' : 'none';
  });
});

/* ================= MOTIVATION VIDEO SNIPPETS ================= */
let activeSnippetVideo=null;
document.querySelectorAll('.snippet-item .play-btn[data-video]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const item=btn.closest('.snippet-item');
    let video=item.querySelector('video');
    const img=item.querySelector('img');

    if(!video){
      video=document.createElement('video');
      video.src=btn.dataset.video;
      video.controls=true;
      video.autoplay=true;
      video.style.width='100%';
      item.prepend(video);
    }

    if(activeSnippetVideo && activeSnippetVideo!==video){
      activeSnippetVideo.pause();
      activeSnippetVideo.currentTime=0;
      activeSnippetVideo.closest('.snippet-item')?.querySelector('img')?.style.removeProperty('display');
      activeSnippetVideo.closest('.snippet-item')?.querySelector('.play-btn')?.style.removeProperty('display');
    }

    if(video.paused){
      MediaManager.playVideo(video);
      img.style.display='none';
      btn.style.display='none';
      activeSnippetVideo=video;
    }else{
      video.pause();
      img.style.removeProperty('display');
      btn.style.removeProperty('display');
    }

    video.onended=()=>{
      img.style.removeProperty('display');
      btn.style.removeProperty('display');
      activeSnippetVideo=null;
    };
  });
});

/* ================= HEART ================= */
const heart=document.getElementById('heartIcon');
heart?.addEventListener('click',()=>heart.classList.toggle('active'));

/* ================= FOLLOW BUTTON ================= */
document.querySelectorAll('.follow-btn').forEach(b=>{
  b.onclick=()=>{b.classList.toggle('following');b.textContent=b.classList.contains('following')?'Following':'Follow';};
});

/* ================= GLOBAL VIDEO EXCLUSIVITY ================= */
document.addEventListener('play',function(e){
  const v=e.target;
  if(v.tagName==='VIDEO'){
    MediaManager.playVideo(v);
  }
},true);

/* ================= THEME TOGGLE ================= */

  const themeBtn = document.getElementById("themeToggle");
  if(!themeBtn) return;

  if(localStorage.getItem("theme")==="light"){
    document.body.classList.add("light-mode");
    themeBtn.innerHTML="<i class='bx bx-sun'></i>";
  }

  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const light = document.body.classList.contains("light-mode");
    localStorage.setItem("theme", light ? "light" : "dark");
    themeBtn.innerHTML = light
      ? "<i class='bx bx-sun'></i>"
      : "<i class='bx bx-moon'></i>";
  });


/* ================= LIVE SEARCH ================= */

const searchInput = document.getElementById("searchInput");

if(searchInput){
searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase().trim();
    document.querySelectorAll("[data-search]").forEach(item=>{
        const text = item.getAttribute("data-search").toLowerCase();
        item.style.display = text.includes(query) ? "" : "none";
    });
});
}

/* ================= CONTINUOUS MOVING POSTER SLIDER ================= */

const gallery = document.querySelector(".i-gallery");

if (gallery) {

  let speed = 0.35;     // movement speed
  let position = 0;

  // duplicate images once (important!)
  gallery.innerHTML += gallery.innerHTML;

  function animateGallery() {

    position += speed;
    gallery.style.transform = `translateX(-${position}px)`;

    // reset when half reached
    if (position >= gallery.scrollWidth / 2) {
      position = 0;
    }

    requestAnimationFrame(animateGallery);
  }

  animateGallery();

}

/* ================= VERSEBOARD IMAGE ZOOM ================= */

const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("zoomed-image");
const closeBtn = document.querySelector(".close");

if(modal && modalImg && closeBtn){

document.querySelectorAll(".image-sequence img").forEach(img => {
  img.addEventListener("click", () => {
    modal.style.display = "flex";
    modalImg.src = img.src;
  });
});

closeBtn.onclick = () => modal.style.display = "none";

modal.addEventListener("click", e=>{
  if(e.target === modal) modal.style.display="none";
});

}

document.querySelectorAll('.card,.artist-card,.profile-card')
.forEach(el=>{
  el.addEventListener('mousemove',e=>{
    const r = el.getBoundingClientRect();
    el.style.setProperty('--x',`${e.clientX-r.left}px`);
    el.style.setProperty('--y',`${e.clientY-r.top}px`);
  });
});

/* detect manual video play (user clicks built-in controls) */
document.querySelectorAll("video").forEach(v=>{
  v.addEventListener("play", ()=> MediaManager.playVideo(v));
});

/* ================= PANELS CONTROLLER ================= */



  const notifBtn   = document.getElementById("notifBtn");
  const settingsBtn= document.getElementById("settingsBtn");

  const notifPanel   = document.getElementById("notificationPanel");
  const settingsPanel= document.getElementById("settingsPanel");

  if(!notifBtn || !settingsBtn) return;

  /* NOTIFICATIONS */
  notifBtn.addEventListener("click",(e)=>{
    e.stopPropagation();

    const open = notifPanel.classList.contains("show");

    // close all
    notifPanel.classList.remove("show");
    settingsPanel.classList.remove("show");

    // reopen if needed
    if(!open){
      renderNotifications();
      notifPanel.classList.add("show");
    }
  });

  /* SETTINGS */
  settingsBtn.addEventListener("click",(e)=>{
    e.stopPropagation();

    const open = settingsPanel.classList.contains("show");

    notifPanel.classList.remove("show");
    settingsPanel.classList.remove("show");

    if(!open){
      settingsPanel.classList.add("show");
    }
  });

  /* CLICK OUTSIDE CLOSE */
  document.addEventListener("click",(e)=>{
    if(!notifPanel.contains(e.target) && !notifBtn.contains(e.target)){
      notifPanel.classList.remove("show");
    }

    if(!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)){
      settingsPanel.classList.remove("show");
    }
  });



document.getElementById("darkToggle")?.addEventListener("change",e=>{
  document.body.classList.toggle("light-mode", !e.target.checked);
});

document.getElementById("logoutBtn")?.addEventListener("click",()=>{
  Clerk.signOut();
});

  /* CAROUSEL */


  const slider = document.getElementById("artistCarousel");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  if(!slider) return;

  /* ---------------- BUTTONS ---------------- */
  const scrollAmount = 340;

  nextBtn.onclick = ()=> slider.scrollBy({left:scrollAmount,behavior:"smooth"});
  prevBtn.onclick = ()=> slider.scrollBy({left:-scrollAmount,behavior:"smooth"});


  /* ---------------- DRAG DESKTOP ---------------- */
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener("mousedown",(e)=>{
    isDown = true;
    slider.classList.add("dragging");
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave",()=> isDown=false);
  slider.addEventListener("mouseup",()=> isDown=false);

  slider.addEventListener("mousemove",(e)=>{
    if(!isDown) return;
    e.preventDefault();

    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.6; // speed
    slider.scrollLeft = scrollLeft - walk;
  });


  /* ---------------- TOUCH MOBILE ---------------- */
  let touchStartX = 0;
  let touchScroll = 0;

  slider.addEventListener("touchstart",(e)=>{
    touchStartX = e.touches[0].pageX;
    touchScroll = slider.scrollLeft;
  },{passive:true});

  slider.addEventListener("touchmove",(e)=>{
    const x = e.touches[0].pageX;
    const walk = (touchStartX - x) * 1.5;
    slider.scrollLeft = touchScroll + walk;
  },{passive:true});

function updateArrows(){
  prev.style.opacity = container.scrollLeft <= 10 ? ".3" : "1";
  next.style.opacity = 
    container.scrollLeft + container.clientWidth >= container.scrollWidth-10
    ? ".3" : "1";
}

container.addEventListener("scroll", updateArrows);
updateArrows();

audio.addEventListener("timeupdate",()=>{
  const energy = Math.sin(audio.currentTime*4)*0.5+0.5;
  document.body.style.setProperty("--music-energy",energy);
});

/* ================= GLOBAL AUDIO TRACKER (AUTO DB SAVE) ================= */

document.addEventListener("play", e => {

  if(e.target.tagName !== "AUDIO") return;

  const audio = e.target;

  /* get metadata from html attributes */
  const meta = {
    title:  audio.dataset.title  || "Unknown Song",
    artist: audio.dataset.artist || "Unknown Artist",
    cover:  audio.dataset.cover  || "images/default.jpg"
  };

  console.log("Tracking:", meta.title);

  PlayerDB.addHistory(meta);

  /* save resume position */
  audio.ontimeupdate = () => {
    PlayerDB.setLast(meta, audio.currentTime);
  };

}, true);


});




