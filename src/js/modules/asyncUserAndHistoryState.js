//  Sigma.asyncUserAndHistoryState module

//  We need to know that both getHistory module and tryLocalStorage/userIsConnected module are completed
module.exports = {
  modulesLoaded: 0,
  makeLiveForUser : function () {
    //  Set owner's articles as editable
    Sigma.makeOwnerArticlesEditable();
    //  Attach tools
    Sigma.attachTools();
    //  Add create button
    Sigma.connectOrCreateButton(false);
    //  Highlight user's articles
    Sigma.highlightUserArticles();
    //  Welcome user
    Sigma.manageMessage(true, 'Hi '+Sigma.username+'! Nice to see you there!', true);
  },
  check : function () {
    //  Increment when called
    ++this.modulesLoaded;
    //  If exactly two calls occured
    if (this.modulesLoaded === 2) {
      this.makeLiveForUser();
    }
  }
};