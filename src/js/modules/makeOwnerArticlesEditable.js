//  Sigma.makeOwnerArticlesEditable module

//  Make contenteditable set to true for the owner
module.exports = function () {
  //  Make contenteditable set to true if the user is the owner
  var data = document.querySelectorAll('[data-sigma]'),
      resetAndMakeEditable = function (i) {
        var owner = data[i].parentNode.querySelector('[data-owner]').dataset.owner;
        if (owner === Sigma.username) {
          data[i].contentEditable = 'true';
        } else {
          data[i].contentEditable = 'false';
        }
      };
  for (var i = 0; i < data.length; ++i) {
    resetAndMakeEditable(i);
  }
};