export default class Slider {
  constructor(sliderContainer, controlGroup, sliderItemsCount) {
    this.sliderContainer = sliderContainer;
    this.controlGroup = controlGroup;
    this.sliderItemsCount = sliderItemsCount;
  }

  setItemsPerPage(itemsPerPage) {
    this.itemsPerPage = itemsPerPage;
    this.addControlBtn();
    this.goToItem(0);
  }

  setTransition(transitionValue = "transform 0.5s ease") {
    this.transitionValue = transitionValue;
  }

  addControlBtn() {
    this.controlGroup.innerHTML = "";
    var slideCount = this.sliderItemsCount - this.itemsPerPage;
    for (var i = 0; i <= slideCount; i++) {
      var newNode = document.createElement("button");
      newNode.classList.add("slider-controller");
      newNode.setAttribute("index", `${i}`);
      newNode.addEventListener("click", (e) =>
        this.goToItem(e.target.getAttribute("index"))
      );
      this.controlGroup.appendChild(newNode);
    }
  }

  goToItem(index = 0) {
    if (index < 0) {
      index = this.sliderItemsCount - this.itemsPerPage;
    } else if (index > this.sliderItemsCount - this.itemsPerPage) {
      index = 0;
    }
    this.sliderContainer.style.transition = this.transitionValue;

    // Move container to left (overflow of it will be hidden)
    // Distance (%) = (index / itemsPerPage ) *100
    this.sliderContainer.style.transform = `translateX(-${
      index * (100 / this.itemsPerPage)
    }%)`;
    this.currentIndex = index;

    // Change control button status
    var lastActiveControllerNode = this.controlGroup.querySelector(
      ".slider-controller.slider-controller--active"
    );
    if (lastActiveControllerNode)
      lastActiveControllerNode.classList.remove("slider-controller--active");
    var controllerList =
      this.controlGroup.querySelectorAll(".slider-controller");
    controllerList[index].classList.add("slider-controller--active");
  }

  goToPrevious() {
    this.goToItem(this.currentIndex - 1);
  }

  goToNext() {
    this.goToItem(this.currentIndex + 1);
  }

  sliderAutoSwipe(time = 1000) {
    this.timer = setInterval(() => {
      this.goToItem(Number(this.currentIndex) + 1);
    }, time);
  }
}
