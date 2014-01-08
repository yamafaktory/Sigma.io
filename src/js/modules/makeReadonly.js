//  Sigma.makeReadonly module

//  Manage contenteditable state
module.exports = function () {
  //  Make all Sigma attributes with contenteditable set to false if the user is not the owner of theses ones
  var data = document.querySelectorAll('[data-sigma]'),
      makeReadonly = function (i) {
        var owner = data[i].parentNode.querySelector('[data-owner]').dataset.owner;
        if (owner !== Sigma.username) {
          data[i].contentEditable = 'false';
        }
      };
  for (var i = 0; i < data.length; ++i) {
    makeReadonly(i);
  }
};