// msgObj should have all the user inputs from the popup
// ie. brightness, saturation, colormap, ...

// listens to any input change of popup window and changes DOM of page accordingly
chrome.runtime.onMessage.addListener(msgObj => {
    console.log("recieved a message")
    //selecting all elements to be changed
    var allEls = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, a, div, body, img"); //and other elements
    for (var i = 0; i < allEls.length; i++) {

        if (msgObj.type == "brightness") {
            allEls[i].style.cssText += "filter:brightness(" + msgObj.value + ");";
        } else if (msgObj.type == "saturation") {
            allEls[i].style.cssText += "filter:saturate(" + msgObj.value + ");"
        } else if (msgObj.type == "fontSize") {
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
