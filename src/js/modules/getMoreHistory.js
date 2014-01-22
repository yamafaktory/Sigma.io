//  Sigma.getMoreHistory module

//  Send request based on date and get past articles
module.exports = {
  loadMoreButton : function () {
    var _this = this,
    button = document.querySelector('.channel');
    Sigma.clickAndTouchListener.add(button, 'requestArticles', _this.requestArticles);
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
      //  Get images sources
      Sigma.loadResponsiveImages();
    });
    //  Attach listener on channel button
    this.loadMoreButton();
  }
};