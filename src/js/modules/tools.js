//  Sigma.tools module

//  Attach or remove edit icon
module.exports = {
  attach : function () {
    var data = document.querySelectorAll('[data-sigma]'),
        attachTools = function (i) {
          var owner = data[i].parentNode.querySelector('[data-owner]').dataset.owner;
          if (Sigma.username === owner) {
            Sigma.contentEditing.status(data[i]);
          }
        };
    for (var i = 0; i < data.length; ++i) {
      attachTools(i);
    }
  },
  remove : function () {
    var data = document.querySelectorAll('[data-sigma]');
    for (var j = 0; j < data.length; ++j) {
      Sigma.contentEditing.status(data[j], false);
    }
  }
};