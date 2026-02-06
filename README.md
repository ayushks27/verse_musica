Verse — Interactive Music & Media Web Experience

Verse is a front-end multimedia web application inspired by modern streaming platforms.
It blends music playback, moving poster rails, artist galleries, and interactive UI panels into one seamless experience.

The project focuses on **UI logic, animation systems, and media interaction**, not hosting heavy media assets.

Features

🎵 Smart Audio Manager

* Only one audio/video plays globally
* Play / pause sync across all sections
* Resume tracking & playback memory
* Listening history + notifications

🎬 Infinite Moving Poster Rail

* Seamless infinite scrolling posters
* No snapping or jump resets
* Smooth GPU-optimized animation

🖼 Image Zoom Viewer

* Click any image to zoom preview
* Smooth modal animation
* Close on outside click or ESC
* Works with dynamically loaded content

📺 Video Snippets

* Auto-stops music when video plays
* Prevents multiple videos playing together
* Clean UI restoration

🔎 Live Search

* Real-time filtering using data attributes
* Instant results without reload

🎛 Interactive UI

* Dark / Light theme toggle
* Follow buttons & like system
* Notifications & settings panels
* Drag-scroll carousel



Tech Stack

* HTML5
* CSS3 (Flexbox, transitions, animations)
* Vanilla JavaScript (no frameworks)
* LocalStorage persistence

Project Structure

    Verse/
    │── index.html
    │── style.css
    │── script.js
    │
    ├── images/      (ignored from Git)
    ├── audio/       (ignored from Git)
    ├── video/       (ignored from Git)

Media Files Not Included

To keep the repository lightweight, large assets are excluded:

* Posters / images
* Songs / audio
* Video files

After cloning, add your own media inside:

    images/
    audio/
    video/

The UI will automatically load them.

Run Locally

Clone the repository:

    git clone https://github.com/YOUR_USERNAME/verse.git

Open the project:

    cd verse

Run in browser:
  
    Open index.html

No build tools required — pure front-end project.

Purpose

Verse demonstrates:

* Advanced DOM event handling
* Cross-component media synchronization
* Infinite animation techniques
* Modal viewer architecture
* Complex UI state management without frameworks

License

Free for learning and personal use.
Do not redistribute copyrighted media.

Author

Developed by Purnendu
