/* eslint-disable no-unused-vars */
import { useEffect, useRef } from "react";
import { addEvt, delEvt, get } from "./js/utils.js";

export default function ProjectScrollbar(props) {
  useEffect(() => {
    let sb = new HorizontalScrollBar(
      get("#carProjet"),
      get("#elements"),
      get("#cursor")
    );
    let elements = get("#elements"),
      line = get("#line");
    sb.onScroll(function (center, end) {
      elements.style = `background-image : radial-gradient(circle at ${center}px,rgba(255, 221, 235, 1) ${
        end - 5
      }px, rgba(31, 0, 23, 1) ${end}px) !important;`;
      line.style = `background-image : radial-gradient(circle at ${center}px,rgba(255, 221, 235, 1) ${
        end - 5
      }px, rgba(31, 0, 23, 1) ${end}px) !important;`;
    });
  }, []);

  return (
    <div id="projScroll" className="liquidGlass no-drag">
      <div id="elements">
        <i className="fa-solid fa-circle" />
        {[...Array(props.length)].map(() => (
          <Line />
        ))}
      </div>
      <div id="line" />
      <div id="cursor" className="liquidGlass" />
    </div>
  );
}

function Line() {
  return <i className="fa-solid fa-circle" />;
}

class HorizontalScrollBar {
  constructor(
    scrollarea,
    scrollbar,
    bar,
    transformMethod = (barposition) => `translate(${barposition}px, -50%)`
  ) {
    this.scrollarea = scrollarea;
    this.scrollbar = scrollbar;
    this.bar = bar;
    this.rect = this.scrollbar.getBoundingClientRect();
    this.barPos = this.rect.left;
    this.scrollBarWidth = this.scrollbar.offsetWidth;
    this.scrollBarRight = this.scrollbar.getBoundingClientRect().right;
    this.renderWidth = this.scrollarea.offsetWidth; //taille affichée a l'écran
    this.scrollWidth = this.scrollarea.scrollWidth; //taille totale de l'élément
    this.scrollLeft =
      Math.floor(this.scrollWidth) - Math.floor(this.renderWidth);
    this.bar.style.width = `${
      (this.renderWidth * this.scrollBarWidth) / this.scrollWidth
    }px`;
    this.barRight = Math.floor(this.bar.getBoundingClientRect().right);
    this.maxSpaceLeft = this.scrollBarRight - this.barRight;
    this.transform = transformMethod;
    this.onScroll();

    let updatesbBind = this.#updatescrollbar.bind(this);
    let updatebarBind = this.#updateCursor.bind(this);

    scrollarea.addEventListener("scroll", updatesbBind);

    //clic support pour la touchbar sur pc
    scrollbar.addEventListener("mousedown", (e) => {
      scrollarea.removeEventListener("scroll", updatesbBind);
      scrollbar.addEventListener("mousemove", updatebarBind);
    });

    document.addEventListener("mouseup", () => {
      scrollbar.removeEventListener("mousemove", updatebarBind);
      scrollarea.addEventListener("scroll", updatesbBind);
    });

    //touch support pour la scrollbar sur mobile
    scrollbar.addEventListener("touchstart", (e) => {
      scrollarea.removeEventListener("scroll", updatesbBind);
      scrollbar.addEventListener("touchmove", updatebarBind);
    });

    document.addEventListener("touchend", (e) => {
      scrollbar.removeEventListener("touchmove", updatebarBind);
      scrollarea.addEventListener("scroll", updatesbBind);
    });

    this.stoptt = false;
    this.decr = this.scrollWidth / 77;

    this.intervalAnim = setInterval(() => {
      this.#autoScroll();
    }, 7777);

    addEvt(this.scrollarea, "touchstart", this.cancelCarAnim);
    addEvt(this.scrollarea, "mousedown", this.cancelCarAnim);
    addEvt(this.scrollbar, "mousedown", this.cancelCarAnim);

    this.touchendBind = (() => {
      this.cancelCarAnim;
      this.bar.classList.add("touched");
    }).bind(this);

    addEvt(this.scrollbar, "touchstart", this.touchendBind);

    this.touchendBind = (() => {
      this.bar.classList.remove("touched");
    }).bind(this);
    document.addEventListener("touchend", this.touchendBind);
  }

  onScroll(fun = (barCenter, barEnd) => {}) {
    this.styleFun = fun;
    this.#updatescrollbar();
  }

  setTransform(
    transformMethod = (barposition) => `translate(${barposition}px, -50%)`
  ) {
    this.transform = transformMethod;
  }

  #updateCursor(e) {
    let cursorPos;
    if (e.type == "touchmove") {
      cursorPos = e.changedTouches[0].clientX;
    } else {
      cursorPos = e.clientX;
    }
    let cursorRelativePos = cursorPos - this.barPos; //position du curseur par rapport a la scrollbar
    let actualBarRightPos = Math.floor(this.bar.getBoundingClientRect().right); //position de l'extremité gauche de la barre de la scrollbar
    let actualSpaceLeft = this.scrollBarRight - actualBarRightPos; //espace restant entre l'extrémité gauche de la barre de scroll et l'extrémité gauche de la scrollbar
    let spaceTotal = this.scrollBarWidth - this.bar.offsetWidth; //espace total pour calculer le ratio en % de scroll
    let trueOffset = (actualSpaceLeft * 100) / this.maxSpaceLeft; //ratio en % d'a quel point la scrollbar a été scroll
    trueOffset = Math.abs(trueOffset - 100); //j'inverse le % car si il reste 0% d'espace a scroll on veut que le carrousel soit scroll a 100%
    trueOffset = (trueOffset * this.scrollLeft) / 100; //je prends le % pixel du carrousel a scroll
    let barposition = cursorRelativePos - this.bar.offsetWidth / 2; //on deplace la barre vers le curseur - la moitié de la taille de la barre afin de la centrer
    let barCenter = cursorRelativePos;
    let barEnd = this.bar.offsetWidth / 2;
    //on gere les extrémités
    if (cursorRelativePos - this.bar.offsetWidth / 2 < 0) {
      barposition = 0;
      barCenter = this.bar.offsetWidth / 2 - 5;
    } else if (cursorRelativePos - this.bar.offsetWidth / 2 > spaceTotal) {
      barposition = spaceTotal;
      barCenter = this.scrollbar.offsetWidth - this.bar.offsetWidth / 2 + 5;
    }
    this.bar.style.transform = this.transform(barposition);
    this.styleFun(barCenter, barEnd);
    this.scrollarea.scrollTo(trueOffset, 0);
  }

  #updatescrollbar() {
    let scrollBarWidth = this.scrollbar.offsetWidth; //taille du scrollbar
    let scrollPos = this.scrollarea.scrollLeft; //a quel pt l'élément a été scroll
    let offset = (scrollPos * scrollBarWidth) / this.scrollWidth;
    this.bar.style.transform = this.transform(offset);
    let barCenter = offset + this.bar.offsetWidth / 2;
    let barEnd = this.bar.offsetWidth / 2 + 4;
    this.styleFun(barCenter, barEnd);
  }

  target = 0;
  animId;
  animId2;
  incr = 0;

  cancelCarAnim = (() => {
    this.stoptt = true;
    clearInterval(this.intervalAnim);
    cancelAnimationFrame(this.animId);
    cancelAnimationFrame(this.animId2);
    delEvt(this.scrollarea, "touchstart", this.cancelCarAnim);
    delEvt(this.scrollarea, "mousedown", this.cancelCarAnim);
    delEvt(this.scrollbar, "mousedown", this.cancelCarAnim);
  }).bind(this);

  #autoScroll() {
    if (this.target == this.scrollWidth - this.renderWidth) {
      this.#scrollAnimTo0();
      return;
    }
    let steps = this.scrollarea.childElementCount;
    let nextStep = this.scrollWidth / steps;
    let scrollPos = this.scrollarea.scrollLeft; //a quel pt l'élément a été scroll
    this.target = scrollPos + nextStep;
    if (this.target > this.scrollWidth - this.renderWidth) {
      this.target = this.scrollWidth - this.renderWidth;
    }
    this.incr = nextStep / 77;
    this.#scrollAnim();
  }
  #scrollAnim() {
    if (this.stoptt) {
      return;
    }
    if (this.scrollarea.scrollLeft < this.target) {
      this.scrollarea.scrollTo(this.scrollarea.scrollLeft + this.incr, 0);
      this.animId = requestAnimationFrame(this.#scrollAnim.bind(this));
    }
  }
  #scrollAnimTo0() {
    if (this.stoptt) {
      return;
    }
    if (this.target > 0) {
      this.target = this.target - this.decr;
      this.scrollarea.scrollTo(this.target, 0);
      this.animId2 = requestAnimationFrame(this.#scrollAnimTo0.bind(this));
    }
  }
}
