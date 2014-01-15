//  Sigma.getHistory module

//  History sent by the server
module.exports = function () {
  Sigma.socket.on('history', function (data) {
    if (data.empty) {
      var title = 'Welcome here pioneer!',
          content = 'It seems that you are the very first person on that channel.';
      if (Sigma.username !== undefined) {
        content += ' Please edit that content to make it yours!';
      } else {
        content += ' Please identify yourself!';
      }
      Sigma.addContent(false, undefined, title, content, Sigma.username || 'Sigma');
    } else {
      //  Populate main div with the DOM content sent by the server
      data.documents.forEach(function (document) {
        Sigma.addContent(document.html, document._id);
      });
    }
    Sigma.setObservers();
    //  Check if localStorage module was loaded too
    Sigma.asyncUserAndHistoryState.check();
  });
};