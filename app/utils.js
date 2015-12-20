
export let throttle = (callback, limit) => {
  var wait = false;
  return function() {
    if (!wait) {
      callback.call();
      wait = true;
      setTimeout(() => {
          wait = false;
      }, limit);
    }
  }
}