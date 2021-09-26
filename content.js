// msgObj should have all the user inputs from the popup
// ie. brightness, saturation, colormap, ...

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

        }


    }
});

<<<<<<< HEAD


// Definitions - body select's a word

document.addEventListener("selectionchange", function() {
    document.addEventListener("dblclick", function(){
        let selected = window.getSelection().toString();
        const request = new XMLHttpRequest();
        console.log("https://api.dictionaryapi.dev/api/v2/entries/en/" + selected);
        request.open("GET", "https://api.dictionaryapi.dev/api/v2/entries/en/" + selected);
        request.send();
        request.onload = function() {
            let data = JSON.parse(this.response); //this.response
            console.log(data[0].meanings[0].definitions[0].definition);
            // ACCOUNT FOR WHEN NOT CLICKED ON REAL WORD
        }
        
    })
})
=======
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
>>>>>>> e1c747fe3a16415604bbb738f91a228062b97ff2
