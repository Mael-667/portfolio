import React, { createContext, useEffect, useRef} from "react";
import startDynamicHue from "./js/liquidGlass.js";
import AboutmeCarrousel from "./aboutmeCarrousel.jsx";
import ProjectCarrousel from "./projectCarrousel.jsx";
import Contact from "./Contact.jsx";
import Header from "./Header.jsx";

import {animateOnSpawn} from "./js/utils.js";

export default function App() {
  const titre = useRef(null);
  const intro = useRef(null);
  const h1 = useRef(null);

  useEffect(() => {
    startDynamicHue();

    document.fonts.ready.then(() => {
      animateOnSpawn(
        h1.current,
        "tracking-in-expand 0.9s cubic-bezier(0.215, 0.610, 0.355, 1.000) both"
      );
      titre.current.style.opacity = 1;
    })
  }, []);
  
  
  return (
    <>
      <Header getRef={intro} />
      <main>
        <section id="intro" ref={intro}>
          <div id="titre" ref={titre} style={{opacity:0, transition:"250ms"}}>
            <h2>Développeur Full-Stack</h2>
            <h1 ref={h1}>Mael Flament</h1>
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