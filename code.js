// Variables
var currentScrn = "home";
var sequence = ["home", "challange", "community", "profile"];
var timeout;
var data;

// Load Data
fetch('data.json')
    .then(response => response.json())
    .then(dat => {
        // Now you can use your JSON data here
        data = dat;
        createList();
    })
    .catch(error => console.error('Error:', error));
// Functions
function getScreen() {
    var visibleDiv = document.querySelector('.scrn:not([hidden])');
    return(visibleDiv);
}
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

// Navigation
for (let x of document.querySelectorAll(".navBtns")) {
    x.onclick = function() {
        if (x.getAttribute("disabled") == "false" || x.getAttribute("disabled") == undefined) {
            setScreen(x.getAttribute("value"));
            this.setAttribute("disabled", "true");
            this.style.backgroundColor = "lightgrey";
            for (let f of document.querySelectorAll(".navBtns")) {
                if (f != this) {
                    f.setAttribute("disabled", "false");
                    f.style.backgroundColor = "rgba(0, 0, 0, 0)";
                }
            }
        }
    }
}

// Home
function createList() {
    let topics = Object.keys(data);
    for (let t of topics) {
        let div = document.createElement("div");
        div.className = "homeList";
        div.innerHTML = t;
        document.getElementById("homediv").appendChild(div);
    }
};