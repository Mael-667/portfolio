document.querySelector("#intro").style.height = `${window.innerHeight - 25}px`
getGithubData()


document.addEventListener("scroll", function(e){
    let euh = isElementInViewport(document.querySelector("#intro")); 
    if(euh){
        document.querySelectorAll("header .liquidGlass").forEach(e => 
            e.classList.contains("glassDarkMode") ? e.classList.remove("glassDarkMode") : 0
        )
    } else {
        document.querySelectorAll("header .liquidGlass").forEach(e =>
                e.classList.add("glassDarkMode")
        )
    }
})

function isElementInViewport (el) {
    var rect = el.getBoundingClientRect();

    // console.log(window.innerHeight, window.innerWidth, rect);
    return rect.bottom > 1
    
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
    let articles = document.querySelector("#carrousel").children
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

async function getGithubData() {
  const url = "https://api.github.com/users/Mael-667/repos";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    // console.log(result);

    for (let index = 0; index < result.length; index++) {
        insertProject(await parseGithubProj(result[index]));
        document.querySelector("#projScroll").innerHTML += `<div class="miniBar"><span class="bar"></span><i class="fa-solid fa-circle"></i></div>`
    }

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


document.querySelector("#carProjet").addEventListener("scroll", function(e){
    // console.log(e);
    
})

function scrollbar(){
    let carrousel = document.querySelector("#carProjet");
    let scrollWidth = carrousel.scrollWidth;
}