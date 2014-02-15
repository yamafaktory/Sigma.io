//  Sigma.heroHeader module

//  Add or remove header
module.exports = {
  add : function () {
    //  Add if not visible of first launch
    if (this.isVisible === undefined || !this.isVisible) {
      var body = document.querySelector('body'),
        main = document.querySelector('main'),
        hero = document.createElement('header'),
        svg = document.createElement('div'),
        title = document.createElement('h1');
        subtitle = document.createElement('h2');
      body.insertBefore(hero, main);
      hero.setAttribute('class', 'hero');
      svg.setAttribute('class', 'svg');
      hero.appendChild(title);
      hero.appendChild(subtitle);
      hero.appendChild(svg);
      title.appendChild(document.createTextNode('Sigma.io'));
      subtitle.appendChild(document.createTextNode('Create and share data in true real-time.'));
      this.isVisible = true;
    }
  },
  remove : function () {
    //  Remove only if visible
    if (this.isVisible === undefined || this.isVisible) {
      var hero = document.querySelector('header');
      hero.parentNode.removeChild(hero);
      this.isVisible = false;
    }
  }
};