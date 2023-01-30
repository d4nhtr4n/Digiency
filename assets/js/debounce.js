export default function debounce(func, delay = 0) {
  // TimeoutID identify timer created by setTimeout func
  let timerId;

  return function () {
    const args = arguments;
    const context = this;

    // Cancel previous timeout
    if (timerId) clearTimeout(timerId);

    // New timeout
    timerId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}
