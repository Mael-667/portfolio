import React, { useEffect } from 'react';
import { isTargetInElement} from '../js/utils';

export default function useDynamicHue() {

  useEffect(() => {
    let backgrounds = document.querySelectorAll("[data-hue]");
    let parents = document.querySelectorAll(".dynamicHue");
    let parentsHoverable = document.querySelectorAll(".dynamicHueHvr");
    let elmnts = [];
    for (const parent of parents) {
      for (const enfant of parent.querySelectorAll(".liquidGlass")) {
        elmnts.push({ element: enfant, hoverable: false });
      };
    };
    for (const parent of parentsHoverable) {
      for (const enfant of parent.querySelectorAll(".liquidGlass")) {
        elmnts.push({ element: enfant, hoverable: true });
      };
    };

    let wait = false;
    let DynamicHue = () => {
      if (!wait) {
        let selected = [];
        for (let i = 0; i < backgrounds.length; ++i) {
          let color = backgrounds[i].getAttribute("data-hue");
          for (let j = 0; j < elmnts.length; j++) {
            if (isTargetInElement(elmnts[j].element, backgrounds[i])) {
              elmnts[j].element.classList.add("dynamic");
              elmnts[j].element.style.setProperty('--background', `${colorAdjust(color, -0.2)}32`);
              elmnts[j].element.style.setProperty('--shadow', `inset 1px 1px 3px 1px ${colorAdjust(color, 0.2)}47, inset -1px -2px 3px 1px rgb(49 49 49 / 30%), 0px 0px 7px 1px rgb(0 0 0 / 41%)`);
              if (elmnts[j].hoverable) {
                elmnts[j].element.style.setProperty('--backgroundHover', `${colorAdjust(color, -0.1)}50`);
              }
              selected.push(j);
            };
          };
        };
        for (let i = 0; i < elmnts.length; ++i) {
          let euh = true;
          for (let j = 0; j < selected.length; j++) {
            if (i == selected[j]) {
              euh = false;
            };
          };
          if (euh) {
            elmnts[i].element.classList.remove("dynamic");
            elmnts[i].element.style.setProperty('--background', "");
            elmnts[i].element.style.setProperty('--shadow', ``);
            elmnts[i].element.style.setProperty('--backgroundHover', ``);
          };
        };
        wait = true;
        setTimeout(function () {
          wait = false;
        }, 70);
      }
    }

    document.addEventListener("scroll", DynamicHue, { passive: true });

    return () => {
      document.removeEventListener("scroll", DynamicHue)
    }
  }, [])
};


function colorAdjust(color, brigthness) {
  let r, g, b;
  if (color[0] == "#") {
    r = Number(`0x${color.substring(1, 3)}`);
    g = Number(`0x${color.substring(3, 5)}`);
    b = Number(`0x${color.substring(5, 7)}`);
  }
  let brigthnessCorrection = Math.floor(brigthness * 255 / 1);

  r += brigthnessCorrection;
  g += brigthnessCorrection;
  b += brigthnessCorrection;

  r = r < 0 ? "00" : r > 255 ? "ff" : r < 16 ? `0${r.toString(16)}` : r.toString(16);
  g = g < 0 ? "00" : g > 255 ? "ff" : g < 16 ? `0${g.toString(16)}` : g.toString(16);
  b = b < 0 ? "00" : b > 255 ? "ff" : b < 16 ? `0${b.toString(16)}` : b.toString(16);

  return `#${r}${g}${b}`
}