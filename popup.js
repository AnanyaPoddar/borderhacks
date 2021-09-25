// finds the input range slider
brightnessTracker = document.querySelectorAll('input')[0]
saturationTracker = document.querySelectorAll('input')[1]

brightnessTracker.addEventListener('input', function () {

    // converts brightness value between 0 to 1
    var brightnessVal = (brightnessTracker.value / 100).toFixed(2).toString();
    document.querySelectorAll('output')[0].innerHTML = brightnessVal;

    // sends message object to activated tab through tab id
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id,
            {
                value: brightnessVal,
                type: "brightness"
            });
        console.log("info sent")
    });
});

saturationTracker.addEventListener('input', function () {

    // converts brightness value between 0 to 1
    var saturationVal = (saturationTracker.value / 100).toFixed(2).toString();
    document.querySelectorAll('output')[1].innerHTML = saturationVal;

    // sends message object to activated tab through tab id
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id,
            {
                value: saturationVal,
                type: "saturation"
            });
        console.log("info sent")
    });
});


dark = document.getElementById('checkBox');

dark.addEventListener('change', () => {
    document.body.classList.toggle('dark');
    darkMode = document.body.classList.contains('dark');
    if (darkMode) {
        chrome.tabs.executeScript({
            file: "darkModeEnable.js"
        });
    }
    else {
        chrome.tabs.executeScript({
            file: "darkModeDisable.js"
        });
    }
});


fontSize = document.getElementById("font-size");

fontSize.addEventListener('input', function () {

    // sends message object to activated tab through tab id
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id,
            {
                value: fontSize.value,
                type: "fontSize"
            });
        console.log("info sent fontSize")
    });
});
font.addEventListener('click', () => {
    var text = font.options[font.selectedIndex].text;
    chrome.tabs.executeScript({
        code: "console.log('hello world');document.querySelector('body').innerText.style.font-size=500px;"
    })
})


font = document.getElementById("font");

font.addEventListener('input', function () {

    // sends message object to activated tab through tab id
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id,
            {
                value: font.value,
                type: "font"
            });
        console.log("info sent font")
    });
});


// ambient sound 
window.addEventListener("DOMContentLoaded", event => {
    // event listener for  input
    let volumes = [0.2, 0.2, 0.2];
    var playPauseBtn = document.getElementById("play-it");
    var action = "pause";
    // change volume of songs
    for (let sound_i = 0; sound_i < volumes.length; sound_i++) {
        const soundVolTracker = document.querySelectorAll('.sound-inp')[sound_i];
        soundVolTracker.addEventListener('input', function () {
            // converts brightness value between 0 to 1
            volumes[sound_i] = (soundVolTracker.value / 100).toFixed(2).toString();
            chrome.extension.sendMessage({ 
                action: action,
                volumes: volumes, 
            });
        });
    }
    playPauseBtn.addEventListener("click", function () {
        console.log("Play was clicked");
        if (action == "play") {
            action = "pause";
        } else {
            action = "play"
        }
        chrome.extension.sendMessage({ 
            action: action,
            volumes: volumes, 
        });
    });
});



// Definitions: Input Word
const inputEl = document.getElementById("input-el");
const defBtn = document.getElementById("def-btn");
const def = document.getElementById("definitions-el");
const word = document.getElementById("word-el");
defBtn.addEventListener("click", function(){
    def.innerHTML = "Definition: ";
    word.innerHTML = "Word: " + inputEl.value;
    const request = new XMLHttpRequest();
    request.open("GET", "https://api.dictionaryapi.dev/api/v2/entries/en/" + inputEl.value);
    request.send();
    request.onload = function() {
        let data = JSON.parse(request.response); //this.response
        def.innerHTML += data[0].meanings[0].definitions[0].definition;
        // Account for when it's a non-existent word and so doesn't have definition. 
        // Make sure it's a valid single word
        //def.innerHTML += request.response;
    };
});

// Definitions: Select Word (on pop-up)

document.addEventListener("selectionchange", () => {
    console.log("Here")
    document.body.onmouseup = function(){
        console.log("Here2")
        let selected = window.getSelection().toString();
        def.innerHTML = "Definition: ";
        word.innerHTML = "Word: " + selected;
        console.log("https://api.dictionaryapi.dev/api/v2/entries/en/" + selected);
        const request2 = new XMLHttpRequest();
        request2.open("GET", "https://api.dictionaryapi.dev/api/v2/entries/en/" + selected);
        request2.send();
        request2.onload = function() {
            let data2 = JSON.parse(request2.response); //this.response
            def.innerHTML += data2[0].meanings[0].definitions[0].definition;
        }
        
    }
})
