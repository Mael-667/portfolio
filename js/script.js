function addEvt(target, event, fun){
    target.addEventListener(event, fun);
}

function delEvt(target, event, fun){
    target.removeEventListener(event, fun);
}

function get(element, target = document){
    return target.querySelector(element);
}

function toggleAnim(target, cssClass){
    function removeAnim(){
        delEvt(target, "animationend", removeAnim);
        target.classList.toggle(cssClass);
    }
    addEvt(target, "animationend", removeAnim)
    target.classList.toggle(cssClass);
}

function triFusion(array, fun = (leftEntry, rightEntry) => leftEntry > rightEntry ){
    function defusion(arrayCopy){
        if(arrayCopy.length == 1){
            return arrayCopy;
        } else {
            let g, d;
            g = arrayCopy.slice(0, arrayCopy.length/2);
            d = arrayCopy.slice(arrayCopy.length/2, arrayCopy.length);          
            return fusion(defusion(g), defusion(d))
        }
    }

    function fusion(arrG, arrD){
        let ans = new Array(arrG.length + arrD.length);
        let ig, id;
        ig = id = 0;
        for(let i = 0; i < ans.length; ++i){
            if(ig == arrG.length){
                ans[i] = arrD[id++];
            } else if(id == arrD.length){
                ans[i] = arrG[ig++];
            } else if (fun(arrG[ig], arrD[id])){
                ans[i] = arrG[ig++];
            } else {
                ans[i] = arrD[id++];
            }
        }
        return ans;
    }

    return defusion(array);
}

function isTargetInElement(target, element){
    let coTarget = target.getBoundingClientRect();
    let coElement = element.getBoundingClientRect();
    if(!(coTarget.top >= coElement.top)){
        return false;
    }
    if(!(coTarget.bottom <= coElement.bottom)){
        return false;
    }
    if(!(coTarget.left >= coElement.left)){
        return false;
    }
    if(!(coTarget.right <= coElement.right)){
        return false;
    }
    return true;
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




let intro = document.querySelector("#intro");
intro.style.height = `${window.innerHeight - 25}px`;
let divProjet = get("#projets");
let projetsAnimSetuped = false;
getGithubData()
document.addEventListener("scroll", function(e){
    if(isTargetInElement(get("header li"), intro)){
        document.querySelectorAll("header .liquidGlass").forEach(e => 
            e.classList.add("glassLightMode")
        );
    } else {
        document.querySelectorAll("header .liquidGlass").forEach(e =>
            e.classList.remove("glassLightMode")
        );
    }
})




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
        toggleAnim(e, "wobble-hor-bottom")
    }
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


let menuOpened = false;

document.querySelector("#btnBurger").addEventListener("click", function(e){
    e.stopImmediatePropagation();
    document.querySelector("#btnBurger").classList.add("rotate-out-2-ccw");

    let ul = document.querySelector("header ul");
    ul.style.display = "flex";
    ul.classList.toggle("appear");
    menuOpened = true;
    addEvt(document, "click", removeBurger)
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
        delEvt(document, "click", removeBurger)
    }
}

function resetBurger(){
    let ul = document.querySelector("header ul");
    ul.style.display = "none"
    ul.classList.remove("Reverseappear")
    document.querySelector("#btnBurger").classList.remove("Reverserotate-out-2-ccw")
    ul.removeEventListener("animationend", resetBurger)
}


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
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    let result = await response.json();
    result = triFusion(result, (g, d) => g.id < d.id)

    let limit = result.length > 6 ? 6 : result.length;
    for (let index = 0; index < limit; index++) {
        await insertProject(await parseGithubProj(result[index]));
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
    parsedGithubData.readme = `${data.url}/readme`
    parsedGithubData.desc = data.description;
    // console.log(parsedGithubData);
    
    return(parsedGithubData)
    
}


async function insertProject(data) {
    let readme;
    // console.log(data.readme);
    if(data.desc == null){
        data.desc = await getReadme(data.readme);
    }
    if(data.desc.length < 300){
        readme = data.desc.substring(0, data.desc.length);
    } else {
        readme = `${data.desc.substring(0, 300)}...`;
    }
    let toInsert= `
                    <article class="liquidGlassLarge projet">

                        <div class="minia" style="background-image: url('${data.img}');"> </div>

                        <div class="projText">
                            <div class="projEntete">
                                <h3>${data.name}</h3> <p>${data.languageIcon}</p>
                            </div>
                            <p>${readme}</p>
                        </div>
                        <a href="${data.url}" target="_blank" class="liquidBtn">En voir plus</a>
                    </article>
                   `
    let parent = document.querySelector("#carProjet")
    parent.innerHTML = toInsert + parent.innerHTML;
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
        case("Portfolio"):
            link = "./img/portfolio.png"
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


let carrousel = get("#carProjet");
addEvt(carrousel, "scroll", scrollbar);
addEvt(carrousel, "touchstart", cancelCarAnim);
addEvt(carrousel, "mousedown", cancelCarAnim);

let stoptt = false;
//clic support pour la touchbar sur pc
addEvt(scrollBar, "mousedown", function(e){
    cancelCarAnim();
    delEvt(carrousel, "scroll", scrollbar);
    addEvt(scrollBar, "mousemove", updateCursor);
})

addEvt(document, "mouseup", function(){
    delEvt(scrollBar, "mousemove", updateCursor);
    addEvt(carrousel, "scroll", scrollbar);
})

//touch support pour la scrollbar sur mobile
addEvt(scrollBar, "touchstart", function(e){
    cancelCarAnim();
    delEvt(carrousel, "scroll", scrollbar);
    addEvt(scrollBar, "touchmove", updateCursor);
    cursor.classList.toggle("touched");    
})

addEvt(document, "touchend", function(e){
    delEvt(scrollBar, "touchmove", updateCursor);
    cursor.classList.toggle("touched");
    addEvt(carrousel, "scroll", scrollbar);
})

function cancelCarAnim(){
    stoptt = true;
    clearInterval(intervalAnim);
    cancelAnimationFrame(animId);
    cancelAnimationFrame(animId2);
}

function updateCursor(e){
    let cursorPos;
    if(e.type == "touchmove"){
        cursorPos = e.changedTouches[0].clientX;
    } else {
        cursorPos = e.clientX;
    }
    let cursorRelativePos = cursorPos-barPos;
    let actualCursorRight = Math.floor(cursor.getBoundingClientRect().right);
    let actualSpaceLeft = scrollBarRight - actualCursorRight;
    let spaceTotal = scrollBarWidth - cursor.offsetWidth;
    let trueOffset = actualSpaceLeft*100/maxSpaceLeft;
    // console.log(actualSpaceLeft, maxSpaceLeft);
    
    trueOffset = Math.abs(trueOffset-100);
    trueOffset = (trueOffset*scrollLeft/100);
    let barposition = cursorRelativePos-(cursor.offsetWidth/2);
    let gradientPos = cursorRelativePos;
    if(cursorRelativePos-(cursor.offsetWidth/2) < 0){
        barposition = 0;
        gradientPos = cursor.offsetWidth/2-5;
    } else if (cursorRelativePos-(cursor.offsetWidth/2) > spaceTotal){
        barposition = spaceTotal;
        gradientPos = scrollBar.offsetWidth - cursor.offsetWidth/2 + 5;
    }
    get("#elements").style = `background-image : radial-gradient(circle at ${gradientPos}px,rgba(255, 221, 235, 1) ${(cursor.offsetWidth/2)-5}px, rgba(31, 0, 23, 1) ${(cursor.offsetWidth/2)}px) !important;`
    get("#line").style = `background-image : radial-gradient(circle at ${gradientPos}px,rgba(255, 221, 235, 1) ${(cursor.offsetWidth/2)-5}px, rgba(31, 0, 23, 1) ${(cursor.offsetWidth/2)}px) !important;`
    cursor.style.transform = `translate(${barposition}px, -50%)`;
    carrousel.scrollTo(trueOffset, 0);
}

let firstSetup = true;
let intervalAnim;

function scrollbar(){
    // let scrollBar = document.querySelector("#elements")
    let scrollBarWidth = scrollBar.offsetWidth; //taille du scrollbar
    let scrollWidth = carrousel.scrollWidth; //taille totale de l'élément
    let scrollPos = carrousel.scrollLeft //a quel pt l'élément a été scroll
    let renderWidth = carrousel.offsetWidth //taille affichée a l'écran
    let cursor = document.querySelector("#cursor")
    if(firstSetup){        
        cursor.style.width = `${renderWidth*scrollBarWidth/scrollWidth}px`;
        setupScrollBarSpaceLeft();
        
        intervalAnim = setInterval(() => {
                autoScroll();
            }, 7777);
        firstSetup = false;
    }
    let offset = scrollPos*scrollBarWidth/scrollWidth;
    cursor.style.transform = `translate(${offset}px, -50%)`

    get("#elements").style = `background-image : radial-gradient(circle at ${offset+(cursor.offsetWidth/2)-1}px,rgba(255, 221, 235, 1) ${(cursor.offsetWidth/2)}px, rgba(31, 0, 23, 1) ${(cursor.offsetWidth/2)+2}px) !important;`
    get("#line").style = `background-image : radial-gradient(circle at ${offset+(cursor.offsetWidth/2)-1}px,rgba(255, 221, 235, 1) ${(cursor.offsetWidth/2)}px, rgba(31, 0, 23, 1) ${(cursor.offsetWidth/2)+2}px) !important;`
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
}

let target = 0;
let incr = 0;
let decr = carrousel.scrollWidth/77;
function autoScroll(){
    if(target == carrousel.scrollWidth-carrousel.offsetWidth){
        scrollAnimTo0();
        return;
    }
    let carrouselWidth = carrousel.scrollWidth;
    let steps = carrousel.childElementCount;
    let nextStep = carrouselWidth/steps;
    let scrollPos = carrousel.scrollLeft; //a quel pt l'élément a été scroll
    target = scrollPos+nextStep;
    if(target > carrousel.scrollWidth-carrousel.offsetWidth){
        target = carrousel.scrollWidth-carrousel.offsetWidth 
    }
    incr = nextStep/77;
    scrollAnim();
}
let animId;
function scrollAnim(){    
    if(stoptt){
        return;
    }
    if(carrousel.scrollLeft < target){
        carrousel.scrollTo(carrousel.scrollLeft+incr, 0);
        animId = requestAnimationFrame(scrollAnim);
    }
}
let animId2;
function scrollAnimTo0(){
    if(stoptt){
        return;
    }
    if(target > 0){
        target = target-decr;
        carrousel.scrollTo(target, 0);
        animId2 = requestAnimationFrame(scrollAnimTo0);
    }
}


addEvt(get("form"), "submit", function(e){
    e.preventDefault();
    let sujet = get("#sujet");
    let obj = get("#text");
})