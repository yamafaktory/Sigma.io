//  Sigma.userIsConnected module

//  Manage user connection
module.exports = function () {
  Sigma.socket.on('isConnected', function (data) {
    //  Remove aside
    var aside = document.querySelector('aside');
    aside.parentNode.removeChild(aside);
    //  Save username into the app
    Sigma.username = data.username;
    //  Try to use localStorage
    if ('localStorage' in window) {
      localStorage.setItem('username', Sigma.username);
    }
    //  Change nav layout
    Sigma.connectOrCreateButton(false);
    //  Highlight user's articles
    Sigma.highlightUserArticles();
    //  Then welcome user
    Sigma.manageMessage(true, 'Hi '+Sigma.username+'! Nice to see you there!', true);
  });
};