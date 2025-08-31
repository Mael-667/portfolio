document.querySelector("#intro").style.height = `${window.innerHeight - 25}px`

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
    console.log(result);

    for (let index = 0; index < result.length; index++) {
        parseGithubProj(result[index]);
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
    parsedGithubData.primaryLanguage = data.language;
    parsedGithubData.stars = data.stargazers_count; //one day.
    parsedGithubData.readme = await getReadme(`${data.url}/readme`)
    console.log(parsedGithubData);
    
}