import React, { useEffect, useState } from "react";
import startDynamicHue from "./js/liquidGlass.js";
import AboutmeCarrousel from "./aboutmeCarrousel.jsx";
import ProjectCarrousel from "./projectCarrousel.jsx";
import Contact from "./Contact.jsx";
import Header from "./Header.jsx";

import { addEvt, animateOnSpawn, get, isTargetInElement } from "./js/utils.js";

export default function App() {
  useEffect(() => {
    startDynamicHue();
    animateOnSpawn(
      get("#titre>h1"),
      "tracking-in-expand 0.9s cubic-bezier(0.215, 0.610, 0.355, 1.000) both"
    );
    switchHeaderTheme();
  }, []);

  return (
    <>
      <Header />
      <main>
        <section id="intro">
          <div id="titre">
            <h2>Développeur Web</h2>
            <h1>Mael Flament</h1>
          </div>
        </section>
        <section id="presentation" data-hue="#1c95ffff">
          <h2>À propos de moi</h2>
          <AboutmeCarrousel />
        </section>
        <section id="projets" data-hue="#bf4de1ff">
          <h2>Mes projets</h2>
          <ProjectCarrousel />
        </section>
        <section id="contact">
          <h2>Si mon travail a retenu votre attention</h2>
          <Contact />
        </section>
      </main>
    </>
  );
}

function switchHeaderTheme() {
  let intro = document.querySelector("#intro");
  document.addEventListener("scroll", function () {
    if (isTargetInElement(get("header li"), intro)) {
      document
        .querySelectorAll("header .liquidGlass")
        .forEach((e) => e.classList.add("glassLightMode"));
    } else {
      document
        .querySelectorAll("header .liquidGlass")
        .forEach((e) => e.classList.remove("glassLightMode"));
    }
  });
}
