
/* Video Player */
document.addEventListener('DOMContentLoaded', function() {
    var playButton = document.createElement('button');
    var resetButton = document.createElement('button');
    var video = document.querySelector('video');

    playButton.textContent = 'Play';
    resetButton.textContent = 'Reset';

    playButton.style.marginRight = '10px';

    playButton.addEventListener('click', function() {
        if (video) {
            if (video.paused) {
                video.play();
                playButton.textContent = 'Pause';
            } else {
                video.pause();
                playButton.textContent = 'Play';
            }
        }
    });
    resetButton.addEventListener('click', function() {
        if (video) {
            video.currentTime = 0;
            video.pause();
            playButton.textContent = 'Play';
        }
    });

    var wrap = document.getElementsByClassName('wrap-vid-aim2024')[0];
    if (wrap) {
        wrap.appendChild(playButton);
        wrap.appendChild(resetButton);
    } else {
        console.error('No container with id "wrap-vid-aim2024" found on the page.');
    }
});