//  Sigma.userIsConnected module

//  Manage user connection
module.exports = function () {
  Sigma.socket.on('isConnected', function (data) {
    var aside = document.querySelector('aside'),
        body = document.querySelector('body'),
        //  Remove aside
        returnHome = function () {
          var removeAside = function () {
            //  Remove from DOM at animation's end
            aside.parentNode.removeChild(aside);
          };
          // Cross-browser event listeners
          Sigma.animationListener(true, aside, removeAside, true);
          //  Launch aside slide animation
          aside.classList.add('removeAside');
          //  Make body scrollable again
          body.classList.remove('noScroll');
          //  Show nav again
          Sigma.navigation.show();
          //  Remove listeners
          Sigma.disableMouseWheelAndTouchMove(body, true);
          //  Set form visibility
          Sigma.signIn.isVisible = false;
          //  Remove unclosed message if present
          Sigma.manageMessage(false);
        };
    //  Return home
    returnHome();
    //  Save username into the app
    Sigma.username = data.username;
    //  Try to use localStorage
    if ('localStorage' in window) {
      //  Store data as JSON
      localStorage.sigma = JSON.stringify({username : Sigma.username, password : data.password});
    } else {
      Sigma.manageMessage(true, 'LocalStorage is not supported!', false);
    }
    //  Check if history module was loaded too
    Sigma.asyncUserAndHistoryState.check();
    //  Remove Hero header
    Sigma.heroHeader.remove();
  });
};