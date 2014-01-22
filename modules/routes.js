//  Sigma.io

//  Routes module
module.exports = function () {

  var Sigma = this;

  //  Channel and image rendering
  var renderChannel = function (req, res) {
    Sigma.channel.name = req.params.channel === undefined ? 'welcome' : req.params.channel;
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
  },
    renderImage = function (req, res) {
      //  First try to use URL as an id
      var idIsNotValid;
      try {
        new Sigma.objectId(req.params.id);
      } catch (error) {
        idIsNotValid = true;
      }
      if (idIsNotValid) {
        //  Send 404
        res.sendfile('./public/img/404.svg');
      } else {
        //  Find image source
        Sigma.database.collection('images').findOne(
          { '_id': new Sigma.objectId(req.params.id)},
          function (error, document) {
            var imageSource;
            if (error || document == null) {
              //  Send 404
              res.sendfile('./public/img/404.svg');
            } else {
              if (req.params.size === 'large') {
                //  Large image
                imageSource = document.large;
                res.set('Content-Type', 'image/jpeg');
                res.send(new Buffer(imageSource, 'base64'));
              } else {
                //  Small image
                imageSource = document.small;
                res.set('Content-Type', 'image/png');
                res.send(new Buffer(imageSource, 'base64'));
              }
            }
        });
      }
    };

  //  Channel routes
  Sigma.app.get('/:channel?', renderChannel);
  Sigma.app.get('/:channel/results/:results?', renderChannel);

  //  Image routes
  Sigma.app.get('/data/:id/:size?', renderImage);
  
};