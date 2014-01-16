//  Sigma.tryLocalStorage module

//  Try if localStorage is supported by the browser
module.exports = {
  changeUserInterfaceToSign : function () {
    //  Provide a form to sign in and to sign up
    Sigma.connectOrCreateButton(true);
    //  Add Hero header
    Sigma.heroHeader.add();
    //  Enable user connection
    Sigma.userIsConnected();
  },
  checkStorageState : function (event) {
    //  Check storage state in realtime
    Sigma.tryLocalStorage.clearStorage();
    Sigma.manageMessage(true, 'Unwanted LocalStorage change occured. LocalStorage has been cleared.', false);
    Sigma.tryLocalStorage.changeUserInterfaceToSign();
  },
  clearStorage : function () {
    //  Clear app local storage
    localStorage.clear();
  },
  init : function () {
    if ('localStorage' in window) {
      var _this = this,
          localData = localStorage.sigma === undefined ? { username: undefined, password: undefined } : JSON.parse(localStorage.sigma);
      //  Add listener on storage
      window.addEventListener('storage', _this.checkStorageState, false);
      //  Server response for localStorage's credentials
      Sigma.socket.on('localStorageState', function (data) {
        if (data.secure) {
          //  Save username into the app
          Sigma.username = localData.username;
          //  Check if history module was loaded too
          Sigma.asyncUserAndHistoryState.check();
        } else {
          _this.clearStorage();
          Sigma.manageMessage(true, 'Wrong credentials were stored in local browser. Please sign in or sign up!', false);
          _this.changeUserInterfaceToSign();
        }
      });
      //  Send collected credentials
      if (localData.username !== undefined && localData.password !== undefined) {
        Sigma.socket.emit('checkLocalStorage', { username: localData.username, password: localData.password });
      } else {
        _this.clearStorage();
        _this.changeUserInterfaceToSign();
      }
    } else {
      Sigma.manageMessage(true, 'LocalStorage is not supported!', false);
    }
  }
};