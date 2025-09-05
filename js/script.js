//TODO : menu burger déroulant avec des bouton en liquidglassbtn
//TODO : gray out les indicateurs des card hors screen sur la scrollbar des projets
//TODO : scroll automatique du carrousel projet


document.querySelector("#intro").style.height = `${window.innerHeight - 25}px`;
getGithubData()


function addEvt(target, event, fun){
    target.addEventListener(event, fun);
}

function delEvt(target, event, fun){
    target.removeEventListener(event, fun);
}

function get(element){
    return document.querySelector(element);
}

document.addEventListener("scroll", function(e){
    let euh = isElementInViewport(document.querySelector("#intro")); 
    if(euh){
        document.querySelectorAll("header .liquidGlass").forEach(e => 
            e.classList.contains("glassDarkMode") ? e.classList.remove("glassDarkMode") : 0
        );
    } else {
        document.querySelectorAll("header .liquidGlass").forEach(e =>
                e.classList.add("glassDarkMode")
        );
    }
})

function isElementInViewport (el) {
    var rect = el.getBoundingClientRect();

    // console.log(window.innerHeight, window.innerWidth, rect);
    return rect.bottom > 1;
    
}

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}


function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function scroll(direction){
    let articles = document.querySelector("#carrousel").children;
    if(direction == "left"){
        for(let i = 0; i < articles.length; ++i){
            let e = articles[i];
            if(e.classList.contains("articleFocus")){
                e.classList.remove("articleFocus");
                e.classList.add("articleLeft");
            } else if(e.classList.contains("articleLeft")){
                e.classList.remove("articleLeft");
                e.classList.add("articleRight");
            } else if(e.classList.contains("articleRight")){
                e.classList.remove("articleRight");
                e.classList.add("articleFocus");
            }
        }
    } else if(direction == "right"){
        for(let i = 0; i < articles.length; ++i){
            let e = articles[i];
            if(e.classList.contains("articleFocus")){
                e.classList.remove("articleFocus");
                e.classList.add("articleRight");
            } else if(e.classList.contains("articleLeft")){
                e.classList.remove("articleLeft");
                e.classList.add("articleFocus");
            } else if(e.classList.contains("articleRight")){
                e.classList.remove("articleRight");
                e.classList.add("articleLeft");
            }
        }
    }
}


function startScroll(e){
    if(!e.classList.contains("active")){
        let li = document.querySelector("#presentation ul").children;
        let active, target;
        for(let i = 0; i < li.length; ++i){
            if(li[i].classList.contains("active")){
                active = i;
                li[i].classList.remove("active")
            } else if (li[i] == e){
                target = i;
                li[i].classList.add("active")
            }
        }

        let steps = target - active;
        let dir = steps >= 0 ? "left" : "right";
        steps = Math.abs(steps);

        for (let i = 0; i < steps; ++i) {
            scroll(dir)
        }

    } else {
        cantSelectActive(e);
    }
}

function cantSelectActive(e){
    e.classList.toggle("wobble-hor-bottom");
    e.addEventListener("animationend", adios);

    function adios(){
        e.removeEventListener("animationend", adios);
        e.classList.toggle("wobble-hor-bottom");
    }
}



// document.addEventListener("click", function(e){
//      console.log(e);

// })

let menuOpened = false;

document.querySelector("#btnBurger").addEventListener("click", function(e){
    e.stopImmediatePropagation();
    document.querySelector("#btnBurger").classList.add("rotate-out-2-ccw");

    let ul = document.querySelector("header ul");
    ul.style.display = "flex";
    ul.classList.toggle("appear");
    menuOpened = true;
})



function removeBurger(){
    if(menuOpened){
        document.querySelector("#btnBurger").classList.remove("rotate-out-2-ccw");
        document.querySelector("#btnBurger").classList.add("Reverserotate-out-2-ccw");
        let ul = document.querySelector("header ul");
        console.log(menuOpened);
        

        ul.classList.toggle("appear");
        ul.classList.add("Reverseappear");
        ul.addEventListener("animationend", resetBurger);

        menuOpened = false;
    }
}

function resetBurger(){
    let ul = document.querySelector("header ul");
    ul.style.display = "none"
    ul.classList.remove("Reverseappear")
    document.querySelector("#btnBurger").classList.remove("Reverserotate-out-2-ccw")
    ul.removeEventListener("animationend", resetBurger)
}

window.onclick = removeBurger


let scrollBar = document.querySelector("#elements");
var rect;
let barPos;
let scrollBarWidth;
let scrollBarRight;
let maxSpaceLeft;
let cursor = document.querySelector("#cursor");
let cursorRight;
let scrollLeft;
async function getGithubData() {
  const url = "https://api.github.com/users/Mael-667/repos";
  try {
    // const response = await fetch(url);
    // if (!response.ok) {
    //   throw new Error(`Response status: ${response.status}`);
    // }

    // const result = await response.json();
    // localStorage.setItem("github", result);
    // console.log(result);


    const result = localStorage.getItem("github")


    let limit = result.length > 7 ? 7 : result.length;
    for (let index = 0; index < limit; index++) {
        insertProject(await parseGithubProj(result[index]));
        document.querySelector("#elements").innerHTML += `<i class="fa-solid fa-circle"></i>`
    }
    scrollbarSetup();
    scrollbar();
} catch (error) {
    console.error(error.message);
  }
}

async function getReadme(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    
    return b64DecodeUnicode(result.content);
    
  } catch (error) {
    console.error(error.message);
    return "";
  }
}

async function parseGithubProj(data){
    let parsedGithubData = {};
    parsedGithubData.name = capitalizeFirstLetter(data.name);

    parsedGithubData.url = data.html_url;
    parsedGithubData.img = getProjectIcon(parsedGithubData.name);
    parsedGithubData.primaryLanguage = data.language;
    parsedGithubData.languageIcon = getLanguageIcon(data.language);
    parsedGithubData.stars = data.stargazers_count; //one day.
    parsedGithubData.readme = await getReadme(`${data.url}/readme`)
    // console.log(parsedGithubData);
    
    return(parsedGithubData)
    
}


function insertProject(data) {
    let readme;
    // console.log(data.readme);
    
    if(data.readme.length < 350){
        readme = data.readme.substring(0, data.readme.length);
    } else {
        readme = `${data.readme.substring(0, 150)}...`;
    }
    let toInsert= `
                    <article class="liquidGlass liquidGlassLarge darkGlassMode projet">

                        <div class="minia" style="background-image: url('${data.img}');"> </div>

                        <div class="projText">
                            <div class="projEntete">
                                <h3>${data.name}</h3> <p>${data.languageIcon}</p>
                            </div>
                            <p>${readme}</p>
                        </div>
                        <a href="${data.url}" target="_blank"><button class="liquidBtn">En voir plus</button></a>
                    </article>
                   `
    let parent = document.querySelector("#carProjet")
    parent.innerHTML = toInsert + parent.innerHTML;
}







let touchstartX, touchstartY, touchendX, touchendY;
document.querySelector("#carrousel").addEventListener('touchstart', function (event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, false);

document.querySelector("#carrousel").addEventListener('touchend', function (event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture();
}, false);


function handleGesture() {
    let delta = window.innerWidth*10/100;
    let vDelta = window.innerHeight*15/100;
    let target = document.querySelector(".active");
    let children = target.parentElement.children
    let activeId;
    for(let i = 0; i < children.length; ++i){
        if(children[i] == target){
            activeId = i;
        }
    }
    let targetId;
    if(Math.abs(touchstartX-touchendX) > delta && Math.abs(touchstartY-touchendY) < vDelta){
        if (touchstartX > touchendX) {
            // console.log('Swiped Left');
            targetId = activeId == children.length-1 ? 0 : activeId+1
            startScroll(children[targetId])
        }
        
        if (touchendX > touchstartX) {
            // console.log('Swiped Right');
            targetId = activeId == 0 ? children.length-1 : activeId-1
            startScroll(children[targetId])
        }
    }
}


function getProjectIcon(project){
    let link ="";
    switch(project){
        case("Stateur"):
            link = "./img/stateur.jpg"
            break;
        case("Interstalla"):
            link = "./img/interstella.jpg"
            break;
        case("Flex"):
            link = "./img/flex.jpg"
            break;
        case("Diskype"):
            link = "./img/diskype.jpg"
            break;
    }
    return link;
}


function getLanguageIcon(language){
    console.log(language);
    
    switch(language){
        case("Java"):
            return `<i class="fa-brands fa-java"></i>`
            break;
        case("HTML"):
            return `<i class="fa-brands fa-html5"></i>`
            break;
        case("JavaScript"):
            return `<i class="fa-brands fa-square-js"></i>`
            break;
        case("CSS"):
            return `<i class="fa-brands fa-css"></i>`
            break;
    }
}

let carProjet = get("#carProjet");
addEvt(carProjet, "scroll", scrollbar);

let carrousel = document.querySelector("#carProjet");


//clic support pour la touchbar sur pc
addEvt(scrollBar, "mousedown", function(e){
    delEvt(carProjet, "scroll", scrollbar);
    addEvt(scrollBar, "mousemove", updateCursor);
})

addEvt(document, "mouseup", function(){
    delEvt(scrollBar, "mousemove", updateCursor);
    addEvt(carProjet, "scroll", scrollbar);
})




//touch support pour la scrollbar sur mobile
addEvt(scrollBar, "touchstart", function(e){
    delEvt(carProjet, "scroll", scrollbar);
    addEvt(scrollBar, "touchmove", updateCursor);
    cursor.classList.toggle("touched");    
})

addEvt(document, "touchend", function(e){
    delEvt(scrollBar, "touchmove", updateCursor);
    cursor.classList.toggle("touched");
    addEvt(carProjet, "scroll", scrollbar);
})



function updateCursor(e){
    let cursorPos;
    if(e.type == "touchmove"){
        cursorPos = e.changedTouches[0].clientX
    } else {
        cursorPos = e.clientX;
    }
    let cursorRelativePos = cursorPos-barPos
    get("#elements").style = `background-image : radial-gradient(circle at ${cursorRelativePos}px,rgb(255, 157, 198) 35%, rgba(31, 0, 23, 1) 40%) !important;`
    get("#line").style = `background-image : radial-gradient(circle at ${cursorRelativePos}px,rgb(255, 157, 198) 35%, rgba(31, 0, 23, 1) 40%) !important;`
    let actualCursorRight = Math.floor(cursor.getBoundingClientRect().right);
    let actualSpaceLeft = scrollBarRight - actualCursorRight;
    let spaceTotal = scrollBarWidth - cursor.offsetWidth;
    let trueOffset = actualSpaceLeft*100/maxSpaceLeft;
    trueOffset = Math.abs(trueOffset-100);
    trueOffset = (trueOffset*scrollLeft/100);
    let barposition;
    if(cursorRelativePos-(cursor.offsetWidth/2) < 0){
        barposition = 0;
    } else if (cursorRelativePos-(cursor.offsetWidth/2) > spaceTotal){
        barposition = spaceTotal;
    } else {
        barposition = cursorRelativePos-(cursor.offsetWidth/2)
    }
    cursor.style.transform = `translate(${barposition}px, -50%)`
    carrousel.scrollTo(trueOffset, 0);
}

let firstSetup = true;

function scrollbar(){
    // let scrollBar = document.querySelector("#elements")
    let scrollBarWidth = scrollBar.offsetWidth; //taille du scrollbar
    let scrollWidth = carrousel.scrollWidth; //taille totale de l'élément
    let scrollPos = carrousel.scrollLeft //a quel pt l'élément a été scroll
    let renderWidth = carrousel.offsetWidth //taille affichée a l'écran
    let cursor = document.querySelector("#cursor")
    if(firstSetup){
        cursor.style.width = `${renderWidth*scrollBarWidth/scrollWidth}px`
        addEvt(cursor, "transitionend", setupScrollBarSpaceLeft)
        firstSetup = false;
    }
    let offset = scrollPos*scrollBarWidth/scrollWidth;
    cursor.style.transform = `translate(${offset}px, -50%)`
}

function scrollbarSetup(){
    rect = scrollBar.getBoundingClientRect();
    barPos = rect.left;
    scrollBarWidth = scrollBar.offsetWidth; 
    scrollBarRight = scrollBar.getBoundingClientRect().right
    scrollLeft = Math.floor(carrousel.scrollWidth) - Math.floor(carrousel.offsetWidth);
}

function setupScrollBarSpaceLeft(){
    cursorRight = Math.floor(cursor.getBoundingClientRect().right);
    maxSpaceLeft = scrollBarRight - cursorRight;
    delEvt(cursor, "transitionend", setupScrollBarSpaceLeft)
}

addEvt(window, "resize", function(){
    console.log("euh");
    scrollbarSetup()
    firstSetup = true;
    scrollbar();
})