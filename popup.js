// finds the input range slider

window.onload = function () {
    chrome.storage.sync.get('fontSize', function (data) {
        fontSize.value = data.fontSize;
    });
    chrome.storage.sync.get('font', function (data) {
        font.value = data.font;
    });
    chrome.storage.sync.get('darkMode', function (data) {
        darkMode.value = data.darkMode;
        console.log(darkMode.value);
    });
    if (darkMode) {
        if (document.getElementById('checkbox') != null)
            document.getElementById('checkbox').checked = true;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id,
            {
                value: fontSize.value,
                type: "fontSize"
            });
        console.log("info sent fontSize")
    });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id,
            {
                value: font.value,
                type: "font"
            });
        console.log("info sent font")
    });
}

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
    var darkMode = document.body.classList.contains('dark');
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

font = document.getElementById("font");

font.addEventListener('input', function () {
    syncSet();
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id,
            {
                value: font.value,
                type: "font"
            });
        console.log("info sent font");
    });
});


fontSize = document.getElementById("font-size");

fontSize.addEventListener('input', function () {
    syncSet();
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id,
            {
                value: fontSize.value,
                type: "fontSize"
            });
        console.log("info sent fontSize")
    });
});

// ambient sound 
window.addEventListener("DOMContentLoaded", event => {
    // event listener for  input
    let volumes = [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2];
    var playPauseBtn = document.getElementById("play");
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


function syncSet() {
    chrome.storage.sync.set({ 'font': font.value, 'fontSize': fontSize.value, 'darkMode': dark.checked }, function () {
        console.log("font: " + font.value + " fontSize: " + fontSize.value);
    });
}

// Definitions: Input Word
const inputEl = document.getElementById("input-el");
const defBtn = document.getElementById("def-btn");
const def = document.getElementById("definitions-el");
const word = document.getElementById("word-el");
defBtn.addEventListener("click", function () {
    def.innerHTML = "Definition: ";
    word.innerHTML = "Word: " + inputEl.value;
    const request = new XMLHttpRequest();
    request.open("GET", "https://api.dictionaryapi.dev/api/v2/entries/en/" + inputEl.value);
    request.send();
    request.onload = function () {
        let data = JSON.parse(request.response); //this.response
        def.innerHTML += data[0].meanings[0].definitions[0].definition;
        // Account for when it's a non-existent word and so doesn't have definition. 
        // Make sure it's a valid single word
        //def.innerHTML += request.response;
    };
});

//censor words
let censorWords = [];
const addCensorBtn = document.getElementById("add-censor-btn");
addCensorBtn.addEventListener("click", function(){
    const inputEl = document.getElementById("censor-inp");
    censorWords.push(inputEl.value);
    console.log(censorWords);

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, 
            {censorWords: censorWords});
        console.log("info sent")
    });
});

let speech = new SpeechSynthesisUtterance();
speech.lang = "en";

let voices = [];
window.speechSynthesis.onvoiceschanged = () => {
  voices = window.speechSynthesis.getVoices();
  let voiceSelect = document.querySelector("#voices");
  voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
};

document.querySelector("#speed").addEventListener("input", () => {
    const speed = document.querySelector("#speed").value;
    speech.rate = speed;
    document.querySelector("#speed-label").innerHTML = 'Speed - ' + speed;
    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //   chrome.tabs.sendMessage(tabs[0].id, 
    //       {speed: speed,
    //       type: "speed"});
    //       console.log("info sent")
    // });
});

document.querySelector("#pitch").addEventListener("input", () => {
    const pitch = document.querySelector("#pitch").value;
    speech.pitch = pitch;
    document.querySelector("#pitch-label").innerHTML = 'Pitch - ' + pitch;
    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, 
    //         {pitch: pitch,
    //         type: "pitch"});
    //         console.log("info sent")
    // });
});


// Show Content Warnings 
let cwWords = []; // Content Warning Words
const addCWBtn = document.getElementById("add-cw-btn");
addCWBtn.addEventListener("click", function(){
    const inputEl = document.getElementById("cw-input");
    cwWords.push(inputEl.value);
    console.log(cwWords);

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, 
            {cwWords: cwWords});
        console.log("CW sent")
    });
})

