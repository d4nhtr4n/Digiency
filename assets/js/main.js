"use strict";

import Slider from "./slider.js";
import debounce from "./debounce.js";
import formValidator from "./form_validator.js";
import Swipe from "./swipe.js";

// Initial
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/**
 * Form validate and export data to console
 */
let form = new formValidator("contact__send-message-form");
form.onSubmit = (formData) => {
  console.log(formData);
};

/**
 * Nav Menu on Mobile handle
 */
(function handleNavMenuChange() {
  const navToggle = $(".header__nav-toggle");

  // Open Nav menu on mobile
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("header__nav-toggle--open");
  });

  // Close Nav menu on mobile on scroll
  window.addEventListener("scroll", () => {
    if (navToggle.classList.contains("header__nav-toggle--open"))
      navToggle.classList.remove("header__nav-toggle--open");
  });
})();

/**
 *Theme switch handle
 */
(function handleThemeSwitch() {
  const themeToggleBtn = $(".header__theme-toggle-btn");
  const root = $(":root");

  // Adjust theme as last access
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme == "light") {
    root.classList.toggle("light-theme");
    themeToggleBtn.checked = true;
  }

  // Button click event change theme
  themeToggleBtn.addEventListener("change", () => {
    root.classList.toggle("light-theme");
    let theme = "dark";
    if (root.classList.contains("light-theme")) {
      theme = "light";
    }
    localStorage.setItem("theme", theme);
  });
})();

/**
 * Shrink header on PC when scroll
 */
(function handleShrinkHeader() {
  const header = $(".header");
  window.addEventListener(
    "scroll",
    debounce(function (e) {
      if (window.innerWidth > 1023) {
        //Only Shrink on >= PC devices
        // Get current scroll position
        let scroll = this.scrollY;
        if (scroll > 254 && header.clientHeight > 70) {
          header.style.height = `70px`;
          return;
        }
        if (scroll > 254) return;

        const defaultHeight = 100;
        let newHeight = defaultHeight - scroll / 7;
        if (newHeight < 70) newHeight = 70;
        header.style.height = `${newHeight}px`;
      }
    }, 10)
  );
})();

/**
 * About Us: Our work tab bar change
 */
(function handleChangeWorkTab() {
  const tabs = $$(".work__tab-item");
  const panes = $$(".work__tab-panel");

  const tabActive = $(".work__tab-item.work__tab-item--active");
  tabs.forEach((tab, index) => {
    const pane = panes[index];

    tab.onclick = function () {
      $(".work__tab-item.work__tab-item--active").classList.remove(
        "work__tab-item--active"
      );
      $(".work__tab-panel.work__tab-panel--active").classList.remove(
        "work__tab-panel--active"
      );

      this.classList.add("work__tab-item--active");
      pane.classList.add("work__tab-panel--active");
    };
  });
})();

/**
 * Change nav menu on scroll to a section
 */
(function handleHighlightNavItem() {
  // Get all sections that have ID
  const sections = $$("section[id]");
  // Get sections's values
  const sectionsValue = Array.from(sections).map((section) => ({
    sectionId: section.getAttribute("id"),
    sectionHeight: section.offsetHeight,
    sectionTop: section.offsetTop - 50,
  }));

  function handleNavMenuChangeOnScroll() {
    // Get current scroll position
    let scrollY = window.pageYOffset;

    // Get currentSection
    let currentSection = sectionsValue.filter(
      (section) =>
        scrollY > section.sectionTop &&
        scrollY <= section.sectionTop + section.sectionHeight
    )[0];
    const currentNavItem = $(
      ".header__navbar-items.header__navbar-items--active"
    );

    if (!currentSection) {
      // If current position is Footer -> Highlight Contact section
      currentSection = sectionsValue[sectionsValue.length - 1];
    }

    if (
      currentSection.sectionId != currentNavItem.getAttribute("href").slice(1)
    ) {
      currentNavItem.classList.remove("header__navbar-items--active");
      document
        .querySelector(
          ".header__navbar-items[href*=" + currentSection.sectionId + "]"
        )
        .classList.add("header__navbar-items--active");
    }
  }
  window.addEventListener("scroll", debounce(handleNavMenuChangeOnScroll, 20));
})();

/**
 * Client slider Initial
 * Get slider for responsive function
 */
function clientsReviewSliderInit() {
  const sliderContainer = $(".testimonial__review-slider-container");
  const sliderItemsCount = $$(".testimonial__review-item-wrapper").length;
  const controlGroup = $(".testimonial__review-panel-control-group");

  let clientsReviewSlider = new Slider(
    sliderContainer,
    controlGroup,
    sliderItemsCount
  );
  clientsReviewSlider.setTransition("transform 0.5s ease");
  clientsReviewSlider.setItemsPerPage(3);
  clientsReviewSlider.sliderAutoSwipe(4000);

  // Slider Swipe on Touchable device
  let swiper = new Swipe(sliderContainer);
  swiper.onLeft(() => {
    clientsReviewSlider.goToNext();
  });
  swiper.onRight(() => {
    clientsReviewSlider.goToPrevious();
  });
  swiper.run();

  $(".testimonial__review-slider__prev-btn").addEventListener("click", () =>
    clientsReviewSlider.goToPrevious()
  );
  $(".testimonial__review-slider__next-btn").addEventListener("click", () =>
    clientsReviewSlider.goToNext()
  );
  return clientsReviewSlider;
}
let clientsReviewSlider = clientsReviewSliderInit();

function blogsSliderInit() {
  const sliderContainer = $(".blog-slider-container");
  const sliderItemsCount = $$(".blog-item-wrapper").length;
  const controlGroup = $(".blog-control-group");

  const blogsSlider = new Slider(
    sliderContainer,
    controlGroup,
    sliderItemsCount
  );
  blogsSlider.setTransition("transform 0.5s ease");
  blogsSlider.setItemsPerPage(2);
  blogsSlider.sliderAutoSwipe(6000);

  // Slider Swipe on Touchable device
  let swiper = new Swipe(sliderContainer);
  swiper.onLeft(() => {
    blogsSlider.goToNext();
  });
  swiper.onRight(() => {
    blogsSlider.goToPrevious();
  });
  swiper.run();

  $(".blog-slider__prev-btn").addEventListener("click", () =>
    blogsSlider.goToPrevious()
  );
  $(".blog-slider__next-btn").addEventListener("click", () =>
    blogsSlider.goToNext()
  );

  return blogsSlider;
}
let blogsSlider = blogsSliderInit();

/**
 * Responsive
 * - Re-set items per page for table or mobile devices
 */
function responsive() {
  let windowWidth = window.innerWidth;
  if (windowWidth <= 739) {
    // Mobile
    clientsReviewSlider.setItemsPerPage(1);
    blogsSlider.setItemsPerPage(1);
  } else {
    // Tablet & >=PC
    blogsSlider.setItemsPerPage(2);
    if (windowWidth <= 1023) {
      // Tablet
      clientsReviewSlider.setItemsPerPage(2);
    } else {
      // >= PC
      clientsReviewSlider.setItemsPerPage(3);
    }
  }
}
responsive();
window.addEventListener("resize", debounce(responsive, 100));
