//  Sigma.attachTools module

//  Attach edit icon if user logged in
module.exports = function () {
  var data = document.querySelectorAll('[data-sigma]'),
      tools = function (i) {
        var owner = data[i].parentNode.querySelector('[data-owner]').dataset.owner;
        if (Sigma.username === owner) {
          Sigma.contentEditing.status(data[i]);
        }
      };
  for (var i = 0; i < data.length; ++i) {
    tools(i);
  }
};