//  Sigma.animationListener module

//  Cross-browser animation listener
module.exports = function (state, target, action, removeWhenDone) {
  //  State is false = animationstart | true = animationend
  var vendorPrefixes = ['animation', 'webkitAnimation', 'MSAnimation', 'oAnimation'],
      addState = function (prefix) {
        return prefix + (prefix === 'animation' ? (state ? 'end' : 'start') : (state ? 'End' : 'Start'));
      },
      animationListeners = vendorPrefixes.map(addState),
      actionAndRemoveListeners = function () {
        //  Launch requested action
        action();
        //  Remove animation listeners if wanted
        if (removeWhenDone) {
          animationListeners.forEach(function (animation) {
            this.removeEventListener(animation, actionAndRemoveListeners, false);
          }.bind(this));
        }
      };
  //  Add cross-browser animation listeners based on state
  animationListeners.forEach(function (animation) {
    target.addEventListener(animation, actionAndRemoveListeners, false);
  });
};