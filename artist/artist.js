document.addEventListener("DOMContentLoaded", function () {
    const playButtons = document.querySelectorAll(".play-button");
    const heartButtons = document.querySelectorAll(".heart-button");

    playButtons.forEach((button) => {
        const audio = button.parentNode.querySelector("audio");
        button.addEventListener("click", function () {
            if (audio.paused) {
                audio.play();
                button.querySelector("i").classList.replace("bxs-right-arrow", "bx-pause");
            } else {
                audio.pause();
                button.querySelector("i").classList.replace("bx-pause", "bxs-right-arrow");
            }
        });
    });

    heartButtons.forEach((button) => {
        button.addEventListener("click", function () {
            button.classList.toggle("liked");
        });
    });
});
