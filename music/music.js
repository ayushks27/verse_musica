document.addEventListener("DOMContentLoaded", function () {
    const galleryItems = document.querySelectorAll(".gallery-item");

    galleryItems.forEach((item) => {
        const playButton = item.querySelector(".play-button");
        const heartButton = item.querySelector(".heart-button");
        const audio = item.querySelector("audio");
        const audioSrc = item.dataset.audio;

        if (audioSrc) {
            audio.src = audioSrc;
        }

        // Play/Pause functionality
        playButton.addEventListener("click", function () {
            const playIcon = playButton.querySelector("i"); 
            if (audio.paused) {
                // Pause all other audios
                document.querySelectorAll(".gallery-item audio").forEach((otherAudio) => {
                    if (otherAudio !== audio) {
                        otherAudio.pause();
                        const otherPlayIcon = otherAudio.closest(".gallery-item").querySelector(".play-button i");
                        if (otherPlayIcon) {
                            otherPlayIcon.classList.replace("bx-pause", "bxs-right-arrow");
                        }
                    }
                });

                // Play current audio
                audio.play();
                if (playIcon) {
                    playIcon.classList.replace("bxs-right-arrow", "bx-pause");
                }
            } else {
                // Pause current audio
                audio.pause();
                if (playIcon) {
                    playIcon.classList.replace("bx-pause", "bxs-right-arrow");
                }
            }
        });

        // Heart button functionality
        heartButton.addEventListener("click", function () {
            heartButton.classList.toggle("liked");
            const heartIcon = heartButton.querySelector("i");
            if (heartIcon) {
                heartIcon.classList.toggle("bxs-heart");
                heartIcon.classList.toggle("bx-heart");
            }
        });

        // Reset play button when audio ends
        audio.addEventListener("ended", function () {
            const playIcon = playButton.querySelector("i");
            if (playIcon) {
                playIcon.classList.replace("bx-pause", "bxs-right-arrow");
            }
        });
    });
});


























