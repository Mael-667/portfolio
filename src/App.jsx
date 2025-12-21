import React, { useEffect, useState } from "react";
import startDynamicHue from "./js/liquidGlass.js";
import AboutmeCarrousel from "./aboutmeCarrousel.jsx";
import ProjectCarrousel from "./projectCarrousel.jsx";
import Contact from "./Contact.jsx";
import Header from "./Header.jsx";

import {animateOnSpawn, get, isTargetInElement } from "./js/utils.js";

export default function App() {

  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    startDynamicHue();
    switchHeaderTheme();
  }, []);
  
  document.fonts.ready.then(() => {
    animateOnSpawn(
      get("#titre>h1"),
      "tracking-in-expand 0.9s cubic-bezier(0.215, 0.610, 0.355, 1.000) both"
    );
    setOpacity(1);
  })
  
  return (
    <>
      <Header />
      <main>
        <section id="intro">
          <div id="titre"  style={{opacity:opacity, transition:"250ms"}}>
            <h2>Développeur Full-Stack</h2>
            <h1>Mael Flament</h1>
          </div>
        </section>
        <section id="presentation" data-hue="#0059ffff">
          <AboutmeCarrousel />
        </section>
        <section id="projets" data-hue="#bf4de1ff">
          <ProjectCarrousel />
        </section>
        <section id="contact">
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
