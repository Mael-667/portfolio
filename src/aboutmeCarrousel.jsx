import React from "react";
import { animateOnSpawn, get, toggleAnim } from "./js/utils";
import javaLogo from "./assets/java.svg";
import htmlLogo from "./assets/html.svg";
import cssLogo from "./assets/css.svg";
import jsLogo from "./assets/js.svg";
import phpLogo from "./assets/php.svg";

class AboutmeCarrousel extends React.Component {
  touchstartX;
  touchstartY;
  touchendX;
  touchendY;

  touchStartBind = ((event) => {
    this.touchstartX = event.changedTouches[0].screenX;
    this.touchstartY = event.changedTouches[0].screenY
  }).bind(this);

  touchEndBind = ((event) => {
    this.touchendX = event.changedTouches[0].screenX;
    this.touchendY = event.changedTouches[0].screenY;
    this.handleGesture();
  }).bind(this);

  scroll(direction) {
    let articles = document.querySelector("#carrousel").children;
    let toLeft = direction == "left" ? true : false;
    for (let i = 0; i < articles.length; ++i) {
      let e = articles[i];
      if (e.classList.contains("articleFocus")) {
        e.classList.remove("articleFocus");
        toLeft
          ? e.classList.add("articleLeft")
          : e.classList.add("articleRight");
      } else if (e.classList.contains("articleLeft")) {
        e.classList.remove("articleLeft");
        toLeft
          ? e.classList.add("articleRight")
          : e.classList.add("articleFocus");
      } else if (e.classList.contains("articleRight")) {
        e.classList.remove("articleRight");
        toLeft
          ? e.classList.add("articleFocus")
          : e.classList.add("articleLeft");
      }
    }
  }

  startScroll(e) {
    if (!e.classList.contains("active")) {
      let li = document.querySelector("#presentation ul").children;
      let active, target;
      for (let i = 0; i < li.length; ++i) {
        if (li[i].classList.contains("active")) {
          active = i;
          li[i].classList.remove("active");
        } else if (li[i] == e) {
          target = i;
          li[i].classList.add("active");
        }
      }

      let steps = target - active;
      let dir = steps >= 0 ? "left" : "right";
      steps = Math.abs(steps);

      for (let i = 0; i < steps; ++i) {
        this.scroll(dir);
      }
    } else {
      toggleAnim(e, "wobble-hor-bottom");
    }
  }

  handleGesture() {
    let delta = (window.innerWidth * 10) / 100;
    let vDelta = (window.innerHeight * 15) / 100;
    let target = document.querySelector(".active");
    let children = target.parentElement.children;
    let activeId;
    for (let i = 0; i < children.length; ++i) {
      if (children[i] == target) {
        activeId = i;
      }
    }
    let targetId;
    if (
      Math.abs(this.touchstartX - this.touchendX) > delta &&
      Math.abs(this.touchstartY - this.touchendY) < vDelta
    ) {
      if (this.touchstartX > this.touchendX) {
        targetId = activeId == children.length - 1 ? 0 : activeId + 1;
        this.startScroll(children[targetId]);
      }

      if (this.touchendX > this.touchstartX) {
        targetId = activeId == 0 ? children.length - 1 : activeId - 1;
        this.startScroll(children[targetId]);
      }
    }
  }

  componentDidMount() {
    document
      .querySelector("#carrousel")
      .addEventListener("touchstart", this.touchStartBind, false);

    document
      .querySelector("#carrousel")
      .addEventListener("touchend", this.touchEndBind, false);
      animateOnSpawn(get("#carrousel"), "flip-in-hor-top 0.7s ease-out both")
  }

  render() {
    return (
      <div id="presentationMain">
        <div id="carrousel">


          <article className="liquidGlassLarge articleLeft" id="interets">
            <h3>Centres d'intérêt</h3>
            <p>
              Curieux de nature, je m'intéresse à divers univers qui
              enrichissent mon approche du développement et du design.
            </p>
            <p>En voici une courte liste :</p>
            <div id="passions">
              <Icon name="Piano" src="/img/piano.svg" alt="Icone de piano" />
              <Icon
                name="Informatique"
                src="/img/code.svg"
                alt="Icone de code"
              />
              <Icon name="Vélo" src="/img/velo.svg" alt="Icone de vélo" />
              <Icon
                name="Dessin"
                src="/img/dessin.svg"
                alt="Icone de dessin"
              />
            </div>
          </article>



          <article className="liquidGlassLarge articleFocus" id="aboutMe">
            <h3>Présentation</h3>
            <p>
              Intéressé depuis longtemps par le développement et le design, j'ai
              appris la programmation en autodidacte dès l'adolescence.
            </p>
            <p>
              Aujourd'hui en formation dans le domaine de l'informatique et
              développeur full stack, je souhaite approfondir mes connaissances
              et contribuer à des projets créatifs et ambitieux.
            </p>
            <p>
              Ayant une bonne connaissance du JavaScript, PHP, HTML/CSS et Java,
              je me plais à réaliser différents sites et applications web, en
              explorant le coté front-end aussi bien que le back-end afin de
              concevoir des applications modernes et interactives.
            </p>
          </article>



          <article className="liquidGlassLarge articleRight" id="skills">
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
                <i className="fa-brands fa-bootstrap" />
                <p>Bootstrap</p>
              </div>
            </div>
          </article>
        </div>


        
        <nav className="liquidGlass">
          <ul>
            <li
              id="btn1"
              className=""
              onClick={(e) => this.startScroll(e.target)}
            >
              <i className="fa-solid fa-heart" />
            </li>
            <li
              id="btn2"
              className="active"
              onClick={(e) => this.startScroll(e.target)}
            >
              <i className="fa-solid fa-image-portrait" />
            </li>
            <li
              id="btn3"
              className=""
              onClick={(e) => this.startScroll(e.target)}
            >
              <i className="fa-solid fa-web-awesome" />
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

function Icon({ name, src, alt }) {
  return (
    <>
      <div className="skill">
        <img src={src} alt={alt} />
        <p>{name}</p>
      </div>
    </>
  );
}

export default AboutmeCarrousel;
