//  Sigma.getMoreHistory module

//  Send request based on date and get past articles
module.exports = {
  loadMoreButton : function () {
    button = document.querySelector('.channel');
    Sigma.clickAndTouchListener.add(button, 'requestArticles', this.requestArticles);
  },
  requestArticles : function () {
    //  Send request with the date of the less recent article previously loaded
    Sigma.socket.emit('loadMoreHistory', { date: Sigma.currentDate});
  },
  init : function () {
    //  Add socket listener
    Sigma.socket.on('moreHistory', function (data) {
      //  If not empty
      if (!data.empty) {
        //  Populate main div with the DOM content sent by the server
        data.documents.forEach(function (document) {
          Sigma.addContent(true, document.html, document._id);
        });
        //  And keep track of last date if user want to load more articles
        Sigma.currentDate = data.documents.reverse()[0].date;
      }
      //  Disconnect observers
      Sigma.disconnectObservers();
      //  Get images sources
      Sigma.loadResponsiveImages();
      //  Set owner's articles as editable
      Sigma.makeOwnerArticlesEditable();
      //  Attach tools
      Sigma.tools.attach();
      //  Reset and highlight user's articles
      Sigma.resetAndHighlightUserArticles();
      //  Set observers
      Sigma.setObservers();
    });
    //  Attach listener on channel button
    this.loadMoreButton();
  }
};