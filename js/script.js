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
    let toLeft = direction == "left" ? true : false;
    for(let i = 0; i < articles.length; ++i){
        let e = articles[i];
        if(e.classList.contains("articleFocus")){
            e.classList.remove("articleFocus");
            toLeft ? e.classList.add("articleLeft") : e.classList.add("articleRight");
        } else if(e.classList.contains("articleLeft")){
            e.classList.remove("articleLeft");
            toLeft ? e.classList.add("articleRight") : e.classList.add("articleFocus");
        } else if(e.classList.contains("articleRight")){
            e.classList.remove("articleRight");
            toLeft ? e.classList.add("articleFocus") : e.classList.add("articleLeft");
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
            targetId = activeId == children.length-1 ? 0 : activeId+1
            startScroll(children[targetId])
        }
        
        if (touchendX > touchstartX) {
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
    document.addEventListener("click", removeBurger)
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
        let sb = new HorizontalScrollBar(get("#carProjet"), get("#elements"), get("#cursor"));
        let elements = get("#elements"), line = get("#line");
        sb.onScroll(function(center, end){
            elements.style = `background-image : radial-gradient(circle at ${center}px,rgba(255, 221, 235, 1) ${end-5}px, rgba(31, 0, 23, 1) ${end}px) !important;`
            line.style = `background-image : radial-gradient(circle at ${center}px,rgba(255, 221, 235, 1) ${end-5}px, rgba(31, 0, 23, 1) ${end}px) !important;`
        })
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

    return(parsedGithubData)
    
}


async function insertProject(data) {
    let readme;
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
                        <div class="minia" style="background-image: url('${data.img}');" role="img" aria-label="Image d'illustration pour mon projet ${data.name}"> </div>
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
    let link = {
        "Stateur": "./img/stateur.jpg",
        "Interstalla": "./img/interstella.jpg",
        "Flex": "./img/flex.jpg",
        "Diskype": "./img/diskype.jpg",
        "Portfolio": "./img/portfolio.png",
        "Liquid-Glass-CSS": "./img/lgcss.gif"
    };
    return link[project];
}


function getLanguageIcon(language){
    let icons = {
        "Java": `<i class="fa-brands fa-java"></i>`,
        "HTML": `<i class="fa-brands fa-html5"></i>`,
        "JavaScript": `<i class="fa-brands fa-square-js"></i>`,
        "CSS": `<i class="fa-brands fa-css"></i>`
    }
    return icons[language];
}

class HorizontalScrollBar{
    constructor(scrollarea, scrollbar, bar, transformMethod = (barposition) => `translate(${barposition}px, -50%)`){
        this.scrollarea = scrollarea;
        this.scrollbar = scrollbar;
        this.bar = bar;
        this.rect = this.scrollbar.getBoundingClientRect();
        this.barPos = this.rect.left;
        this.scrollBarWidth = this.scrollbar.offsetWidth;
        this.scrollBarRight = this.scrollbar.getBoundingClientRect().right;
        this.renderWidth = this.scrollarea.offsetWidth //taille affichée a l'écran
        this.scrollWidth = this.scrollarea.scrollWidth; //taille totale de l'élément
        this.scrollLeft = Math.floor(this.scrollWidth) - Math.floor(this.renderWidth);
        this.bar.style.width = `${this.renderWidth*this.scrollBarWidth/this.scrollWidth}px`;
        this.barRight = Math.floor(this.bar.getBoundingClientRect().right);
        this.maxSpaceLeft = this.scrollBarRight - this.barRight;
        this.transform = transformMethod;
        this.onScroll();

        let updatesbBind = this.#updatescrollbar.bind(this);
        let updatebarBind = this.#updateCursor.bind(this);


        scrollarea.addEventListener("scroll", updatesbBind);
        
        
        //clic support pour la touchbar sur pc
        scrollbar.addEventListener("mousedown", (e)=>{
            scrollarea.removeEventListener("scroll", updatesbBind);
            scrollbar.addEventListener("mousemove", updatebarBind);
        })
    
        document.addEventListener("mouseup", ()=>{
            scrollbar.removeEventListener("mousemove", updatebarBind);
            scrollarea.addEventListener("scroll", updatesbBind);
        })
    
        //touch support pour la scrollbar sur mobile
        scrollbar.addEventListener("touchstart", (e)=>{
            scrollarea.removeEventListener("scroll", updatesbBind);
            scrollbar.addEventListener("touchmove", updatebarBind);
        })
    
        document.addEventListener("touchend", (e)=>{
            scrollbar.removeEventListener("touchmove", updatebarBind);
            scrollarea.addEventListener("scroll", updatesbBind);
        })
    }

    onScroll(fun = (barCenter, barEnd)=>{}){
        this.styleFun = fun;
        this.#updatescrollbar();
    }

    setTransform(transformMethod = (barposition) => `translate(${barposition}px, -50%)`){
        this.transform = transformMethod;
    }


    #updateCursor(e){
        let cursorPos;
        if(e.type == "touchmove"){
            cursorPos = e.changedTouches[0].clientX;
        } else {
            cursorPos = e.clientX;
        }
        let cursorRelativePos = cursorPos-this.barPos; //position du curseur par rapport a la scrollbar
        let actualBarRightPos = Math.floor(this.bar.getBoundingClientRect().right); //position de l'extremité gauche de la barre de la scrollbar
        let actualSpaceLeft = this.scrollBarRight - actualBarRightPos; //espace restant entre l'extrémité gauche de la barre de scroll et l'extrémité gauche de la scrollbar
        let spaceTotal = this.scrollBarWidth - this.bar.offsetWidth; //espace total pour calculer le ratio en % de scroll
        let trueOffset = actualSpaceLeft*100/this.maxSpaceLeft; //ratio en % d'a quel point la scrollbar a été scroll
        trueOffset = Math.abs(trueOffset-100); //j'inverse le % car si il reste 0% d'espace a scroll on veut que le carrousel soit scroll a 100%
        trueOffset = (trueOffset*this.scrollLeft/100); //je prends le % pixel du carrousel a scroll
        let barposition = cursorRelativePos-(this.bar.offsetWidth/2); //on deplace la barre vers le curseur - la moitié de la taille de la barre afin de la centrer
        let barCenter = cursorRelativePos;
        let barEnd = this.bar.offsetWidth/2;
        //on gere les extrémités
        if(cursorRelativePos-(this.bar.offsetWidth/2) < 0){
            barposition = 0;
            barCenter = this.bar.offsetWidth/2-5;
        } else if (cursorRelativePos-(this.bar.offsetWidth/2) > spaceTotal){
            barposition = spaceTotal;
            barCenter = this.scrollbar.offsetWidth - this.bar.offsetWidth/2 + 5;
        }
        this.bar.style.transform = this.transform(barposition);
        this.styleFun(barCenter, barEnd)
        this.scrollarea.scrollTo(trueOffset, 0);
    }

    #updatescrollbar(){
        let scrollBarWidth = this.scrollbar.offsetWidth; //taille du scrollbar
        let scrollPos = this.scrollarea.scrollLeft //a quel pt l'élément a été scroll
        let offset = scrollPos*scrollBarWidth/this.scrollWidth;
        this.bar.style.transform = this.transform(offset);
        let barCenter = offset+(this.bar.offsetWidth/2)
        let barEnd = this.bar.offsetWidth/2+4
        this.styleFun(barCenter, barEnd)
    }
}

let intervalAnim;
let stoptt = false;
let carrousel = get("#carProjet");
let bar = get("#projScroll");

intervalAnim = setInterval(() => {
                    autoScroll();
                }, 7777);

addEvt(carrousel, "touchstart", cancelCarAnim);
addEvt(carrousel, "mousedown", cancelCarAnim);
addEvt(bar, "mousedown", cancelCarAnim)

addEvt(bar, "touchstart", function(e){
    cancelCarAnim(); 
    get("#cursor").classList.add("touched");  
})
document.addEventListener("touchend", (e)=>{
    get("#cursor").classList.remove("touched");
})


function cancelCarAnim(){
    stoptt = true;
    clearInterval(intervalAnim);
    cancelAnimationFrame(animId);
    cancelAnimationFrame(animId2);
    delEvt(carrousel, "touchstart", cancelCarAnim);
    delEvt(carrousel, "mousedown", cancelCarAnim);
    delEvt(bar, "mousedown", cancelCarAnim)
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



(function(){
    emailjs.init({
    publicKey: "yYpHDqxVNiasi79Ps",
    });
})();

let mailLog = get("#mailLog")
addEvt(get("form"), "submit", function(e){
    e.preventDefault();
    mailLog.style.backgroundColor = "";
    mailLog.innerText = "";
    let params = {
        name:get("#sujet").value,
        email:get("#mail").value,
        message:get("#text").value
    }
    let complete = true;
    for(key in params){
        if(params[key] == ""){
            mailLog.innerText = `Le champ ${key == "name" ? "Nom" : key} ne peut pas être vide`
            complete = false;
        }
    }
    if(!params.email.match(/.*@.*\..*/)){
        mailLog.innerText = `Veuillez entrer une adresse mail valide`
        complete = false;
    }
    if(complete){
        mailLog.style.backgroundColor = "#68ff8494";
        mailLog.innerText = "Envoi en cours"
        emailjs.send("service_3942ntr", "template_vmiqhyq", params).then(
            function (response){
                mailLog.innerText = "Email bien envoyé."
                get("form").reset();
            },
            function(error){
                console.log(error)
                mailLog.innerText = `L'email n'a pas pu être envoyé`
            }
        )
    }
    mailLog.style.display = "block"
})