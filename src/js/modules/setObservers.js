//  Sigma.setObservers module

//  Set observers
module.exports = function () {
  var MutationObserver = window.MutationObserver ||
                         window.WebKitMutationObserver ||
                         window.MozMutationObserver,
      observers = [],
      data = document.querySelectorAll('[data-sigma]'),
      //  Attach observers on selected nodes
      attachObserver = function (i) {
        observers[i] = new MutationObserver(function (mutations) {
          //  For each mutation into the DOM, sync content server-side
          mutations.forEach(function (mutation) {
            //  Synchronize only if mutation is not related to an image node
            if (mutation.target.nodeName !== 'IMG') {
              Sigma.synchronize();
              Sigma.loadResponsiveImages();
            }
            Sigma.droppedImages.lookAtMutations(mutation);
          });
        });
        observers[i].observe(data[i], {
          attributes: true, 
          childList: true, 
          characterData: true,
          attributeOldValue: true,
          subtree: true,
          characterDataOldValue: true
        });
      };
  for (var i = 0; i < data.length; ++i) {
    attachObserver(i);
  }
  //  Save a list of observers
  Sigma.observers = observers;
};