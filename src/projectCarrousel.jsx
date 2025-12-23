import React, { useState, useEffect, useRef } from "react";
import {
  addEvt,
  delEvt,
  get,
  animateOnSpawn,
} from "./js/utils.js";
import ProjectScrollbar from "./projectScrollbar.jsx";
import GithubData from "./modules/GithubData.jsx";


function ProjectCarrousel() {
  const [cards, setCards] = useState([]);
  const carProjet = useRef(null);

  useEffect(() => {
    GithubData.loadData().then((value) => {
      if (value) {
        setCards(value);
      }
    });

    animateOnSpawn(
      carProjet.current,
      "slide-in-right 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both"
    );
  }, [])

  function showProjectCards() {
    if (cards && cards.length == 0) {
      return <FallbackCard />
    } else if (cards && cards.length > 0) {
      return cards.map((element) => (
        <ProjectCard data={element} />
      ))
    }
  }

  return (
    <>
      <h2>Mes projets</h2>
      <div>
        <div id="carProjet" style={{ transform: "translateX(50vw)" }} ref={carProjet}>
          {showProjectCards()}
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
        {cards.length > 0 && (
          <ProjectScrollbar length={cards.length} carrousel={carProjet} onRender={() => startAutoScroll(get("#carProjet"), get("#elements"), get("#cursor"))} />
        )}
      </div>
    </>
  );
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

function FallbackCard() {
  return <article className="liquidGlassLarge projet">
    <div className="loading" />
    <div className="projText">
      <div className="projEntete">
        <h3 className="loading" />
      </div>
      <p className="loading" />
    </div>
  </article>
}

function startAutoScroll(scrollarea, scrollbar, bar, duration = 2.5) {
  let renderWidth = scrollarea.offsetWidth; //taille affichée a l'écran
  let scrollWidth = scrollarea.scrollWidth; //taille totale de l'élément
  let stoptt = false;
  let decr = scrollWidth / (60 * duration);
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
        }, 7777);
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
    cancelCarAnim();
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
    incr = nextStep / (60 * duration);
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
  
  return cancelCarAnim;
}
