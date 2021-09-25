// finds the input range slider

window.onload = function () {
    chrome.storage.sync.get('fontSize', function (data) {
        fontSize.value = data.fontSize;
    });
    chrome.storage.sync.get('font', function (data) {
        font.value = data.font;
    });
    chrome.storage.sync.get('darkMode', function (data) {
        darkMode = data.darkMode;
    });
    console.log(fontSize.value + " " + font.value + " " + darkMode.value);
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

function syncSet() {
    chrome.storage.sync.set({ 'font': font.value, 'fontSize': fontSize.value, 'darkMode': darkMode }, function () { console.log("font: " + font.value + " fontSize: " + fontSize.value); });
}