/* eslint-disable no-unused-vars */
import React from "react";
import {
  addEvt,
  delEvt,
  get,
  triFusion,
  capitalizeFirstLetter,
  b64DecodeUnicode,
  animateOnSpawn,
} from "./js/utils.js";
import ProjectScrollbar from "./projectScrollbar.jsx";

class ProjectCarrousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      cardsLength: 0,
    };
  }

  componentDidMount() {
    GithubData.loadData().then((value) => {
      if (value){
        this.setState(() => ({
          cards: value,
          cardsLength: value.length,
        }));
      }
    });

    animateOnSpawn(
      get("#carProjet"),
      "slide-in-right 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both"
    );
  }

  render() {
    return (
      <>
        <h2>Mes projets</h2>
        <div>
          <div id="carProjet" style={{ transform: "translateX(50vw)" }}>
            {this.state.cards.map((element) => (
              <ProjectCard data={element} />
            ))}
            <article className="liquidGlassLarge projet">
              <div
                className="minia"
                style={{ backgroundImage: 'url("./img/more.jpg")' }}
              ></div>
              <div className="projText">
                <div className="projEntete">
                  <h3>Et bien plus</h3>
                  <p>
                    <i className="fa-solid fa-trophy" />
                  </p>
                </div>
                <p>
                  Étant particulièrement passionné par la programmation, je me
                  plais réaliser des programmes en tout genre et à essayer
                  différentes technologies sur mon temps libre.
                </p>
              </div>
            </article>
          </div>
          {this.state.cardsLength > 0 && (
            <ProjectScrollbar length={this.state.cardsLength} onRender={() => {startAutoScroll(get("#carProjet"), get("#elements"), get("#cursor"))}} />
          )}
        </div>
      </>
    );
  }
}
export default ProjectCarrousel;

function ProjectCard(data) {
  data = data.data;
  return (
    <article className="liquidGlassLarge projet" key={data.key}>
      <div
        className="minia"
        style={{ backgroundImage: `url(${data.img}` }}
        role="img"
        aria-label={`Image d'illustration pour mon projet ${data.name}`}
      ></div>
      <div className="projText">
        <div className="projEntete">
          <h3>{data.name}</h3> <p>{data.languageIcon}</p>
        </div>
        <p>{data.desc}</p>
      </div>
      <a href={data.url} target="_blank" className="liquidBtn">
        En voir plus
      </a>
    </article>
  );
}


class GithubData {
  static async loadData() {
    const url = "https://api.github.com/users/Mael-667/repos";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      let result = await response.json();
      result = triFusion(result, (g, d) => g.id > d.id);
      let ans = [];
      let limit = result.length > 6 ? 6 : result.length;
      for (let index = 0; index < limit; index++) {
        ans.push(await this.#parseGithubProj(result[index], index));
      }

      return ans;
    } catch (error) {
        console.error(error.message);
      return false;
    }
  }

  static async #getReadme(url) {
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

  static async #parseGithubProj(data, id) {
    let parsedGithubData = {};
    parsedGithubData.key = id;
    parsedGithubData.name = capitalizeFirstLetter(data.name);

    parsedGithubData.url = data.html_url;
    parsedGithubData.img = this.#getProjectIcon(parsedGithubData.name);
    parsedGithubData.primaryLanguage = data.language;
    parsedGithubData.languageIcon = this.#getLanguageIcon(data.language);
    parsedGithubData.stars = data.stargazers_count; //one day.
    parsedGithubData.desc = data.description;

    if (parsedGithubData.desc == null) {
      parsedGithubData.desc = await this.#getReadme(
        `https://api.github.com/repos/Mael-667/${data.name}/contents/README.md`
      );
    }

    if (parsedGithubData.desc.length > 255) {
      parsedGithubData.desc = `${parsedGithubData.desc.substring(0, 255)}...`;
    }

    return parsedGithubData;
  }

  static #getProjectIcon(project) {
    let link = {
      Stateur: "./img/stateur.jpg",
      Interstalla: "./img/interstella.jpg",
      Flex: "./img/flex.jpg",
      Diskype: "./img/diskype.jpg",
      Portfolio: "./img/portfolio.png",
      "Liquid-Glass-CSS": "./img/lgcss.gif",
    };
    return link[project];
  }

  static #getLanguageIcon(language) {
    let icons = {
      Java: <i className="fa-brands fa-java"></i>,
      HTML: <i className="fa-brands fa-html5"></i>,
      JavaScript: <i className="fa-brands fa-square-js"></i>,
      CSS: <i className="fa-brands fa-css"></i>,
    };
    return icons[language];
  }
}


function startAutoScroll(scrollarea, scrollbar, bar, duration = 2) {
  let renderWidth = scrollarea.offsetWidth; //taille affichée a l'écran
  let scrollWidth = scrollarea.scrollWidth; //taille totale de l'élément
  let stoptt = false;
  let decr = scrollWidth / (60*duration);
  let target = 0;
  let animId = 0;
  let animId2 = 0;
  let incr = 0;
  let intervalAnim = 0;
  let cancelCarAnim = () => {
    stoptt = true;
    clearInterval(intervalAnim);
    cancelAnimationFrame(animId);
    cancelAnimationFrame(animId2);
    delEvt(scrollarea, "touchstart", cancelCarAnim);
    delEvt(scrollarea, "mousedown", cancelCarAnim);
    delEvt(scrollbar, "mousedown", cancelCarAnim);
  };

  const callback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        intervalAnim = setInterval(() => {
          autoScroll();
        }, 9777);
        observer.disconnect();
      }
    });
  };

  const options = {
    root: null,
    rootMargin: "-10px",
    scrollMargin: "0px",
    threshold: 0.7,
  };

  let observer = new IntersectionObserver(callback, options);
  observer.observe(scrollarea);

  addEvt(scrollarea, "touchstart", cancelCarAnim);
  addEvt(scrollarea, "mousedown", cancelCarAnim);
  addEvt(scrollbar, "mousedown", cancelCarAnim);

  function touchStartBind() {
    cancelCarAnim;
    bar.classList.add("touched");
  }
  addEvt(scrollbar, "touchstart", touchStartBind);

  function touchEndBind() {
    bar.classList.remove("touched");
  }
  document.addEventListener("touchend", touchEndBind);

  function autoScroll() {
    if (target == scrollWidth - renderWidth) {
      scrollAnimTo0();
      return;
    }
    let steps = scrollarea.childElementCount;
    let nextStep = scrollWidth / steps;
    let scrollPos = scrollarea.scrollLeft; //a quel pt l'élément a été scroll
    target = scrollPos + nextStep;
    if (target > scrollWidth - renderWidth) {
      target = scrollWidth - renderWidth;
    }
    incr = nextStep / (60*duration);
    scrollAnim();
  }
  function scrollAnim() {
    if (stoptt) {
      return;
    }
    if (scrollarea.scrollLeft < target) {
      scrollarea.scrollTo(scrollarea.scrollLeft + incr, 0);
      animId = requestAnimationFrame(scrollAnim);
    }
  }
  function scrollAnimTo0() {
    if (stoptt) {
      return;
    }
    if (target > 0) {
      target = target - decr;
      scrollarea.scrollTo(target, 0);
      animId2 = requestAnimationFrame(scrollAnimTo0);
    }
  }
}
