//  Sigma.heroHeader module

//  Add or remove header
module.exports = {
  add : function () {
    //  Add if not visible of first launch
    if (this.isVisible === undefined || !this.isVisible) {
      var body = document.querySelector('body'),
        main = document.querySelector('main'),
        hero = document.createElement('header'),
        title = document.createElement('h1');
      body.insertBefore(hero, main);
      hero.setAttribute('class', 'hero');
      hero.appendChild(title);
      title.appendChild(document.createTextNode('Create and share data in true real-time.'));
      this.isVisible = true;
    }
  },
  remove : function () {
    //  Remove only if visible
    if (this.isVisible === undefined || !this.isVisible) {
      var hero = document.querySelector('header');
      hero.parentNode.removeChild(hero);
      this.isVisible = false;
    }
  }
};