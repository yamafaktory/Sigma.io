//  Sigma.tryLocalStorage module

//  Try if localStorage is supported by the browser
module.exports = function () {
  if ('localStorage' in window) {
    var username = localStorage.getItem('username'),
        test = function () {
          console.log(event);
        };
    if (username !== null) {
      //  Save username into the app
      Sigma.username = username;
      //  Add create button
      Sigma.connectOrCreateButton(false);
      //  Welcome user
      Sigma.manageMessage(true, 'Hi '+Sigma.username+'! Nice to see you there!', true);
    } else {
      //  Provide a form to sign in and to sign up
      Sigma.connectOrCreateButton(true);
      //  Add Hero header
      Sigma.addHeroHeader();
      //  Enable user connection
      Sigma.userIsConnected();
    }
    window.addEventListener('storage', test, false);
  } else {
    // !!!!!!!!!!!!!
  }
};