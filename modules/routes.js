//  Sigma.io

//  Routes module
exports.init = function (Sigma) {

  //  Channels API

  //  Only name
  Sigma.app.get('/:channel', function (req, res) {
    Sigma.channel.name = req.params.channel;
    Sigma.channel.results = 10;
    res.render('index', { id: Sigma.channel.name });
  });

  //  Name & number of results to render
  Sigma.app.get('/:channel/results/:results?', function (req, res) {
    Sigma.channel.name = req.params.channel;
    var processResults = function (results) {
      //  Create a regular expression that fits only integers
      var regex = new RegExp('^\\d+$');
      //  If results are a valid integer
      if (regex.test(results)) {
        //  If not from 0 to 100, set it to 10
        if (results < 0 || results > 100) {
         results = 10;
        }
      } else {
        results = 10;
      }
      return parseInt(results, 10);
    };
    Sigma.channel.results = processResults(req.params.results);
    res.render('index', { id: Sigma.channel.name });
  });

  //  Images API
  Sigma.app.get('/data/:id/:size?', function (req, res) {
    //  Find image source
    Sigma.database.collection('images').findOne(
      { '_id': new Sigma.objectId(req.params.id)},
      function (error, document) {
        var imageSource;
        if (error || document == null) {
          res.sendfile('./public/img/404.svg');
        } else {
          if (req.params.size === 'large') {
            imageSource = document.large;
            res.set('Content-Type', 'image/jpeg');
            res.send(new Buffer(imageSource, 'base64'));
          } else {
            imageSource = document.small;
            res.set('Content-Type', 'image/png');
            res.send(new Buffer(imageSource, 'base64'));
          }
        }
    });
  });

};