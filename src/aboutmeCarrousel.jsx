import React, { useEffect, useState, useRef } from "react";
import { animateOnSpawn, get, toggleAnim } from "./js/utils";
import javaLogo from "./assets/java.svg";
import htmlLogo from "./assets/html.svg";
import cssLogo from "./assets/css.svg";
import jsLogo from "./assets/js.svg";
import phpLogo from "./assets/php.svg";
import { LiquidGlass } from "./modules/LiquidGlassProvider";

function AboutmeCarrousel() {

  const [articlePos, setArticlePos] = useState([-1, 0, 1])
  const carrousel = useRef(null);
  const touch = useRef({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } })
  const limitPos = useRef({ min: -1, max: 1 });

  function getPos(pos) {
    switch (pos) {
      case -1:
        return "articleLeft"
      case 0:
        return "articleFocus"
      case 1:
        return "articleRight"
    }
  }

  function loop(pos) {
    if (pos > limitPos.current.max) return limitPos.current.min;
    if (pos < limitPos.current.min) return limitPos.current.max;
    return pos;
  }


  function startScroll(e, id) {
    let steps = articlePos[id];
    if (steps != 0) {
      let increment = (steps < 0) ? 1 : -1;
      for (let i = 0; i < Math.abs(steps); ++i) {
        setArticlePos(prev => prev.map((i) => loop(i + increment)));
      }
    } else {
      toggleAnim(e, "wobble-hor-bottom");
    }
  }

  function handleGesture() {
    let delta = (window.innerWidth * 10) / 100;
    let vDelta = (window.innerHeight * 15) / 100; 
    if (Math.abs(touch.current.start.x - touch.current.end.x) > delta && Math.abs(touch.current.start.y - touch.current.end.y) < vDelta) {
      let increment = 0;
      if (touch.current.start.x > touch.current.end.x) {
        increment = -1;
      }
      if (touch.current.end.x > touch.current.start.x) {
        increment = 1;
      }
      setArticlePos(prev => prev.map((i) => loop(i + increment)));
    }
  }

  let touchHandlers = useRef(
    [
      (event) => {
        touch.current.start.x = event.changedTouches[0].screenX;
        touch.current.start.y = event.changedTouches[0].screenY;
      }
      , 
      (event) => {
        touch.current.end.x = event.changedTouches[0].screenX;
        touch.current.end.y = event.changedTouches[0].screenY;
        handleGesture();
      }
    ])

  useEffect(() => {
    let car = carrousel.current;
    let touchHandler = touchHandlers.current;
    car.addEventListener("touchstart", touchHandler[0], { passive: true });
    car.addEventListener("touchend", touchHandler[1], { passive: true });
    animateOnSpawn(get("#carrousel"), "flip-in-hor-top 0.7s ease-out both");
    return () => {
      car.removeEventListener("touchstart", touchHandler[0]);
      car.removeEventListener("touchend", touchHandler[1]);
    }
  }, [])

  return (
    <>
      <h2>À propos de moi</h2>
      <div id="presentationMain">
        <div id="carrousel" ref={carrousel}>
          <LiquidGlass as="article" large className={getPos(articlePos[0])} id="interets">
            <h3>Mes passions</h3>
            <p>Passionné par la création sous toutes ses formes, j'aime mêler logique et créativité à travers le développement. Le code, le design et l'expérience utilisateur sont pour moi indissociables. Toujours curieux, j'explore de nouvelles idées et technologies pour enrichir ma façon de concevoir des applications modernes et intuitives.</p>
            <p>Voici une courte liste de ces passions qui m'animent :</p>
            <div id="passions">
              <Icon name="Piano" src="./img/piano.svg" alt="Icone de piano" />
              <Icon
                name="Informatique"
                src="./img/code.svg"
                alt="Icone de code"
              />
              <Icon name="Vélo" src="./img/velo.svg" alt="Icone de vélo" />
              <Icon
                name="Dessin"
                src="./img/dessin.svg"
                alt="Icone de dessin"
              />
            </div>
          </LiquidGlass>

          <LiquidGlass as="article" large className={getPos(articlePos[1])} id="aboutMe">
            <h3>Présentation</h3>
            <p>Passionné par le développement depuis de nombreuses années, j'ai commencé à apprendre la programmation en autodidacte dès l'adolescence.</p>
            <p>Actuellement développeur full-stack, je souhaite approfondir mes compétences et m'investir dans des projets créatifs et ambitieux.</p>
            <p>À l'aise avec JavaScript, PHP, HTML/CSS et Java, j'aime concevoir des sites et des applications web en explorant aussi bien le front-end que le back-end, avec pour objectif de créer des applications modernes, performantes et visuellement abouties.</p>
          </LiquidGlass>

          <LiquidGlass as="article" large className={getPos(articlePos[2])} id="skills">
            <h3>Mes compétences</h3>
            <h4>Langages</h4>
            <div id="comp">
              <Icon name="Java" src={javaLogo} alt="Logo Java" />
              <Icon name="HTML" src={htmlLogo} alt="Logo HTML" />
              <Icon name="CSS" src={cssLogo} alt="Logo CSS" />
              <Icon name="JavaScript" src={jsLogo} alt="Logo JavaScript" />
              <Icon name="PHP" src={phpLogo} alt="Logo PHP" />
            </div>
            <h4>Frameworks</h4>
            <div id="autres">
              <div className="skill">
                <i className="fa-brands fa-symfony" />
                <p>Symfony</p>
              </div>
              <div className="skill">
                <i className="fa-brands fa-react" />
                <p>React</p>
              </div>
              <div className="skill">
                <i className="fa-brands fa-bootstrap" />
                <p>Bootstrap</p>
              </div>
            </div>
          </LiquidGlass>
        </div>

        <nav className="liquidGlass" aria-label="Navigation du carrousel">
          <ul>
            <li
              aria-selected={(articlePos[0] == 0)}
              aria-controls="interets"
              id="btn1"
              className={(articlePos[0] == 0) ? "active" : ""}
              onClick={(e) => startScroll(e.target, 0)}
            >
              <i className="fa-solid fa-heart" aria-hidden="true" />
            </li>
            <li
              aria-selected={(articlePos[1] == 0)}
              aria-controls="aboutMe"
              id="btn2"
              className={(articlePos[1] == 0) ? "active" : ""}
              onClick={(e) => startScroll(e.target, 1)}
            >
              <i className="fa-solid fa-image-portrait" aria-hidden="true"/>
            </li>
            <li
              aria-selected={(articlePos[2] == 0)}
              aria-controls="skills"
              id="btn3"
              className={(articlePos[2] == 0) ? "active" : ""}
              onClick={(e) => startScroll(e.target, 2)}
            >
              <i className="fa-solid fa-web-awesome" aria-hidden="true"/>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

function Icon({ name, src, alt }) {
  return (
    <div className="skill">
      <img src={src} alt={alt} />
      <p>{name}</p>
    </div>
  );
}

export default AboutmeCarrousel;