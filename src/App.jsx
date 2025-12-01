import React from "react";
import startDynamicHue from "./js/liquidGlass.js";
import AboutmeCarrousel from "./aboutmeCarrousel.jsx";
import ProjectCarrousel from "./projectCarrousel.jsx";
import Contact from "./Contact.jsx";
import { addEvt, animateOnSpawn, get } from "./js/utils.js";

class App extends React.Component {
  componentDidMount() {
    startDynamicHue();
    animateOnSpawn(get("#titre>h1"), "tracking-in-expand 0.9s cubic-bezier(0.215, 0.610, 0.355, 1.000) both")
  }

  render() {
    return (
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
    );
  }
}

export default App;
