"use strict";

// Selecting elements
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const links = document.querySelectorAll(".nav__link");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const footer = document.querySelector(".footer");
const allSections = document.querySelectorAll(".section");
const slides = document.querySelectorAll(".slide");
const sliderContainer = document.querySelector(".slider");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotsContainer = document.querySelector(".dots");

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
document.addEventListener("keydown", function (e) {
  // concerning the model
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

///////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener("click", function (e) {
  const coords1 = section1.getBoundingClientRect();
  console.log(coords1);

  console.log(e.target.getBoundingClientRect());

  console.log(
    `Current scroll (X/Y): ${window.pageXOffset}, ${window.pageYOffset}`
  );

  console.log(
    `Height/Width Viewport: ${document.documentElement.clientHeight}, ${document.documentElement.clientWidth}`
  );

  // scrolling
  // window.scrollTo(
  //   coords1.left + window.pageXOffset,
  //   coords1.top + window.pageYOffset
  // );

  // scrolling with smooth behavior old way of scrolling
  // window.scrollTo({
  //   left: coords1.left + window.pageXOffset,
  //   top: coords1.top + window.pageYOffset,
  //   behavior: "smooth",
  // });

  // Modern Way of scrolling
  section1.scrollIntoView({ behavior: "smooth" });
});

///////////////////////////////////////
/*
 Page Navigation
 with Events delegation by using the power of Bubbling and capturing phase
*/

// links.forEach(function (el) {
//   // el.addEventListener("click", function (e) {
//   //   e.preventDefault();
//   //   // const id = this.href; // entire url
//   //   const id = this.getAttribute("href");
//   //   console.log(id);
//   //   document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   // });

// });

// 1 Add event listener to common parent element
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();
  // console.log(e.target);

  // Matching strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");

    // console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

///////////////////////////////////////
//tabbed components
tabsContainer.addEventListener("click", function (e) {
  e.preventDefault();

  const clicked = e.target.closest(".operations__tab");
  // console.log(clicked);

  // Guard clause
  if (!clicked) return;

  // Active tabs
  // Remove active active in all of them
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  // Add active class
  clicked.classList.add("operations__tab--active");

  // Activate content area
  tabsContent.forEach((tc) =>
    tc.classList.remove("operations__content--active")
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

///////////////////////////////////////
// Menu fade animation
const eventHandler = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    // select the sibblings
    const sibblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    sibblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};

// Passing "arguments" to events handler using bind method
nav.addEventListener("mouseover", eventHandler.bind(0.5));
nav.addEventListener("mouseout", eventHandler.bind(1));

///////////////////////////////////////
// 1. Sticky Navigation using scroll event is bad for performance in the old smartphone
// window.addEventListener("scroll", function () {
//   // sticky nav start from the section 1 in HTML document
//   const initialsCoords = section1.getBoundingClientRect();
//   // console.log(initialsCoords);
//   if (window.scrollY > initialsCoords.top) nav.classList.add("sticky");
//   else nav.classList.remove("sticky");
// });

// 2. Sticky Navigation using the Intersection Observer API
// const obsCallBack = function (entries, observer) {
//   entries.forEach((entry) => console.log(entry));
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallBack, obsOptions);
// observer.observe(section1);
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

///////////////////////////////////////
// Reveal Sections on scrolling
const revealSections = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSections, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add("section--hidden");
});

///////////////////////////////////////
//Lazy Loading images
const imgTargets = document.querySelectorAll("img[data-src]");
console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach(function (img) {
  imgObserver.observe(img);
});

///////////////////////////////////////
// Slider
// slider.style.transform = "scale(0.4) translateX(-1000px)";
// slider.style.overflow = "visible";
const slider = function () {
  let curSlide = 0;
  const maxSlide = slides.length;

  // create and insert dots in each slide
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // Activate Dot
  const activateDot = function (slide) {
    // select all the dots and remove in all of them the active class
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    // Add active class to the current dot based on the data-slide attribute
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (CurSlide) {
    slides.forEach(function (s, i) {
      s.style.transform = `translate(${100 * (i - CurSlide)}%)`;
    });
  };

  // Next Slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Previous Slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1; // maxSlide is Zero base so then we add moins 1
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };
  /////////////////////////////////////////
  // Initialisation function for the slider
  const init = function () {
    goToSlide(0); // make the first slide active at 0%
    createDots(); // create dots buttons
    activateDot(0); // make the first dot active
  };
  init();

  /////////////////////////////////////////
  //Events Handlers

  // curSlide = 1: -100%, 0%, 100%, 200%, 300%
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);
  // Add event listener to each dot
  dotsContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      // console.log(e.target);
      // detructuring the slide
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });

  ///////////////////////////////////////
  // Events attach to the document
  document.addEventListener("keydown", function (e) {
    // slider
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });
};
slider();
///////////////////////////////////////
/*
  Traversing the DOM 
 */

// 1. Going Downwards : child
// const h1 = document.querySelector("h1");
// console.log(h1.querySelectorAll(".highlight"));
// console.log(h1.childNodes);
// console.log(h1.children); //used direct children
// h1.firstElementChild.style.color = "white";
// h1.lastElementChild.style.color = "orangered";

// // 2. Going upwards : Parent
// console.log(h1.parentNode);
// console.log(h1.parentElement);
// h1.closest(".header").style.background = "var(--gradient-secondary)";

// // 3. Going sideways : sibblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach((el) => {
//   if (el !== h1) el.style.transform = "scale(0.5)";
// });

/**
 * EVENTS
 */

// 1.Events
// const alertFunc = function (e) {
//   alert("Hello from h1 mouse enter!");

// remove listener
// h1.removeEventListener("mouseenter", alertFunc);
// };
// h1.addEventListener("mouseenter", alertFunc);

// remove listener
// setTimeout(() => {
//   h1.removeEventListener("mouseenter", alertFunc);
// }, 3000);

// Create an element
const message = document.createElement("div");
message.classList.add("cookie-message");
message.innerHTML =
  "We use cookies for improved functionality and analytics. <button class='btn btn--close-cookie'>Got it!</button>";

// Insert element
//header.prepend(message); // insert message at the beginning of header content
//header.append(message);

//header.before(message); // insert before header container sibblings
footer.after(message);

// Delete element from the DOM
document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", function (e) {
    // message.remove();
    message.parentElement.removeChild(message);
  });

// Styles elements
// message.style.backgroundColor = "#37383d";
message.style.backgroundColor = " rgba(255, 255, 255, 0.95)";
message.style.color = "#37383d";

// cumputedStyle, modifting the height
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 40 + "px";

// set custom color variable in root
// document.documentElement.style.setProperty("--color-primary", "orangered");

// Lifecycle DOM Events

// 1. make the page ready for users
// document.addEventListener("DOMContentLoaded", function (e) {
//   console.log(e);
//   console.log("The HTML parsed and DOM tree built!");
// });

// load events
// window.addEventListener("load", function (e) {
//   console.log(e);
//   console.log("Load external files, images");
// });

// Ask the user before leaving the page
// window.addEventListener("beforeunload", function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = "";
// });
