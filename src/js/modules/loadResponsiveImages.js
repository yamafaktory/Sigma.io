//  Sigma.loadResponsiveImages module

//  Load images on content update
module.exports = function () {
  var appWidth = document.querySelector('[data-app-width]'),
      responsiveImages = document.querySelectorAll('[data-image]'),
      loadSource = function (i) {
        //  Change data attribute
        responsiveImages[i].dataset.imageWidth = appWidth.dataset.appWidth;
        //  And inject source
        var source = Sigma.host+':'+Sigma.port+'/data/'+responsiveImages[i].dataset.mongoId+'/'+appWidth.dataset.appWidth;
        responsiveImages[i].setAttribute('src', source);
      };
  for (var i = 0; i < responsiveImages.length; ++i) {
    loadSource(i);
  }
};