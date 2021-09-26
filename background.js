console.log("bg is running.....");

function setUpAudioElement(source) {
    var audioElement = document.createElement('audio');
    audioElement.setAttribute("preload", "auto");
    audioElement.autobuffer = true;
    var audioSrc = document.createElement('source');
    audioSrc.type = 'audio/mpeg';
    audioSrc.src = source;
    audioElement.appendChild(audioSrc);
    return audioElement;
}

let audios = [new Audio('sounds/birds.mp3'), new Audio('sounds/cicadas.mp3'), new Audio('sounds/leaves.mp3'),
            new Audio('sounds/uguisu-bird.mp3'), new Audio('sounds/waterfall.mp3'), new Audio('sounds/water-stream.mp3'),
            new Audio('sounds/windchime.mp3'), new Audio('sounds/wind.mp3')]
for (var i = 0; i < audios.length; i++) {
    audios[i].loop = true;
    audios[i].play();
}

chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log("got the sound!");
        for (let i = 0; i < audios.length; i++) {
            if (request.action == "play") {
                // audios[i].load;
                audios[i].loop = true;
                audios[i].play();
                console.log(request.volumes);
                console.log(request.volumes[i]);
                audios[i].volume = parseFloat(request.volumes[i]).toFixed(2);
                console.log("changing the volume done:" + parseInt(request.volumes[i]));
            } else if (request.action == "pause") {
                audios[i].pause();
            }
        }
    });
