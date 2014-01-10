//  Sigma.clickAndTouchListener module

//  Device-agnostic click and touch add or remove listeners
module.exports = {
  functions: {},
  preventClickIfTouch : function (event) {
    if (event.type === 'touchstart') {
      event.preventDefault();
    }
  },
  add : function (target, functionName, functionCode, disablePreventClickIfTouch) {
    var _this = this,
        code = functionCode;
    //  DisablePreventClickIfTouch is optional and set to false by default - trick for contenteditable
    disablePreventClickIfTouch = disablePreventClickIfTouch || false;
    //  Store code to execute in functions object
    _this.functions[functionName] = function (event) {
      //  If event is touchstart we prevent the click event from firing
      if(!disablePreventClickIfTouch) {
        _this.preventClickIfTouch(event);
      }
      //  Then we execute function code
      code(event);
    };
    //  As we can't detect if the device use click or touch events, we use both!
    target.addEventListener('click', _this.functions[functionName], false);
    target.addEventListener('touchstart', _this.functions[functionName], false);
  },
  remove : function (target, functionName) {
    var _this = this;
    target.removeEventListener('click', _this.functions[functionName], false);
    target.removeEventListener('touchstart', _this.functions[functionName], false);
  }
};