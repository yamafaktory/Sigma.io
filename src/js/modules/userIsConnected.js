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
            if (aside !== null) {
              aside.parentNode.removeChild(aside);
            }
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
          Sigma.mouseWheelAndTouchMove.enable(body);
          //  Set form visibility
          Sigma.signIn.isVisible = false;
          //  Remove unclosed message if present
          Sigma.manageMessage(false);
        };
    //  Return home
    returnHome();
    //  Save username into the app
    Sigma.username = data.username;
    //  Remove listener on storage
    Sigma.tryLocalStorage.storageListener(false);
    //  Store data as JSON
    localStorage.sigma = JSON.stringify({username : Sigma.username, password : data.password});
    //  Add listener on storage
    Sigma.tryLocalStorage.storageListener(true);
    //  Check if history module was loaded too
    Sigma.asyncUserAndHistoryState.check();
    //  Remove Hero header
    Sigma.heroHeader.remove();
  });
};