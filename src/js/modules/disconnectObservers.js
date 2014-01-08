//  Sigma.disconnectObservers module

//  Disconnecting observers on demand
module.exports = function () {
  Sigma.observers.forEach(function (observer) {
    observer.disconnect();
  });
  //  Remove eventListeners too for memory leaks!
  var data = document.querySelectorAll('[data-sigma]');
  for (var i = 0; i < data.length; ++i) {
    data[i].removeEventListener('focus', Sigma.contentEditing.editMode, true);
    data[i].removeEventListener('blur', Sigma.contentEditing.viewMode, true);
  }
};