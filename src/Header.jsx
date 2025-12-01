import React from "react";
import { get, isTargetInElement, delEvt } from "./js/utils.js";

class Header extends React.Component {
    menuOpened = false;
    removeBurgerBind = this.removeBurger.bind(this);
    resetBurgerBind = this.resetBurger.bind(this);
    componentDidMount() {
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

    openBurger(e) {
        e.stopPropagation();
        document.querySelector("#btnBurger").classList.add("rotate-out-2-ccw");

        let ul = document.querySelector("header ul");
        ul.style.display = "flex";
        ul.classList.toggle("appear");
        this.menuOpened = true;
        document.addEventListener("click", this.removeBurgerBind);
    }


    removeBurger(e) {
        e.stopPropagation();
        if (this.menuOpened) {
            document.querySelector("#btnBurger").classList.remove("rotate-out-2-ccw");
            document
                .querySelector("#btnBurger")
                .classList.add("Reverserotate-out-2-ccw");
            let ul = document.querySelector("header ul");

            ul.classList.toggle("appear");
            ul.classList.add("Reverseappear");
            
            this.menuOpened = false;
            delEvt(document, "click", this.removeBurger);
            delEvt(document, "click", this.removeBurgerBind);
            ul.addEventListener("animationend", this.resetBurgerBind);
        }
    }

    resetBurger() {
        let ul = document.querySelector("header ul");
        ul.style.display = "none";
        ul.classList.remove("Reverseappear");
        document
            .querySelector("#btnBurger")
            .classList.remove("Reverserotate-out-2-ccw");
        ul.removeEventListener("animationend", this.resetBurgerBind);
    }

    render() {
        return (
            <>
                <header>
                    <nav className="dynamicHueHvr">
                        <button className="liquidGlass glassLightMode" id="btnBurger" onClick={(this.openBurger.bind(this))}>
                            <i className="fa-solid fa-bars"></i>
                        </button>
                        <ul>
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
}

export default Header;
