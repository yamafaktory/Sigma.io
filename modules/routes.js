//  Sigma.io

//  Routes module
exports.init = function (Sigma) {
  //    Channels
  Sigma.app.get('/:id', function (req, res) {
    Sigma.id = req.params.id;
    res.render('index', { id: Sigma.id });
  });
  //    Images
  Sigma.app.get('/data/:id', function (req, res) {
    //  Find image source
    Sigma.database.collection('images').findOne(
      { '_id': new Sigma.objectId(req.params.id)},
      function (error, document) {
      if (error || document == null) {
        res.sendfile(__dirname + '/public/img/404.svg');
      } else {
        res.set('Content-Type', 'image/png');
        res.send(new Buffer(document.source, 'base64'));
      }
    });
  });
};