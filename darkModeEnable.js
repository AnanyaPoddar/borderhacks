
(function () {
    document.querySelector("html").style.filter = "invert(1) hue-rotate(180deg) contrast(.85) brightness(.9)";

    let media = document.querySelectorAll("img", "picture", "video");
    media.forEach((m) => { m.style.filter = "invert(1) hue-rotate(180deg)" })

    let hover = document.querySelectorAll('.hover');
    hover.forEach(e => e.addEventListener("mouseover", () => mouseOver(e)));

    function mouseOver(e) {
        e.style.filter = "invert(1) hue-rotate(180deg)";
    }
}())