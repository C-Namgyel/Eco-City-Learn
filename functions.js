function setAuthScrn(scrn) {
    for (let x of document.querySelectorAll(".authScrns")) {
        if (x.id == scrn) {
            x.hidden = false;
        } else {
            x.hidden = true;
        }
    }
}
function getScreen() {
    var visibleDiv = document.querySelector('.scrn:not([hidden])');
    return(visibleDiv);
}
var timeout;
var currentScrn = "home";
var sequence = ["home", "community", "profile"];
function setScreen(val) {
    clearTimeout(timeout);
    let thisScrn = document.getElementById(currentScrn);
    currentScrn = val;
    let newScrn = document.getElementById(val)
    for (let x of document.querySelectorAll(".scrn")) {
        x.hidden = true;
    }
    thisScrn.hidden = false;
    thisScrn.style.zIndex = 0;
    newScrn.hidden = false;
    newScrn.style.zIndex = 1;
    if (sequence.indexOf(thisScrn.id) < sequence.indexOf(newScrn.id)) {
        newScrn.style.animationName = "slideInLeft";
    } else {
        newScrn.style.animationName = "slideInRight";
    }
    timeout = setTimeout(function() {
        thisScrn.hidden = true;
    }, 150);
}
function snackbar(message) {
    let sb = document.getElementById("snackbar")
    sb.innerHTML = message;
    sb.style.animationName = "snackbar";
    sb.onanimationend = function() {
        sb.style.animationName = NaN;
    }
}
function menuOpen() {
    document.getElementById("menuDiv").style.animationName = "menuOpen";
    document.getElementById("menuBarrier").hidden = false;
    document.getElementById("menuBarrier").style.animationName = "menuFadeIn";
}
function menuClose() {
    document.getElementById("menuDiv").style.animationName = "menuClose";
    document.getElementById("menuBarrier").style.animationName = "menuFadeOut";
    document.getElementById("menuBarrier").onanimationend = function(anim) {
        if (anim.animationName == "menuFadeOut") {
            this.hidden = true;
        }
    }
}
function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}
function compressImg(file, dimensionX, dimensionY, code) {
    let spDiv = document.createElement("div");
    spDiv.style = `position: fixed; left: -${dimensionX}px; width: ${dimensionY}px; height: ${dimensionX}px; overflow: hidden; background-image: url('${URL.createObjectURL(file)}'); background-position: center; background-repeat: no-repeat; background-size: cover;`
    document.body.appendChild(spDiv);
    html2canvas(spDiv, {
        scale: 1,
    }).then(canvas => {
        let imgData = canvas.toDataURL('image/png');
        let convFile = dataURLtoFile(imgData, file.name)
        code(convFile);
    });
}