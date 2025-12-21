import React, { useState } from "react";
import { get, delEvt} from "./js/utils.js";

export default function Header() {
  const [opened, SetOpened] = useState({
    button: "",
    nav: "reverse-appear 0.3s both",
  });

  const mobile = document.documentElement.clientWidth < 769;

  //   useState(() => {

  //     // animateOnSpawn(get("header"), "scale-in-center 0.8s cubic-bezier(0.250, 0.460, 0.450, 0.940) both")
  //   }, []);

  function openBurger(e) {
    e.stopPropagation();
    SetOpened({
      button:
        "rotate-out-2-ccw 0.25s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
      nav: "appear 0.3s both",
    });
    get("header ul").style.display = "flex";
    document.addEventListener("click", removeBurger);
  }

  function removeBurger(e) {
    e.stopPropagation();
    SetOpened({
      button:
        "reverse-rotate-out-2-ccw 0.25s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
      nav: "reverse-appear 0.3s both",
    });
    let ul = document.querySelector("header ul");
    delEvt(document, "click", removeBurger);
    ul.addEventListener("animationend", resetBurger);
  }

  function resetBurger() {
    let ul = document.querySelector("header ul");
    ul.style.display = "none";
    get("#btnBurger").style.animation = "";
    ul.removeEventListener("animationend", resetBurger);
  }

  return (
    <>
      <header>
        <nav className="dynamicHueHvr">
          <button
            className="liquidGlass glassLightMode"
            id="btnBurger"
            onClick={openBurger}
            style={{animation : (mobile && opened.button)}}
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          <ul
            style={{animation : (mobile && opened.nav)}}
          >
            <li className="liquidGlass glassLightMode">
              <a href="#intro">Accueil</a>
            </li>
            <li className="liquidGlass glassLightMode">
              <a href="#presentation">Présentation</a>
            </li>
            <li className="liquidGlass glassLightMode">
              <a href="#projets">Projets</a>
            </li>
            <li className="liquidGlass glassLightMode">
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
