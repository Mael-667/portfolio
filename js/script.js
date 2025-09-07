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



//ajouter "data-hue:#hexcolor" a un élement pour que sa couleur imprègne les liquidglass ayant pour parent un élément a la class dynamic qui le survolent
function dynamicColor(){

    let backgrounds = document.querySelectorAll("[data-hue]")
    let parents = document.querySelectorAll(".dynamic")
    let elmnts = [];
    for(parent of parents){ 
        for(enfant of parent.querySelectorAll(".liquidGlass")){
            elmnts.push(enfant);
        }
    } 


    addEvt(document, "scroll", function(){
        let selected = [];

        for(let i = 0; i < backgrounds.length; ++i){
            let color = backgrounds[i].getAttribute("data-hue");
            for(let j = 0; j < elmnts.length; j++){
                if(isTargetInElement(elmnts[j], backgrounds[i])){
                    elmnts[j].classList.add("dynamic")
                    elmnts[j].style.setProperty('--background', `${pSBC(0.01, color)}07`);
                    elmnts[j].style.setProperty('--shadow', `inset 1px 1px 3px 1px ${pSBC(-0.2, color)}20, inset -1px -2px 3px 1px rgb(49 49 49 / 30%), 0px 0px 7px 1px rgb(0 0 0 / 46%)`);
                    selected.push(j);
                }
            }
        }
        for(let i = 0; i < elmnts.length; ++i){
            let euh = true;
            for(let j = 0; j < selected.length; j++){
                if(i == selected[j]){
                    euh = false;
                }
            }
            if(euh){
                elmnts[i].classList.remove("dynamic")
                elmnts[i].style.setProperty('--background', "");
                elmnts[i].style.setProperty('--shadow', ``);
            }
        }
    })
}



const pSBC=(p,c0,c1,l)=>{
    let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
    if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
    if(!this.pSBCr)this.pSBCr=(d)=>{
        let n=d.length,x={};
        if(n>9){
            [r,g,b,a]=d=d.split(","),n=d.length;
            if(n<3||n>4)return null;
            x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
        }else{
            if(n==8||n==6||n<4)return null;
            if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
            d=i(d.slice(1),16);
            if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
            else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
        }return x};
    h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
    if(!f||!t)return null;
    if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
    else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
    a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
    if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
    else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}







let intro = document.querySelector("#intro");
let divProjet = get("#projets");
let projetsAnimSetuped = false;
document.addEventListener("scroll", function(e){
    let euh = isElementInViewport(intro); 
    if(euh){
        document.querySelectorAll("header .liquidGlass").forEach(e => 
            e.classList.remove("glassDarkMode")
        );
    } else {
        document.querySelectorAll("header .liquidGlass").forEach(e =>
                e.classList.add("glassDarkMode")
        );
    }
})

function isElementInViewport (el) {
    var rect = el.getBoundingClientRect();
    // console.log(get("#projets").getBoundingClientRect());
    
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
        // cantSelectActive(e);
        toggleAnim(e, "wobble-hor-bottom")
    }
}

// function cantSelectActive(e){
//     e.classList.toggle("wobble-hor-bottom");
//     e.addEventListener("animationend", adios);

//     function adios(){
//         e.removeEventListener("animationend", adios);
//         e.classList.toggle("wobble-hor-bottom");
//     }
// }



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
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    let result = await response.json();
    result = triFusion(result, (g, d) => g.id < d.id)
    localStorage.setItem("github", result);
    console.log(result);


    // const result = localStorage.getItem("github")


    let limit = result.length > 6 ? 6 : result.length;
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
                        <a href="${data.url}" target="_blank" class="liquidBtn">En voir plus</a>
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

let carProjet = get("#carProjet");
addEvt(carProjet, "scroll", scrollbar);
addEvt(carProjet, "touchstart", cancelCarAnim);
addEvt(carProjet, "mousedown", cancelCarAnim);
let carrousel = document.querySelector("#carProjet");

let stoptt = false;
//clic support pour la touchbar sur pc
addEvt(scrollBar, "mousedown", function(e){
    cancelCarAnim();
    delEvt(carProjet, "scroll", scrollbar);
    addEvt(scrollBar, "mousemove", updateCursor);
})

addEvt(document, "mouseup", function(){
    delEvt(scrollBar, "mousemove", updateCursor);
    addEvt(carProjet, "scroll", scrollbar);
})




//touch support pour la scrollbar sur mobile
addEvt(scrollBar, "touchstart", function(e){
    cancelCarAnim();
    delEvt(carProjet, "scroll", scrollbar);
    addEvt(scrollBar, "touchmove", updateCursor);
    cursor.classList.toggle("touched");    
})

addEvt(document, "touchend", function(e){
    delEvt(scrollBar, "touchmove", updateCursor);
    cursor.classList.toggle("touched");
    addEvt(carProjet, "scroll", scrollbar);
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
    // delEvt(cursor, "transitionend", setupScrollBarSpaceLeft)
}

// addEvt(window, "resize", function(){
//     console.log("euh");
//     scrollbarSetup();
//     firstSetup = true;
//     scrollbar();
// })

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





function tst(nb){
    let array = new Array(nb);
    for(let i = 0; i < nb; ++i){
        array[i] = Math.floor(Math.random() * nb);
    }

    let euh = [
        {age:2},
        {age:50},
        {age:14},
        {age:90},
        {age:1}
    ]

    let start = Date.now();
    // console.log(triFusion(euh, (g, d) => g.age < d.age));
    triFusion(array);
    let fin = Date.now();
    console.log(`TEMPS DEXEC + ${fin-start}MS`);
    // console.log(triFusion(array));
}