export {
  addEvt,
  delEvt,
  get,
  toggleAnim,
  triFusion,
  isTargetInElement,
  capitalizeFirstLetter,
  b64DecodeUnicode,
  animateOnSpawn,
  throttle
};

function addEvt(target, event, fun) {
  target.addEventListener(event, fun);
}

function delEvt(target, event, fun) {
  target.removeEventListener(event, fun);
}

function get(element, target = document) {
  return target.querySelector(element);
}

function toggleAnim(target, cssClass) {
  function removeAnim() {
    delEvt(target, "animationend", removeAnim);
    target.classList.toggle(cssClass);
  }
  addEvt(target, "animationend", removeAnim);
  target.classList.toggle(cssClass);
}

function triFusion(
  array,
  fun = (leftEntry, rightEntry) => leftEntry > rightEntry
) {
  function defusion(arrayCopy) {
    if (arrayCopy.length == 1) {
      return arrayCopy;
    } else {
      let g, d;
      g = arrayCopy.slice(0, arrayCopy.length / 2);
      d = arrayCopy.slice(arrayCopy.length / 2, arrayCopy.length);
      return fusion(defusion(g), defusion(d));
    }
  }

  function fusion(arrG, arrD) {
    let ans = new Array(arrG.length + arrD.length);
    let ig, id;
    ig = id = 0;
    for (let i = 0; i < ans.length; ++i) {
      if (ig == arrG.length) {
        ans[i] = arrD[id++];
      } else if (id == arrD.length) {
        ans[i] = arrG[ig++];
      } else if (fun(arrG[ig], arrD[id])) {
        ans[i] = arrG[ig++];
      } else {
        ans[i] = arrD[id++];
      }
    }
    return ans;
  }

  return defusion(array);
}

function isTargetInElement(target, element) {
  let coTarget = target.getBoundingClientRect();
  let coElement = element.getBoundingClientRect();
  if (!(coTarget.top >= coElement.top)) {
    return false;
  }
  if (!(coTarget.bottom <= coElement.bottom)) {
    return false;
  }
  if (!(coTarget.left >= coElement.left)) {
    return false;
  }
  if (!(coTarget.right <= coElement.right)) {
    return false;
  }
  return true;
}

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function b64DecodeUnicode(str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(
    atob(str)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}

function animateOnSpawn(target, animationStyle) {
  let observer;
  const callback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        target.style.animation = animationStyle;
        observer.disconnect();
      }
    });
  };

  const options = {
    root: null,
    rootMargin: "-10px",
    scrollMargin: "0px",
    threshold: 0,
  };

  observer = new IntersectionObserver(callback, options);
  observer.observe(target);
}

function throttle (callbackFn, limit = 100) {
    let wait = false;                  
    return function () {              
        if (!wait) {                  
            callbackFn.call();           
            wait = true;               
            setTimeout(function () {   
                wait = false;          
            }, limit);
        }
    }
}