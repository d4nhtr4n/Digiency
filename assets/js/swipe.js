export default class Swipe {
  constructor(element) {
    this.xBefore = null;
    this.yBefore = null;

    if (element) {
      this.element = element;
    } else {
      return;
    }

    // Get position when start touch element
    this.element.addEventListener(
      "touchstart",
      function (event) {
        this.xBefore = event.touches[0].clientX;
        this.yBefore = event.touches[0].clientY;
      }.bind(this)
    );
  }

  onLeft(callback = () => {}) {
    this.onLeft = callback;
    return this;
  }

  onRight(callback = () => {}) {
    this.onRight = callback;
    return this;
  }

  onUp(callback = () => {}) {
    this.onUp = callback;
    return this;
  }

  onDown(callback = () => {}) {
    this.onDown = callback;
    return this;
  }

  handleTouchMove(event) {
    if (!this.xBefore || !this.yBefore) {
      return;
    }

    // New position after touch and move
    let xAfter = event.touches[0].clientX;
    let yAfter = event.touches[0].clientY;

    // Distance of two position: form before to after
    this.xDiff = this.xBefore - xAfter;
    this.yDiff = this.yBefore - yAfter;

    if (Math.abs(this.xDiff) > Math.abs(this.yDiff)) {
      if (this.xDiff > 0) {
        this.onLeft();
      } else {
        this.onRight();
      }
    } else {
      if (this.yDiff > 0) {
        this.onUp();
      } else {
        this.onDown();
      }
    }

    // Reset values.
    this.xBefore = null;
    this.yBefore = null;
  }

  run() {
    this.element.addEventListener(
      "touchmove",
      function (event) {
        this.handleTouchMove(event);
      }.bind(this)
    );
  }
}
