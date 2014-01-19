//  Sigma.mouseWheelAndTouchMove module

//  Enable or disable mousewheel and touchmove
module.exports = {
  preventDefault : function (event) {
    event.preventDefault();
  },
  disable : function (target) {
    var _this = this;
    target.addEventListener('mousewheel', _this.preventDefault, false);
    target.addEventListener('touchmove', _this.preventDefault, false);
  },
  enable : function (target) {
    var _this = this;
    target.removeEventListener('mousewheel', _this.preventDefault, false);
    target.removeEventListener('touchmove', _this.preventDefault, false);
  }
};