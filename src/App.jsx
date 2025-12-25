import React, {useEffect, useRef} from "react";
import AboutmeCarrousel from "./aboutmeCarrousel.jsx";
import ProjectCarrousel from "./projectCarrousel.jsx";
import Contact from "./Contact.jsx";
import Header from "./Header.jsx";
import {Tint, LiquidGlassProvider } from "./modules/LiquidGlassProvider.jsx";

import {animateOnSpawn} from "./js/utils.js";
import './css/style.css'

export default function App() {
  const titre = useRef(null);
  const intro = useRef(null);
  const h1 = useRef(null);

  useEffect(() => {
    document.fonts.ready.then(() => {
      animateOnSpawn(
        h1.current,
        "tracking-in-expand 0.9s cubic-bezier(0.215, 0.610, 0.355, 1.000) both"
      );
      titre.current.style.opacity = 1;
    })
  }, []);
  
  
  return (
    <LiquidGlassProvider>
      <Header getRef={intro} />
      <main>
        <section id="intro" ref={intro}>
          <div id="titre" ref={titre} style={{opacity:0, transition:"250ms"}}>
            <h2>Développeur Full-Stack</h2>
            <h1 ref={h1}>Mael Flament</h1>
          </div>
        </section>
        <Tint as="section" id="presentation" hue="#0059ffff">
          <AboutmeCarrousel />
        </Tint>
        <Tint as="section" id="projets" hue="#bf4de1ff">
          <ProjectCarrousel />
        </Tint>
        <section id="contact">
          <Contact />
        </section>
      </main>
    </LiquidGlassProvider>
  );
}