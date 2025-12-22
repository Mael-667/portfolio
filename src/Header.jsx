import { useEffect, useRef, useState } from "react";
import { delEvt, isTargetInElement, addEvt} from "./js/utils.js";

export default function Header({getRef}) {
  const [opened, SetOpened] = useState({
    button: "",
    nav: "reverse-appear 0.3s both",
  });

  const button = useRef(null);
  const ul = useRef(null);

  const mobile = document.documentElement.clientWidth < 769;
  
  useEffect(() => {
    let lgElmnts = [button.current, ...ul.current.children];
    let switchThemeFun = () => {
      for(let elmnt of lgElmnts){
        if (isTargetInElement(elmnt, getRef.current)) {
          elmnt.classList.add("glassLightMode")
        } else {
          elmnt.classList.remove("glassLightMode")
        }
      }
    };

    addEvt(document, "scroll", switchThemeFun);  
    return () => {
      delEvt(document, "scroll", switchThemeFun);
    }
  }, [getRef])

  function openBurger(e) {
    e.stopPropagation();
    SetOpened({
      button:
        "rotate-out-2-ccw 0.25s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
      nav: "appear 0.3s both",
    });
    ul.current.style.display = "flex";
    document.addEventListener("click", removeBurger);
  }

  function removeBurger(e) {
    e.stopPropagation();
    SetOpened({
      button:
        "reverse-rotate-out-2-ccw 0.25s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
      nav: "reverse-appear 0.3s both",
    });
    delEvt(document, "click", removeBurger);
    ul.current.addEventListener("animationend", resetBurger);
  }

  function resetBurger() {
    ul.current.style.display = "none";
    button.current.style.animation = "";
    ul.current.removeEventListener("animationend", resetBurger);
  }

  return (
    <>
      <header>
        <nav className="dynamicHueHvr">
          <button
            className="liquidGlass glassLightMode"
            aria-label="Ouvrir le menu"
            id="btnBurger"
            onClick={openBurger}
            style={{animation : (mobile && opened.button)}}
            ref={button}
          >
            <i className="fa-solid fa-bars" aria-hidden="true"></i>
          </button>
          <ul
            style={{animation : (mobile && opened.nav)}}
            ref={ul}
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
