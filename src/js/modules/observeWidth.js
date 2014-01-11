//  Sigma.observeWidth module

//  Simulate width observer with animationStart event for responsive image
module.exports = function () {
  var appWidth = document.querySelector('[data-app-width]'),
      responsiveImages,
      changeWidth = function (i) {
        //  Change data attribute
        responsiveImages[i].dataset.imageWidth = appWidth.dataset.appWidth;
        //  And inject source
        var source = Sigma.host+':'+Sigma.port+'/data/'+responsiveImages[i].dataset.mongoId+'/'+appWidth.dataset.appWidth;
        responsiveImages[i].setAttribute('src', source);
      },
      getWidth = function () {
        //  Retrieve content from ::after and set it as [data-app-width]
        var content = window.getComputedStyle(appWidth, '::after').getPropertyValue('content'),
            //  Little hack for Firefox which adds double quotes
            deviceWidth = content.replace(/\"/g, "");
        //  Sigma.deviceWith is define for further use
        appWidth.dataset.appWidth = Sigma.deviceWidth = deviceWidth;
        //  Adapt responsive images to screen
        responsiveImages = document.querySelectorAll('[data-image-width]');
        for (var i = 0; i < responsiveImages.length; ++i) {
          changeWidth(i);
        }
      };
  //  Cross-browser event listeners
  Sigma.animationListener(false, appWidth, getWidth, false);
};