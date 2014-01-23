//  Sigma.mouseWheelAndTouchMove module

//  Enable or disable mousewheel and touchmove
module.exports = {
  preventDefault : function (event) {
    event.preventDefault();
  },
  disable : function (target) {
    target.addEventListener('mousewheel', this.preventDefault, false);
    target.addEventListener('touchmove', this.preventDefault, false);
  },
  enable : function (target) {
    target.removeEventListener('mousewheel', this.preventDefault, false);
    target.removeEventListener('touchmove', this.preventDefault, false);
  }
};