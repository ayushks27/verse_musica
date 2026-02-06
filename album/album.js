let currentAudio = null; // Tracks the currently playing audio element
let currentButton = null; // Tracks the button associated with the currently playing audio

function loadAlbums() {
    const albumsContainer = document.querySelector('.albums-container'); // Use the existing albums container in the HTML

    // Find all album items (each album is a div with the class 'album')
    const albums = albumsContainer.querySelectorAll('.album');

    albums.forEach(albumDiv => {
        const songList = albumDiv.querySelector('ul'); // Get the song list inside each album
        const playButtons = songList.querySelectorAll('button'); // Get all play buttons inside the album

        playButtons.forEach(button => {
            button.innerHTML = "<i class='bx bxs-right-arrow'></i> "; // Set default play icon and text

            button.addEventListener('click', function () {
                const parentItem = this.closest('.song-item');
                const audioElement = parentItem.querySelector('audio');

                // Handle toggling for the same button/audio
                if (currentAudio && currentButton === button) {
                    if (currentAudio.paused) {
                        currentAudio.play();
                        this.innerHTML = "<i class='bx bx-pause'></i> "; // Pause icon and text
                    } else {
                        currentAudio.pause();
                        this.innerHTML = "<i class='bx bxs-right-arrow'></i> "; // Play icon and text
                    }
                } else {
                    // Stop the currently playing audio (if any) and reset its button
                    if (currentAudio) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                        currentButton.innerHTML = "<i class='bx bxs-right-arrow'></i> "; // Play icon and text
                    }

                    // Start playing the new audio
                    currentAudio = audioElement;
                    currentAudio.play();
                    this.innerHTML = "<i class='bx bx-pause'></i> "; // Pause icon and text

                    currentButton = this; // Update the current button
                }

                // Reset the play button when the audio ends
                currentAudio.addEventListener('ended', () => {
                    currentAudio = null;
                    currentButton.innerHTML = "<i class='bx bxs-right-arrow'></i> "; // Play icon and text
                });
            });
        });
    });
}

// Ensure the loadAlbums function is called when the page loads
window.onload = loadAlbums;




          


