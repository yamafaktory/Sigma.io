//  Sigma.navigation module

//  Show or hide nav
module.exports = {
  //  Is visible by default
  visibility: true,
  hide : function () {
    if (this.visibility) {
      var nav = document.querySelector('nav'),
          message = document.querySelector('[data-message]');
      nav.classList.add('removeNavigation');
      this.visibility = false;
      //  Make message stick on the bottom as there's no navigation
      if(message) {
        message.classList.add('withNoNavigation');
      }
    }
  },
  show : function () {
    if (!this.visibility) {
      var nav = document.querySelector('nav'),
          message = document.querySelector('[data-message]');
      nav.classList.remove('removeNavigation');
      this.visibility = true;
      //  Make message back to default position
      if(message) {
        message.classList.remove('withNoNavigation');
      }
    }
  }
};