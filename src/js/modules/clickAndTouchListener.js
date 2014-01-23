//  Sigma.clickAndTouchListener module

//  Device-agnostic click and touch add or remove listeners
module.exports = {
  functions : {},
  preventClickIfTouch : function (event) {
    if (event.type === 'touchstart') {
      event.preventDefault();
    }
  },
  add : function (target, functionName, functionCode, disablePreventClickIfTouch) {
    var code = functionCode;
    //  DisablePreventClickIfTouch is optional and set to false by default - trick for contenteditable
    disablePreventClickIfTouch = disablePreventClickIfTouch || false;
    //  Store code to execute in functions object
    this.functions[functionName] = function (event) {
      //  If event is touchstart we prevent the click event from firing
      if(!disablePreventClickIfTouch) {
        this.preventClickIfTouch(event);
      }
      //  Then we execute function code
      code(event);
    }.bind(this);
    //  As we can't detect if the device use click or touch events, we use both!
    target.addEventListener('click', this.functions[functionName].bind(this), false);
    target.addEventListener('touchstart', this.functions[functionName].bind(this), false);
  },
  remove : function (target, functionName) {
    target.removeEventListener('click', this.functions[functionName].bind(this), false);
    target.removeEventListener('touchstart', this.functions[functionName].bind(this), false);
  }
};