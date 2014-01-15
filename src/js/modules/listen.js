//  Sigma.listen module

//  Listen changes sent by the server
module.exports = function () {
  Sigma.socket.on('broadcast', function (data) {
    Sigma.disconnectObservers();
    switch (data.action) {
      //  Add new content
      case 'create':
        Sigma.addContent(data.html, data.id);
        break;
      //  Update content
      case 'update':
        Sigma.updateContent(data.html, data.id);
        break;
      //  Delete content
      case 'delete':
        Sigma.deleteContent(data.id);
        break;
    }
    Sigma.setObservers();
    Sigma.loadResponsiveImages();
  });
};