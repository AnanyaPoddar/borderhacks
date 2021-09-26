// msgObj should have all the user inputs from the popup
// ie. brightness, saturation, colormap, ...
let speech = new SpeechSynthesisUtterance();
speech.lang = "en";

window.addEventListener("DOMContentLoaded", data => {
    chrome.storage.sync.get('fontSize', function (data) {
        console.log(data.fontSize);
    });
    chrome.storage.sync.get('font', function (data) {
        font.value = data.font;
    });
    chrome.storage.sync.get('darkMode', function (data) {
        darkMode = data.darkMode;
    });
    console.log(fontSize.value + " " + font.value + " " + darkMode.value);
});

// listens to any input change of popup window and changes DOM of page accordingly
chrome.runtime.onMessage.addListener(msgObj => {
    // console.log('Hello' + chrome.storage.sync.get('fontSize').value);
    console.log("recieved a message")
    //selecting all elements to be changed
    var allEls = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, a, div, body, img"); //and other elements
    for (var i = 0; i < allEls.length; i++) {

        // if (msgObj.type == "brightness") {
        //     allEls[i].style.cssText += "filter:brightness(" + msgObj.value + ");";
        // } else if (msgObj.type == "saturation") {
        //     allEls[i].style.cssText += "filter:saturate(" + msgObj.value + ");"
        // } 
        if (msgObj.type == "fontSize") {
            allEls[i].style.cssText += "font-size:" + msgObj.value + "px;";
        } else if (msgObj.type == "font") {
            console.log(msgObj.value);
            if (msgObj.value == 'Arial')
                allEls[i].style.cssText += "font-family: 'Arial', 'Helvetica', sans-serif;";
            else if (msgObj.value == 'Calibri')
                allEls[i].style.cssText += "font-family: 'Calibri', sans-serif;";
            else if (msgObj.value == 'Comic Sans')
                allEls[i].style.cssText += "font-family: 'Comic Sans MS', 'Comic Sans', cursive;";
            else if (msgObj.value == 'Tahoma')
                allEls[i].style.cssText += "font-family: 'Tahoma', sans-serif;";
            else if (msgObj.value == 'Times New Roman')
                allEls[i].style.cssText += "font-family: 'Times New Roman', Times, serif;";
            else if (msgObj.value == 'Bold')
                allEls[i].style.cssText += "font-weight: 800;"

        } else if (msgObj.type == "speed") {
            speech.rate = msgObj.speed;
        } else if (msgObj.type == "pitch") {
            speech.pitch = msgObj.pitch;
        } else if (msgObj.type == "voice") {
            let voices = [];
            voices = window.speechSynthesis.getVoices();
            speech.voice = voices[msgObj.voiceIndex];
        }


    }
});

// Definitions - body select's a word
document.addEventListener("selectionchange", function () {
    document.addEventListener("dblclick", function () {
        let selected = window.getSelection().toString();
        const request = new XMLHttpRequest();
        console.log("https://api.dictionaryapi.dev/api/v2/entries/en/" + selected);
        request.open("GET", "https://api.dictionaryapi.dev/api/v2/entries/en/" + selected);
        request.send();
        request.onload = function () {
            let data = JSON.parse(this.response); //this.response
            console.log(data[0].meanings[0].definitions[0].definition);
            // ACCOUNT FOR WHEN NOT CLICKED ON REAL WORD
        }

    })
})
// stuff for censoring words
chrome.runtime.onMessage.addListener(msgObj => {
    console.log("recieved a message")

    // TODO add another item to the json object true/false and toggle with event listener
    const text = document.querySelectorAll('h1, h2, h3, h4, h5, p, caption, span, a, div');

    var censorWords = msgObj.censorWords;
    console.log(censorWords);
    for (let i = 0; i < text.length; i++) {
        // loop over words
        for (var j = 0; j < censorWords.length; j++) {
            if (text[i].innerHTML.includes(censorWords[j])) {
                var replaceCensorWord = "<span style='color:red; background-color:black'>blocked by AccessMe</span>";
                console.log("censored word:" + replaceCensorWord);
                text[i].innerHTML = text[i].innerHTML.replace(censorWords[j], replaceCensorWord);
            }
        }

    }

});

// gets current CW words from localStorage, stores them in myCWWords
const wordsFromLocalStorage = JSON.parse(localStorage.getItem("myCWWords"));
let myCWWords = [];
if (wordsFromLocalStorage) {
    myCWWords = wordsFromLocalStorage;
}

if (myCWWords.length > 0) {
    let includes = [];
    const texts = document.querySelectorAll('h1, h2, h3, h4, h5, p, caption, span, a, div');

    for (let i = 0; i < texts.length; i++) {
        // loop over words
        for (var j = 0; j < myCWWords.length; j++) {
            // If the current CW Word is in the text 
            // AND it's not already in local storage, then it's in the includes array
            if (texts[i].innerHTML.includes(myCWWords[j])) {
                if (!(includes.includes(myCWWords[j]))) {
                    includes.push(myCWWords[j]);
                    console.log("CW contained: " + includes);
                }
            }
        }
    }
    alert("This article contains words you've previously asked for a content warning for: "
        + includes.join(", ") + ". Would you like to proceed?");
}

// Content Warnings 
chrome.runtime.onMessage.addListener(msgObj => {
    console.log("CW recieved a message")

    const text = document.querySelectorAll('h1, h2, h3, h4, h5, p, caption, span, a, div');

    var cwWords = msgObj.cwWords;
    console.log(cwWords);
    //alert(cwWords);
    if(cwWords.length > 0 && cwWords[cwWords.length - 1].length > 0){
        myCWWords.push(cwWords[cwWords.length - 1]); // only takes the last censored word

        let containedWords = []
        localStorage.setItem("myCWWords", JSON.stringify(myCWWords));
        for (let i = 0; i < text.length; i++) {
            // loop over words - TO BE DELETED NOT NEEDED FOR CW
            for (var j = 0; j < cwWords.length; j++) {
                if (text[i].innerHTML.includes(cwWords[j])) {
                    if (!(containedWords.includes(cwWords[j]))) {
                        containedWords.push(cwWords[j]);
                        console.log("CW contained: " + containedWords);
                    }
                }
            }
        }
        if (containedWords.length > 0) {
            alert("This article contains the new word: " + containedWords + ". Would you like to proceed?");
        }
    }

});
async function getTranslation(string1) {
    let url = "https://google-translate20.p.rapidapi.com/translate";
    let response = await fetch(url, {
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "x-rapidapi-host": "google-translate20.p.rapidapi.com",
            "x-rapidapi-key": "4f2b707413msh892c935bf882abap1c7a6ajsnd17684296917"
        },
        "body": JSON.stringify({
            "text": string1,
            "tl": "fr",
            "sl": "en"
        })
    });
    transl = await response.json();
    return transl;
}

var toRead;
document.addEventListener('selectionchange', () => {
    document.body.onmouseup = function () {
        toRead = ""
        document.addEventListener('keydown', (e) => {
            if (e.key == "r") {
                document.onkeyup = function () {
                    toRead = document.getSelection().toString();
                    console.log(toRead);
                    speech.text = toRead;
                    window.speechSynthesis.speak(speech);
                    console.log("read");
                    speech.text = "";
                }
            }
        });
    }
});

