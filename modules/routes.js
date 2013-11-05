//  Sigma.io

//  Routes module
exports.init = function (Sigma) {

  //  Channels API

  //  Only name
  Sigma.app.get('/:channel', function (req, res) {
    Sigma.channel.name = req.params.channel;
    Sigma.channel.results = 10;
    res.render('index', { id: Sigma.channel.name });
    console.log('!!!');
  });

  //  Name & number of results to render
  Sigma.app.get('/:channel/results/:results?', function (req, res) {
    Sigma.channel.name = req.params.channel;
    var results = parseInt(req.params.results, 10);
    //  Check if integer from 0 - 100
    if (!isNaN(results) && (Math.round(results) == results)) {
      if (results > 0 && results <= 100) {
        //  Then define it as number of results
        Sigma.channel.results = results;
      }
    }
    res.render('index', { id: Sigma.channel.name });
  });

  //    Images API
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