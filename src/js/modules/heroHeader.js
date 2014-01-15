//  Sigma.heroHeader module

//  Add or remove header
module.exports = {
  add : function () {
    var body = document.querySelector('body'),
        main = document.querySelector('main'),
        hero = document.createElement('header'),
        title = document.createElement('h1');
    body.insertBefore(hero, main);
    hero.setAttribute('class', 'hero');
    hero.appendChild(title);
    title.appendChild(document.createTextNode('Create and share data in true real-time.'));
  },
  remove : function () {
    var hero = document.querySelector('header');
    hero.parentNode.removeChild(hero);
  }
};