//  Sigma.disableMouseWheelAndTouchMove module

//  Enable or disable mousewheel and touchmove
module.exports = function (target, disable) {
  var preventDefault = function (event) {
    event.preventDefault();
  };
  if (disable) {
    target.addEventListener('mousewheel', preventDefault, false);
    target.addEventListener('touchmove', preventDefault, false);
  } else {
    target.removeEventListener('mousewheel', preventDefault, false);
    target.removeEventListener('touchmove', preventDefault, false);
  }
};