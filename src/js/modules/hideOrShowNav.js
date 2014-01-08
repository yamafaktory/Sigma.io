//  Sigma.hideOrShowNav module

//  Show or hide nav for mobile
module.exports = function () {
  var nav = document.querySelector('nav');
  nav.classList.toggle('removeNav');
};